---
layout      : default
title       : Read about my adventures
description :
---

<section class="articles">
  <div class="container">
    {% for post in site.posts %}
    <a href="{{ post.url | prepend: site.baseurl }}">
      <div class="panel panel-default">
        <div class="panel-body">
          <h3>{{ post.title }}</h3>
          <p>{{ post.excerpt | strip_html }}</p>
        </div>
      </div>
    </a>
    {% endfor %}
  </div>
</section>
