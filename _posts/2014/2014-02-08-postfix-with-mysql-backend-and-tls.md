---
layout: post
author: groveld
title: Postfix with MySQL backend and TLS
description: Install a ready to use Postfix mail server with MySQL backend for virtual users.
tags: [linux, mailserver, postfix, mysql]
---

In this tutorial we'll install a ready to use Postfix mail server with MySQL backend for virtual users. Notice that this tutorial only covers installing the SMTP server (not POP3 and IMAP). Click here for a tutorial on installing Courier POP3 and IMAP services.

Once installed and configured, you can easily create your own admin system to modifiy the domains and users because the table structure is very simple.

This tutorial has been tested on Debian etch and lenny

### Install the Postfix mail server, MySQL server and other required packages

```shell
apt-get install postfix postfix-mysql sasl2-bin libsasl2-modules mysql-client mysql-server libpam-mysql
```

In the configuration wizzard for Postfix select and input the following;

General type of mail configuration **->** `internet Site`

System mail name **->** `server.domain.com` _(your server hostname)_

### Create a MySQL database that will contain domains and mappings and create a user that has read privileges on it

Execute the following SQL queries to create the table structure:

```sql
CREATE TABLE domains (
domain varchar(63) NOT NULL,
PRIMARY KEY (domain)
) ENGINE=MyISAM;

CREATE TABLE forwardings (
email varchar(255) NOT NULL,
destination text NOT NULL,
PRIMARY KEY (email)
) ENGINE=MyISAM;

CREATE TABLE transport (
domain varchar(255) NOT NULL,
transport varchar(255) NOT NULL,
PRIMARY KEY (domain)
) ENGINE=MyISAM;

CREATE TABLE users (
email varchar(255) NOT NULL,
password varchar(255) NOT NULL,
quota int(10) unsigned NOT NULL default '102400',
PRIMARY KEY (email)
) ENGINE=MyISAM;
```

### Populate tables with some test data

```sql
INSERT INTO domains (domain) VALUES (mydomain.com);
INSERT INTO users (email, password) VALUES ('address@mydomain.com', ENCRYPT('mypassword'));
INESRT INTO forwardings (email, desination) VALUES ('myforward@mydomain.com', 'address@mydomain.com, otheraddress@mydomain.com');
INSERT INTO transport (domain, transport) VALUES ('transport.com', 'smtp:mail.transport.com');
```

If you want to create a user or forwarding for a domain, you must add it to the domains table. Using the transport table you can forward all mail received to another mail server, when using the transport table you don't have to add the domain to the domains table.

### Create MySQL mappings for Postfix. Replace {mysql\_\*} with your MySQL credentials

`nano /etc/postfix/mysql-virtual_domains.cf`

```conf
hosts = {mysql_host}
user = {mysql_username}
password = {mysql_password}
dbname = {mysql_database}
table = domains
select_field = 'virtual'
where_field = domain
```

`nano /etc/postfix/mysql-virtual_forwardings.cf`

```conf
hosts = {mysql_host}
user = {mysql_username}
password = {mysql_password}
dbname = {mysql_database}
table = forwardings
select_field = destination
where_field = email
```

`nano /etc/postfix/mysql-virtual_mailboxes.cf`

```conf
hosts = {mysql_host}
user = {mysql_username}
password = {mysql_password}
dbname = {mysql_database}
table = users
select_field = CONCAT(SUBSTRING_INDEX(email,'@',-1),'/',SUBSTRING_INDEX(email,'@',1),'/')
where_field = email
```

`nano /etc/postfix/mysql-virtual_email2email.cf`

```conf
hosts = {mysql_host}
user = {mysql_username}
password = {mysql_password}
dbname = {mysql_database}
table = users
select_field = email
where_field = email
```

`nano /etc/postfix/mysql-virtual_transports.cf`

```conf
hosts = {mysql_host}
user = {mysql_username}
password = {mysql_password}
dbname = {mysql_database}
table = transport
select_field = transport
where_field = domain
```

`nano /etc/postfix/mysql-virtual_mailbox_limit_maps.cf`

```conf
hosts = {mysql_host}
user = {mysql_username}
password = {mysql_password}
dbname = {mysql_database}
table = users
select_field = quota
where_field = email
```

### Set correct permissions on the newly created files and allow Postfix to read the files

```shell
chmod 640 /etc/postfix/mysql-virtual_*
chgrp postfix /etc/postfix/mysql-virtual_*
```

### Create a new user and group named vmail. All incoming mail will be stored in this users home directory

```shell
groupadd -g 5000 vmail
useradd -g vmail -u 5000 vmail -d /home/vmail -m
```

### Configure Postfix to use SASL for user authentication and TLS for encryption

```shell
postconf -e 'smtpd_sasl_auth_enable = yes'
postconf -e 'broken_sasl_auth_clients = yes'
postconf -e 'smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination'
postconf -e 'smtpd_use_tls = yes'
postconf -e 'smtpd_tls_cert_file = /etc/postfix/smtpd.cert'
postconf -e 'smtpd_tls_key_file = /etc/postfix/smtpd.key'
postconf -e 'smtpd_sasl_local_domain = $myhostname'
postconf -e 'smtpd_sasl_security_options = noanonymous'
```

### Configure Postfix to use the MySQL database to find virtual users, where to store mail and what to do for users over quota

```shell
postconf -e 'virtual_alias_domains ='
postconf -e 'virtual_alias_maps = proxy:mysql:/etc/postfix/mysql-virtual_forwardings.cf, mysql:/etc/postfix/mysql-virtual_email2email.cf'
postconf -e 'virtual_mailbox_domains = proxy:mysql:/etc/postfix/mysql-virtual_domains.cf'
postconf -e 'virtual_mailbox_maps = proxy:mysql:/etc/postfix/mysql-virtual_mailboxes.cf'
postconf -e 'virtual_mailbox_base = /home/vmail'
postconf -e 'virtual_uid_maps = static:5000'
postconf -e 'virtual_gid_maps = static:5000'
postconf -e 'transport_maps = proxy:mysql:/etc/postfix/mysql-virtual_transports.cf'
postconf -e 'virtual_create_maildirsize = yes'
postconf -e 'virtual_mailbox_extended = yes'
postconf -e 'virtual_mailbox_limit_maps = proxy:mysql:/etc/postfix/mysql-virtual_mailbox_limit_maps.cf'
postconf -e 'virtual_mailbox_limit_override = yes'
postconf -e 'virtual_maildir_limit_message = "The user you are trying to reach is over quota."'
postconf -e 'virtual_overquota_bounce = yes'
postconf -e 'proxy_read_maps = $local_recipient_maps $mydestination $virtual_alias_maps $virtual_alias_domains $virtual_mailbox_maps $virtual_mailbox_domains $relay_recipient_maps $relay_domains $canonical_maps $sender_canonical_maps $recipient_canonical_maps $relocated_maps $transport_maps $mynetworks $virtual_mailbox_limit_maps'
```

### Create a self signed certificate to encrypt connections

```shell
openssl req -new -outform PEM -out /etc/postfix/smtpd.cert -newkey rsa:2048 -nodes -keyout /etc/postfix/smtpd.key -keyform PEM -days 3650 -x509
chmod 640 /etc/postfix/smtpd.key
```

### Make Postfix listen on port 465 for secure smtp connections

`nano /etc/postfix/master.cf`

```conf
smtps inet n - - - - smtpd
-o smtpd_tls_wrappermode=yes
-o smtpd_sasl_auth_enable=yes
-o smtpd_client_restrictions=permit_sasl_authenticated,reject
```

### Force SASL to store the PID files in a location where Postfix can read them

```shell
mkdir -p /var/spool/postfix/var/run/saslauthd
```

Edit SASL config to enable the daemon and make it use the new PID file location (`nano /etc/default/saslauthd`)

```conf
START=yes
OPTIONS="-c -m /var/spool/postfix/var/run/saslauthd -r"
```

Edit the init file for SASL (`nano /etc/init.d/saslauthd`)

```conf
PIDFILE="/var/spool/postfix/var/run/${NAME}/saslauthd.pid"
```

### Insert MySQL credentials for PAM (nano /etc/pam.d/smtp)\*\*

```conf
auth required pam_mysql.so user={mysql_username} passwd={mysql_password} host={mysql_host} db={mysql_database} table=users usercolumn=email passwdcolumn=password crypt=1
account sufficient pam_mysql.so user={mysql_username} passwd={mysql_password} host={mysql_host} db={mysql_database} table=users usercolumn=email passwdcolumn=password crypt=1
```

### Config SASL for Postfix and specify MySQL credentials

`nano /etc/postfix/sasl/smtpd.conf`

```conf
pwcheck_method: saslauthd
mech_list: plain login
allow_plaintext: true
auxprop_plugin: mysql
sql_hostnames: {mysql_host}
sql_user: {mysql_username}
sql_passwd: {mysql_password}
sql_database: {mysql_database}
sql_select: select password from users where email = '%u'
```

### Add the Postfix user to the SASL group allowing Postfix to communicate with SASL

```shell
adduser postfix sasl
```

### Restart Postfix and SASL

```shell
/etc/init.d/postfix restart
/etc/init.d/saslauthd restart
```

You're all done. Now you can connect to ports 25 and 465 to sent mails to your virtual users specified in the MySQL database. When authenticating with your email client, use the full email address as the username.
