/* news.js — сортування та фільтрація новин за роком/категорією */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var list = document.querySelector("[data-news-list]");
    if (!list) return;

    var cards = Array.prototype.slice.call(list.querySelectorAll("[data-news-date]"));
    var sortToggle = document.querySelector("[data-news-sort]");
    var tags = document.querySelectorAll("[data-news-tag]");
    var activeTag = "all";
    var descending = true;

    function apply() {
      cards.forEach(function (card) {
        var tag = card.getAttribute("data-news-category");
        card.classList.toggle("is-hidden-item", !(activeTag === "all" || tag === activeTag));
      });

      var sorted = cards.slice().sort(function (a, b) {
        var da = a.getAttribute("data-news-date");
        var db = b.getAttribute("data-news-date");
        return descending ? db.localeCompare(da) : da.localeCompare(db);
      });

      sorted.forEach(function (card) {
        list.appendChild(card);
      });
    }

    for (var t = 0; t < tags.length; t += 1) {
      tags[t].addEventListener("click", function () {
        for (var i = 0; i < tags.length; i += 1) tags[i].classList.remove("is-active");
        this.classList.add("is-active");
        activeTag = this.getAttribute("data-news-tag");
        apply();
      });
    }

    if (sortToggle) {
      sortToggle.addEventListener("click", function () {
        descending = !descending;
        this.textContent = descending ? "Спочатку нові" : "Спочатку старі";
        apply();
      });
    }

    apply();
  });
})();
