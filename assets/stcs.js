const $ = require("jquery");
window.$ = $;
window.jQuery = $;
const bs_transition = require("./node_modules/bootstrap/js/transition");
const bs_collapse = require("./node_modules/bootstrap/js/collapse");
const pay = require("./payments");

function lMap() {
  $(document).ready(function($) {
    const url =
      "https://www.google.co.uk/maps/place/St+Columba's+Free+Church+of+Scotland";
    var map = L.map("map-container").setView(
      [55.948757558814606, -3.194131548552832],
      16
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([55.948757558814606, -3.194131548552832]).addTo(map);
  });
}

function init() {
  // payments
  pay.init();
  // carousel
  const mapElem = document.getElementById("map-container");
  if (mapElem !== null) {
    lMap();
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  init();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/sw.js");
  });
}
