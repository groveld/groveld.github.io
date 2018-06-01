---
permalink: /service-worker.js
---

'use strict';

const cacheName = 'groveld-{{'now' | date: '%s' }}';
const cacheFiles = [
  '/',
  '/about',
  '/articles',
  '/contact',
  '/cookies',
  '/privacy',
  '/terms',
  '/articles/htaccess-snippets',
  '/articles/www-non-www-redirection',
  '/articles/give-user-permission-to-edit-and-add-files-in-var-www',
  '/articles/use-gitolite-to-control-access-to-a-git-server',
  '/articles/open-hackerspaces-day-2014',
  '/articles/how-to-use-gpg-to-encrypt-and-sign-messages',
  '/articles/postfix-with-mysql-backend-and-tls',
  '/articles/clean-urls-with-jekyll-apache',
  '/articles/what-it-really-means-to-hack',
  '/articles/teamspeak-3-server-on-debian-ubuntu',
  '/articles/ohm2013-observe-hack-make'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('activate', (event) => {
});

self.addEventListener('fetch', (event) => {
  // event.respondWith(
  //   caches.match(event.request).then(function(response) {
  //     return response || fetch(event.request);
  //   })
  // );
});
