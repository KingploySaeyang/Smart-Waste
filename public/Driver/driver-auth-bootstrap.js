// driver-auth-bootstrap.js
(async function () {
  console.log("🚚 Driver Auth Bootstrap: init");

  if (!window.SWAuth || typeof window.SWAuth.requireAuth !== "function") {
    console.error("❌ SWAuth not ready");
    return;
  }

  let user = null;

  try {
    user = await window.SWAuth.requireAuth([1]); // 👈 role คนขับ
  } catch (err) {
    console.error("❌ requireAuth failed", err);
    return;
  }

  if (!user || !user.driverId) {
    console.error("❌ DRIVER_AUTH invalid", user);
    alert("ข้อมูลบัญชีคนขับไม่สมบูรณ์");
    return;
  }

  const displayName = user.fullName || user.username || "Driver";

  window.DRIVER_AUTH = {
    uid: user.uid,
    username: user.username,
    fullName: user.fullName || "",
    displayName,
    driverId: user.driverId,
    zoneId: user.zoneId || null,
    role: user.role,
    roleLabel: "คนขับรถเก็บขยะ",
    raw: user
  };

  console.log("✅ DRIVER_AUTH ready", window.DRIVER_AUTH);

  document.dispatchEvent(
    new CustomEvent("driver-auth-ready", { detail: window.DRIVER_AUTH })
  );
})();
