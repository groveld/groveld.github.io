---
layout: post
author: groveld
title: Give user permission to edit and add files in /var/www
description: A tutorial showing you how to give an Ubuntu user the right to edit and add files in the /var/www folders.
tags: [linux]
---

Tutorial showing you how to give an Ubuntu user the right to edit and add files in the `/var/www` folders.

Add the www-data group to an existing user

```shell
sudo usermod -a -G www-data username
```

OR if the user doesn’t exist: Create a new user and assign them the `www-data` group

```shell
sudo adduser username www-data
```

Make sure all files are owned by the www-data group and user (cleans up the ownership)

```shell
sudo chown -R www-data:www-data /var/www
```

Enable all members of the www-data group to read and write files

```shell
sudo chmod -R g+rw /var/www
```

**Note:** You are done. But if you want all future files created in this directory to keep the current setup do the following as well:

This is what I do to ensure that all files created keep the current user and permissions (it’s really lame to create new files, say from Git, and then have to update the user, groups and permissions of the new files every time to ensure they can be run by the server)

```shell
sudo chmod -R g+rws /var/www
```

**Final Note:** For security reasons it may be better to keep /var/www owned by root:root (depending on what you are doing)

If you want to keep `/var/www` owned by root replace step 2 with

```shell
sudo chgrp -R www-data /var/www/*
```
