---
layout: post
author: groveld
title: Clean URLs with Jekyll/Apache
description: Clean URLs with Jekyll/Apache
tags: [jekyll, apache]
---

Yesterday I decided to shorten and clear the URLs of my posts once and for all. By clean, I mean short and simple URLs without dates, categories or anything else in them, only the post slug. My definition of cleanness also includes **not** having a slash at the end of the URLs. For example, `groveld.com/about`.

To view options available when setting the permalink structure of posts in jekyll, you can take a look at the [documentation](https://jekyllrb.com/docs/permalinks/), but for our purpose, it's so simple and you might have already guessed it without looking at the docs: `permalink: /:title`

You have to put the above line in the `_config.yml` file in the root directory of your jekyll project.

If you have pagination, the permalink for the pagination could be as simple as `paginate_path: "page/:num"`

Now the tricky and more exciting part, which is telling apache to remove the trailing slashes! Here's how I did it, with this htaccess configuartion:

```
Options -Multiviews +FollowSymLinks
RewriteEngine On
RewriteBase /
DirectorySlash Off

# remove the trailing slash
RewriteRule ^(.*)\/(\?.*)?$ $1$2 [R=301,L]

# rewrite /dir/file to /dir/file/index.html
RewriteRule ^([\w\/-]+)(\?.*)?$ $1/index.html$2 [L,T=application/x-httpd-html]
```

<div class="alert alert-warning" role="alert"><strong>Disclaimer:</strong> By no means I'm an expert in writing .htaccess files! But, it's working as I expect it to do. Note that it also passes the queries (if there are any).</div>

We're done! but there's one more thing I'd like to mention:

In this approach, jekyll creates a directory for each post, which in my opinion is not very nice. The solution for that will be to tell jekyll to create all posts as html files in some directory, like `blog` and then have Apache load the actual file for each post from the `blog` folder. However, if you try this, you'll realize that jekyll always creates the paginations in folder structure (`/page/2/index.html`) and there's no easy way to make it create html files (`/page/2.html`), and therefore that'll messup our htaccess URL rewrite. Now, if you have a decent knowledge of [Regular expression](https://en.wikipedia.org/wiki/Regular_expression), then you're fine and you can separate blog posts from paginations, but that's not the case for me :p, so this is as far as I will go.
