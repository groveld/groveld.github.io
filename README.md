<p align="center">
  <a href="https://www.groveld.com/">
    <img alt="Logo" src="assets/img/logo.svg" width="100px"/>
  </a>
</p>

<h1 align="center">
  groveld.github.io
</h1>

<p align="center">
  <picture><img alt="Build" src="https://img.shields.io/github/actions/workflow/status/groveld/groveld.github.io/cloudflare-pages.yml?label=Build&style=flat-square"></picture>
</p>

## Getting Started

```shell
git clone https://github.com/groveld/groveld.github.io.git
cd groveld.github.io
gem install bundler && bundle install # Ensures you have all RubyGems needed
jekyll serve # Build site and run a local server
```

The _front-matter_ of a **post** should look like this;

```txt
---
layout      : post
updated     : "2018-05-27@12:23"
author      : "John Doe"
email       : "johndoe@example.email"
title       : "Some Title Here"
description : "A very descriptive description here"
tags        : [some, tags, here]
---
```

The _front-matter_ of a **page** should look like this;

```txt
---
layout      : page
permalink   : /page-url
title       : "Some Title Here"
description : "A very descriptive description here"
---
```

## Contributing

1. Fork it (`https://github.com/groveld/groveld.github.io.git`).
2. Create your feature branch (`git checkout -b my-new-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin my-new-feature`).
5. Create a new Pull Request.

## License

The following directories and their contents are Copyright Martin Groeneveld. You may not reuse anything therein without my permission:

- \_data
- \_drafts
- \_pages
- \_posts
- assets

All other directories and files are ISC Licensed. Feel free to use the HTML and CSS as you please. If you do use them, a link back to <https://github.com/groveld/groveld.github.io> would be appreciated.
