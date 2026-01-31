(() => {
  const ACTIVE_NAV = document.body.dataset.activeNav || document.documentElement.dataset.activeNav || "home";

  const ROLE_LABELS = {
    th: { 0: "ผู้ดูแลระบบ", 1: "พนักงานขับรถ", 2: "ผู้ใช้ทั่วไป", admin: "ผู้ดูแลระบบ", driver: "พนักงานขับรถ", user: "ผู้ใช้ทั่วไป" },
    en: { 0: "Administrator", 1: "Driver Staff", 2: "User", admin: "Administrator", driver: "Driver Staff", user: "User" },
    ms: { 0: "Pentadbir", 1: "Kakitangan Pemandu", 2: "Pengguna", admin: "Pentadbir", driver: "Kakitangan Pemandu", user: "Pengguna" }
  };

  let currentLang = (window.AdminLang && typeof AdminLang.getLang === "function")
    ? AdminLang.getLang()
    : (localStorage.getItem("sw_lang") || "th");

  function getRoleLabelFromUser(admin) {
    const labels = ROLE_LABELS[currentLang] || ROLE_LABELS.th;

    // รองรับทั้ง role แบบ string (admin/user/driver) และ status แบบเลข (0/1/2)
    const role = admin?.role;
    const status = admin?.status;

    if (role != null && labels[role]) return labels[role];
    if (status != null && labels[status] != null) return labels[status];

    // fallback
    return labels[2] || "User";
  }

  function buildShell() {
    if (document.getElementById("adminShellHeader")) return;

    const initialNodes = Array.from(document.body.childNodes);

    const header = document.createElement("header");
    header.className = "top-header";
    header.id = "adminShellHeader";
    header.innerHTML = `
      <div class="brand-left">
        <button class="menu-toggle" id="menuToggleBtn" type="button" aria-label="เมนู">
          <i class="ri-menu-fill"></i>
        </button>
        <div class="brand-mark"><i class="ri-recycle-line"></i></div>
        <div class="brand-name">Smart Waste</div>
      </div>
      <div class="header-right">
        <div class="lang-switcher" style="position:relative;">
          <button class="icon-btn" id="langIconBtn" type="button" aria-label="เปลี่ยนภาษา">
            <i class="ri-global-line"></i>
          </button>
          <div class="lang-menu" id="langMenu">
            <button type="button" data-lang="th">ไทย</button>
            <button type="button" data-lang="en">English</button>
            <button type="button" data-lang="ms">Bahasa Melayu</button>
          </div>
          <select id="langSelect" style="display:none;">
            <option value="th">ไทย</option>
            <option value="en">English</option>
            <option value="ms">Bahasa Melayu</option>
          </select>
        </div>
        <div class="header-user" id="profileBoxTop">
          <img src="images/profile-icon.png" alt="Profile" class="user-avatar" id="adminAvatarTop">
          <div class="user-meta">
            <div class="user-name" id="adminNameTop">-</div>
<div class="user-role" id="adminRoleTop">-</div>
          </div>
        </div>
      </div>`;

    const overlay = document.createElement("div");
    overlay.id = "drawerOverlay";
    overlay.className = "drawer-overlay";

    const sidebar = document.createElement("aside");
    sidebar.className = "sidebar";
    sidebar.id = "sidebar";
    sidebar.setAttribute("aria-label", "เมนูด้านข้าง");
    sidebar.innerHTML = `
      <div class="sidebar-user" id="profileBoxSide">
        <img src="images/profile-icon.png" alt="Profile" class="user-avatar" id="adminAvatarSide">
        <div class="user-meta">
          <div class="user-name" id="adminNameSide">-</div>
          <div class="user-role" id="adminRoleSide">-</div>
        </div>
      </div>
      <nav class="menu" data-admin-menu data-active="${ACTIVE_NAV}"></nav>
      <div class="sw-logout-slot" data-sw-logout-slot></div>`;

    const main = document.createElement("main");
    main.className = "admin-main";
    main.id = "adminShellMain";
    const content = document.createElement("div");
    content.id = "adminShellContent";
    main.appendChild(content);

    document.body.append(header, overlay, sidebar, main);

    initialNodes.forEach(node => {
      if (!node) return;
      if (node.nodeType !== 1) {
        content.appendChild(node);
        return;
      }
      const cls = node.classList || [];
      const id = node.id || "";
      if (cls.contains("sidebar") || cls.contains("topbar") || cls.contains("sidebar-backdrop") || cls.contains("toggle-btn") || id === "sidebar") return;
      if (id === "pageLoader") {
        document.body.appendChild(node);
        return;
      }
      if (node.tagName && node.tagName.toLowerCase() === "script") {
        document.body.appendChild(node);
      } else {
        content.appendChild(node);
      }
    });
  }

  function ensureLoader() {
    if (document.getElementById("pageLoader")) return;
    const loader = document.createElement("div");
    loader.id = "pageLoader";
    loader.className = "shell-loader";
    loader.innerHTML = `
      <div class="loader-box">
        <div class="loader-spinner"></div>
        <div class="loader-text" id="loaderText">กำลังโหลด...</div>
      </div>`;
    document.body.appendChild(loader);
  }

  function isMobile() {
    return window.innerWidth <= 980;
  }

  function bindDrawer() {
    const menuToggleBtn = document.getElementById("menuToggleBtn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("drawerOverlay");
    function openDrawer() {
      if (!isMobile()) return;
      sidebar.classList.add("show");
      overlay.classList.add("show");
      document.body.style.overflow = "hidden";
    }
    function closeDrawer() {
      sidebar.classList.remove("show");
      overlay.classList.remove("show");
      document.body.style.overflow = "";
    }
    function toggleDrawer() {
      if (sidebar.classList.contains("show")) closeDrawer();
      else openDrawer();
    }
    if (menuToggleBtn && sidebar) menuToggleBtn.addEventListener("click", toggleDrawer);
    if (overlay) overlay.addEventListener("click", closeDrawer);
    document.addEventListener("click", e => {
      if (!isMobile()) return;
      const a = e.target.closest(".menu a");
      if (a) closeDrawer();
    });
    window.addEventListener("resize", () => {
      if (!isMobile()) closeDrawer();
    });
  }

  function bindLangMenu() {
    const langIconBtn = document.getElementById("langIconBtn");
    const langMenu = document.getElementById("langMenu");
    function toggleLangMenu(show) {
      if (!langMenu) return;
      if (typeof show === "boolean") langMenu.style.display = show ? "block" : "none";
      else langMenu.style.display = (langMenu.style.display === "block") ? "none" : "block";
    }
    if (langIconBtn && langMenu) {
      langIconBtn.addEventListener("click", () => toggleLangMenu());
      langMenu.addEventListener("click", e => {
        const btn = e.target.closest("button[data-lang]");
        if (!btn) return;
        const lang = btn.dataset.lang;
        currentLang = lang;
        if (window.AdminLang && typeof AdminLang.setLang === "function") {
          AdminLang.setLang(lang);
        }

        // อัปเดต role ใน shell ทันที
        const admin = window.ADMIN_AUTH || window.currentUser || (window.SWAuth?.getCurrentUser?.() || null);
        if (admin) setAdminUI(admin); else {
          try { localStorage.setItem("sw_lang", lang); } catch (_) { }
        }
        if (window.AdminNav && typeof AdminNav.setLanguage === "function") {
          AdminNav.setLanguage(lang);
        }
        if (window.AdminUser && typeof AdminUser.setLanguage === "function") {
          AdminUser.setLanguage(lang);
        }
        toggleLangMenu(false);
      });
      document.addEventListener("click", e => {
        const inMenu = langMenu.contains(e.target) || langIconBtn.contains(e.target);
        if (!inMenu) toggleLangMenu(false);
      });
    }
  }

  function setAdminUI(admin) {
    const displayName = admin?.fullName || admin?.displayName || admin?.username || admin?.email || admin?.uid || "-";
    const roleLabel = getRoleLabelFromUser(admin);

    const nameTop = document.getElementById("adminNameTop");
    const roleTop = document.getElementById("adminRoleTop");
    const nameSide = document.getElementById("adminNameSide");
    const roleSide = document.getElementById("adminRoleSide");

    if (nameTop) nameTop.textContent = displayName;
    if (roleTop) roleTop.textContent = roleLabel;
    if (nameSide) nameSide.textContent = displayName;
    if (roleSide) roleSide.textContent = roleLabel;
  }

  function watchAdminAuth() {
    let tries = 0;
    let resolving = false;
    const timer = setInterval(async () => {
      if (resolving) return;
      resolving = true;
      tries++;

      let admin = window.ADMIN_AUTH || window.currentUser || null;
      if (!admin && window.SWAuth && typeof window.SWAuth.getCurrentUser === "function") {
        try { admin = window.SWAuth.getCurrentUser(); } catch (_) { admin = null; }
      }

      if (admin) {
        setAdminUI(admin);
        clearInterval(timer);
      } else if (tries > 80) {
        clearInterval(timer);
      }
      resolving = false;
    }, 250);
  }

  function initNavLanguage() {
    let lang = (window.AdminLang && typeof AdminLang.getLang === "function")
      ? AdminLang.getLang()
      : (localStorage.getItem("sw_lang") || "th");
    if (window.AdminNav && typeof AdminNav.setLanguage === "function") {
      AdminNav.setLanguage(lang);
    }
    if (window.AdminUser && typeof AdminUser.setLanguage === "function") {
      AdminUser.setLanguage(lang);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildShell();
    ensureLoader();
    bindDrawer();
    bindLangMenu();
    watchAdminAuth();
    initNavLanguage();
  });
})();
