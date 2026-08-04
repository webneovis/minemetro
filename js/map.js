/* map.js — інтерактивна схема метро: підказки, фільтр ліній, перехід на станцію */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var map = document.querySelector(".metro-map");
    if (!map) return;

    var tooltip = document.createElement("div");
    tooltip.className = "map-tooltip";
    document.body.appendChild(tooltip);

    var stations = map.querySelectorAll(".map-station");

    function showTooltip(event, node) {
      var name = node.getAttribute("data-name");
      var line = node.getAttribute("data-line-name");
      var transfer = node.getAttribute("data-transfer");
      tooltip.textContent = name + " · " + line + (transfer ? " · пересадка" : "");
      tooltip.style.left = event.clientX + "px";
      tooltip.style.top = event.clientY + "px";
      tooltip.classList.add("is-visible");
    }

    for (var i = 0; i < stations.length; i += 1) {
      (function (node) {
        node.addEventListener("mousemove", function (event) {
          showTooltip(event, node);
        });
        node.addEventListener("mouseleave", function () {
          tooltip.classList.remove("is-visible");
        });
        node.addEventListener("focus", function () {
          node.classList.add("is-focused");
        });
      })(stations[i]);
    }

    // фільтр ліній у легенді
    var buttons = document.querySelectorAll(".map-legend button");
    for (var b = 0; b < buttons.length; b += 1) {
      buttons[b].addEventListener("click", function () {
        var key = this.getAttribute("data-line");
        var active = this.classList.contains("is-active");

        for (var c = 0; c < buttons.length; c += 1) buttons[c].classList.remove("is-active");

        var lines = map.querySelectorAll(".map-line");
        var nodes = map.querySelectorAll(".map-station");
        var n;

        for (n = 0; n < lines.length; n += 1) lines[n].classList.remove("is-active");
        for (n = 0; n < nodes.length; n += 1) nodes[n].classList.remove("is-active");

        if (active || !key) {
          map.classList.remove("is-dimmed");
          return;
        }

        this.classList.add("is-active");
        map.classList.add("is-dimmed");

        var chosenLines = map.querySelectorAll('.map-line[data-line="' + key + '"]');
        var chosenNodes = map.querySelectorAll('.map-station[data-line="' + key + '"]');
        for (n = 0; n < chosenLines.length; n += 1) chosenLines[n].classList.add("is-active");
        for (n = 0; n < chosenNodes.length; n += 1) chosenNodes[n].classList.add("is-active");
      });
    }
  });
})();
