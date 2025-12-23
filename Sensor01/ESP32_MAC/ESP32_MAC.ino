#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <SPI.h>
#include <MFRC522.h>
#include "HX711.h"

// =================================================
// WiFi
// =================================================
#define WIFI_SSID "3BB"
#define WIFI_PASSWORD "12082546"

// =================================================
// Firebase
// =================================================
#define FIREBASE_HOST "smart-waste2568-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_API_KEY "AIzaSyCyTSsRmX642krpJYOI-TfFpIhnxJBbzxk"
#define FIREBASE_RTDB_SECRET "Irran8J7yjOyDsoyi7btfcKr9Cz6KnSax0FLwoKe"

const String DEVICES_STATUS_BASE_PATH = "/esp32_devices";

// =================================================
// Pins
// =================================================
// RFID
#define SS_PIN 5
#define RST_PIN 22

// Ultrasonic
#define ULTRASONIC_TRIG_PIN 12
#define ULTRASONIC_ECHO_PIN 14
#define BIN_HEIGHT_CM 80

// LED
#define CONFIRM_LED_PIN 2

// HX711
#define HX711_DT 35
#define HX711_SCK 32

// =================================================
// HX711 Calibration
// ❗ ปรับค่านี้ให้ตรงกับของจริง (หน่วย: กรัม)
// =================================================
#define HX711_SCALE 700.0   // 🔴 เปลี่ยนตามค่าที่คุณ calibrate ได้

// =================================================
// Objects
// =================================================
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

MFRC522 mfrc522(SS_PIN, RST_PIN);
HX711 scale;

// =================================================
// Globals
// =================================================
bool firebaseReady = false;
String macAddress;

unsigned long lastSensorRead = 0;
const unsigned long SENSOR_READ_INTERVAL = 5000;

unsigned long lastRfidClear = 0;
const unsigned long RTDB_CLEAR_DELAY = 10000;

// =================================================
// Ultrasonic → ระดับขยะ (%)
// =================================================
int readUltrasonicLevel() {
    digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(ULTRASONIC_TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(ULTRASONIC_TRIG_PIN, LOW);

    long duration = pulseIn(ULTRASONIC_ECHO_PIN, HIGH, 30000);
    if (duration == 0) return 0;

    float distance_cm = duration * 0.0343 / 2;
    float fill_depth = BIN_HEIGHT_CM - distance_cm;
    fill_depth = constrain(fill_depth, 0, BIN_HEIGHT_CM);

    return (int)((fill_depth / BIN_HEIGHT_CM) * 100);
}

// =================================================
// Load Cell → น้ำหนัก (กรัม)
// =================================================
float readWeightGram() {
    if (!scale.is_ready()) return -1;

    float w = scale.get_units(5); // average 5 ครั้ง
    if (w < 0) w = 0;

    return w;
}

// =================================================
// LED Command จากเว็บ
// =================================================
void checkLedCommand() {
    String path = DEVICES_STATUS_BASE_PATH + "/" + macAddress + "/command/led";

    if (Firebase.RTDB.getString(&fbdo, path)) {
        String cmd = fbdo.stringData();
        digitalWrite(CONFIRM_LED_PIN, (cmd == "ON") ? HIGH : LOW);
    }
}

// =================================================
// Setup
// =================================================
void setup() {
    Serial.begin(115200);

    // RFID
    SPI.begin();
    mfrc522.PCD_Init();

    // Pins
    pinMode(ULTRASONIC_TRIG_PIN, OUTPUT);
    pinMode(ULTRASONIC_ECHO_PIN, INPUT);
    pinMode(CONFIRM_LED_PIN, OUTPUT);

    digitalWrite(CONFIRM_LED_PIN, LOW); // เริ่มต้นไฟดับ

    // HX711
    scale.begin(HX711_DT, HX711_SCK);
    scale.set_scale(HX711_SCALE);
    scale.tare(); // ⚠️ ตอนเปิดเครื่องต้องไม่มีของวาง

    // WiFi
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi connected");

    // MAC Address
    macAddress = WiFi.macAddress();
    macAddress.replace(":", "");
    macAddress.toUpperCase();

    // Firebase
    config.database_url = FIREBASE_HOST;
    config.api_key = FIREBASE_API_KEY;
    config.signer.tokens.legacy_token = FIREBASE_RTDB_SECRET;

    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);

    firebaseReady = true;
    Serial.println("Firebase ready");
}

// =================================================
// Loop
// =================================================
void loop() {
    if (!firebaseReady) return;

    if (WiFi.isConnected() && Firebase.ready()) {
        checkLedCommand();
    }

    // ---------- Sensors ----------
    if (millis() - lastSensorRead > SENSOR_READ_INTERVAL || lastSensorRead == 0) {

        int fillLevel = readUltrasonicLevel();
        float weightGram = readWeightGram();

        FirebaseJson json;
        json.set("mac", macAddress);
        json.set("status", "Connected");
        json.set("fillLevel", fillLevel);
        json.set("weightGram", weightGram);
        json.set("lastUpdate", Firebase.getCurrentTime());

        Firebase.RTDB.setJSON(
            &fbdo,
            DEVICES_STATUS_BASE_PATH + "/" + macAddress,
            &json
        );

        lastSensorRead = millis();
    }

    // ---------- RFID ----------
    if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {

        String uidText = "";
        for (byte i = 0; i < mfrc522.uid.size; i++) {
            uidText += (mfrc522.uid.uidByte[i] < 0x10 ? "0" : "") +
                       String(mfrc522.uid.uidByte[i], HEX);
        }
        uidText.toUpperCase();

        FirebaseJson json;
        json.set("tagId", uidText);
        json.set("ts", millis());

        Firebase.RTDB.setJSON(
            &fbdo,
            DEVICES_STATUS_BASE_PATH + "/" + macAddress + "/rfid_input",
            &json
        );

        lastRfidClear = millis();

        mfrc522.PICC_HaltA();
        mfrc522.PCD_StopCrypto1();
    }

    // ---------- Clear RFID ----------
    if (lastRfidClear != 0 && millis() - lastRfidClear > RTDB_CLEAR_DELAY) {
        Firebase.RTDB.deleteNode(
            &fbdo,
            DEVICES_STATUS_BASE_PATH + "/" + macAddress + "/rfid_input"
        );
        lastRfidClear = 0;
    }
}
