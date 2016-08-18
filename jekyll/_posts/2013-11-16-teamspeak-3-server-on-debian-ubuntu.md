---
layout      : post
title       : TeamSpeak 3 server on Debian/Ubuntu
description :
update      :
---

It has been a long time since my last post – I’m sorry for that but I didn’t have the time. Anyway I just installed TeamSpeak 3 on a Ubuntu 10.04 for a friend and want to share that info. Getting TeamSpeak running is mostly not the problem but you don’t want to start it after every boot by hand or run it as root. This Howto shows what I did. I assume that all user actions shown in this howto are performed as root or after executing sudo bash.

First you need to create a user under which the TeamSpeak server should run by executing following command:

```shell
adduser --disabled-login teamspeak
```

Now we need to get the software (64bit in my case)
*(Take a look if a new version is out when you install your server)*

``` shell
wget http://ftp.4players.de/pub/hosted/ts3/releases/beta-22/teamspeak3-server_linux-amd64-3.0.0-beta22.tar.gz
```

and extract it

``` shell
tar xzf teamspeak3-server_linux-amd64-3.0.0-beta22.tar.gz
```

We move it to a nice place with

``` shell
mv teamspeak3-server_linux-amd64 /opt/ts3
```

and give it to the user teamspeak

``` shell
chown -R teamspeak /opt/ts3
```

If you take a look into the /opt/ts3 directory you’ll see that there is a already a start/stop script (ts3server_startscript.sh), we will utilize it. Create a init.d file with pasting the content after executing `cat > /etc/init.d/teamspeak` :

``` shell
#! /bin/sh
### BEGIN INIT INFO
# Provides:          teamspeak
# Required-Start:    networking
# Required-Stop:
# Default-Start:     2 3 4 5
# Default-Stop:      S 0 1 6
# Short-Description: TeamSpeak Server Daemon
# Description:       Starts/Stops/Restarts the TeamSpeak Server Daemon
### END INIT INFO

set -e

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
DESC="TeamSpeak Server"
NAME=teamspeak
USER=teamspeak
DIR=/opt/ts3
DAEMON=$DIR/ts3server_startscript.sh
#PIDFILE=/var/run/$NAME.pid
SCRIPTNAME=/etc/init.d/$NAME

# Gracefully exit if the package has been removed.
test -x $DAEMON || exit 0

cd $DIR
sudo -u teamspeak ./ts3server_startscript.sh $1
```

Now press ENTER and CTRL-D and you’ve inserted the content into the file. Set the permission correctly with

``` shell
chmod 755 /etc/init.d/teamspeak
```

and now you can try it out by calling

``` shell
/etc/init.d/teamspeak start
```

Take note of the login and token as you will need them later. You can also look for them in the log files in /opt/ts3/logs/. The last thing you need to do now is to make sure the init script is executed at boot time by using following command:

``` shell
update-rc.d teamspeak defaults
```

At last if you’ve a firewall running on your system you need to make sure that you open all your ports. To find out which ports are used by teamspeak use following command:

``` shell
# netstat -lnp | grep ts3
tcp        0      0 0.0.0.0:10011           0.0.0.0:*               LISTEN      30232/ts3server_lin
tcp        0      0 0.0.0.0:30033           0.0.0.0:*               LISTEN      30232/ts3server_lin
udp        0      0 0.0.0.0:9987            0.0.0.0:*                           30232/ts3server_lin
```

I hope this howto helped someone and write a comment if you found an error or a better way to do something. Now you just need to point your TeamSpeak client to the server and go to the menu entry “permissions -> use token” and copy and past the token from above into the edit box. (only insert the chars behind “token=”)
