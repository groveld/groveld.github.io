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
  '/static/css/style.css',
  '/static/js/main.js',
  '/static/images/logo.png',
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

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(cacheFiles);
    })
  );
});

self.addEventListener('activate', e => {
});

self.addEventListener('fetch', e => {
});
