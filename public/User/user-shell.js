(() => {
  function setActiveNav() {
    const active = document.body.dataset.activeNav || "home";
    document.querySelectorAll(".menu a[data-nav]").forEach(link => {
      link.classList.toggle("active", link.dataset.nav === active);
    });
  }

  function bindDrawer() {
    const menuToggleBtn = document.getElementById("menuToggleBtn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("drawerOverlay");

    if (!menuToggleBtn || !sidebar || !overlay) return;

    const isMobile = () => window.innerWidth <= 980;

    const openDrawer = () => {
      if (!isMobile()) return;
      sidebar.classList.add("show");
      overlay.classList.add("show");
      document.body.style.overflow = "hidden";
    };

    const closeDrawer = () => {
      sidebar.classList.remove("show");
      overlay.classList.remove("show");
      document.body.style.overflow = "";
    };

    menuToggleBtn.addEventListener("click", () => {
      if (sidebar.classList.contains("show")) closeDrawer();
      else openDrawer();
    });

    overlay.addEventListener("click", closeDrawer);

    document.addEventListener("click", e => {
      if (!isMobile()) return;
      const link = e.target.closest(".menu a");
      if (link) closeDrawer();
    });

    window.addEventListener("resize", () => {
      if (!isMobile()) closeDrawer();
    });
  }

  function bindLangToggle() {
    const langIconBtn = document.getElementById("langIconBtn");
    const langMenu = document.getElementById("langMenu");
    if (!langIconBtn || !langMenu) return;

    const toggle = () => langMenu.classList.toggle("show");
    const close = () => langMenu.classList.remove("show");

    langIconBtn.addEventListener("click", e => {
      e.stopPropagation();
      toggle();
    });

    document.addEventListener("click", e => {
      const inMenu = langMenu.contains(e.target) || langIconBtn.contains(e.target);
      if (!inMenu) close();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setActiveNav();
    bindDrawer();
    bindLangToggle();
  });
})();
