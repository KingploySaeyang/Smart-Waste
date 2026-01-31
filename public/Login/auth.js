(function () {
  const LOGIN_PATH = "../Login/login.html";

  function resolveLoginUrl(reason) {
    const target = new URL(LOGIN_PATH, window.location.href);
    if (reason) {
      target.searchParams.set("auth", reason);
    }
    return target.toString();
  }

  function getCurrentUser() {
    try {
      const raw = localStorage.getItem("sw_user");
      if (!raw) return null;

      const data = JSON.parse(raw);

      // 🔥 กันของเก่าที่เป็น level
      if ("level" in data) {
        delete data.level;
        localStorage.setItem("sw_user", JSON.stringify(data));
      }

      if (
        !data ||
        typeof data.username !== "string" ||
        typeof data.status !== "number"
      ) {
        return null;
      }

      return data;
    } catch (err) {
      console.warn("Cannot parse sw_user", err);
      return null;
    }
  }

  function clearSession() {
    localStorage.removeItem("sw_user");
  }

  function redirect(reason) {
    window.location.href = resolveLoginUrl(reason);
  }

  async function requireAuth(allowedStatuses) {

    // 🔹 พยายามรอ Firebase Auth (แต่ไม่บังคับ)
    let authUser = null;
    try {
      authUser = await new Promise(resolve => {
        const unsub = firebase.auth().onAuthStateChanged(u => {
          unsub();
          resolve(u);
        });
        // กันค้าง
        // เพิ่มเวลาเป็น 5 วินาที เพื่อให้เน็ตมือถือมีเวลาเชื่อมต่อ
        setTimeout(() => resolve(null), 5000);
      });
    } catch (e) {
      authUser = null;
    }

    // ✅ ใช้ localStorage เป็นตัวจริง
    const user = getCurrentUser();

    // ❌ ถ้าไม่มี session → ยังไม่ login
    if (!user) {
      clearSession();
      redirect("login");
      throw new Error("Session missing");
    }

    // 🔒 DRIVER ต้องมีข้อมูลครบ
    if (user.status === 1) {
      if (!user.zoneId || !user.driverId) {
        clearSession();
        redirect("login");
        throw new Error("Driver staff profile incomplete");
      }
    }

    // ✅ ตรวจสิทธิ์
    if (Array.isArray(allowedStatuses) && allowedStatuses.length > 0) {
      if (!allowedStatuses.includes(user.status)) {
        redirect("denied");
        throw new Error("User not authorized");
      }
    }

    return user;
  }

  function logout() {
    const t = (key, fallback) => {
      try {
        if (typeof window.tr === "function") {
          const v = window.tr(key);
          if (v && v !== key) return v;
        }
        if (window.T && window.T[key]) return window.T[key];
        const lang = localStorage.getItem("sw_lang") || document.documentElement.getAttribute("lang") || "th";
        const dict = window.SW_Translations && window.SW_Translations[lang];
        if (dict && dict[key]) return dict[key];
      } catch (_) {
        /* ignore */
      }
      return fallback;
    };

    const logoutTitle = t("logoutTitle", "ออกจากระบบ?");
    const logoutText = t("logoutText", "คุณต้องการออกจากระบบใช่หรือไม่");
    const logoutConfirm = t("logoutConfirm", "ออกจากระบบ");
    const logoutCancel = t("logoutCancel", "ยกเลิก");

    if (typeof Swal === "undefined") {
      const ok = window.confirm(logoutText);
      if (!ok) return;
      localStorage.removeItem("sw_user");
      window.location.href = "../Login/login.html";
      return;
    }

    Swal.fire({
      title: logoutTitle,
      text: logoutText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: logoutConfirm,
      cancelButtonText: logoutCancel,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.removeItem("sw_user");
        window.location.href = "../Login/login.html";
      }
    });
  }

  function ensureLogoutStyles() {
    if (document.getElementById("sw-logout-style")) return;
    const style = document.createElement("style");
    style.id = "sw-logout-style";
    style.textContent = `
      .sw-logout-slot{
        padding:16px 20px 24px;
      }
      .sidebar .sw-logout-slot{margin-top:auto;}
      .sw-logout-btn{
        width:100%;
        border:none;
        border-radius:12px;
        padding:12px 14px;
        font-size:15px;
        font-weight:600;
        cursor:pointer;
        background:#dc2626;
        color:#fff;
        box-shadow:0 10px 20px rgba(220,38,38,.35);
        transition:transform .12s ease,filter .2s ease;
      }
      .sw-logout-btn:hover{filter:brightness(1.05);}
      .sw-logout-btn:active{transform:translateY(1px);}
    `;
    document.head.appendChild(style);
  }

  function createLogoutButton(text) {
    ensureLogoutStyles();
    const t = (key, fallback) => {
      try {
        if (typeof window.tr === "function") {
          const v = window.tr(key);
          if (v && v !== key) return v;
        }
        if (window.T && window.T[key]) return window.T[key];
        const lang = localStorage.getItem("sw_lang") || document.documentElement.getAttribute("lang") || "th";
        const dict = window.SW_Translations && window.SW_Translations[lang];
        if (dict && dict[key]) return dict[key];
      } catch (_) {
        /* ignore */
      }
      return fallback;
    };

    const fallbackLabel = t("menuLogout", t("btnLogout", t("logout", "Logout")));
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sw-logout-btn";
    btn.textContent = text || fallbackLabel;
    btn.addEventListener("click", logout);
    return btn;
  }

  function mountLogoutButtons() {
    const slots = document.querySelectorAll("[data-sw-logout-slot]");
    if (slots.length === 0) return;
    slots.forEach(slot => {
      if (slot.dataset.swLogoutMounted === "1") return;
      const btn = createLogoutButton(slot.dataset.logoutText);
      slot.appendChild(btn);
      slot.dataset.swLogoutMounted = "1";
    });
  }

  document.addEventListener("DOMContentLoaded", mountLogoutButtons);

  window.SWAuth = {
    requireAuth,
    getCurrentUser,
    logout
  };
})();
