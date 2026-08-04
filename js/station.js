/* station.js — фотогалерея станції (лайтбокс) та копіювання координат */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var lightbox = document.querySelector(".lightbox");
    if (lightbox) {
      var image = lightbox.querySelector("img");
      var closeBtn = lightbox.querySelector(".lightbox__close");
      var thumbs = document.querySelectorAll("[data-lightbox-src]");

      function open(src, alt) {
        image.setAttribute("src", src);
        image.setAttribute("alt", alt || "Фото станції");
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
      }

      function close() {
        lightbox.classList.remove("is-open");
        document.body.style.overflow = "";
      }

      for (var i = 0; i < thumbs.length; i += 1) {
        thumbs[i].addEventListener("click", function () {
          open(this.getAttribute("data-lightbox-src"), this.getAttribute("data-lightbox-alt"));
        });
      }

      if (closeBtn) closeBtn.addEventListener("click", close);
      lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) close();
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") close();
      });
    }

    var coords = document.querySelector("[data-copy-coords]");
    if (coords) {
      coords.addEventListener("click", function () {
        var value = this.getAttribute("data-copy-coords");
        var label = this.textContent;
        var done = function () {
          coords.textContent = "Скопійовано!";
          window.setTimeout(function () {
            coords.textContent = label;
          }, 1600);
        };
        if (navigator.clipboard) {
          navigator.clipboard.writeText(value).then(done, done);
        } else {
          done();
        }
      });
    }
  });
})();
