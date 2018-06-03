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

const cacheName = `groveld-{{ site.time | date: '%s' }}`;

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!cacheName.includes(key)) return caches.delete(key);
      })
    ))
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request).then(function(res) {
          return caches.open(cacheName).then(function(cache) {
            cache.put(event.request.url, res.clone());
            return res;
          });
        });
      }
    })
  );
});
