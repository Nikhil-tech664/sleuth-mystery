// Sleuth Offline PWA Service Worker
const CACHE_NAME = 'sleuth-cache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(['/', '/index.html']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let network handle dynamic requests with fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
