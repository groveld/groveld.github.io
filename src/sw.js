---
permalink: /sw.js
---

'use strict';

const cacheName = `groveld-{{ site.time | date: '%s' }}`;
const urlsToCache = ['/?utm_source=homescreen'];

// Cache assets
{% for file in site.static_files %}urlsToCache.push('{{ file.path }}')
{% endfor %}
// Cache posts
{% for post in site.posts %}urlsToCache.push('{{ post.url }}')
{% endfor %}
// Cache pages
{% for page in site.html_pages %}{% if page.url != '/404' %}urlsToCache.push('{{ page.url }}')
{% endif %}{% endfor %}

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) {
        if (cacheName.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).then(function(response) {
        let clone = response.clone();
        caches.open(cacheName).then(function(cache) {
          cache.put(event.request, clone);
        });
        return response;
      });
    }).catch(function() {
      return caches.match('/static/images/logo.png');
    })
  );
});
