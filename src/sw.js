'use strict';

const cacheName = 'groveld-cache';
const cacheFiles = [
  'https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css',
  'https://code.jquery.com/jquery-3.3.1.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js',
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
