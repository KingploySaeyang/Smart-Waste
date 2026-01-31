(() => {
  function getUser() {
    if (window.SWAuth && typeof window.SWAuth.getCurrentUser === "function") {
      return window.SWAuth.getCurrentUser() || {};
    }
    return {};
  }

  const LangState = window.AdminLang;
  let currentLang = (LangState && typeof LangState.getLang === "function")
    ? LangState.getLang()
    : (localStorage.getItem("sw_lang") || "th");

  const ROLE_LABELS = {
    th: { 0: "ผู้ดูแลระบบ", 1: "พนักงานขับรถ", 2: "ผู้ใช้ทั่วไป" },
    en: { 0: "Administrator", 1: "Driver Staff", 2: "User" },
    ms: { 0: "Pentadbir", 1: "Kakitangan Pemandu", 2: "Pengguna" }
  };

  function getRoleLabel(role) {
    const labels = ROLE_LABELS[currentLang] || ROLE_LABELS.th;
    return labels[role] || labels[2];
  }

  function injectStyles() {
    if (document.getElementById("sw-user-chip-style")) return;
    const style = document.createElement("style");
    style.id = "sw-user-chip-style";
    style.textContent = `
      .user-chip {
        cursor: pointer;
        text-decoration: none;
        color: inherit;
      }
      .user-chip .avatar {
        overflow: hidden;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
      }
      .user-chip .avatar.has-image {
        color: transparent !important;
      }
    `;
    document.head.appendChild(style);
  }

  function applyAvatar(el, user) {
    if (!el || !user) return;
    const displayName = user.fullName || user.username || "";
    const avatarData = user.avatarData || user.avatarUrl || "";
    if (avatarData) {
      el.style.backgroundImage = `url(${avatarData})`;
      el.textContent = "";
      el.classList.add("has-image");
    } else {
      el.style.backgroundImage = "";
      el.textContent = displayName ? displayName.charAt(0).toUpperCase() : "?";
      el.classList.remove("has-image");
    }
  }

  function enhanceChip(chip, user) {
    if (!chip) return;
    if (!chip.dataset.profileLinked) {
      chip.addEventListener("click", () => {
        window.location.href = "profile.html";
      });
      chip.dataset.profileLinked = "1";
    }
    const avatarEl = chip.querySelector(".avatar");
    applyAvatar(avatarEl, user);
  }

  function refreshRoleLabels() {
    const user = getUser();
    const roleLabel = getRoleLabel(user.status);
    document.querySelectorAll(".user-chip #adminRole").forEach(el => {
      el.textContent = roleLabel;
    });
  }

  function refreshAdminName() {
    const user = getUser();
    const displayName = user.fullName || user.username || "-";
    document.querySelectorAll(".user-chip #adminName").forEach(el => {
      el.textContent = displayName;
    });
  }

  function refreshChips() {
    injectStyles();
    const user = getUser();
    document.querySelectorAll(".user-chip").forEach(chip => {
      enhanceChip(chip, user);
    });
    refreshRoleLabels();
    refreshAdminName();
  }

  document.addEventListener("DOMContentLoaded", refreshChips);

  window.AdminUser = {
    getUser,
    refreshChips,
    setLanguage(lang) {
      currentLang = lang || currentLang;
      refreshChips();
    },
    applyAvatar(el) {
      applyAvatar(el, getUser());
    },
    saveToLocal(extra) {
      try {
        const base = getUser();
        const merged = { ...base, ...extra };
        localStorage.setItem("sw_user", JSON.stringify(merged));
      } catch (_) {
        /* ignore */
      }
    }
  };

  if (LangState && typeof LangState.onChange === "function") {
    LangState.onChange(lang => {
      if (lang && lang !== currentLang) {
        currentLang = lang;
        refreshChips();
      }
    });
  }
})();
