---
title: Companion 4.0 (API 1.12)
sidebar_position: -40
description: Module permissions & isVisibleExpression
---

### Permissions

As of @companion-module/base v1.12, modules will be run with the nodejs permissions model enabled. This will allow us to inform users about the requirements of modules.

You can opt into additional permissions by defining the `permissions` object in your `manifest.json`

The permissions you can request are:

- 'worker-threads' - allows using nodejs worker_thread api
- 'child-process' - allows using nodejs child_process api
- 'native-addons' - allows using native (c/c++) addons
- 'filesystem' - allows read/write access to the filesystem.

:::danger

If possible it is advised to not use any of these permissions, as in the future it will show your module as needing extra permissions.

:::

:::tip

In the future we expect to make the filesystem permission more granular, with users being able to specify certain paths that your module is allowed to access.  
We would recommend planning for this in your module implementation.

:::

### isVisible as expressions

The `isVisible` functions that can be defined on option fields can now be written in the companion expression syntax through a new `isVisibleExpression` property.

:::tip

We advise all uses to be updated to the new syntax, the old syntax is now deprecated and support will be dropped in a future release.

:::

### Bonjour query port

Bonjour queries in the module manifest can now specify a filter based on port number.

### New utility methods

- parseEscapeCharacters
- substituteEscapeCharacters
