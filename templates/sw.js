importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

workbox.skipWaiting();
workbox.precaching.precacheAndRoute([
  {% for k in manifest %}{url: '{{ k }}', revision: '{{ manifest[k] }}'},
  {% endfor %}
]);

workbox.routing.setDefaultHandler(workbox.strategies.staleWhileRevalidate({}));

// cache images, but make sure to not cache leaflet tiles
workbox.routing.registerRoute(
  /static\/.*\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  }),
);

// cache fonts
workbox.routing.registerRoute(
  new RegExp('^https://fonts.(?:googleapis|gstatic).com/(.*)'),
  workbox.strategies.cacheFirst(),
);

// cache leaflet js
workbox.routing.registerRoute(
  new RegExp('^https://unpkg.com/(.*)'),
  workbox.strategies.cacheFirst(),
);

workbox.clientsClaim();
