const cacheVersion = '1697414554::';

const urlsToExclude = [
  '/atom.xml',
  '/browserconfig.xml',
  '/feed.json',
  '/manifest.json',
  '/robots.txt',
  '/rss.xml',
  '/serviceworker.js',
  '/sitemap.xml'
];

const urlsToCache = [
  '/',
  '/404',
  '/about',
  '/articles',
  '/articles/clean-urls-with-jekyll-apache',
  '/articles/give-user-permission-to-edit-and-add-files-in-var-www',
  '/articles/group-policy-processing',
  '/articles/how-to-use-gpg-to-encrypt-and-sign-messages',
  '/articles/htaccess-snippets',
  '/articles/ohm2013-observe-hack-make',
  '/articles/open-hackerspaces-day-2014',
  '/articles/postfix-with-mysql-backend-and-tls',
  '/articles/teamspeak-3-server-on-debian-ubuntu',
  '/articles/use-gitolite-to-control-access-to-a-git-server',
  '/articles/what-it-really-means-to-hack',
  '/articles/www-non-www-redirection',
  '/assets/css/style.css',
  '/assets/css/syntax.css',
  '/assets/js/main.js',
  '/privacy',
  '/terms'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cacheVersion + 'static').then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
  return self.skipWaiting();
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          return cacheName.indexOf(cacheVersion) !== 0;
        }).map(function (cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open(cacheVersion + 'static').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function (response) {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(function () {
        return caches.match('/404')
      });
    })
  );
});
