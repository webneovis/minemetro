/* main.js — анімовані лічильники статистики, кнопка "нагору", рік у футері */
(function () {
  "use strict";

  function formatNumber(value) {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var duration = 1500;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = decimals
        ? value.toFixed(decimals).replace(".", ",")
        : formatNumber(Math.round(value));
      if (progress < 1) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var counters = document.querySelectorAll("[data-count]");

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      for (var i = 0; i < counters.length; i += 1) observer.observe(counters[i]);
    } else {
      for (var j = 0; j < counters.length; j += 1) animateCounter(counters[j]);
    }

    var toTop = document.querySelector(".to-top");
    if (toTop) {
      window.addEventListener(
        "scroll",
        function () {
          toTop.classList.toggle("is-visible", window.scrollY > 420);
        },
        { passive: true }
      );
      toTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    var years = document.querySelectorAll("[data-current-year]");
    for (var k = 0; k < years.length; k += 1) {
      years[k].textContent = String(new Date().getFullYear());
    }
  });
})();
