//* gallery.js — фільтр, пошук та пагінація у галереях станцій і поїздів */
(function () {
  "use strict";

  var PER_PAGE = 24;

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.querySelector("[data-gallery]");
    if (!grid) return;

    var cards = grid.querySelectorAll("[data-filter-value]");
    var buttons = document.querySelectorAll(".filters button");
    var search = document.querySelector("[data-search]");
    var counter = document.querySelector("[data-result-count]");
    var activeFilter = "all";

    // --- пагінація (вмикається лише якщо на сторінці є блок [data-pagination])
    var pager = document.querySelector("[data-pagination]");
    var pageList = pager ? pager.querySelector("[data-page-list]") : null;
    var pageInfo = pager ? pager.querySelector("[data-page-info]") : null;
    var prevBtn = pager ? pager.querySelector("[data-page-prev]") : null;
    var nextBtn = pager ? pager.querySelector("[data-page-next]") : null;
    var section = grid.closest("section") || grid;
    var currentPage = 1;

    function pageNumbers(total, current) {
      // компактний формат: 1 2 3 … 20 21
      var out = [];
      var i;
      if (total <= 7) {
        for (i = 1; i <= total; i += 1) out.push(i);
        return out;
      }
      var start = Math.max(2, current - 1);
      var end = Math.min(total - 1, current + 1);
      out.push(1);
      if (start > 2) out.push("…");
      for (i = start; i <= end; i += 1) out.push(i);
      if (end < total - 1) out.push("…");
      out.push(total);
      return out;
    }

    function renderPager(totalPages) {
      if (!pager) return;
      pager.hidden = totalPages <= 1;
      if (prevBtn) prevBtn.disabled = currentPage <= 1;
      if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
      if (pageInfo) pageInfo.textContent = "Сторінка " + currentPage + " з " + totalPages;
      if (!pageList) return;

      pageList.textContent = "";
      var items = pageNumbers(totalPages, currentPage);
      for (var i = 0; i < items.length; i += 1) {
        if (items[i] === "…") {
          var dots = document.createElement("span");
          dots.className = "pagination__dots";
          dots.textContent = "…";
          dots.setAttribute("aria-hidden", "true");
          pageList.appendChild(dots);
          continue;
        }
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pagination__page" + (items[i] === currentPage ? " is-active" : "");
        btn.textContent = String(items[i]);
        btn.setAttribute("data-page", String(items[i]));
        if (items[i] === currentPage) btn.setAttribute("aria-current", "page");
        btn.setAttribute("aria-label", "Сторінка " + items[i]);
        pageList.appendChild(btn);
      }
    }

    function apply(resetPage) {
      var query = search ? search.value.trim().toLowerCase() : "";
      var matched = [];
      var i;

      for (i = 0; i < cards.length; i += 1) {
        var card = cards[i];
        var value = card.getAttribute("data-filter-value");
        var text = (card.getAttribute("data-search-text") || "").toLowerCase();
        var matchFilter = activeFilter === "all" || value === activeFilter;
        var matchQuery = !query || text.indexOf(query) !== -1;
        var visible = matchFilter && matchQuery;
        card.classList.toggle("is-hidden-item", !visible);
        if (visible) matched.push(card);
      }

      if (counter) counter.textContent = String(matched.length);

      if (!pager) return;

      var totalPages = Math.max(1, Math.ceil(matched.length / PER_PAGE));
      if (resetPage) currentPage = 1;
      if (currentPage > totalPages) currentPage = totalPages;
      if (currentPage < 1) currentPage = 1;

      var from = (currentPage - 1) * PER_PAGE;
      var to = from + PER_PAGE;

      for (i = 0; i < cards.length; i += 1) cards[i].classList.add("is-hidden-page");
      for (i = from; i < to && i < matched.length; i += 1) {
        matched[i].classList.remove("is-hidden-page");
        matched[i].classList.add("is-visible");
      }

      renderPager(totalPages);
    }

    function goTo(page, scroll) {
      currentPage = page;
      apply(false);
      if (scroll && section) {
        var offset = 75; // <- підберіть під висоту вашого header + бажаний відступ
        var top = section.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    }

    for (var b = 0; b < buttons.length; b += 1) {
      buttons[b].addEventListener("click", function () {
        for (var c = 0; c < buttons.length; c += 1) buttons[c].classList.remove("is-active");
        this.classList.add("is-active");
        activeFilter = this.getAttribute("data-filter") || "all";
        apply(true);
      });
    }

    if (search) {
      search.addEventListener("input", function () {
        apply(true);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (currentPage > 1) goTo(currentPage - 1, true);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(currentPage + 1, true);
      });
    }

    if (pageList) {
      pageList.addEventListener("click", function (event) {
        var target = event.target.closest("[data-page]");
        if (!target) return;
        var page = parseInt(target.getAttribute("data-page"), 10);
        if (page && page !== currentPage) goTo(page, true);
      });
    }

    apply(true);
  });
})();
