// admin-auth-bootstrap.js
(async () => {
  try {
    // 1️⃣ ตรวจสิทธิ์ (admin = status 0)
    const authUser = await window.SWAuth.requireAuth([0]);

    // 🔑 ระบบคุณใช้ username เป็น document id
    const username = authUser.username;

    if (!username) {
      throw new Error("Username not found in authUser");
    }

    // 2️⃣ โหลดข้อมูลจาก Firestore
    const snap = await firebase
      .firestore()
      .collection("users")
      .doc(username) // ✅ ถูกต้อง (ไม่ใช้ uid)
      .get();

    // 3️⃣ profile เริ่มต้น (fallback)
    let profile = {
      uid: authUser.uid,
      username,
      fullName: username,
      role: "admin"
    };

    if (snap.exists) {
      const d = snap.data() || {};
      profile.fullName = d.fullName || username;

      // รองรับทั้ง role แบบ string และ status แบบตัวเลข
      if (typeof d.role === "string") {
        profile.role = d.role;
      } else if (typeof d.status === "number") {
        profile.role =
          d.status === 0 ? "admin" :
          d.status === 1 ? "driver" : "user";
      }
    }

    // 4️⃣ เก็บเป็น global
    window.ADMIN_AUTH = profile;

    // 5️⃣ render profile bar
    if (window.AdminProfile && typeof AdminProfile.init === "function") {
      AdminProfile.init(profile);
    }

    console.log("✅ ADMIN AUTH READY:", profile);

  } catch (err) {
    console.error("❌ ADMIN AUTH ERROR:", err);
  }
})();
