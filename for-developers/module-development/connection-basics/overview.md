---
title: Module Method Overview
sidebar_label: Overview
sidebar_position: 10
description: Module method overview.
---

TODO: API 2.0

The module/Companion API is primarily defined by the generic class `InstanceBase<>`, which is provided by `@companion-module/base`. Your module's code will extend that class to fill out the missing base class's methods as describe here, and you will call many of the ones provided to expose functionality into Companion.

The API can be divided into (1) exposing your module class (2) methods that get called by Companion during the life of your module (3) other methods are called by you to tell Companion how to interact with the end-users and (4) various helper classes and functions that are not part of `InstanceBase<>`.

## Exposing your module class

The main component of this is to export your class, so that Companion can import and execute it. This should be done at the top-level of _src/main.ts_ (if you're using the [recommended file structure](../module-setup/file-structure.md)).

In ESM this typically this like:

```ts
export default class MyModule extends InstanceBase {
  ...
}

export const UpgradeScripts = [...] // If you have any upgrade scripts
```

Or for commonjs:

```ts
module.exports = class MyModule extends InstanceBase {
  ...
}

module.exports.UpgradeScripts = [...] // If you have any upgrade scripts
```

:::tip
In API 1.x, this was achieved by a call to `runEntrypoint(ModuleInstance, UpgradeScripts)`. This is no longer supported and will need to be updated
:::

## Define the module class

### Typescript Generics

If you are not using Typescript, you can skip this section

:::tip
This has changed in [API 2.0](../api-changes/v2.0.md), before this it was a simpler `TConfig` that was generic for just your module config.
:::

The first step in creating a module is creating the module Instance class. If you are using the recommended [TypeScript module template](https://github.com/bitfocus/companion-module-template-ts), then the module definition is in _src/main.ts_.

The class has a type parameter which describes many things about your module. If no type is specified, the default is:

```ts
export interface InstanceTypes {
  config: JsonObject
  secrets: JsonObject | undefined
  actions: Record<string, CompanionActionSchema<CompanionOptionValues>>
  feedbacks: Record<string, CompanionFeedbackSchema<CompanionOptionValues>>
  variables: CompanionVariableValues
}
```

You can override each of these with concrete types, so that Typescript can offer narrower types throughout your module.

Each page explains the structure and usage of each portion in more detail

## Methods called from Companion

### `constructor(internal)`

This class constructor is called during instantiation of the class. You should not do much here as Companion is not yet ready to interact with your module. You should only do some small setup tasks, such as creating objects/instances you need and initialising properties on the class.

Shortly after this `init()` will be called, when Companion is ready to interact with you.

### `init(config: TConfig, isFirstInit: boolean, secrets: TSecrets): Promise<void>`

This is called when Companion is ready to properly run your module.

The parameters are:

- `config` - the [user-configuration object](./user-configuration.md) as provided by the user
- `isFirstInit` - if this is the first time this instance of your module has been run, this will be true
- `secrets` - [the secrets object](./user-configuration.md) as provided by the user

In this method you should store the `config` and `secrets` if needed, and perform any tasks to setup any connections, or other logic that your class should be running. If you are connecting over an Ethernet connection, consider setting up the connection using [TCPHelper, TelnetHelper, or UDPHelper](./connecting.md) from `@companion-module/base`. In the callbacks for these classes, you can set the connection status by calling `updateStatus`. See the [Connecting to the device](./connecting.md) page for more details.

:::tip

Many modules simply call `await this.configUpdated(config, secrets)` as they need to perform the same steps during `configUpdated`

:::

:::danger

While you should setup any connections you need to make, you must not wait for the connection to complete here. Otherwise, Companion may restart your module if it thinks that this method 'timed out'.

Also, until this method has completed, users will not be able to edit the [user-configuration](./user-configuration.md).

Waiting in `init()` is a common source of bugs, leaving users with unusable connections.

:::

### `configUpdated(config: TConfig, secrets: TSecrets): Promise<void>`

This is called whenever the user updates [the user-configuration](./user-configuration.md) of the module.

In this you should often destroy any existing connections, and restart them from the new user-configuration

### `destroy(): Promise<void>`

This is called as part of stopping your module.

In this you should gracefully terminate any connections, cleanup any timers and generally ensure nothing will be leaked.

This is the last method that is called for your module when it is no longer needed.

### `getConfigFields(): SomeCompanionConfigField[]`

This is called whenever the user goes to edit [the user-configuration](./user-configuration.md).

The return object of this method is an array of input-field definitions for both the `TConfig` object and the
`TSecrets` object . Input-fields of the type 'secret-text' are automatically
assigned to the `TSecrets` object; the rest will go into the `TConfig` object.

:::tip

Not every field of your config/secrets object needs to be associated with an input-field. For example,
if you want to store some internal state that persists between sessions, it can be added to the config
object and saved with a call to `saveConfig`.

:::

## Methods you call directly

There are many more methods than are described here, as they are relevant to a certain area of module functionality, and are described properly on those pages.

This list describes some common utilities

### `log(level: LogLevel, message: string): void`

This will write a message to the Companion log from your module

### `updateStatus(status: InstanceStatus, message?: null | string): void`

Call this to update the connected-status of your module. (Updates the status of your module shown on the Connections page.)

Provide one of the defined [`status` values](https://bitfocus.github.io/companion-module-base/enums/InstanceStatus.html) and an optional message which will be shown when hovering over it.

### Action/Feedback/Variable/Preset definitions

See the corresponding pages, linked below, for the appropriate API calls.

## Further Reading

- [Autogenerated docs for the module `InstanceBase` class](https://bitfocus.github.io/companion-module-base/classes/InstanceBase.html)
- [User-configuration management](./user-configuration.md)
- [Actions](./actions.md)
- [Feedbacks](./feedbacks.md)
- [Variables](./variables.md)
- [Presets](./presets.md)
