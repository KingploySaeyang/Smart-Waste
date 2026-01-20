// (() => {
//   const STORAGE_KEY = "sw_lang";
//   const DEFAULT_LANG = "th";
//   const listeners = new Set();

//   let currentLang = readStorage();
//   syncHtmlLang(currentLang);

//   function readStorage() {
//     try {
//       return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
//     } catch (_) {
//       return DEFAULT_LANG;
//     }
//   }

//   function syncHtmlLang(lang) {
//     try {
//       document.documentElement.setAttribute("lang", lang);
//     } catch (_) {
//       /* ignore */
//     }
//   }

//   function notify(lang) {
//     syncHtmlLang(lang);
//     listeners.forEach(fn => {
//       try {
//         fn(lang);
//       } catch (_) {
//         /* ignore listener errors */
//       }
//     });
//     window.dispatchEvent(new CustomEvent("sw:langchange", { detail: { lang } }));
//   }

//   function setLang(lang) {
//     if (!lang || lang === currentLang) return currentLang;
//     currentLang = lang;
//     try {
//       localStorage.setItem(STORAGE_KEY, currentLang);
//     } catch (_) {
//       /* ignore */
//     }
//     notify(currentLang);
//     return currentLang;
//   }

//   function getLang() {
//     return currentLang;
//   }

//   function onChange(fn) {
//     if (typeof fn !== "function") return () => {};
//     listeners.add(fn);
//     return () => listeners.delete(fn);
//   }

//   function bindSelect(selectEl) {
//     if (!selectEl) return () => {};
//     const sync = lang => {
//       if (selectEl.value !== lang) selectEl.value = lang;
//     };
//     sync(currentLang);

//     const changeHandler = e => setLang(e.target.value);
//     selectEl.addEventListener("change", changeHandler);
//     listeners.add(sync);

//     return () => {
//       selectEl.removeEventListener("change", changeHandler);
//       listeners.delete(sync);
//     };
//   }

//   window.addEventListener("storage", e => {
//     if (e.key !== STORAGE_KEY) return;
//     const lang = e.newValue || DEFAULT_LANG;
//     if (lang === currentLang) return;
//     currentLang = lang;
//     notify(currentLang);
//   });

//   window.AdminLang = { getLang, setLang, onChange, bindSelect, STORAGE_KEY };
// })();
