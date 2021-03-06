const pay = require("./payments");

function lMap() {
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
}

function transcript() {
  var showButton = document.getElementById("show-transcript");
  var hideButton = document.getElementById("hide-transcript");
  var target = document.getElementById("transcript");
  if (showButton != null) {
    showButton.addEventListener("click", function(event) {
      target.classList.toggle("hidden");
    });
  }
  if (hideButton != null) {
    hideButton.addEventListener("click", function(event) {
      target.classList.toggle("hidden");
    });
  }
}

function init() {
  // transcript
  transcript();
  // payments
  pay.init();
  // maps
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
