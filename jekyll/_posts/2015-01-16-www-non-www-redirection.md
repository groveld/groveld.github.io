---
layout      : post
title       : Nginx config for www and non-www redirection
description :
update      :
---

There are many ways to force Nginx to use either WWW version or non-WWW version of URLs for your site.

## Redirect non-www to WWW

### Single domain
``` nginx
server {
  server_name example.com;
  return 301 $scheme://www.example.com$request_uri;
}
```

### All domains
``` nginx
server {
  server_name "~^(?!www\.).*" ;
  return 301 $scheme://www.$host$request_uri;
}
```

## From WWW to non-WWW

### Single domain
``` nginx
server {
  server_name www.example.com;
  return 301 $scheme://example.com$request_uri;
}
```

### All domains
``` nginx
server {
  server_name "~^www\.(.*)$" ;
  return 301 $scheme://$1$request_uri ;
}
```

In both cases, for other-www, we create a altogether different server { } block. IMHO, this is cleanest and optimised way to handle www to non-www and non-www to www redirection.

There are some WordPress plugins available there which can handle this at PHP-level. But for performance reason, always handle things in Nginx, that can be handled in Nginx alone!
