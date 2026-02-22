---
title: Module Feedback Definitions
sidebar_label: Feedback Definitions
sidebar_position: 17
description: Module feedback definition details.
---

Feedbacks allow Companion to reflect device state, using that state for button styles, setting variables, or triggering other behaviour.

This section explains how to define feedbacks, provide options to the user, and implement the behaviour of the feedback.

## API call: `setFeedbackDefinitions()`

Your module defines the list of feedbacks it supports by making a call to [`this.setFeedbackDefinitions({ ...some feedbacks here... })`](https://bitfocus.github.io/companion-module-base/classes/InstanceBase.html#setfeedbackdefinitions). You will need to do this as part of your `init()` method, but can also call it at any other time if you wish to update the list of feedbacks exposed.

:::warning
Please try not to call this method too often, as updating the list has a cost. If you are calling it multiple times in a short span of time, consider if it would be possible to batch the calls so it is only done once.
:::

## API calls: `checkFeedbacks(...)`, `checkAllFeedbacks()` & `checkFeedbacksById(...)`

:::note
Starting with [API 2.0](../api-changes/v2.0.md), it is no longer possible to call `checkFeedbacks()` without any arguments. When you need to call this, you should instead use `checkAllFeedbacks()`
:::

You should tell Companion to re-run the callback of your feedbacks whenever the result is expected to change by calling `this.checkFeedbacks('your-feedback-id', 'another-feedback')`.

:::tip
For modules with many options on feedbacks, you may want to make use of the [subscription flow](#subscribe--unsubscribe-flow) and `this.checkFeedbacksById('abc', 'def')`, to trigger smaller and more controlled invalidations.
:::

## Feedback types

Companion currently supports three types of [Feedback definitions](https://bitfocus.github.io/companion-module-base/interfaces/CompanionFeedbackDefinitionBase.html):

### Boolean feedbacks

This is the recommended feedback type, in which the callback returns a simple `true` or `false` value.

Inside Companion, users can use these in triggers, as part of feedback logic and to apply style changes of their choice to buttons.

### Value feedbacks

This is a newer addition since [API 1.13](../api-changes/v1.13.md) (Companion 4.1).

The user can use this feedback to store a value into a local variable. This allows you to define subscription style lazy loading of values that the user wants to use.

These can return any JSON object, array, or primitive value.

### Advanced feedbacks

These are no longer recommended in most cases.

This type of feedback returns a portion of button style properties that override the user defined style of the button.

Commonly, you will have some options on the feedback to let the user choose the background and text colour values to return when true. However this is often too rigid and does not give the user the customisation abilities they desire.

They can also be used to return image pixel buffers, to show some custom content, although this is no longer recommended

:::tip
In older versions of Companion, these were the only available type of feedback. We recommend that older modules should [update their feedbacks to boolean feedbacks](../connection-advanced/migrating-legacy-to-boolean-feedbacks.md) whenever possible.
:::

## Feedback definitions

The [TypeScript module template](https://github.com/bitfocus/companion-module-template-ts) includes a file `src/feedbacks.ts` which is where your feedbacks should be defined. It is not required to use this structure, but it keeps it more readable than having everything in one file. More complex modules will likely want to split the feedback definitions into even more files/folders.

All the feedbacks are passed in a single JavaScript object, like

```js
{
  'feedbacks1' : { properties of feedback 1 },
  'feedbacks2' : { properties of feedback 2 },
  'feedbacks3' : { properties of feedback 3 },
}
```

The minimum boolean feedback definition is as follows:

```js
{
  type: 'boolean',
  name: 'My first feedback',
  defaultStyle: {
    // The default style change for a boolean feedback
    // The user will be able to customise these values as well as the fields that will be changed
    bgcolor: 0xff0000, // or combineRgb(255, 0, 0)
    color: 0x000000, // or combineRgb(0, 0, 0)
  },
  // options is how the user can choose the condition the feedback activates for
  options: [{
    type: 'number',
    label: 'Source',
    id: 'source',
    default: 1,
  }],
  callback: (feedback) => {
    // This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
    return self.some_device_state.source == feedback.options.source
  },
}
```

### Feedback execution (callback)

The callback function is called when the feedback is executed, either shortly after the module calls `this.checkFeedbacks()`, or after the feedback options are changed.

It is called with 2 parameters:

- `feedback` - an object containing the options the feedback is executed with, along with some extra identifiers that can be useful
- `context` - since API 1.1. This contains some useful methods tied to the execution of the feedback

It is safe for your callback to throw an error, Companion will catch and log the error for you and treat the feedback result as falsey.

The expected values you can return from this depend on the [type of the feedback](#feedback-types).

#### Synchronous and asynchronous execution

Starting with API v1.1, feedback callbacks can be async or return a promise if you need.

You should not be performing any network requests here, but it can be necessary when generating images or using other native code.

:::tip
You must make sure to use a sensible timeout on any async execution, or your feedback can get stuck showing a stale value.
:::

#### Using variables

Since API v1.1, it has been possible to use variables in feedback callbacks. This makes your feedbacks much more powerful as it lets the user build more complex interactions and systems.

:::note
As of [API v1.13](../api-changes/v1.13.md) (Companion 4.1), variables in textinput fields are now automatically parsed.

As of [API v2.0](../api-changes/v2.0.md) (Companion 4.3), modules are unable to parse variables themselves, Companion does it for you based on the fields describing of the options.
:::

Between API v1.1 and API v1.14, a `context` object is passed as the second argument in the `callback`, `subscribe`, `unsubscribe` and `learn` callbacks.

The `context` object in these versions includes a special version of the `parseVariablesInString()` method that allows Companion to track which variables are referenced by each feedback, so that they can be re-executed whenever the parsed variables changed.

```js
{
  type: 'boolean',
  name: 'My first feedback',
  defaultStyle: {
    bgcolor: combineRgb(255, 0, 0),
    color: combineRgb(0, 0, 0),
  },
  options: [{
    type: 'text',
    label: 'text',
    id: 'text',
    default: '',
    useVariables: true
  }],
  callback: async (feedback, context) => {
    // Note: make sure to use `parseVariablesInString` from `context`. That lets Companion know what feedback the call was for
    const text = await context.parseVariablesInString(feedback.options.text)
    return text === 'OK'
  },
}
```

#### Inverting boolean feedbacks

Since [API v1.5](../api-changes/v1.5.md) (Companion 3.1), Companion provides built-in support for 'inverting' the value of boolean feedbacks. This is done automatically for any boolean feedbacks your module exposes.

If you wish to influence the auto-detection behaviour, you can do so by setting `showInvert: false` on a feedback. If this is an existing feedback, make sure to update any existing usages in an [upgrade scripts](./upgrade-scripts.md), to preserve existing behaviour for users.

If your feedback already provides a field to match a true or false state, we strongly advise removing it and replacing existing usage with the built-in invert property.  
A helper function (`CreateUseBuiltinInvertForFeedbacksUpgradeScript`) is provided to generate an upgrade script for your module to convert an existing invert checkbox to the built-in system. It expects a parameter describe the feedbacks to process, and the name of the invert checkbox being replaced:

```js
CreateUseBuiltinInvertForFeedbacksUpgradeScript({
  myfeedback: 'invert',
  another: 'inverted',
})
```

### Additional properties

There are more properties available, which are described in full in [the autogenerated Feedbacks documentation on GitHub](https://bitfocus.github.io/companion-module-base/interfaces/CompanionFeedbackDefinition.html)

The `options` property of the feedback definition is an array of input types, see the [input fields](./input-field-types.md) page for more details.

For boolean feedbacks a `defaultStyle` should be defined. This will give the feedback some default style overrides when the user adds the feedback to a button

### UI Presentation

The Companion UI will sort your feedbacks by name when presenting them in a list. You can add a longer description line of text with the `description` property.

Since [API 2.0](../api-changes/v2.0.md), you can customise the sort order of the feedbacks by setting the `sortName` property on a feedback definition. When this is set, it will be used instead of the `name` when sorting the feedback definitions alphabetically.

### Subscribe & unsubscribe flow

Sometimes you will want to only load state from the device when it is needed by a feedback. This is common for devices which have thousands of properties, or if loading and maintaining a bit of data has a cost, such as requiring polling to fetch.

This flow changed in [API 2.0](../api-changes/v2.0.md), any existing feedbacks will need migrating to the new flow.

#### Since API 2.0

On the feedback definition, it is possible to register an additional callbacks to be informed about the feedbacks.

```js
const feedbacks = {}
feedbacks['check_source'] = {
    name: 'Test feedback',
    options: [{
        type: 'number',
        label: 'Source',
        id: 'source',
        default: 1,
    }],
    callback: (feedback) => {
        ...
    },
    unsubscribe: (feedback) => {
        ...
    },
}
```

Whenever a feedback is added to a button, the callback will be called.
Whenever a feedback is removed from a button, unsubscribe will be called.
Whenever the options of an feedback on a button is changed, only the callback will be called

With this, if you need to do any data loading, you should dispatch but not await this inside the callback, and trigger a reevaluation of the feedback (using either `this.checkFeedbacks()` or `this.checkFeedbacksById()`).

:::tip
To help you decide if you need to perform any data loading, in each call to the `callback` you can now access the options provided to the previous call with `feedback.previousOptions`.
With this you can check whether the options affecting the data loading have changed, and skip the loading process when it is not needed.
:::

It is also possible to force the callbacks for all your feedbacks to be re-executed, by calling `this.checkFeedbacks()` or `this.unsubscribeFeedbacks()`. Both functions accept `feedbackIds` parameters, to only run on a certain feedback type (eg `this.unsubscribeFeedbacks('set_source', 'set_source2')`).
It is common to call `this.checkFeedbacks()` once the connection to the device has been established, to help ensure all the required data gets loaded.

Often, you will want to track the specific id of feedbacks which are relying on specific data subscriptions from your device, which can then be used with `this.checkFeedbacksById()` to allow rechecking a very targeted group of feedbacks

#### In API 1.15 and earlier

On the feedback definition, it is possible to register some additional callbacks to be informed about the feedbacks.

```js
const feedbacks = {}
feedbacks['check_source'] = {
    name: 'Test feedback',
    options: [{
        type: 'number',
        label: 'Source',
        id: 'source',
        default: 1,
    }],
    callback: (feedback) => {
        ...
    },
    subscribe: (feedback) => {
        ...
    },
    unsubscribe: (feedback) => {
        ...
    },
}
```

Whenever a feedback is added to a button, subscribe will be called.
Whenever a feedback is removed from a button, unsubscribe will be called.
Whenever the options of an feedback on a button is changed, unsubscribe will be called, followed by subscribe, then the callback.

If the referenced variables change, the callback will be called without any calls to unsubscribe or subscribe.

:::warning
There was a behaviour change in [API 1.13](../api-changes/v1.13.md). With all variables now being parsed by Companion when building the `options`, it no longer made sense to call unsubscribe and subscribe on every options change, so they will only be called when adding or removing the feedback
:::

It is also possible to force either unsubscribe or subscribe to be called for every feedback, by calling `this.subscribeFeedbacks()` or `this.unsubscribeFeedbacks()`. Both functions accept `feedbackIds` parameters, to only run on a certain feedback type (eg `this.unsubscribeFeedbacks('set_source', 'set_source2')`).
When using these callbacks, it is common to call `this.subscribeFeedbacks()` once the connection to the device has been established, to help ensure all the required data gets loaded.

### Learn option values

Some feedbacks have many options that users may wish to configure on the device and 'capture' into a feedback in Companion.
Implementing the [learn option values](../connection-advanced/learn-action-feedback-values.md) flow will allow them to achieve that

## TypeScript typings

:::tip
This was introduced in [API v2.0](../api-changes/v2.0.md), prior to this any strong typings had to be managed yourself
:::

As part of the `InstanceTypes` generic argument passed to `InstanceBase`, an `feedbacks` property must be defined.
By default this is `Record<string, CompanionFeedbackSchema<CompanionOptionValues>>` which means it is loosely typed.

To enable strong typings, you can define a type such as:

```ts
export type FeedbacksSchema = {
  route: {
    type: 'boolean'
    options: {
      source: number
      destination: number
    }
  }
}

export interface MyTypes {
  feedbacks: FeedbacksSchema
}
```

This will tell the InstanceBase that there should be one type of feedback which is called `route` with an options object as described.

```ts
const act: CompanionFeedbackDefinition<FeedbacksSchema['route']['options']> = {
  name: 'My First Feedback',
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
- [Migrating Legacy Feedbacks to Boolean Feedback](../connection-advanced/migrating-legacy-to-boolean-feedbacks.md)
- [Upgrade scripts](./upgrade-scripts.md)
- [Autogenerated docs for the module `InstanceBase` class](https://bitfocus.github.io/companion-module-base/classes/InstanceBase.html)
- [Autogenerated docs for the module feedback types/definitions](https://bitfocus.github.io/companion-module-base/types/CompanionFeedbackDefinition.html)
