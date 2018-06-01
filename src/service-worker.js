self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] Installed!');
});

self.addEventListener('activate', function(event) {
});

self.addEventListener('fetch', function(event) {
  console.log("Resource requested is :", event.request.url);
});
