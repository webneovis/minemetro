/* animations.js — поява секцій при скролі, прогрес читання, плавні переходи */
(function () {
  "use strict";

  function revealAll() {
    var items = document.querySelectorAll(".reveal");
    for (var i = 0; i < items.length; i += 1) {
      items[i].classList.add("is-visible");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("page-fade");

    var items = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      revealAll();
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
      );
      for (var i = 0; i < items.length; i += 1) {
        observer.observe(items[i]);
      }
    }

    // індикатор прогресу читання сторінки
    var bar = document.querySelector(".page-progress");
    if (bar) {
      var ticking = false;
      var wasLocked = false;

      // Поки відкрите (або закривається) мобільне меню, body отримує
      // overflow:hidden — висота документа тимчасово недостовірна,
      // тому прогрес заморожуємо на останньому коректному значенні.
      var isMenuLocked = function () {
        return !!document.querySelector(".nav__menu.is-open, .nav__menu.is-closing");
      };

      var update = function () {
        ticking = false;

        if (isMenuLocked()) {
          wasLocked = true;
          return;
        }
        wasLocked = false;

        var doc = document.documentElement;
        var body = document.body;
        // повна висота документа (найбільше з можливих значень)
        var docHeight = Math.max(
          doc.scrollHeight,
          doc.offsetHeight,
          doc.clientHeight,
          body ? body.scrollHeight : 0,
          body ? body.offsetHeight : 0
        );
        var viewport = window.innerHeight || doc.clientHeight || 0;
        var scrolled = window.pageYOffset || doc.scrollTop || 0;
        var max = docHeight - viewport;

        var ratio;
        if (max <= 1) {
          // коротка сторінка: прокручувати нічого
          ratio = 0;
        } else {
          ratio = scrolled / max;
        }
        if (ratio < 0) ratio = 0;
        if (ratio > 1) ratio = 1;

        bar.style.width = (ratio * 100).toFixed(2) + "%";
      };

      var requestUpdate = function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      };

      update();
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate);
      window.addEventListener("orientationchange", requestUpdate);
      window.addEventListener("load", requestUpdate);
      window.addEventListener("pageshow", requestUpdate);

      // висота сторінки змінюється через reveal-анімації, картинки, лайтбокси
      if ("ResizeObserver" in window && document.body) {
        new ResizeObserver(requestUpdate).observe(document.body);
      }

      // щойно меню повністю закрилось — перерахувати за реальною висотою
      var menuEl = document.querySelector(".nav__menu");
      if (menuEl && "MutationObserver" in window) {
        new MutationObserver(function () {
          if (wasLocked && !isMenuLocked()) requestUpdate();
        }).observe(menuEl, { attributes: true, attributeFilter: ["class"] });
      }
    }

    // плавний перехід між сторінками
    document.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (!link) return;
      var href = link.getAttribute("href");
      if (!href || href.charAt(0) === "#" || link.target === "_blank") return;
      if (href.indexOf("http") === 0 || href.indexOf("mailto:") === 0) return;
      if (event.metaKey || event.ctrlKey) return;
      event.preventDefault();
      document.body.classList.add("is-leaving");
      window.setTimeout(function () {
        window.location.href = href;
      }, 220);
    });
  });
})();

