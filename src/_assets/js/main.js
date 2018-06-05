//= require bootstrap

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    // ServiceWorker registration successful
  }).catch(function(err) {
    console.log('ServiceWorker registration failed:', err);
  });
}

// Enable A2HS prompt
window.addEventListener('beforeinstallprompt', function(event) {
  event.prompt();
});

$(document).ready(function() {

  $('#show-comments').click(function() {
    var disqus_shortname = 'groveld';
    // ajax request to load the disqus javascript
    $.ajax({
      type: "GET",
      url: "https://" + disqus_shortname + ".disqus.com/embed.js",
      dataType: "script",
      cache: true
    });
    $('#comments').fadeIn(150);
    // hide the button once comments load
    $(this).fadeOut(150);
  });

  //Check to see if the window is top if not then display button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 300) {
      $('#scrollUp').fadeIn(150);
    } else {
      $('#scrollUp').fadeOut(150);
    }
  });

  //Click event to scroll to top
  $('#scrollUp').click(function() {
    $('html, body').animate({scrollTop: 0}, 250);
    return false;
  });

});
