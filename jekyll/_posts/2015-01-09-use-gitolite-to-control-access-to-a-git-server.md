---
layout      : post
author      : groveld
email       : martin@groveld.com
title       : Use Gitolite to Control Access to a Git Server
description : How To Use Gitolite to Control Access to a Git Server on an Debian 7.0 VPS
tags        : [git, linux, debian, gitolite]
---

Git is a great distributed version control system that can be used to keep track of changes and code for any kind of project. Sometimes, it is helpful to configure a git server to house your team's projects.

**Gitolite** provides an access-control layer for a git server, so that you can configure user-based git access without the accompanying operating system user accounts. This provides your git contributors the privileges they need, without exposing your server to other kinds of interaction.

We will be installing these components on an Debian 7.0 VPS. This tutorial assumes that you have a regular user account on this VPS with sudo privileges.

## Install Git

Log into your Debian server with your regular user account.

We will be installing git from Debian's default repositories:

```shell
sudo apt-get install git-core
```

We now have git installed. We will want to configure a few things for git to operate properly.

## Install Gitolite

Now that we have git set up correctly, we can install gitolite to manage user access to our repositories.

Gitolite is also available in Debian's default repositories. Install it with this command:

```shell
sudo apt-get install gitolite
```

Gitolite manages its configuration through git! To set this up properly, we'll create a operating system user whose sole function is to interact with gitolite.

The operating system user will be called `git` to make it easy for our collaborators to remember. We will not set a password so that it is only accessible through using the `su` command.

```shell
sudo adduser --system --group --shell /bin/bash --disabled-password git
```

We now have a user called "git" that will handle gitolite configuration. We need to be able to access this user from a normal account. We will do this by configuring an SSH key associated with git administration.

## Configure SSH Keys for Git Administration

On your **local computer**, which you will be using to administer git and gitolite, you need to create an SSH key pair if you have not done so already.

***Note:*** *If you already have a key pair created, you should skip this command to avoid overwriting your SSH keys.*

```shell
ssh-keygen -t rsa
```

Accept the default location and press `ENTER` to configure key-based login without a password.

Copy the public key to the git server by typing:

```shell
scp ~/.ssh/id_rsa.pub regular_username@git_server_IP_address:/tmp/git-admin.pub
```

If you followed the Initial Server Setup article, you will need to allow SSH access to the git user. You can do that by editing `/etc/ssh/sshd_config` and adding git to the `AllowUsers` directive. Once you're done, restart the SSH server:

``` shell
sudo service ssh restart
```

## Configure Gitolite

The next steps will take place back on our git server. Log back in with your normal user.

We can log in with our "git" user to initialize gitolite with the public key we just transferred.

``` shell
sudo su - git
```

Now, we can set up gitolite with the following command:

``` shell
gl-setup /tmp/git-admin.pub
```

Hit `ENTER` to pull the configuration into your editor. Scan the contents to make sure the default configuration will meet your needs. You can always change it later.

When you are finished, save and exit out of the file.

## How To Administer Gitolite

Back on your **local** computer, you can begin administering gitolite.

If you do not already have git installed on this computer, you need to install it with:

``` shell
sudo apt-get install git-core
```

First, we need to clone the gitolite information from our git server to our local machine:

``` shell
git clone git@git_server_IP_address:gitolite-admin
```

This will create a new directory called `gitolite-admin` within your current directory. Here, we can make changes to our access policies and then push those changes to the git server.

## Add New Users to Gitolite

To add users to your projects, you will need their public keys. Gitolite works by associating the username that will be signing in with the public key with the same name. We will pretend we have a user called `john` for this demonstration.

On the local machine, we can change into the `gitolite-admin` directory and see what is inside:

``` shell
cd gitolite-admin
ls
```

``` shell
conf    keydir
```

Inside, there are two directories: `conf` and `keydir`. Unsurprisingly, `keydir` contains user keys.

You would communicate with "john" and acquire the public key that he plans on using. You would then copy that key into this directory like this:

``` shell
cp /path/to/johns/public/key.pub ~/gitolite-admin/keydir/john.pub
```

After that, you need to add the new public key to the git repository.

First, we want to configure the user name and email that will be associated with administrative git actions. Type these commands to configure this:

``` shell
git config --global user.name "your_name_here"
git config --global user.email "your_email@address.com"
```

You probably also want to configure git to use the editor of your choice. Type this command to specify your preferences:

``` shell
git config --global core.editor your_editor_choice
```

Now, we can add the new file to git:

``` shell
git add keydir/john.pub
```

Commit the changes with a message:

``` shell
git commit -a -m "New user John added"
```

Push the changes up to the git server to save the results:

``` shell
git push
```

## Configure Access with Gitolite

When you added the user in the last section, you may have noticed a warning like this:

``` shell
remote:
remote:         ***** WARNING *****
remote:         the following users (pubkey files in parens) do not appear in the config file:
remote: john(john.pub)
```

You will receive a message that the new user is not in the config file. This means that the user "john" is known to gitolite, but no access has been created for him.

We can easily add him to our configuration by editing the `~/gitolite-admin/conf/gitolite.conf` file.

We will go one step further though and give him his own repository. We will create a repository called `johns-project` and give him access:

``` shell
nano ~/gitolite-admin/conf/gitolite.conf
repo    gitolite-admin
RW+     =   git-admin

repo    testing
RW+     =   @all
```

As you can see, the syntax is pretty simple.

We specify a git repository with the `repo` keyword followed by its name. Under that, we write the privilege type, an equal sign (=), and the users who should get that access.

Groups can be defined with a line like this:

``` shell
@group_name = user1 user2 user3
```

After that, we can refer to a number of users like by referencing the group:

``` shell
repo    some_repo
RW+     = @group_name
```

A special group called `@all` references all users or all repositories, based on the context.

The permissions can be one of these values:

R: Read only access
RW: Can read or push new changes. Cannot delete refs that exist on the git server already.
RW+: Can push destructively, or delete refs on the server.
-: Has no access to the specified content.

We can give "john" full access to a new repository called `johns-project` by adding these lines to the end of the file:

``` shell
repo    johns-project
RW+     =       john
```

Save and close the file.

Now, we can commit this change with a new message:

``` shell
git commit -a -m "Made John's repo"
```

Finally, push the changes to the git server:

``` shell
git push
```

Now, "john" should be able to clone his project repository with the following command, from the computer where he created the public and private keys:

``` shell
git clone git@git_server_IP_address:johns-project
```

## Conclusion

You should now have gitolite configured correctly. You should be able to create git users easily without worrying about configuring accompanying operating system users and permissions every time.

If you are managing multiple projects with diverse teams, it is probably best to set up groups that correspond to projects. It might also be helpful to organize your `keydir` keys into subdirectories based on project. Gitolite will use them the same way, but they will be easier to find for administrative purposes.
