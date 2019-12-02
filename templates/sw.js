importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.core.skipWaiting();
workbox.precaching.precache([
  {% for k in manifest %}{url: '{{ k }}', revision: '{{ manifest[k] }}'},
  {% endfor %}
]);

workbox.routing.registerRoute('/.*', new workbox.strategies.NetworkFirst({}));
// cache images, but make sure to not cache leaflet tiles
workbox.routing.registerRoute(
  /static\/.*\.(?:png|gif|jpg|jpeg|svg)$/,
  new workbox.strategies.CacheFirst({
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
  new workbox.strategies.CacheFirst(),
);

// cache leaflet js
workbox.routing.registerRoute(
  new RegExp('^https://unpkg.com/(.*)'),
  new workbox.strategies.CacheFirst(),
);

// required due to workbox v3 -> v4:
workbox.precaching.cleanupOutdatedCaches()

workbox.core.clientsClaim();

