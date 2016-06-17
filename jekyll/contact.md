---
layout      : default
title       : We like hearing from you
description :
---

<section class="contact">
  <div class="container">
    <div class="row">
      <div class="col-md-4 col-md-push-8">
        <p>Want to get in touch with me? Fill out the form to send me a message and I will try to get back to you within 24 hours!</p>
        <div class="row">
          <div class="col-xs-6 text-left">
            <strong>Address</strong>
            <address>
              Griend 18<br>
              8604 AS Sneek<br>
              Netherlands
            </address>
          </div>
          <div class="col-xs-6 text-left">
            <strong>Contact</strong>
            <address>
              <a href="tel:{{ site.phone }}">{{ site.phone }}</a><br>
              <a href="mailto:{{ site.email }}">{{ site.email }}</a>
            </address>
          </div>
        </div>
        <ul class="list-inline">
          {% if site.github %}<li><a href="https://github.com/{{ site.github }}" class="btn btn-social-icon btn-github"><span class="fa fa-github"></span></a></li>{% endif %}
          {% if site.bitbucket %}<li><a href="https://bitbucket.org/{{ site.bitbucket }}/" class="btn btn-social-icon btn-bitbucket"><span class="fa fa-bitbucket"></span></a></li>{% endif %}
          {% if site.googleplus %}<li><a href="https://plus.google.com/{{ site.googleplus }}" class="btn btn-social-icon btn-google-plus"><span class="fa fa-google-plus"></span></a></li>{% endif %}
          {% if site.linkedin %}<li><a href="https://www.linkedin.com/in/{{ site.linkedin }}" class="btn btn-social-icon btn-linkedin"><span class="fa fa-linkedin"></span></a></li>{% endif %}
          {% if site.twitter %}<li><a href="https://twitter.com/{{ site.twitter }}" class="btn btn-social-icon btn-twitter"><span class="fa fa-twitter"></span></a></li>{% endif %}
          {% if site.facebook %}<li><a href="https://www.facebook.com/{{ site.facebook }}" class="btn btn-social-icon btn-facebook"><span class="fa fa-facebook"></span></a></li>{% endif %}
          {% if site.keybase %}<li><a href="https://keybase.io/{{ site.keybase }}" class="btn btn-social-icon btn-keybase"><span class="fa fa-key"></span></a></li>{% endif %}
        </ul>
      </div>
    	<div class="col-md-8 col-md-pull-4">
        <h3 class="hidden-md hidden-lg">Contact form</h3>
        <form id="contactForm">
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <input type="text" class="form-control" name="name" placeholder="Name" autocapitalize="words" autofocus>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <input type="tel" class="form-control" name="phone" placeholder="Phone Number" autocorrect="off" autocapitalize="off">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <input type="email" class="form-control" name="email" placeholder="Email Address" autocorrect="off" autocapitalize="off">
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <input type="text" class="form-control" name="subject" placeholder="Subject" autocapitalize="sentences">
              </div>
            </div>
          </div>
          <div class="form-group">
            <textarea class="form-control" name="message" rows="8" placeholder="Enter your massage for us here" autocapitalize="sentences"></textarea>
          </div>
          <div class="form-group">
            <div id="alertContainer" class="alert" style="display: none;"></div>
            <button type="submit" class="btn btn-success btn-lg btn-block" disabled="disabled">Send</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>
