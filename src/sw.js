---
permalink: /sw.js
---

'use strict';

const cacheVersion = '{{ site.time | date: "%s" }}::';
const urlsToCache = [
  '/',
  '/?utm_source=homescreen',
  '/sw.js',
  '/manifest.json',
  '/browserconfig.xml',
  '/static/css/style.css',
  '/static/js/main.js',
  '/static/images/logo.png',
  '/static/offline.html',
  '/static/images/offline.svg'
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheVersion + 'static').then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  self.clients.claim();
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.indexOf(cacheVersion) !== 0;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheVersion + 'dynamic').then(function(cache) {
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
