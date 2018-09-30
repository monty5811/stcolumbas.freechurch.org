const $ = require('jquery');
window.$ = $;
window.jQuery = $;
const bs = require('bootstrap');
const pay = require('./payments');

function init() {
  // payments
  pay.init();
  // carousel
  $(function() {
    $('#carousel-stcs').carousel({
      pause: 'false',
    });
  });
}

document.addEventListener('DOMContentLoaded', function(event) {
  init();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js');
  });
}
