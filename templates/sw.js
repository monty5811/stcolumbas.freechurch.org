importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

workbox.skipWaiting();
workbox.clientsClaim();

workbox.core.setCacheNameDetails({
  prefix: 'stcs',
  suffix: 'v_{{ version }}'
});

// we can use this if we get https://github.com/GoogleChrome/workbox/issues/1612
// workbox.precaching.precacheAndRoute([
//   {% for k in manifest %}{url: '{{ k }}', revision: '{{ manifest[k] }}'},
//   {% endfor %}
// ]);
// in the meantime we use this so we always get up to date data:
self.addEventListener('install', event => {
  const urls = [{% for k in manifest %}'{{ k }}',
    {% endfor %}
  ];
  /* ... */
  event.waitUntil(
    caches.open(workbox.core.cacheNames.runtime).then(cache => cache.addAll(urls))
  );
});

workbox.routing.setDefaultHandler(workbox.strategies.networkFirst({networkTimeoutSeconds: 2}));

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

workbox.routing.registerRoute(
  new RegExp('^https://fonts.(?:googleapis|gstatic).com/(.*)'),
  workbox.strategies.cacheFirst(),
);
