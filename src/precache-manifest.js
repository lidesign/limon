importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
// Inject precache-manifest
workbox.precaching.precacheAndRoute([]);

/*
// Cache gstatic CDNs
workbox.routing.registerRoute(
  /.*\.gstatic\.com\//,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'gstatic'
  })
);
// Cache Google Fonts stylesheets
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com\//,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets'
  })
);
// Cache jsDelivr
workbox.routing.registerRoute(
  /^https:\/\/cdn\.jsdelivr\.net\//,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'jsdelivr'
  })
);
*/

// Cache images
workbox.routing.registerRoute(
  /\.(?:jpg|jpeg|png|gif|webp|ico|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        // 30 Days
        maxAgeSeconds: 60 * 60 * 24 * 30
      })
    ]
  })
);
// Cache JavaScript and CSS Files
workbox.routing.registerRoute(
  /\.(?:js|mjs|css)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'static',
    plugins: [
      new workbox.expiration.Plugin({
        // 30 Days
        maxAgeSeconds: 60 * 60 * 24 * 30
      })
    ]
  })
);
// Router
workbox.routing.registerNavigationRoute('/');
// Force service worker to update immediately after installing
self.addEventListener('install', function(ev) {
  ev.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', function(ev) {
  self.clients.claim();
});
// Google Analytics offline
workbox.googleAnalytics.initialize();
