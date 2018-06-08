# groveld.github.io [![Build Status](https://travis-ci.org/groveld/groveld.github.io.svg?branch=build)](https://travis-ci.org/groveld/groveld.github.io)

This is the personal website of Martin Groeneveld.

## Getting Started

ImageMagick-7.0.7-38-Q16-x64-dll.exe with 'install legacy (or older) utilities' checked.
You need Ruby+Devkit 2.5.X for this to work on Windows.

```shell
git clone https://github.com/groveld/groveld.github.io.git
cd groveld.github.io
gem install bundler && bundle install # Ensures you have all RubyGems needed
jekyll serve # Build site and run a local server
```

The **front-matter** of a post should look like this;

```txt
---
layout      : post
author      : "John Doe"
title       : "Some Title Here"
description : "A very descriptive description here"
tags        : [some, tags, here]
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

- src/_pages
- src/_posts
- src/static/images

All other directories and files are ISC Licensed. Feel free to use the HTML and CSS as you please. If you do use them, a link back to https://github.com/groveld/groveld.github.io/ would be appreciated.
