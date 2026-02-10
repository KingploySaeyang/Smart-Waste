(() => {
  const ACTIVE_NAV = document.body.dataset.activeNav || document.documentElement.dataset.activeNav || "home";
  const LangState = window.AdminLang;
  let currentLang = (LangState && typeof LangState.getLang === "function")
    ? LangState.getLang()
    : (localStorage.getItem("sw_lang") || "th");
  let currentAdmin = null;

  function getTranslation(key) {
    const dict = window.SW_Translations || {};
    const langPack = dict[currentLang] || dict.th || {};
    return langPack[key] || key;
  }

  function getRoleLabel(admin) {
    if (admin && admin.roleLabel) return admin.roleLabel;
    const role = admin?.role ?? admin?.status;
    if (role === "driver" || role === 1) return getTranslation("driverRole");
    if (role === "user" || role === 2) return getTranslation("userRole_user");
    return getTranslation("adminRole");
  }

  function applyShellLanguage(lang) {
    currentLang = lang || currentLang;
    const menuToggleBtn = document.getElementById("menuToggleBtn");
    if (menuToggleBtn) menuToggleBtn.setAttribute("aria-label", getTranslation("ariaMenuToggle"));
    const langIconBtn = document.getElementById("langIconBtn");
    if (langIconBtn) langIconBtn.setAttribute("aria-label", getTranslation("ariaChangeLanguage"));
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.setAttribute("aria-label", getTranslation("ariaSidebar"));
    const loaderText = document.getElementById("loaderText");
    if (loaderText) loaderText.textContent = getTranslation("loading");
    if (!currentAdmin) {
      const roleLabel = getTranslation("adminRole");
      const roleTop = document.getElementById("adminRoleTop");
      const roleSide = document.getElementById("adminRoleSide");
      if (roleTop) roleTop.textContent = roleLabel;
      if (roleSide) roleSide.textContent = roleLabel;
    }
    syncLangMenuActive(currentLang);
  }

  function syncLangMenuActive(lang) {
    const langMenu = document.getElementById("langMenu");
    const langSelect = document.getElementById("langSelect");
    if (langSelect && lang) langSelect.value = lang;
    if (!langMenu || !lang) return;
    langMenu.querySelectorAll("button[data-lang]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }

  function buildShell() {
    if (document.getElementById("adminShellHeader")) return;

    const initialNodes = Array.from(document.body.childNodes);
    const menuToggleLabel = getTranslation("ariaMenuToggle");
    const langToggleLabel = getTranslation("ariaChangeLanguage");
    const roleLabel = getTranslation("adminRole");
    const sidebarLabel = getTranslation("ariaSidebar");

    const header = document.createElement("header");
    header.className = "top-header";
    header.id = "adminShellHeader";
    header.innerHTML = `
      <div class="brand-left">
        <button class="menu-toggle" id="menuToggleBtn" type="button" aria-label="${menuToggleLabel}">
          <i class="ri-menu-fill"></i>
        </button>
        <div class="brand-mark"><i class="ri-recycle-line"></i></div>
        <div class="brand-name">Smart Waste</div>
      </div>
      <div class="header-right">
        <div class="lang-switcher" style="position:relative;">
          <button class="icon-btn" id="langIconBtn" type="button" aria-label="${langToggleLabel}">
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
            <div class="user-role" id="adminRoleTop">${roleLabel}</div>
          </div>
        </div>
      </div>`;

    const overlay = document.createElement("div");
    overlay.id = "drawerOverlay";
    overlay.className = "drawer-overlay";

    const sidebar = document.createElement("aside");
    sidebar.className = "sidebar";
    sidebar.id = "sidebar";
    sidebar.setAttribute("aria-label", sidebarLabel);
    sidebar.innerHTML = `
      <div class="sidebar-user" id="profileBoxSide">
        <img src="images/profile-icon.png" alt="Profile" class="user-avatar" id="adminAvatarSide">
        <div class="user-meta">
          <div class="user-name" id="adminNameSide">-</div>
          <div class="user-role" id="adminRoleSide">${roleLabel}</div>
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
        <div class="loader-text" id="loaderText">${getTranslation("loading")}</div>
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
        if (window.AdminLang && typeof AdminLang.setLang === "function") {
          AdminLang.setLang(lang);
        } else {
          try { localStorage.setItem("sw_lang", lang); } catch (_) {}
        }
        if (window.AdminNav && typeof AdminNav.setLanguage === "function") {
          AdminNav.setLanguage(lang);
        }
        if (window.AdminUser && typeof AdminUser.setLanguage === "function") {
          AdminUser.setLanguage(lang);
        }
        syncLangMenuActive(lang);
        toggleLangMenu(false);
      });
      document.addEventListener("click", e => {
        const inMenu = langMenu.contains(e.target) || langIconBtn.contains(e.target);
        if (!inMenu) toggleLangMenu(false);
      });
    }
  }

  function setAdminUI(admin) {
    currentAdmin = admin || currentAdmin;
    const displayName = admin?.fullName || admin?.displayName || admin?.username || admin?.email || admin?.uid || "-";
    const roleLabel = getRoleLabel(admin || currentAdmin);

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
    applyShellLanguage(currentLang);
  });

  if (LangState && typeof LangState.onChange === "function") {
    LangState.onChange(lang => {
      if (lang && lang !== currentLang) {
        applyShellLanguage(lang);
        if (currentAdmin) setAdminUI(currentAdmin);
      }
    });
  }
})();
