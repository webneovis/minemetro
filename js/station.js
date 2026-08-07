/* station.js — фотогалерея станції (лайтбокс) та копіювання координат */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var lightbox = document.querySelector(".lightbox");
    if (lightbox) {
      var image = lightbox.querySelector("img");
      var closeBtn = lightbox.querySelector(".lightbox__close");
      var prevBtn = lightbox.querySelector(".lightbox__nav--prev");
      var nextBtn = lightbox.querySelector(".lightbox__nav--next");
      var counter = lightbox.querySelector(".lightbox__counter");
      var thumbs = document.querySelectorAll("[data-lightbox-src]");
      var current = 0;

      function show(index) {
        if (!thumbs.length) return;
        current = (index + thumbs.length) % thumbs.length;
        var thumb = thumbs[current];
        image.setAttribute("src", thumb.getAttribute("data-lightbox-src"));
        image.setAttribute("alt", thumb.getAttribute("data-lightbox-alt") || "Фото станції");
        if (counter) counter.textContent = (current + 1) + " / " + thumbs.length;
      }

      function open(index) {
        show(index);
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
      }

      function close() {
        lightbox.classList.remove("is-open");
        document.body.style.overflow = "";
      }

      function isOpen() {
        return lightbox.classList.contains("is-open");
      }

      for (var i = 0; i < thumbs.length; i += 1) {
        (function (index) {
          thumbs[index].addEventListener("click", function () {
            open(index);
          });
        })(i);
      }

      if (thumbs.length < 2) {
        if (prevBtn) prevBtn.hidden = true;
        if (nextBtn) nextBtn.hidden = true;
      }

      if (prevBtn) {
        prevBtn.addEventListener("click", function (event) {
          event.stopPropagation();
          show(current - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener("click", function (event) {
          event.stopPropagation();
          show(current + 1);
        });
      }

      if (closeBtn) closeBtn.addEventListener("click", close);
      lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) close();
      });
      document.addEventListener("keydown", function (event) {
        if (!isOpen()) return;
        if (event.key === "Escape") close();
        if (event.key === "ArrowLeft") show(current - 1);
        if (event.key === "ArrowRight") show(current + 1);
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

