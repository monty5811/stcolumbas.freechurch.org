var $ = require('jquery');
window.$ = $;
window.jQuery = $;
var bs = require('bootstrap');
var pay = require('./payments');

function gMap() {
  $(document).ready(function($) {
    var center = new google.maps.LatLng(55.948845, -3.194091999999955);
    var map_pin = new google.maps.MarkerImage(
      '/static/images/icons/mapmarker-icon-76x106.png'
    );
    map_pin.size = new google.maps.Size(38, 53);
    map_pin.scaledSize = new google.maps.Size(38, 53);
    map_pin.anchor = new google.maps.Point(38, 53);
    var mapOptions = {
      zoom: 15,
      minZoom: 2,
      maxZoom: 18,
      center: center,
      scrollwheel: false,
      draggable: false,
      mapTypeControl: true,
      disableDefaultUI: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    map = new google.maps.Map($('#map-container1')[0], mapOptions);
    var title = '';
    var churchMarker = new google.maps.Marker({
      position: center,
      map: map,
      icon: map_pin,
      url:
        "https://www.google.co.uk/maps/place/St+Columba's+Free+Church+of+Scotland",
    });
    google.maps.event.addListener(churchMarker, 'click', function() {
      window.open(this.url);
    });
  });
}

function init() {
  // payments
  pay.init();
  // carousel
  $(function() {
    $('#carousel-stcs').carousel({
      pause: 'false',
    });
  });
  // google map:
  mapElem = document.getElementById('map-container1');
  if (mapElem !== null) {
    gMap();
  }
}

document.addEventListener('DOMContentLoaded', function(event) {
  init();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js');
  });
}
