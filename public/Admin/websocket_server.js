// ต้องติดตั้งไลบรารี ws ก่อน: npm install ws
const WebSocket = require('ws');

// ตั้งค่า Port ให้ตรงกับที่กำหนดใน ESP32: 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log("=========================================");
console.log("WebSocket Server is running on port 8080");
// หากคุณรันบนเครื่อง 10.3.12.179 ควรเห็นข้อความนี้
console.log("Listening for connections from ESP32 & Web Clients...");
console.log("=========================================");

// Set เพื่อเก็บ Clients ทั้งหมด (รวมถึงหน้าเว็บ Browser)
const clients = new Set();

wss.on('connection', function connection(ws, req) {
    // เพิ่ม Client ใหม่เข้าใน Set
    clients.add(ws);
    
    // ตรวจสอบว่าเป็น ESP32 หรือ Browser ที่เชื่อมต่อมา
    const clientIP = req.socket.remoteAddress;
    console.log(`[WS] Client connected: ${clientIP}. Total clients: ${clients.size}`);
    
    // เมื่อได้รับข้อความ (RFID Tag) จาก Client (น่าจะเป็น ESP32)
    ws.on('message', function incoming(message) {
        const rfidTag = message.toString().trim();
        console.log(`[DATA] Received RFID: ${rfidTag} from ${clientIP}`);

        // 💡 ส่งต่อข้อความ RFID นี้ไปยัง Clients อื่นๆ ทั้งหมด (หน้าเว็บ Browser)
        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                // ส่ง RFID Tag ไปยัง Browser Client
                client.send(rfidTag);
                console.log(`[RELAY] Sent RFID to a web client.`);
            }
            // ถ้า client == ws (คือส่งกลับไปหา ESP32 เอง) ก็ข้ามไป
        });
    });

    // เมื่อ Client ตัดการเชื่อมต่อ
    ws.on('close', () => {
        clients.delete(ws);
        console.log(`[WS] Client disconnected. Total clients: ${clients.size}`);
    });

    // กรณีเกิดข้อผิดพลาด
    ws.on('error', (error) => {
        console.error(`[WS] Client error on ${clientIP}: ${error.message}`);
    });
});