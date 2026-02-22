---
title: Runtime Permissions
sidebar_label: Runtime Permissions
sidebar_position: 10
description: Enable advanced runtime permissions for your module
---

Since [API 1.12](../api-changes/v1.12.md) modules are run with some restrictive permissions applied. The intention here is to limit some of the more dangerous abilities of the nodejs runtime, so that we can warn users about modules which require them.  
Think of it as similar to how your phone prompts you to accept a list of permissions when installing an app.

To enable any of these, start by adding to the `runtime` object in your manifest:

```js
"permissions": {

}
```

:::tip
These permissions are applied during development too. However, when [the debugger](../module-debugging.md#attach-a-debugger) is enabled, the permissions are disabled. Make sure to test the module without the debugger enabled before publishing
:::

## Worker threads

If your module needs to utilise worker threads, you will need to add:

```js
"permissions": {
  "worker-threads": true
}
```

## Child Processes

If your module needs to spawn child processes, you will need to add:

```js
"permissions": {
  "child-process": true
}
```

We recommend avoiding using child processes whenever possible, as these will be reported to the user as dangerous, as the spawned process will bypass all of the restrictions we apply to your module.

## Native addons

If your module needs to use any native addons, you will need to add:

```js
"permissions": {
  "native-addons": true
}
```

## Filesystem access

If you need read access to more of the filesystem, or write access to the filesystem, you can enable this:

```js
"permissions": {
  "filesystem": true
}
```

:::tip
In a future release of Companion, we intend to require the user to grant access to specific paths to each connection.
View this as a request for more access, it may or may not be granted by the user.
:::

## Insecure OpenSSL algorithms

In some rare cases, your module may need to talk to old devices which use now deprecated encryption algorithms.

```js
"permissions": {
  "insecure-algorithms": true
}
```

This currently translates to the process being run with the [`--openssl-legacy-provider` argument](https://nodejs.org/api/cli.html#--openssl-legacy-provider).
