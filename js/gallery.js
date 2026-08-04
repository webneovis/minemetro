//* gallery.js — фільтр та пошук у галереях станцій і поїздів */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.querySelector("[data-gallery]");
    if (!grid) return;

    var cards = grid.querySelectorAll("[data-filter-value]");
    var buttons = document.querySelectorAll(".filters button");
    var search = document.querySelector("[data-search]");
    var counter = document.querySelector("[data-result-count]");
    var activeFilter = "all";

    function apply() {
      var query = search ? search.value.trim().toLowerCase() : "";
      var shown = 0;

      for (var i = 0; i < cards.length; i += 1) {
        var card = cards[i];
        var value = card.getAttribute("data-filter-value");
        var text = (card.getAttribute("data-search-text") || "").toLowerCase();
        var matchFilter = activeFilter === "all" || value === activeFilter;
        var matchQuery = !query || text.indexOf(query) !== -1;
        var visible = matchFilter && matchQuery;
        card.classList.toggle("is-hidden-item", !visible);
        if (visible) shown += 1;
      }

      if (counter) counter.textContent = String(shown);
    }

    for (var b = 0; b < buttons.length; b += 1) {
      buttons[b].addEventListener("click", function () {
        for (var c = 0; c < buttons.length; c += 1) buttons[c].classList.remove("is-active");
        this.classList.add("is-active");
        activeFilter = this.getAttribute("data-filter") || "all";
        apply();
      });
    }

    if (search) search.addEventListener("input", apply);
    apply();
  });
})();
