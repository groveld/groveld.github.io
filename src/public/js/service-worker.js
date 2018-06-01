const version = "4";
const cacheName = `groveld-${version}`;
const cacheFiles = [
  '/',
  '/index.html',
  '/about.html',
  '/public/css/main.css',
  '/public/images/logo.png',
  '/public/js/main.js',
  '/public/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(cacheFiles).then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
      return response || fetch(event.request);
    })
  );
});
