---
---

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


var main, bar;

// declare vars once so that they are not redefined every scroll event
document.addEventListener("DOMContentLoaded", () => {
    main = document.querySelector("body"); // locate here your content element to count progress in
    bar = document.getElementById("reading-progress");
});

window.addEventListener("scroll", () => {
    let top = main.getBoundingClientRect().top + window.scrollY; // find where content element starts
    let bottom = top + main.offsetHeight; // find where content element ends

    // if the user has started scrolling inside the target element
    if (window.scrollY >= top) {
        let progress = (window.scrollY - top) / main.clientHeight; // count part of element we've scrolled

        // or, if the target element remains visible when document ends
        if (document.body.offsetHeight - bottom <= window.innerHeight)
            progress = (window.scrollY - top) / (document.body.offsetHeight - window.innerHeight);

        if (progress <= 1)
            bar.style.width = parseFloat(progress * 100).toFixed(2) + "%";
        else bar.style.width = "100%"; // to avoid progress bar being stuck a bit less than 100%
    } else bar.style.width = "0%"; // to avoid progress bar being stuck a bit more than 0%
});
