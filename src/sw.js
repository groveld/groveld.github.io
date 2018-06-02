'use strict';

const cacheName = 'groveld-cache';
const cacheFiles = [
  '/',
  '/blog',
  '/about',
  '/contact',
  '/legal/terms',
  '/legal/privacy',
  '/legal/cookies',
  '/static/css/app.css',
  '/static/js/app.js',
  '/static/images/logo.png',
  '/articles/htaccess-snippets',
  '/articles/www-non-www-redirection'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(cacheFiles);
      })
  );
});

self.addEventListener('activate', event => {
});

self.addEventListener('fetch', event => {
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
  // event.respondWith(
  //   caches.match(event.request)
  //     .then(response => {
  //       return response || fetch(event.request);
  //     })
  // );
});
