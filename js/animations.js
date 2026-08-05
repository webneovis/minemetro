/* animations.js — поява секцій при скролі, плавні переходи */
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