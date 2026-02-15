---
title: Module Method Overview
sidebar_label: Overview
sidebar_position: 10
description: Module method overview.
---

In your module, you will be defining a class with extends the `InstanceBase` class provided by `@companion-module/base`.

There are a few core lifecycle methods that get called by Companion during the life of your module, and there are bunch of methods which you can call to expose functionality to Companion.

## Core lifecycle methods

### `constructor(internal)`

This class constructor is called during instantiation of the class. You should not do much here as Companion is not yet ready to interact with your module. You should only do some small setup tasks, such as creating objects/instances you need and initialising properties on the class.

Shortly after this `init()` will be called, when Companion is ready to interact with you.

### `init(config: TConfig, isFirstInit: boolean, secrets: TSecrets): Promise<void>`

This is called when Companion is ready to properly run your module.  
As parameters, is:

- `config` - the [configuration object](./user-configuration.md) as setup by the user
- `isFirstInit` - if this is the first time this instance of your module has been run, this will be true
- `secrets` - the [secrets object]('./secrets.md) as provided by the user

In this method you should store the `config` and `secrets` if needed, and perform any tasks to setup any connections, or other logic that your class should be running.

:::tip

Many modules simply call `await this.configUpdated(config, secrets)` as they need to perform the same steps during `configUpdated`

:::

:::danger

While you should setup any connections you need to make, you must not wait for them to connect here.  
If you wait for a connection to complete, you will often find that Companion will restart your module as this method 'timed out'. Until this method has completed, users will not be able to edit the [configuration](./user-configuration.md).

This is a common source of bugs, leaving users with unusable connections.

:::

### `configUpdated(config: TConfig, secrets: TSecrets): Promise<void>`

This is called whenever the user updates [the configuration](./user-configuration.md) of the module.

In this you should often destroy any existing connections, and restart them from the new configuration

### `destroy(): Promise<void>`

This is called as part of stopping your module.

In this you should gracefully terminate any connections, cleanup any timers and generally ensure nothing will be leaked.

This is the last method that is called for your module when it is no longer needed.

### `getConfigFields(): SomeCompanionConfigField[]`

This is called whenever the user goes to edit [the configuration ](./user-configuration.md)

## Methods to call

There are many more methods than are described here, as they are relevant to a certain area of module functionality, and are described properly on those pages.

This list describes some common utilities

### `log(level: LogLevel, message: string): void`

This will write a message to the Companion log from your module

### `updateStatus(status: InstanceStatus, message?: null | string): void`

This will update the status of your module on the Connections page.

Provide one of the defined [`status` values](https://bitfocus.github.io/companion-module-base/enums/InstanceStatus.html) and an optional message which will be shown when hovering over it.
