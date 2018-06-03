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
{% for page in site.html_pages %}{% if page.url != '/404' or page.url != '/CNAME' %}urlsToCache.push('{{ page.url }}')
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
});

self.addEventListener('fetch', function(event) {
});
