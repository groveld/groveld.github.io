---
layout      : post
author      : groveld
title       : "Understanding Group Policy Processing"
description : "Understanding Group Policy Processing in Active Directory Domain Services"
tags        : [Active Directory, Group Policy]
---

**Group Policy Processing**: You can have local policies, site policies, domain policies, and OU policies within your domain structure. To learn how to best implement Group Policies to serve the organization, you need to understand the order in which the policies are applied.

Nonlocal [GPOs][1] are created in Active Directory and linked to container objects. Nonlocal [GPOs][1] can be linked to Active Directory sites, domains, or OUs. They cannot be linked to built-in containers, such as the default Users, Builtin, or Computer containers. These containers can receive policies only through domain or site-linked policies that flow down to all objects within them.

## Understating Group Policy Processing

Policies affect the containers to which they are linked in the following ways:

- Site-linked policies affect all domains within a site.
- Domain-linked policies affect all users and computers within a domain and within any containers within a domain. This includes objects in built-in containers, as well as objects within OUs and sub-OUs within the domain structure.
- OU-linked policies affect all objects within the OU and any other OU structure nested within them.

To begin, policies are processed in the following order, typically referred as **LSDOU**:

1. Local Policies
2. Site policies
3. Domain policies
4. OU policies

Following the order of processing from steps 1 to 4, the settings in the policies that are processed last, that is, those that are assigned to an OU in step 4, override any conflicting settings in the policies that were processed in the previous steps.

For example, suppose you have a policy setting that is applied to the site and affects all domains and their contents. If you have modified the same settings to produce a different result in an OU policy, the OU policy settings prevail. This behavior is intentional and provides administrators with flexibility in Group Policy application. In addition, as policies are applied, each container inherits the settings of the parent container policies by default.

Domains, sites, and OUs can have multiple group policies linked to them. Expanding on the previous example, you might have more than one policy linked to the Education department’s OU. In this situation, the top GPO in the list is processed last. When multiple [GPOs][1] are linked to a container, the first GPO in the list has the highest priority. In other words, by default, the list of linked [GPOs][1] is processed from the bottom to the top.

Policies can be applied to containers and the user and computer objects that reside in them. Computer configuration settings are processed when a computer starts, followed by **User Configuration settings**, which are processed during user login. Computer startup scripts and user logon scripts can run during startup. In addition, user logoff scripts and computer shutdown scripts can run during shutdown.

The following steps describe the process of implementing the settings of the assigned [GPOs][1] for a computer and user:

1. When a computer is initializing during startup, it establishes a secure link between the computer and a domain controller. Then, the computer objects a list of [GPOs][1] to be applied.
2. Computer configuration settings are applied synchronously during computer startup before the logon dialog box is presented to the user. Synchronous processing of policies means that each policy must be read and applied completely before the next policy can be invoked. The default synchronous behavior can be modified by the system administrator if necessary, although such modification is discouraged. No user interface is displayed during this process with the exception of a startup dialog box indication that policies are being applied. The policies are read and applied in the LSDOU sequence described earlier.
3. Any startup scripts set to run during computer startup are processed. These scripts also run synchronously and have a default timeout of 600 seconds to complete. This process is hidden from the user.
4. When the computer configuration scripts and startup scripts are complete, the user is prompted to press *Ctrl + Alt + Del* to log on.
5. Upon successful authentication, the user profile is loaded, based on the Group Policy settings in effect.
6. A list of [GPOs][1] specific for the user is obtained from the domain controller. User configuration settings also are processed in the LSDOU sequence. The GPO processing is again transparent to the user, and the policies are processed synchronously.
7. After the user policies run, any logon scripts run. These scripts, unlike the startup scripts, run asynchronously by default. Asynchronously processing allows multiple scripts to be processed at the same time, without waiting for the outcome of a previously launched script to occur. However, the user object script runs last.
8. The user’s desktop appears after all policies and scripts have been processed.

[1]: https://en.wikipedia.org/wiki/Group_Policy
