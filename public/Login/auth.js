(function(){
  const LOGIN_PATH = "../Login/home.html";

  function resolveLoginUrl(reason){
    const target = new URL(LOGIN_PATH, window.location.href);
    if(reason){
      target.searchParams.set("auth", reason);
    }
    return target.toString();
  }

  function getCurrentUser(){
    try{
      const raw = localStorage.getItem("sw_user");
      if(!raw) return null;
      const data = JSON.parse(raw);
      if(!data || typeof data.username !== "string" || typeof data.status !== "number"){
        return null;
      }
      return data;
    }catch(err){
      console.warn("Cannot parse sw_user", err);
      return null;
    }
  }

  function clearSession(){
    localStorage.removeItem("sw_user");
  }

  function redirect(reason){
    window.location.href = resolveLoginUrl(reason);
  }

  function requireAuth(allowedStatuses){
    const user = getCurrentUser();
    if(!user){
      clearSession();
      redirect("login");
      throw new Error("User not authenticated");
    }
    if(Array.isArray(allowedStatuses) && allowedStatuses.length > 0){
      if(!allowedStatuses.includes(user.status)){
        redirect("denied");
        throw new Error("User not authorized");
      }
    }
    return user;
  }

  function logout(){
    clearSession();
    redirect("logout");
  }

  function ensureLogoutStyles(){
    if(document.getElementById("sw-logout-style")) return;
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

  function createLogoutButton(text){
    ensureLogoutStyles();
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sw-logout-btn";
    btn.textContent = text || "ออกจากระบบ";
    btn.addEventListener("click", logout);
    return btn;
  }

  function mountLogoutButtons(){
    const slots = document.querySelectorAll("[data-sw-logout-slot]");
    if(slots.length === 0) return;
    slots.forEach(slot => {
      if(slot.dataset.swLogoutMounted === "1") return;
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
