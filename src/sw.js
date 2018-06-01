const cacheName = 'groveld-0004';
const cacheFiles = [
  '/',
  '/index.html',
  '/about.html',
  '/public/css/main.css',
  '/public/images/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('activate', (event) => {
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
