/* navigation.js — sticky-хедер, бургер-меню з drawer, підсвітка активного пункту */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector(".site-header");
    const burger = document.querySelector(".nav__burger");
    const menu = document.querySelector(".nav__menu");
    const scrim = document.querySelector(".nav-scrim");

    let closeTimer = 0;

    const setMenu = (open) => {
      if (!menu || !burger) return;
      const wasOpen = menu.classList.contains("is-open");
      menu.classList.toggle("is-open", open);
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
      if (scrim) scrim.classList.toggle("is-visible", open);

      const mobile = window.innerWidth <= 900;
      if (open) {
        menu.classList.remove("is-closing");
        if (closeTimer) {
          window.clearTimeout(closeTimer);
          closeTimer = 0;
        }
        document.body.style.overflow = mobile ? "hidden" : "";
      } else if (mobile && wasOpen) {
        // під час анімації закриття панель тимчасово виходить праворуч,
        // тому тримаємо блокування прокрутки до її завершення
        menu.classList.add("is-closing");
        if (closeTimer) window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(() => {
          menu.classList.remove("is-closing");
          document.body.style.overflow = "";
          closeTimer = 0;
        }, 460);
      } else {
        menu.classList.remove("is-closing");
        document.body.style.overflow = "";
      }
    };

    if (burger && menu) {
      burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
      menu.addEventListener("click", (event) => {
        if (event.target.closest(".nav__link")) setMenu(false);
      });
      if (scrim) scrim.addEventListener("click", () => setMenu(false));
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setMenu(false);
      });
      window.addEventListener("resize", () => {
        if (window.innerWidth > 900) setMenu(false);
      });
    }

    if (header) {
      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // активний пункт меню
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav__link").forEach((link) => {
      const href = link.getAttribute("href");
      const match = link.getAttribute("data-match");
      const active = href === path || (match && path.indexOf(match) === 0);
      link.classList.toggle("is-active", Boolean(active));
      if (active) link.setAttribute("aria-current", "page");
    });
  });
})();

