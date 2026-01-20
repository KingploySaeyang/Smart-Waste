// user-auth-bootstrap.js
(async function () {
  console.log("👤 User Auth Bootstrap: init");

  // ✅ รอให้ auth.js พร้อมจริง
  if (!window.SWAuth || typeof window.SWAuth.requireAuth !== "function") {
    console.error("❌ SWAuth not ready");
    return;
  }

  let user = null;

  try {
    // 🔒 บังคับ role = user (2)
    user = await window.SWAuth.requireAuth([2]);
  } catch (err) {
    console.error("❌ requireAuth failed", err);
    return;
  }

  if (!user || !user.username) {
    console.error("❌ USER_AUTH invalid", user);
    return;
  }

  const displayName = user.fullName || user.username;

  window.USER_AUTH = {
    uid: user.uid,
    username: user.username,
    fullName: user.fullName || "",
    displayName,
    role: user.role,
    roleLabel: "ผู้ใช้งาน",
    raw: user
  };

  console.log("✅ USER_AUTH ready", window.USER_AUTH);

  // 🔔 แจ้งให้หน้าอื่นรู้ว่า auth พร้อมแล้ว
  document.dispatchEvent(
    new CustomEvent("user-auth-ready", { detail: window.USER_AUTH })
  );
})();
