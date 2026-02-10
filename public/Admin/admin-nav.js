(() => {
  const MENU_ITEMS = [
    { id: "register", href: "addBin.html" },
    { id: "addDriver", href: "addDriver.html" },
    { id: "schedule", href: "schedule.html" },
    { id: "truck", href: "truck.html" },
    { id: "report", href: "report.html" }
  ];

  const MENU_ICONS = {
    register: "ri-add-circle-line",
    addDriver: "ri-user-3-line",
    schedule: "ri-calendar-event-line",
    truck: "ri-truck-line",
    report: "ri-bar-chart-fill",
    capacity: "ri-donut-chart-line"
  };

  const NAV_LABELS = {
    th: {
      register: "ลงทะเบียนถังขยะ",
      addDriver: "พนักงานขับรถ",
      schedule: "ตารางขับรถขยะ",
      truck: "ตำแหน่งรถขยะ",
      report: "รายงานย้อนหลัง",
      logout: "ออกจากระบบ",

      // 🔽 SweetAlert Logout
      logoutTitle: "ออกจากระบบ?",
      logoutText: "คุณต้องการออกจากระบบใช่หรือไม่",
      logoutConfirm: "ออกจากระบบ",
      logoutCancel: "ยกเลิก"
    },
    en: {
      register: "Register Bin",
      addDriver: "Driver Staff",
      schedule: "Collection Schedule",
      truck: "Truck Tracking",
      report: "Reports",
      logout: "Logout",

      // 🔽 SweetAlert Logout
      logoutTitle: "Sign out?",
      logoutText: "Do you want to sign out?",
      logoutConfirm: "Logout",
      logoutCancel: "Cancel"
    },
    ms: {
      register: "Daftar Tong",
      addDriver: "Kakitangan Pemandu",
      schedule: "Jadual Kutipan",
      truck: "Lokasi Lori",
      report: "Laporan",
      logout: "Keluar",

      // 🔽 SweetAlert Logout
      logoutTitle: "Log keluar?",
      logoutText: "Adakah anda mahu log keluar?",
      logoutConfirm: "Log keluar",
      logoutCancel: "Batal"
    }
  };

  const LangState = window.AdminLang;
  let currentLang = (LangState && typeof LangState.getLang === "function")
    ? LangState.getLang()
    : (localStorage.getItem("sw_lang") || "th");

  function createLogoutButton(lang) {
    const labels = NAV_LABELS[lang] || NAV_LABELS.th;
    const btn = document.createElement("button");
    btn.className = "sw-logout-btn";
    btn.textContent = labels.logout || "Logout";
    btn.onclick = () => {
      if (typeof Swal !== "undefined") {
        Swal.fire({
          title: labels.logoutTitle,
          text: labels.logoutText,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: labels.logoutConfirm,
          cancelButtonText: labels.logoutCancel,
          confirmButtonColor: "#dc2626",
          cancelButtonColor: "#94a3b8",
          reverseButtons: true
        }).then(r => {
          if (r.isConfirmed) {
            localStorage.removeItem("sw_user");
            location.href = "../Login/login.html";
          }
        });
      } else {
        const ok = window.confirm(labels.logoutText || "Do you want to sign out?");
        if (ok) {
          localStorage.removeItem("sw_user");
          location.href = "../Login/login.html";
        }
      }
    };
    return btn;
  }

  function buildMenus() {
    document.querySelectorAll("[data-admin-menu]").forEach(nav => {
      const active = nav.dataset.active || "home";
      const links = MENU_ITEMS.map(item => {
        const cls = item.id === active ? "active" : "";
        const icon = MENU_ICONS[item.id] || "ri-checkbox-blank-circle-line";
        return `<a href="${item.href}" data-nav="${item.id}" class="${cls}">
                  <i class="${icon}" aria-hidden="true"></i>
                  <span class="menu-text"></span>
                </a>`;
      }).join("");
      nav.innerHTML = links;
    });
    applyLabels(currentLang);
  }

  function applyLabels(lang) {
    currentLang = lang || "th";
    const labels = NAV_LABELS[currentLang] || NAV_LABELS.th;
    document.querySelectorAll("[data-admin-menu] a[data-nav]").forEach(link => {
      const key = link.dataset.nav;
      const label = labels[key] || key;
      const textEl = link.querySelector(".menu-text");
      if (textEl) textEl.textContent = label;
      else link.textContent = label;
    });

    document.querySelectorAll("[data-sw-logout-slot]").forEach(slot => {
      slot.innerHTML = "";
      slot.appendChild(createLogoutButton(currentLang));
    });
  }

  document.addEventListener("DOMContentLoaded", buildMenus);

  window.AdminNav = {
    setLanguage(lang) {
      if (LangState && typeof LangState.setLang === "function") {
        LangState.setLang(lang);
        currentLang = LangState.getLang();
      } else {
        currentLang = lang || currentLang;
        try { localStorage.setItem("sw_lang", currentLang); } catch (_) { }
      }
      applyLabels(currentLang);
    },
    getLanguage() {
      return currentLang;
    },
    setActive(navId){
      document.querySelectorAll("[data-admin-menu] a[data-nav]").forEach(link=>{
        link.classList.toggle("active", link.dataset.nav === navId);
      });
    }
  };

  if (LangState && typeof LangState.onChange === "function") {
    LangState.onChange(lang => {
      if (lang && lang !== currentLang) {
        applyLabels(lang);
      }
    });
  }
})();
