---
layout: null
---

function isDarkMode() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

// if (isDarkMode()) {
//   document.documentElement.setAttribute('data-theme', 'dark');
// } else {
//   document.documentElement.setAttribute('data-theme', 'light');
// }

{% if site.serviceworker and jekyll.environment == 'production' %}
// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    // ServiceWorker registration successful
  }).catch(function(err) {
    // ServiceWorker registration failed
    console.log('ServiceWorker registration failed:', err);
  });
}
{% endif %}

/** CLOSE MAIN NAVIGATION WHEN CLICKING OUTSIDE THE MAIN NAVIGATION AREA**/
$(document).on('click', function (e){
    /* bootstrap collapse js adds "in" class to your collapsible element*/
    var menu_opened = $('#navbar').hasClass('show');
    if(!$(e.target).closest('#navbar').length &&
        !$(e.target).is('#navbar') && menu_opened === true){
            $('#navbar').collapse('toggle');
    }
});

// NOTE: Scroll performance is poor in Safari
// - this appears to be due to the events firing much more slowly in Safari.
//   Dropping the scroll event and using only a raf loop results in smoother
//   scrolling but continuous processing even when not scrolling
$(document).ready(function () {
  var progressBar = document.querySelector('#reading-progress');
  var lastScrollY = window.scrollY;
  var lastWindowHeight = window.innerHeight;
  var lastDocumentHeight = $(document).height();
  var ticking = false;

  function onScroll() {
    lastScrollY = window.scrollY;
    requestTick();
  }

  function onResize() {
    lastWindowHeight = window.innerHeight;
    lastDocumentHeight = $(document).height();
    requestTick();
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(update);
    }
    ticking = true;
  }

  function update() {
    var progressMax = lastDocumentHeight - lastWindowHeight;
    progressBar.setAttribute('max', progressMax);
    progressBar.setAttribute('value', lastScrollY);
    ticking = false;
  }

  window.addEventListener('scroll', onScroll, {passive: true});
  window.addEventListener('resize', onResize, false);
  update();
});
