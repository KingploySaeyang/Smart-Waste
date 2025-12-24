#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <SPI.h>
#include <MFRC522.h>
#include "HX711.h"
#include <time.h>

// =================================================
// WiFi
// =================================================
#define WIFI_SSID     "3BB"
#define WIFI_PASSWORD "12082546"

// =================================================
// Firebase
// =================================================
#define FIREBASE_HOST "https://smart-waste2568-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_API_KEY "AIzaSyCyTSsRmX642krpJYOI-TfFpIhnxJBbzxk"
#define FIREBASE_RTDB_SECRET "Irran8J7yjOyDsoyi7btfcKr9Cz6KnSax0FLwoKe"

const String DEVICES_STATUS_BASE_PATH = "/esp32_devices";

// =================================================
// Pins
// =================================================
#define SS_PIN 5
#define RST_PIN 22
#define CONFIRM_LED_PIN 2
#define ULTRASONIC_TRIG_PIN 12
#define ULTRASONIC_ECHO_PIN 14
#define BIN_HEIGHT_CM 80
#define HX711_DT 35
#define HX711_SCK 32
#define HX711_SCALE 700.0

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

MFRC522 mfrc522(SS_PIN, RST_PIN);
HX711 scale;

String macAddress;
bool firebaseReady = false;
bool ntpReady = false;
bool isBound = false;

// ⏱️ timing
unsigned long lastHeartbeat = 0;
unsigned long lastLedCheck = 0;
unsigned long lastRfidClear = 0;

const unsigned long HEARTBEAT_INTERVAL = 5000;
const unsigned long LED_CHECK_INTERVAL = 300;
const unsigned long RFID_CLEAR_DELAY = 10000;

// =================================================
// Epoch ms (ไม่ block)
// =================================================
unsigned long long epochMs() {
  time_t now = time(nullptr);
  if (now < 100000) return millis();
  ntpReady = true;
  return (unsigned long long)now * 1000ULL;
}

// =================================================
// LED
// =================================================
void applyLed(bool on) {
  digitalWrite(CONFIRM_LED_PIN, on ? HIGH : LOW);
}

void checkLedCommand() {
  if (isBound) {
    digitalWrite(CONFIRM_LED_PIN, HIGH); // 🔥 บังคับติดถาวร
    return;
  }

  // ยังไม่ bound → ฟังคำสั่งชั่วคราวจากเว็บ
  String path = DEVICES_STATUS_BASE_PATH + "/" + macAddress + "/command/led";
  if (Firebase.RTDB.getString(&fbdo, path)) {
    digitalWrite(CONFIRM_LED_PIN,
      fbdo.stringData() == "ON" ? HIGH : LOW);
  }
}


// =================================================
// Sensors
// =================================================
int readUltrasonicLevel() {
  digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(ULTRASONIC_TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(ULTRASONIC_TRIG_PIN, LOW);

  long d = pulseIn(ULTRASONIC_ECHO_PIN, HIGH, 30000);
  if (d == 0) return 0;

  float cm = d * 0.0343 / 2;
  float depth = BIN_HEIGHT_CM - cm;
  depth = constrain(depth, 0, BIN_HEIGHT_CM);
  return (int)((depth / BIN_HEIGHT_CM) * 100);
}

float readWeightGram() {
  if (!scale.is_ready()) return -1;
  float w = scale.get_units(5);
  return w < 0 ? 0 : w;
}

// =================================================
// Setup
// =================================================
void setup() {
  Serial.begin(115200);

  pinMode(CONFIRM_LED_PIN, OUTPUT);
  applyLed(false);

  pinMode(ULTRASONIC_TRIG_PIN, OUTPUT);
  pinMode(ULTRASONIC_ECHO_PIN, INPUT);

  SPI.begin();
  mfrc522.PCD_Init();

  scale.begin(HX711_DT, HX711_SCK);
  scale.set_scale(HX711_SCALE);
  scale.tare();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  // 🔥 ไม่รอ NTP
  configTime(7 * 3600, 0, "129.6.15.28", "203.107.6.88");

  macAddress = WiFi.macAddress();
  macAddress.replace(":", "");
  macAddress.toUpperCase();
  Serial.println("MAC: " + macAddress);

  config.database_url = FIREBASE_HOST;
  config.api_key = FIREBASE_API_KEY;
  config.signer.tokens.legacy_token = FIREBASE_RTDB_SECRET;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  firebaseReady = true;

  // โหลด bound (ครั้งเดียว)
  String boundPath = DEVICES_STATUS_BASE_PATH + "/" + macAddress + "/bound";
  if (Firebase.RTDB.getBool(&fbdo, boundPath)) {
    isBound = fbdo.boolData();
  }

  applyLed(isBound); // ถ้า bound=true → LED ติด
}

// =================================================
// Loop
// =================================================
void loop() {
  if (!firebaseReady) return;

  checkLedCommand();

  // ---------- Heartbeat ----------
  if (millis() - lastHeartbeat >= HEARTBEAT_INTERVAL) {
    lastHeartbeat = millis();

    FirebaseJson json;
    json.set("mac", macAddress);
    json.set("status", "Connected");
    json.set("fillLevel", readUltrasonicLevel());
    json.set("weightGram", readWeightGram());
    json.set("lastUpdate", (double)epochMs());

    Firebase.RTDB.updateNode(
      &fbdo,
      DEVICES_STATUS_BASE_PATH + "/" + macAddress,
      &json
    );

    Serial.print("Heartbeat ");
    Serial.println(epochMs());
  }

  // ---------- RFID (ทันที ไม่รออะไร) ----------
  if (mfrc522.PICC_IsNewCardPresent() &&
      mfrc522.PICC_ReadCardSerial()) {

    String uid = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      uid += (mfrc522.uid.uidByte[i] < 0x10 ? "0" : "") +
             String(mfrc522.uid.uidByte[i], HEX);
    }
    uid.toUpperCase();

    FirebaseJson json;
    json.set("tagId", uid);
    json.set("ts", epochMs());

    Firebase.RTDB.setJSON(
      &fbdo,
      DEVICES_STATUS_BASE_PATH + "/" + macAddress + "/rfid_input",
      &json
    );

    lastRfidClear = millis();
    Serial.println("RFID: " + uid);

    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
  }

  // ---------- Clear RFID ----------
  if (lastRfidClear &&
      millis() - lastRfidClear > RFID_CLEAR_DELAY) {

    Firebase.RTDB.deleteNode(
      &fbdo,
      DEVICES_STATUS_BASE_PATH + "/" + macAddress + "/rfid_input"
    );
    lastRfidClear = 0;
  }
}
