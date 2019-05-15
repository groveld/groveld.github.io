---
layout      : page
permalink   : /
title       : Articles
description :
---

{% for post in site.posts %}
  <h2 class="p-0 mb-2"><a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a></h2>
  <p class="text-muted mb-2 small">{{ post.date | date: "%Y-%m-%d" }}</p>
  <p class="mb-5">{{ post.excerpt | strip_html | truncatewords: 75 }}</p>
{% endfor %}
