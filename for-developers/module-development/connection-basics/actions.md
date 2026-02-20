---
title: Module Action Definitions
sidebar_label: Action Definitions
sidebar_position: 16
description: Module action definition details.
---

Actions are the heart of many modules: they define what will happen when a user pushes a button or runs a trigger.

This section explains how to define actions, provide options to the user, and respond when the user invokes the action.

## API call: `setActionDefinitions()`

Your module defines the list of actions it supports by making a call to [`this.setActionDefinitions({ ...some actions here... })`](https://bitfocus.github.io/companion-module-base/classes/InstanceBase.html#setactiondefinitions). You will need to do this as part of your `init()` method, but can also call it at any other time if you wish to update the list of actions exposed.

:::warning
Please try not to call this method too often, as updating the list has a cost. If you are calling it multiple times in a short span of time, consider if it would be possible to batch the calls so it is only done once.
:::

## Action definitions

The [TypeScript module template](https://github.com/bitfocus/companion-module-template-ts) includes a file `src/actions.ts` which is where your actions should be defined. It is not required to use this structure, but it keeps it more readable than having everything in one file. More complex modules will likely want to split the actions definitions into even more files/folders.

All the actions are passed in as a single javascript object, in the form of:

```js
{
  'action1' : { properties of action 1 },
  'action2' : { properties of action 2 },
  'action3' : { properties of action 3 }
}
```

The minimum action definition looks like:

```js
{
    name: 'My first action',
    options: [],
    callback: (action) => {
        console.log('Hello World!')
    }
}
```

### Action execution (callback)

The callback function is called when the action is executed (i.e. associate button is pressed).

It is called with 2 parameters:

- `action` - an object containing the options the action was executed with, along with some extra identifiers that can be useful
- `context` - since API 1.1. This contains some useful methods tied to the execution of the action

It is safe for your callback to throw an error, Companion will catch and log the error for you.

#### Synchronous and asynchronous execution

Callback functions may either execute synchronously and return `undefined`, or asynchronously and return a promise that resolves `undefined` (including by directly returning in an `async` function).

Before Companion 3.5, when a series of actions was executed, each action's callback would be called in sequence, with no delay between actions (unless an action was defined with a relative or absolute delay) and no waiting for asynchronous callback functions' returned promises to resolve or reject. From Companion 3.5 onward, actions may be defined to run **in sequence** (by putting them in an action-group in the Admin interface) -- waiting for the promise returned by an asynchronous callback function to resolve before continuing. If you want your action to support delaying subsequent actions until completed, you must write your callback to not resolve the promise it returns until the action has completed. For example:

```js
const actions = [
  // This action will begin to make a http request and subsequent sequential actions
  // will execute before the request is finished.
  {
    name: 'Fetch Google',
    options: [],
    callback: (action) => {
      fetch('https://google.com/').then(
        () => {
          console.log('request complete')
        },
        () => {
          console.log('request failed')
        }
      )
    },
  },
  // This action will begin to make a request and subsequent sequential actions
  // won't execute until the request is finished.
  {
    name: 'Fetch Google and wait',
    options: [],
    callback: async (action) => {
      return fetch('https://google.com/').then(
        () => {
          console.log('request complete')
        },
        () => {
          console.log('request failed')
        }
      )
    },
  },
]
```

#### Using variables

:::note
As of [API v1.13](../api-changes/v1.13.md) (Companion 4.1), variables in textinput fields are now automatically parsed.

As of [API v2.0](../api-changes/v2.0.md) (Companion 4.3), modules are unable to parse variables themselves, Companion does it for you based on the fields describing of the options.
:::

Between API v1.1 and API v1.14, a `context` object is passed as the second argument in the `callback`, `subscribe`, `unsubscribe` and `learn` callbacks.

The `context` object in these versions includes a special version of the `parseVariablesInString()` method that allows Companion to know what control the parse was being run for. This allowed it to parse local variables. If you use `parseVariablesInString` off the `InstanceBase` class instead, any local variables would not be supported.

### Additional properties

There are more properties available, which are described in full in [the autogenerated Actions documentation on GitHub](https://bitfocus.github.io/companion-module-base/interfaces/CompanionActionDefinition.html)

The `options` property of the action definition is an array of input types, see the [input fields](./input-field-types.md) page for more details.

### UI Presentation

The Companion UI will sort your actions by name when presenting them in a list. You can add a longer description line of text with the `description` property.

Since [API 2.0](../api-changes/v2.0.md), you can customise the sort order of the actions by setting the `sortName` property on an action definition. When this is set, it will be used instead of the `name` when sorting the action definitions alphabetically.

### Subscribe & unsubscribe flow

Sometimes it is useful to know what actions and options are being used. This is common for devices which have thousands of properties, or if loading and maintaining a bit of data has a cost, such as requiring polling to fetch.

On the action definition, it is possible to register some additional callbacks to be informed about the actions.

```js
const actions = {}
actions['set_source'] = {
    name: 'Test action',
    options: [{
        type: 'number',
        label: 'Source',
        id: 'source',
        default: 1,
    }],
    callback: (action) => {
        ...
    },
    subscribe: (action) => {
        ...
    },
    unsubscribe: (action) => {
        ...
    },
}
```

Whenever an action is added to a button, subscribe will be called.
Whenever an action is removed from a button, unsubscribe will be called.
Whenever the options of an action on a button is changed, unsubscribe will be called, followed by subscribe, then the callback.

It is also possible to force either unsubscribe or subscribe to be called for every action, by calling `this.subscribeActions()` or `this.unsubscribeActions()`. Both functions accept `actionIds` parameters, to only run on a certain feedback type (eg `this.unsubscribeActions('set_source', 'set_source2')`).
When using these callbacks, it is common to call `this.subscribeActions()` once the connection to the device has been established, to help ensure all the required data gets loaded.

Since [API v1.13](../api-changes/v1.13.md), it is possible to specify `skipUnsubscribeOnOptionsChange` to avoid excessive unsubscribe calls when options are changed. And `optionsToIgnoreForSubscribe` can be used to limit which fields are able to trigger `subscribe` calls.

Since [API v2.0](../api-changes/v2.0.md), as Companion is responsible for all variable and expression parsing, `optionsToMonitorForSubscribe` should be used instead when wanting to limit which fields trigger `subscribe calls`.

### Learn option values

Some actions have many options that users may wish to configure on the device and 'capture' into an action in Companion.
Implementing the [learn option values](../connection-advanced/learn-action-feedback-values.md) flow will allow them to achieve that

### Result to Custom variable

:::danger
This is an experimental idea, that may be removed without notice
:::

Some action executions return a value which may want to be used elsewhere in Companion. This could be written [to a custom variable](../connection-advanced/setting-custom-variables.md)

## Typescript typings

:::tip
This was introduced in [API v2.0](../api-changes/v2.0.md), prior to this any strong typings had to be managed yourself
:::

As part of the `InstanceTypes` generic argument passed to `InstanceBase`, an `actions` property must be defined.
By default this is `Record<string, CompanionActionSchema<CompanionOptionValues>>` which means it is loosely typed.

To enable strong typings, you can define a type such as:

```ts
export type ActionsSchema = {
  route: {
    options: {
      source: number
      destination: number
    }
  }
}

export interface MyTypes {
  actions: ActionsSchema
}
```

This will tell the InstanceBase that there should be one type of action which is called `route` with an options object as described.

```ts
const act: CompanionActionDefinition<ActionsSchema['route']['options']> = {
  name: 'My First Action',
  options: [
    {
      id: 'source',
      type: 'number',
      label: 'Test',
      default: 5,
      min: 0,
      max: 100,
    },
    {
      id: 'destination',
      type: 'number',
      label: 'Test',
      default: 5,
      min: 0,
      max: 100,
    },
  ],
  callback: async (event) => {
    console.log('Hello world!', event.options.source, event.options.destination)
  },
}
```

:::tip
We can't enforce that the options array matches these types, you will have to do that yourself.
:::

These types will also propagate into [presets](./presets.md)

## Further Reading

- [Input-field Types (Options)](./input-field-types.md)
- [Upgrade scripts](./upgrade-scripts.md)
- [Autogenerated Actions documentation on GitHub](https://bitfocus.github.io/companion-module-base/interfaces/CompanionActionDefinition.html)
- [`context` argument documentation on GitHub](https://bitfocus.github.io/companion-module-base/interfaces/CompanionActionContext.html)
- [Autogenerated docs for the module `InstanceBase` class](https://bitfocus.github.io/companion-module-base/classes/InstanceBase.html)
