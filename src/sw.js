---
permalink: /sw.js
---

'use strict';

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

const cacheName = 'groveld-cache-v3';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Activating Service Worker ....', event);
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheName).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
