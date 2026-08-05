/* navigation.js — sticky-хедер, бургер-меню з drawer, підсвітка активного пункту */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector(".site-header");
    const burger = document.querySelector(".nav__burger");
    const menu = document.querySelector(".nav__menu");
    const scrim = document.querySelector(".nav-scrim");

    let closeTimer = 0;

    // ширина системного скролбара — щоб блокування прокрутки не зсувало сторінку
    const lockScroll = (lock) => {
      if (lock) {
        const gap = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = gap > 0 ? gap + "px" : "";
      } else {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }
    };

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
        if (mobile) lockScroll(true);
        else lockScroll(false);
      } else if (mobile && wasOpen) {
        // прокрутку розблоковуємо одразу: панель більше не виходить за viewport,
        // клас is-closing лише тримає її у DOM до кінця анімації
        menu.classList.add("is-closing");
        lockScroll(false);
        if (closeTimer) window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(() => {
          menu.classList.remove("is-closing");
          closeTimer = 0;
        }, 460);
      } else {
        menu.classList.remove("is-closing");
        lockScroll(false);
      }
    };

    // якщо анімація закриття завершилась раніше за таймер — прибираємо клас одразу
    if (menu) {
      menu.addEventListener("animationend", (event) => {
        if (event.target !== menu || !menu.classList.contains("is-closing")) return;
        menu.classList.remove("is-closing");
        if (closeTimer) {
          window.clearTimeout(closeTimer);
          closeTimer = 0;
        }
      });
    }

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
        if (window.innerWidth > 900) {
          setMenu(false);
          // на десктопі не має лишатися ні класів анімації, ні блокування прокрутки
          menu.classList.remove("is-closing");
          if (closeTimer) {
            window.clearTimeout(closeTimer);
            closeTimer = 0;
          }
          lockScroll(false);
        }
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

