---
layout      : default
permalink   : /articles
description :
---

<div class="container-fluid">
  <div class="row">
    <div class="col">

      {% for post in site.posts %}
      <div class="card my-3">
        <div class="card-body">
          <h6 class="card-subtitle text-muted my-1 small">
            <ul class="list-inline">
              {{ post.date | date: "%Y-%m-%d" }} &bull;
              {% for tag in post.tags %}<li class="list-inline-item">{{ tag }}</li>{% endfor %}
            </ul>
          </h6>
          <h5 class="card-title"><a href="{{ post.url | prepend: site.baseurl }}" class="card-link">{{ post.title }}</a></h5>
          <p class="card-text my-0">{{ post.excerpt | strip_html | truncatewords: 75 }}</p>
        </div>
      </div>
      {% endfor %}

    </div>
  </div>
</div>
