---
permalink: /sw.js
---

'use strict';

const cacheVersion = '{{ site.time }}::';
const urlsToCache = [
  {% for page in site.pages %}'{{ page.url | relative_url }}',{% endfor %}
  {% for post in site.posts %}'{{ post.url | relative_url }}',{% endfor %}
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheVersion + 'static').then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
  return self.skipWaiting();
});

self.addEventListener('activate', function(event) {
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
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheVersion + 'static').then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(function() {
        return caches.match('{{ "/404" | relative_url }}')
      });
    })
  );
});
