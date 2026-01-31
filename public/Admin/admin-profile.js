/* =========================================================
   admin-profile.js
   แสดงชื่อผู้ใช้ + role (ไม่แตะ Firebase)
   ========================================================= */

(function () {

  const ROLE_LABELS = {
    th: {
      admin: "ผู้ดูแลระบบ",
      driver: "พนักงานขับรถ",
      user: "ผู้ใช้ทั่วไป"
    },
    en: {
      admin: "Administrator",
      driver: "Driver Staff",
      user: "User"
    },
    ms: {
      admin: "Pentadbir",
      driver: "Kakitangan Pemandu",
      user: "Pengguna"
    }
  };

  let currentLang = localStorage.getItem("sw_lang") || "th";

  function getEls() {
    return {
      nameEl: document.getElementById("profileName"),
      roleEl: document.getElementById("profileRole")
    };
  }

  window.AdminProfile = {
    init(user) {
      if (!user) return;

      const { nameEl, roleEl } = getEls();
      if (!nameEl || !roleEl) return;

      // ชื่อ
      nameEl.textContent =
        user.fullName?.trim() ||
        user.username ||
        "—";

      // role
      const map = ROLE_LABELS[currentLang] || ROLE_LABELS.th;
      roleEl.textContent = map[user.role] || user.role || "";
    },

    setLanguage(lang) {
      if (!ROLE_LABELS[lang]) return;
      currentLang = lang;

      // re-render ถ้ามี profile อยู่แล้ว
      if (window.ADMIN_AUTH) {
        this.init(window.ADMIN_AUTH);
      }
    }
  };

})();
