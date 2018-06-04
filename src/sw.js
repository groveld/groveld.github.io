---
permalink: /sw.js
---

'use strict';

const CACHE_NAME = 'groveld-{{ site.time | date: '%s' }}';
const urlsToCache = ['/','/?utm_source=homescreen','/sw.js','/manifest.json','/static/offline.html','/static/images/offline.svg'];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        })
        .catch(function() {
          // Offline fallback image
          if (event.request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
            return caches.match('/static/images/offline.svg');
          }
          // If both fail, show a generic fallback:
          return caches.match('/static/offline.html');
        });
      });
    })
  );
});
