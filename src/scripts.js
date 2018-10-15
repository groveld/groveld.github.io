---
---

{% if jekyll.environment == 'production' %}
// // Register Service Worker
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js').then(function(registration) {
//     // ServiceWorker registration successful
//   }).catch(function(err) {
//     console.log('ServiceWorker registration failed:', err);
//   });
// }
{% endif %}

var vhFix = new vhFix([
  {
    selector: '.hero',
    vh: 100
  }
]);
