importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0-beta.0/workbox-sw.js');

workbox.core.setCacheNameDetails({
  prefix: 'stcs',
  suffix: 'v_{{ version }}'
});

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
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

workbox.precaching.precacheAndRoute([
  {% for k in manifest %}{url: '{{ k }}', revision: '{{ manifest[k] }}'},
  {% endfor %}
]);
