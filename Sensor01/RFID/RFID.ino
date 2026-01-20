#include <WiFi.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Firebase_ESP_Client.h>

// ================= WiFi =================
#define WIFI_SSID     "SEEKUBALIK"
#define WIFI_PASSWORD "123456878"

// ================= Firebase =================
#define FIREBASE_HOST "smart-waste2568-default-rtdb.asia-southeast1.firebasedatabase.app"
#define FIREBASE_API_KEY "AIzaSyCyTSsRmX642krpJYOI-TfFpIhnxJBbzxk"
#define FIREBASE_RTDB_SECRET "Irran8J7yjOyDsoyi7btfcKr9Cz6KnSax0FLwoKe"

// ================= MFRC522 Pins =================
#define SS_PIN   5
#define RST_PIN  22

#define STATUS_LED_PIN 2

// RTDB Paths
static const char* PATH_SCANNER_CURRENT_ADMIN = "rfid_scanner/currentAdmin";
static const char* PATH_ADMIN_ACTIVE_BASE     = "admin_rfid_active";
static const char* PATH_ADMIN_RFID_INPUT_BASE = "admin_rfid_input";

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

MFRC522 mfrc522(SS_PIN, RST_PIN);

String activeAdminUid = "";
String lastTagSent = "";
unsigned long lastSendMs = 0;

const unsigned long POLL_INTERVAL_MS = 300;
unsigned long lastPollMs = 0;

const unsigned long SEND_COOLDOWN_MS = 900;

static void led(bool on) {
  pinMode(STATUS_LED_PIN, OUTPUT);
  digitalWrite(STATUS_LED_PIN, on ? HIGH : LOW);
}

static String readTagHexUpper() {
  if (!mfrc522.PICC_IsNewCardPresent()) return "";
  if (!mfrc522.PICC_ReadCardSerial()) return "";

  String tag = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) tag += "0";
    tag += String(mfrc522.uid.uidByte[i], HEX);
  }
  tag.toUpperCase();

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
  return tag;
}

static String readCurrentAdminLock() {
  if (Firebase.RTDB.getString(&fbdo, PATH_SCANNER_CURRENT_ADMIN)) {
    String uid = fbdo.stringData();
    uid.trim();
    return uid;
  }
  return "";
}

// fallback: หา uid ตัวแรกที่ admin_rfid_active/{uid} == true
static String findActiveAdminFallback() {
  if (!Firebase.RTDB.getJSON(&fbdo, PATH_ADMIN_ACTIVE_BASE)) return "";
  FirebaseJson *json = fbdo.jsonObjectPtr();
  if (!json) return "";

  size_t len = json->iteratorBegin();
  String found = "";
  for (size_t i = 0; i < len; i++) {
    int type = 0;
    String key, value;
    json->iteratorGet(i, type, key, value);
    String v = value; v.trim(); v.toLowerCase();
    if (v == "true" || v == "1") { found = key; break; }
  }
  json->iteratorEnd();
  return found;
}

static bool sendTagToAdmin(const String& uid, const String& tag) {
  if (uid.isEmpty() || tag.isEmpty()) return false;
  String path = String(PATH_ADMIN_RFID_INPUT_BASE) + "/" + uid + "/tagId";
  return Firebase.RTDB.setString(&fbdo, path.c_str(), tag.c_str());
}

static bool shouldSend(const String& tag) {
  unsigned long now = millis();
  if (now - lastSendMs < SEND_COOLDOWN_MS) return false;
  if (tag == lastTagSent && (now - lastSendMs) < (SEND_COOLDOWN_MS * 3)) return false;
  return true;
}

void setup() {
  Serial.begin(115200);
  delay(200);

  led(false);

  // WiFi
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("WiFi connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println("\nWiFi OK");

  // Firebase
  config.database_url = String("https://") + FIREBASE_HOST;
  config.api_key = FIREBASE_API_KEY;
  config.signer.tokens.legacy_token = FIREBASE_RTDB_SECRET;

  Firebase.reconnectWiFi(true);
  Firebase.begin(&config, &auth);

  // RFID
  SPI.begin(); // ถ้าสายคุณไม่ใช่ค่า default ให้ใช้ SPI.begin(SCK,MISO,MOSI,SS)
  mfrc522.PCD_Init();
  Serial.println("MFRC522 ready");

  Serial.println("Waiting session: rfid_scanner/currentAdmin (or fallback admin_rfid_active)");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) return;
  if (!Firebase.ready()) { delay(100); return; }

  // poll session owner
  if (millis() - lastPollMs > POLL_INTERVAL_MS) {
    lastPollMs = millis();

    String uid = readCurrentAdminLock();
    if (uid.isEmpty()) {
      uid = findActiveAdminFallback(); // ให้ลองทำงานได้ก่อน แม้ยังไม่เพิ่ม lock
    }

    if (uid != activeAdminUid) {
      activeAdminUid = uid;
      if (!activeAdminUid.isEmpty()) {
        Serial.print("ACTIVE ADMIN UID = ");
        Serial.println(activeAdminUid);
        led(true);
        lastTagSent = "";
        lastSendMs = 0;
      } else {
        Serial.println("No active admin. Standby.");
        led(false);
      }
    }
  }

  if (activeAdminUid.isEmpty()) { delay(10); return; }

  // read tag
  String tag = readTagHexUpper();
  if (tag.isEmpty()) { delay(5); return; }

  Serial.print("Scanned tag: ");
  Serial.println(tag);

  if (!shouldSend(tag)) return;

  bool ok = sendTagToAdmin(activeAdminUid, tag);
  if (ok) {
    Serial.println("Sent tag OK -> admin_rfid_input/{uid}/tagId");
    lastTagSent = tag;
    lastSendMs = millis();
  } else {
    Serial.print("Send FAIL: ");
    Serial.println(fbdo.errorReason());
  }

  delay(10);
}
