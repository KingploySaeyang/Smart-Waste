#include <WiFi.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Firebase_ESP_Client.h>

// ✅ ส่วนเสริม Firebase
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#include <time.h>

/* ================= LED STATUS ================= */
#define LED_PIN 2 

/* ================= WiFi ================= */
#define WIFI_SSID     "SEEKUBALIK"
#define WIFI_PASSWORD "123456878"

/* ================= Firebase ================= */
#define API_KEY       "AIzaSyCyTSsRmX642krpJYOI-TfFpIhnxJBbzxk"
#define DATABASE_URL  "https://smart-waste2568-default-rtdb.asia-southeast1.firebasedatabase.app"

#define USER_EMAIL    "esp32@smartwaste.com"
#define USER_PASSWORD "123456"

/* ================= RFID ================= */
#define SS_PIN   5
#define RST_PIN  22
MFRC522 rfid(SS_PIN, RST_PIN);

/* ================= Firebase objects ================= */
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

/* ================= Device ================= */
String DEVICE_ID = "esp32_01";

/* ================= State ================= */
bool wifiConnected = false;
unsigned long lastScanMillis = 0;

/* ================= Helper ================= */
String uidToString(MFRC522::Uid uid) {
  String s = "";
  for (byte i = 0; i < uid.size; i++) {
    if (uid.uidByte[i] < 0x10) s += "0";
    s += String(uid.uidByte[i], HEX);
  }
  s.toUpperCase();
  return s;
}

/* ================= Setup ================= */
void setup() {
  Serial.begin(115200);
  Serial.println("\n=== ESP32 START ===");

  // ✅ 1. เริ่มต้น: ให้ไฟดับไว้ก่อน
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW); 

  /* RFID */
  SPI.begin(18, 19, 23, SS_PIN);
  rfid.PCD_Init();
  Serial.println("RFID READY");

  /* WiFi */
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting WiFi");

  // ✅ 2. ขณะเชื่อม WiFi: ไม่กระพริบ (ดับนิ่งๆ)
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  wifiConnected = true;
  Serial.println("\n✅ WiFi Connected");
  Serial.println(WiFi.localIP());

  /* Firebase Config */
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.token_status_callback = tokenStatusCallback;

  // ✅ เพิ่ม: ปรับ Buffer แก้ปัญหา SSL Error หลุดบ่อย
  fbdo.setBSSLBufferSize(1024, 1024);
  config.timeout.socketConnection = 10000;
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  /* Time Setup */
  // ใช้ Google NTP เพื่อความเร็ว
  configTime(7 * 3600, 0, "time.google.com", "pool.ntp.org", "time.nist.gov");
  
  Serial.print("Syncing Time");

  // ✅ 3. เชื่อม WiFi ได้แล้ว แต่กำลังเชื่อมระบบ (Sync Time/Firebase): ให้กระพริบ
  while (time(nullptr) < 1000000000) {
    digitalWrite(LED_PIN, !digitalRead(LED_PIN)); // สั่งกระพริบ
    delay(250);
    Serial.print(".");
  }
  Serial.println("\n✅ Time Synced");
  
  Serial.print("Firebase ready = ");
  Serial.println(Firebase.ready());

  // ✅ 4. เสร็จทุกอย่าง: ไฟติดค้าง
  digitalWrite(LED_PIN, HIGH);
}

/* ================= Loop ================= */
void loop() {
  /* ตรวจสอบ WiFi */
  if (WiFi.status() != WL_CONNECTED) {
    if (wifiConnected) {
      Serial.println("📶 WiFi LOST");
      wifiConnected = false;
      // ✅ 5. ถ้าเน็ตหลุด: ไฟดับ
      digitalWrite(LED_PIN, LOW);
    }
    delay(1000);
    return;
  }

  // ถ้ากลับมาเชื่อมต่อได้แล้ว
  if (!wifiConnected) {
    wifiConnected = true;
    Serial.println("✅ WiFi RECONNECTED");
    // กลับมาติดค้าง
    digitalWrite(LED_PIN, HIGH);
  }

  if (!Firebase.ready()) {
    return;
  }

  /* กันสแกนรัว (Cooldown 2 วิ) */
  if (millis() - lastScanMillis < 2000) return;

  /* RFID */
  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;

  lastScanMillis = millis();

  // (Optional) กระพริบยืนยันการอ่านบัตร (ดับนิดนึงแล้วติดต่อ)
  digitalWrite(LED_PIN, LOW);
  delay(100);
  digitalWrite(LED_PIN, HIGH);

  String rfidUID = uidToString(rfid.uid);
  Serial.println("📌 RFID SCANNED = " + rfidUID);

  sendRFIDEvent(rfidUID);

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1(); 
}

/* ================= Send Event ================= */
void sendRFIDEvent(String rfidUID) {
  
  FirebaseJson json;
  json.set("rfid", rfidUID);
  json.set("time", (double)time(nullptr) * 1000); 

  // Path คือตัว esp32_01 เลย (ไม่มี ID ย่อยต่อท้าย)
  String path = "/rfid_events/" + DEVICE_ID;
  Serial.print("Updating " + path + "... ");

  // ✅ ใช้ setJSON เพื่อเขียนทับ (Update) ค่าเดิม
  if (Firebase.RTDB.setJSON(&fbdo, path, &json)) {
    Serial.println("✅ UPDATE SUCCESS");
  } else {
    Serial.println("❌ FAILED");
    Serial.println("REASON: " + fbdo.errorReason());
  }
}