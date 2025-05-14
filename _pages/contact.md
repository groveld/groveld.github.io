---
layout: page
permalink: /contact
title: Contact
description: Contact
---

<div id="contact">
  <h2>Get in Touch</h2>
    <div class="container py-4">
      <form id="contact-form">
        <div class="mb-3">
          <label class="form-label" for="contact-form-name">Naam</label>
          <input
            class="form-control"
            id="contact-form-name"
            type="text"
            name="name"
            placeholder="Uw naam"
            required
            autofocus
          />
        </div>
        <div class="mb-3">
          <label class="form-label" for="contact-form-email">Email</label>
          <input
            class="form-control"
            id="contact-form-email"
            type="email"
            name="email"
            placeholder="Uw email adres"
            minlength="3"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label" for="contact-form-subject">Onderwerp</label>
          <input
            class="form-control"
            id="contact-form-subject"
            type="text"
            name="subject"
            placeholder="Het onderwerp van  uw bericht"
            minlength="5"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label" for="contact-form-message">Bericht</label>
          <textarea
            class="form-control"
            id="contact-form-message"
            name="message"
            placeholder="Typ hier uw bericht"
            rows="5"
            minlength="20"
            required
          ></textarea>
        </div>
        <div class="cf-turnstile" data-sitekey="0x4AAAAAAAYrFCIgVRhtP95q"></div>
        <div class="d-grid">
          <button class="btn btn-lg btn-primary" id="contact-form-submit" type="submit">Verstuur</button>
        </div>
      </form>
    </div>
</div>
