#include <WiFi.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Firebase_ESP_Client.h> 

// -------------------------------------------------------------------------------------------------
// ⚠️ ต้องแก้ไขค่า FIREBASE_RTDB_SECRET 
// -------------------------------------------------------------------------------------------------
#define WIFI_SSID "3BB"
#define WIFI_PASSWORD "12082546"

// ข้อมูล Firebase (ใช้ API Key และ Realtime Database Secret Key)
// โฮสต์ที่คุณใช้ (.firebaseio.com) ถูกต้องสำหรับ Host เก่า
#define FIREBASE_HOST "smart-waste2568-default-rtdb.asia-southeast1.firebasedatabase.app" 
#define FIREBASE_API_KEY "AIzaSyCyTSsRmX642krpJYOI-TfFpIhnxJBbzxk" 

// 💡 ต้องใส่ Secret Key ที่นี่
#define FIREBASE_RTDB_SECRET "Irran8J7yjOyDsoyi7btfcKr9Cz6KnSax0FLwoKe" 

// Path ใน Realtime DB ที่จะใช้ส่งค่า RFID
const String RFID_PATH = "/rfid_input/tagId"; 

// -------------------------------------------------------------------------------------------------

// กำหนด GPIO Pins สำหรับ RC522
#define SS_PIN 5  // D5 (เป็น SDA/SS)
#define RST_PIN 22 // D22

MFRC522 mfrc522(SS_PIN, RST_PIN);  

// ตัวแปร Firebase
FirebaseData fbdo;
FirebaseAuth auth; 
FirebaseConfig config;

// ตัวแปรสำหรับตรวจสอบสถานะ
bool firebaseSetupDone = false;
unsigned long lastRfidClear = 0;
const unsigned long RTDB_CLEAR_DELAY = 10000; // 10 วินาที 

// ฟังก์ชันสำหรับตรวจสอบสถานะ Token (Callback function, โครงสร้างเปลี่ยนไป)
void firebaseTokenStatusCallback(TokenInfo info);

void setup() {
    Serial.begin(115200);
    SPI.begin();       
    mfrc522.PCD_Init(); 

    Serial.println("RC522 initialized.");

    // --- เชื่อมต่อ Wi-Fi ---
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to Wi-Fi");
    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(500);
    }
    Serial.println();
    Serial.print("Connected with IP: ");
    Serial.println(WiFi.localIP());

    // --- ตั้งค่า Firebase ---
    
    config.database_url = FIREBASE_HOST;
    config.api_key = FIREBASE_API_KEY;
    
    // 💡 การยืนยันตัวตนด้วย Legacy Token (Secret Key)
    if (String(FIREBASE_RTDB_SECRET).length() > 0) {
        config.signer.tokens.legacy_token = FIREBASE_RTDB_SECRET;
        Serial.println("Using Legacy Database Secret Token.");
    }
    
    config.token_status_callback = firebaseTokenStatusCallback; 

    // เริ่ม Firebase 
    Firebase.begin(&config, &auth); 
    
    Firebase.reconnectWiFi(true);
    firebaseSetupDone = true;
    
    fbdo.setResponseSize(2048); 
    Serial.println("Firebase setup complete.");
}

// Callback สำหรับตรวจสอบสถานะ Token 
void firebaseTokenStatusCallback(TokenInfo info) {
    if (info.status == token_status_ready) {
        Serial.println("Firebase Token is ready.");
    } else {
        Serial.printf("Token Status: %d\n", info.status);
    }
}

void loop() {
    if (!firebaseSetupDone) return;

    // ตรวจสอบว่ามีบัตรวางอยู่หรือไม่
    if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
        
        // อ่านค่า UID ของบัตร (RFID Tag)
        String uidText = "";
        for (byte i = 0; i < mfrc522.uid.size; i++) {
            if (i > 0) uidText += ""; 
            uidText += (mfrc522.uid.uidByte[i] < 0x10 ? "0" : "") + 
                       String(mfrc522.uid.uidByte[i], HEX);
        }
        uidText.toUpperCase(); 

        Serial.print("RFID Tag Detected: ");
        Serial.println(uidText);

        // --- ส่งค่า RFID ไปยัง Firebase Realtime Database ---
        // Path ที่ใช้: /rfid_input/tagId
        if (Firebase.RTDB.setString(&fbdo, RFID_PATH, uidText)) {
            Serial.println("✅ Sent to Firebase successfully.");
            // 💡 ถ้าส่งสำเร็จ ให้ตั้งค่าล้างค่า
            lastRfidClear = millis(); 
        } else {
            Serial.print("❌ Failed to send to Firebase: ");
            // 💡 แสดงสาเหตุความผิดพลาดให้ชัดเจนที่สุด
            Serial.println(fbdo.errorReason()); 
        }

        mfrc522.PICC_HaltA();      
        mfrc522.PCD_StopCrypto1(); 

        delay(1000); 
    }

    // -----------------------------------------------------------------
    // ฟังก์ชันเสริม: ล้างค่า RFID ใน Realtime DB (ถ้าไม่มีการสแกนใหม่ 10 วินาที)
    // -----------------------------------------------------------------
    if (millis() - lastRfidClear > RTDB_CLEAR_DELAY && lastRfidClear != 0) {
        // ต้องตรวจสอบการเชื่อมต่อก่อนเรียกใช้
        if (WiFi.isConnected() && Firebase.ready()) {
            // 💡 แก้ไข: ใช้ deleteNode เพื่อล้างข้อมูลอย่างสมบูรณ์
             if (Firebase.RTDB.deleteNode(&fbdo, RFID_PATH)) { 
                 Serial.println("Auto-cleared RTDB RFID value.");
                 lastRfidClear = 0; // ตั้งค่าเป็น 0 เพื่อหยุดการล้างซ้ำ
             } else {
                 Serial.print("❌ Failed to clear RTDB: ");
                 // อาจจะแสดง error reason เดิม หรือแค่บอกว่าล้มเหลว
                 Serial.println(fbdo.errorReason()); 
             }
        }
    }
    // -----------------------------------------------------------------

    delay(50);
}