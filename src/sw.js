---
permalink: /sw.js
---

'use strict';

const CACHE_NAME = 'groveld-{{ site.time | date: '%s' }}';
const urlsToCache = ['/','/?utm_source=homescreen','/manifest.json','/sw.js','/404','/offline','https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css'];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        keys.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(key);
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
          // If both fail, show a generic fallback:
          return caches.match('/offline');
        });
      });
    })
  );
});
