/* navigation.js — sticky-хедер, бургер-меню, підсвітка активного пункту */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var header = document.querySelector(".site-header");
    var burger = document.querySelector(".nav__burger");
    var menu = document.querySelector(".nav__menu");

    if (burger && menu) {
      burger.addEventListener("click", function () {
        var open = menu.classList.toggle("is-open");
        burger.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", String(open));
      });

      menu.addEventListener("click", function (event) {
        if (event.target.closest(".nav__link")) {
          menu.classList.remove("is-open");
          burger.classList.remove("is-open");
          burger.setAttribute("aria-expanded", "false");
        }
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          menu.classList.remove("is-open");
          burger.classList.remove("is-open");
        }
      });
    }

    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 24);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // активний пункт меню за поточним файлом
    var current = window.location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll(".nav__link");
    for (var i = 0; i < links.length; i += 1) {
      var href = links[i].getAttribute("href");
      var group = links[i].getAttribute("data-match");
      if (href === current || (group && current.indexOf(group) === 0)) {
        links[i].classList.add("is-active");
      }
    }
  });
})();
