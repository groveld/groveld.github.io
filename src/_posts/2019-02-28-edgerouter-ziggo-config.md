---
layout      : post
author      : Martin Groeneveld
title       : "EdgeRouter 4 Setup Ziggo Dual WAN"
description : "EdgeRouter 4 Setup Ziggo Dual WAN"
tags        : [Ubiquiti, EdgeRouter, EdgeMAX, Ziggo, Setup]
comments    : true
---

```shell
configure

set system offload ipv4 forwarding enable
set system offload ipv4 gre enable
set system offload ipv4 pppoe enable
set system offload ipv4 vlan enable
set system offload ipv4 bonding enable

set system offload ipv6 forwarding enable
set system offload ipv6 pppoe enable
set system offload ipv6 vlan enable

set system offload ipsec enable

commit ; save
```
