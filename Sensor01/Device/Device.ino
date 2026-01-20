#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "HX711.h"
#include <time.h>
#include <Preferences.h>

// ================= WiFi =================
#define WIFI_SSID     "SEEKUBALIK"
#define WIFI_PASSWORD "123456878"

// ================= Firebase =================
#define FIREBASE_HOST "https://smart-waste2568-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_API_KEY "AIzaSyCyTSsRmX642krpJYOI-TfFpIhnxJBbzxk"
#define FIREBASE_RTDB_SECRET "Irran8J7yjOyDsoyi7btfcKr9Cz6KnSax0FLwoKe"

const String DEVICES_STATUS_BASE_PATH = "/esp32_devices";

// ================= Pins =================
#define CONFIRM_LED_PIN 2

// Ultrasonic Config
#define ULTRASONIC_TRIG_PIN 22
#define ULTRASONIC_ECHO_PIN 23

// ✅ ตั้งค่าระยะตามโจทย์ใหม่
#define BIN_DEPTH_CM 55    // ความลึกถึงก้นถัง (ค่า 0%)
#define TOP_OFFSET_CM 5    // ระยะเว้นว่างด้านบน (ค่า 100% เริ่มที่นี่)
// ความสูงที่ใช้คำนวณจริง = 55 - 5 = 50 cm

// HX711 Config
#define HX711_DT 25
#define HX711_SCK 26
float calibration_factor = 1044.5; 

// ================= Globals =================
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
HX711 scale;
Preferences preferences;

String macAddress;
bool firebaseReady = false;
bool isBound = false;

unsigned long lastHeartbeat = 0;
const unsigned long HEARTBEAT_INTERVAL = 5000;

// ================= Time =================
unsigned long long epochMs() {
  time_t now = time(nullptr);
  if (now < 100000) return millis();
  return (unsigned long long)now * 1000ULL;
}

// ================= LED =================
void applyLed(bool on) {
  digitalWrite(CONFIRM_LED_PIN, on ? HIGH : LOW);
}

void checkLedCommand() {
  if (isBound) {
    applyLed(true);
    return;
  }
  String path = DEVICES_STATUS_BASE_PATH + "/" + macAddress + "/command/led";
  if (Firebase.RTDB.getString(&fbdo, path)) {
    applyLed(fbdo.stringData() == "ON");
  }
}

// ================= Ultrasonic Logic (สูตรใหม่) =================
int readUltrasonicLevel() {
  float totalCm = 0;
  int validReadings = 0;

  // อ่าน 3 ครั้งหาค่าเฉลี่ย
  for (int i = 0; i < 3; i++) {
    digitalWrite(ULTRASONIC_TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(ULTRASONIC_TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(ULTRASONIC_TRIG_PIN, LOW);

    long duration = pulseIn(ULTRASONIC_ECHO_PIN, HIGH, 40000); // เพิ่ม timeout นิดหน่อยเผื่อถังลึก

    if (duration > 0) {
      float distance = duration * 0.0343 / 2;
      totalCm += distance;
      validReadings++;
    }
    delay(15);
  }

  float avgDistance = 0;
  if (validReadings > 0) {
    avgDistance = totalCm / validReadings;
  } else {
    // อ่านค่าไม่ได้ ตีว่าถังว่าง (ระยะไกลสุด)
    avgDistance = BIN_DEPTH_CM;
  }

  Serial.print("Distance: ");
  Serial.print(avgDistance);
  Serial.println(" cm");

  // --- เข้าสู่ตรรกะคำนวณ % ---
  
  // 1. ถ้าขยะสูงเกินระยะ 5cm (ใกล้เซนเซอร์มาก) -> ให้เป็น 100%
  if (avgDistance <= TOP_OFFSET_CM) {
    return 100;
  }

  // 2. ถ้าระยะห่างมากกว่าก้นถัง (55cm) -> ให้เป็น 0%
  if (avgDistance >= BIN_DEPTH_CM) {
    return 0;
  }

  // 3. คำนวณช่วงตรงกลาง (ระยะ 5cm ถึง 55cm)
  // ความสูงช่วงใช้งานจริง = 55 - 5 = 50 cm
  float effectiveHeight = BIN_DEPTH_CM - TOP_OFFSET_CM; // = 50
  
  // ความสูงขยะที่นับได้ = ก้นถัง - ระยะวัดได้
  float trashHeight = BIN_DEPTH_CM - avgDistance;

  // แปลงเป็นเปอร์เซ็นต์
  int percent = (int)((trashHeight / effectiveHeight) * 100);

  return constrain(percent, 0, 100);
}

// ================= Weight Logic =================
float readWeightGram() {
  if (!scale.is_ready()) return 0.0;
  float weight = scale.get_units(5); 
  if (abs(weight) < 1.0) weight = 0.0;
  if (weight < 0) weight = 0.0;
  return weight;
}

void forceTare() {
  Serial.println("Force Tare...");
  scale.tare(); 
  long newOffset = scale.get_offset();
  preferences.begin("scale", false);
  preferences.putLong("offset", newOffset);
  preferences.end();
}

void checkTareCommand() {
  String path = DEVICES_STATUS_BASE_PATH + "/" + macAddress + "/command/tare";
  if (Firebase.RTDB.getString(&fbdo, path)) {
    if (fbdo.stringData() == "SET") {
      forceTare();
      Firebase.RTDB.setString(&fbdo, path, "OFF"); 
    }
  }
}

// ================= Setup =================
void setup() {
  Serial.begin(115200);

  pinMode(CONFIRM_LED_PIN, OUTPUT);
  pinMode(ULTRASONIC_TRIG_PIN, OUTPUT);
  pinMode(ULTRASONIC_ECHO_PIN, INPUT);
  applyLed(false);

  // HX711
  scale.begin(HX711_DT, HX711_SCK);
  scale.set_scale(-calibration_factor);

  preferences.begin("scale", false);
  long savedOffset = preferences.getLong("offset", 0);
  preferences.end();

  if (savedOffset == 0) {
    scale.tare();
    preferences.begin("scale", false);
    preferences.putLong("offset", scale.get_offset());
    preferences.end();
  } else {
    scale.set_offset(savedOffset);
  }

  // WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  configTime(7 * 3600, 0, "129.6.15.28", "203.107.6.88");

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

  String boundPath = DEVICES_STATUS_BASE_PATH + "/" + macAddress + "/bound";
  if (Firebase.RTDB.getBool(&fbdo, boundPath)) {
    isBound = fbdo.boolData();
  }
  applyLed(isBound);
}

// ================= Loop =================
void loop() {
  if (!firebaseReady) return;

  checkLedCommand();
  checkTareCommand();

  if (millis() - lastHeartbeat >= HEARTBEAT_INTERVAL) {
    lastHeartbeat = millis();

    float weight = readWeightGram();
    int level = readUltrasonicLevel();

    FirebaseJson json;
    json.set("mac", macAddress);
    json.set("status", "Connected");
    json.set("fillLevel", level);
    json.set("weightGram", weight);
    json.set("calibrationFactor", calibration_factor);
    json.set("lastUpdate", (double)epochMs());

    Firebase.RTDB.updateNode(
      &fbdo,
      DEVICES_STATUS_BASE_PATH + "/" + macAddress,
      &json
    );

    Serial.print("Level: "); Serial.print(level);
    Serial.print("% | Weight: "); Serial.print(weight); Serial.println(" g");
  }
}