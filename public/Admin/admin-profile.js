/* =========================================================
   admin-profile.js
   ใช้สำหรับแสดงชื่อผู้ใช้ + role ที่มุมขวาบน (user-chip)
   ========================================================= */

(function () {
  if (!window.firebase || !firebase.auth || !firebase.firestore) {
    console.error("Firebase not initialized");
    return;
  }

  const fs = firebase.firestore();
  const usersCol = fs.collection("users");

  // ---------- ROLE LABELS ----------
  const ROLE_LABELS = {
    th: {
      0: "ผู้ดูแลระบบ",
      1: "พนักงานขับรถ",
      2: "ผู้ใช้ทั่วไป"
    },
    en: {
      0: "Administrator",
      1: "Driver",
      2: "User"
    },
    ms: {
      0: "Pentadbir",
      1: "Pemandu",
      2: "Pengguna"
    }
  };

  // ---------- STATE ----------
  let currentProfile = null;
  let currentLang = "th";

  // ---------- DOM ----------
  function getProfileEls() {
    return {
      nameEl: document.getElementById("profileName"),
      roleEl: document.getElementById("profileRole")
    };
  }

  // ---------- LOAD PROFILE ----------
  async function loadProfile(authUser) {
    if (!authUser) return;

    const key =
      authUser.username ||
      authUser.email ||
      authUser.uid;

    if (!key) return;

    try {
      const snap = await usersCol.doc(key).get();
      if (snap.exists) {
        const d = snap.data() || {};
        currentProfile = {
          username: d.username || snap.id,
          fullName: d.fullName || "",
          status: typeof d.status === "number" ? d.status : 0
        };
      } else {
        // fallback
        currentProfile = {
          username: key,
          fullName: "",
          status: 0
        };
      }
      renderProfile();
    } catch (err) {
      console.error("loadProfile error:", err);
    }
  }

  // ---------- RENDER ----------
  function renderProfile() {
    if (!currentProfile) return;

    const { nameEl, roleEl } = getProfileEls();
    if (!nameEl || !roleEl) return;

    const name =
      currentProfile.fullName?.trim() ||
      currentProfile.username ||
      "—";

    const roleMap = ROLE_LABELS[currentLang] || ROLE_LABELS.th;
    const role = roleMap[currentProfile.status] || "";

    nameEl.textContent = name;
    roleEl.textContent = role;
  }

  // ---------- PUBLIC API ----------
  window.AdminProfile = {
    init(authUser) {
      if (authUser) {
        loadProfile(authUser);
      } else {
        firebase.auth().onAuthStateChanged(u => {
          if (u) loadProfile(u);
        });
      }
    },

    setLanguage(lang) {
      if (!ROLE_LABELS[lang]) return;
      currentLang = lang;
      renderProfile();
    }
  };
})();
