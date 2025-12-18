(()=>{
  const MENU_ITEMS = [
    { id: "register", href: "addBin.html" },
    { id: "addDriver", href: "addDriver.html" },
    { id: "schedule", href: "schedule.html" },
    { id: "truck", href: "truck.html" },
    { id: "report", href: "reports.html" }
  ];

  const NAV_LABELS = {
    th: {
      register: "ลงทะเบียนถังขยะ",
      addDriver: "พนักงานขับรถ",
      schedule: "ตารางเก็บขยะ",
      truck: "ตำแหน่งรถเก็บขยะ",
      report: "รายงานย้อนหลัง",
      logout: "ออกจากระบบ"
    },
    en: {
      register: "Register Bin",
      addDriver: "Drivers",
      schedule: "Collection Schedule",
      truck: "Truck Tracking",
      report: "Reports",
      logout: "Logout"
    },
    ms: {
      register: "Daftar Tong",
      addDriver: "Pemandu",
      schedule: "Jadual Kutipan",
      truck: "Lokasi Lori",
      report: "Laporan",
      logout: "Keluar"
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
      if (window.SWAuth && typeof window.SWAuth.logout === "function") {
        window.SWAuth.logout();
      }
    };
    return btn;
  }

  function buildMenus(){
    document.querySelectorAll("[data-admin-menu]").forEach(nav => {
      const active = nav.dataset.active || "home";
      const links = MENU_ITEMS.map(item => {
        const cls = item.id === active ? "active" : "";
        return `<a href="${item.href}" data-nav="${item.id}" class="${cls}"></a>`;
      }).join("");
      nav.innerHTML = links;
    });
    applyLabels(currentLang);
  }

  function applyLabels(lang){
    currentLang = lang || "th";
    const labels = NAV_LABELS[currentLang] || NAV_LABELS.th;
    document.querySelectorAll("[data-admin-menu] a[data-nav]").forEach(link => {
      const key = link.dataset.nav;
      link.textContent = labels[key] || key;
    });

    document.querySelectorAll("[data-sw-logout-slot]").forEach(slot => {
      slot.innerHTML = "";
      slot.appendChild(createLogoutButton(currentLang));
    });
  }

  document.addEventListener("DOMContentLoaded", buildMenus);

  window.AdminNav = {
    setLanguage(lang){
      if (LangState && typeof LangState.setLang === "function") {
        LangState.setLang(lang);
        currentLang = LangState.getLang();
      } else {
        currentLang = lang || currentLang;
        try { localStorage.setItem("sw_lang", currentLang); } catch (_) {}
      }
      applyLabels(currentLang);
    },
    getLanguage(){
      return currentLang;
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
