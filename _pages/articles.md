---
layout: page
permalink: /articles
title: Articles
description: The personal site of Martin Groeneveld
---

{% for post in site.posts %}

  <h2 class="h4 font-weight-bold p-0 mb-2"><a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a></h2>
  <p class="text-muted mb-2 small">{{ post.date | date: "%Y-%m-%d" }} &bull; {{ post.author | default: site.author | xml_escape }} &bull; {{ post.tags | sort | join: ", " | prepend: "Tags: " }}</p>
  <p class="mb-5">{{ post.excerpt | strip_html | truncatewords: 75 }}</p>
{% endfor %}
