---
title: Logging
sidebar_label: Logging
sidebar_position: 11
description: Logging in your module
---

There are a few different ways to produce logs from your module. Which one to use depends on whether these logs should end up in front of users or are for debugging.

## InstanceBase methods

This is the most common method for producing logs in modules, as it has been supported since the beginning.

On your class, you can do one of the following to produce a log line:

```ts
this.log('error', 'Some error message')
this.log('warn', 'Some warning message')
this.log('info', 'Some info message')
this.log('debug', 'Some dbeug message')
```

## `console.log` and friends

If you want to produce some debug logging from your mode code, you can use the builtin `console` methods such as `console.log` and `console.error`.

These are treated as debug logs, and will only be shown inside of the module debug log view; accessible from the popout menu in the connections list.

## `createModuleLogger`

This is a new method of logging in the [API 2.0](../api-changes/v2.0.md). You can now produce a full range of log levels without passing around your class instance.

Loggers created this way work from anywhere in your module and route to the same destination as the instance methods.

These loggers can be created with an optional prefix, which appears in the log output and helps produce structured logs.

```ts
import { createModuleLogger } from '@companion-module/base'

const logger = createModuleLogger('SomePrefix')

logger.error('something happened!')
```

These logs will make their way into the Companion log, except for the `debug` level which will only be in the module debug log.
