---
layout      : page
permalink   : /articles
description :
---

{% for post in site.posts %}
<div class="card my-3">
  <div class="card-body">
    <h6 class="card-subtitle text-muted my-1 small">{{ post.date | date: "%Y-%m-%d" }} &bull; DOCS, HELP</h6>
    <h5 class="card-title"><a href="{{ post.url | prepend: site.baseurl }}" class="card-link">{{ post.title }}</a></h5>
    <p class="card-text my-0">{{ post.excerpt | strip_html }}</p>
  </div>
</div>
{% endfor %}