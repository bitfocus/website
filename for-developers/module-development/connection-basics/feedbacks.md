---
title: Module Feedback Definitions
sidebar_label: Feedback Definitions
sidebar_position: 17
description: Module feedback definition details.
---

Feedbacks are the way of dynamically changing the style of buttons in companion.

This section explains how to provide the possible feedbacks and their options to the user.

## Control flow (API calls)

API calls: `setFeedbackDefinitions()` and `checkFeedbacks()`

Your module can define the list of feedbacks it supports by making a call to [`this.setFeedbackDefinitions({ ...some feedbacks here... })`](https://bitfocus.github.io/companion-module-base/classes/InstanceBase.html#setfeedbackdefinitions). You will need to do this as part of your `init()` method, but can also call it at any other time if you wish to update the list of feedbacks exposed.

Note: Please try not to do it too often, as updating the list has a cost. If you are calling it multiple times in a short span of time, consider if it would be possible to batch the calls so it is only done once.

You should tell Companion to call the callback for your feedback whenever the result is expected to change by calling `this.checkFeedbacks('your-feedback-id', 'another-feedback')`. You can do this even more granularly if making use of the [subscribe & unsubscribe flow](../connection-advanced/subscribe-unsubscribe-flow.md)

The [TypeScript module template](https://github.com/bitfocus/companion-module-template-ts) includes a file `src/feedbacks.ts` which is where your feedbacks should be defined. It is not required to use this structure, but it keeps it more readable than having everything in one file. More complex modules will likely want to split the actions definitions into even more files/folders.

## Feedback types

Companion supports three types of [Feedback definitions](https://bitfocus.github.io/companion-module-base/interfaces/CompanionFeedbackDefinitionBase.html):

- [**boolean**](https://bitfocus.github.io/companion-module-base/interfaces/CompanionFeedbackBooleanEvent.html): this is generally the preferred type, as it is the most flexible for end-users.
- [**advanced**](https://bitfocus.github.io/companion-module-base/interfaces/CompanionFeedbackAdvancedEvent.html): used for special cases, it provides a fixed response that is not user-configurable.
- [**value**](https://bitfocus.github.io/companion-module-base/interfaces/CompanionValueFeedbackDefinition.html): used to initialize local variables, it returns a JSON object, array or primitive instead of a simple boolean. (Introduced in Companion v4.1/Module-base v1.13.)

Writing boolean feedbacks should be preferred whenever possible. They give the user more control over how their buttons are styled, and allows for using the boolean values elsewhere, such as in triggers.

Advanced feedbacks can still be useful, to return dynamic values derived from the device state. For example, displaying a png.

Prior to Companion 2.2, it was only possible to write the `advanced` type of feedbacks, so many modules are still using those.

It is possible to [Migrate legacy to boolean feedbacks](../connection-advanced/migrating-legacy-to-boolean-feedbacks.md).

## Feedback definitions

All the feedbacks are passed in a single javascript object, like

```js
{
  'feedbacks1' : { properties of feedback 1 },
  'feedbacks2' : { properties of feedback 2 },
  'feedbacks3' : { properties of feedback 3 }
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
    bgcolor: combineRgb(255, 0, 0),
    color: combineRgb(0, 0, 0),
  },
  // options is how the user can choose the condition the feedback activates for
  options: [{
    type: 'number',
    label: 'Source'
    id: 'source',
    default: 1
  }],
  callback: (feedback) => {
    // This callback will be called whenever companion wants to check if this feedback is 'active' and should affect the button style
    if (self.some_device_state.source == feedback.options.source) {
      return true
    } else {
      return false
    }
  }
}
```

The function on callback is what gets executed when the feedback is invoked.
You can see a description of the `feedback` object passed into the callback by following the links in the documentation linked in the [previous section](#feedback-types). Make sure to not use any of the deprecated properties, they may be removed without warning!

As of `@companion-module/base#v1.1.0`, feedback callbacks can now be async or return a promise.

There are more properties available in feedback definitions, which are described in full in the documentationlinked in the [previous section](#feedback-types).

Importantly, the `options` property of the feedback definition is an array of input types, as defined [here](./input-field-types.md)

As of `@companion-module/base#v1.1.0` (Companion 3), there is now a second parameter to each of `callback`, `subscribe`, `unsubscribe` and `learn`. This contains some utility methods that you may need. The full definition of this type is [here](https://bitfocus.github.io/companion-module-base/types/CompanionFeedbackContext.html). See the section below on [Using variables](#using-variables) for more details.

#### Inverting boolean feedbacks

Since Companion 3.1 (API v?), Companion provides builtin support for 'inverting' feedbacks. This is done for boolean feedbacks without any changes needed in the modules. Since `@companion-module/base#v1.5.0` it is possible to disable this behaviour for each feedback, and to access these inversion values in [upgrade scripts](./upgrade-scripts.md).  
You can disable this behaviour by setting `showInvert: false` on a feedback. When changing this, you will need to update the definition and presets yourself, you must make sure to add an upgrade script too to avoid breaking existing configs.  
A helper function (`CreateUseBuiltinInvertForFeedbacksUpgradeScript`) is provided to generate an upgrade script for your module to convert an existing invert checkbox to the builtin system. It expects a parameter describe the feedbacks to process, and the name of the invert checkbox being replaced:

```
CreateUseBuiltinInvertForFeedbacksUpgradeScript({
  myfeedback: 'invert',
  another: 'inverted',
})
```

### Using variables

:::note

As of [`@companion-module/base#v1.13`](../api-changes/companion-4.1.md) (Companion 4.1), variables in textinput fields are now automatically parsed.

:::

As of `@companion-module/base#v1.1.0`, it is now possible to use `parseVariablesInString` in feedbacks.

This is achieved with the `parseVariablesInString` on the context parameter of the feedback callback. This method is provided so that Companion can track what variables your feedback used during the execution of the `callback`, which lets it be rechecked when those variables change. If you use `parseVariablesInString` off the `InstanceBase` class instead, your feedback will **not** be rechecked when variables change.

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
    label: 'text'
    id: 'text',
    default: '',
    useVariables: true
  }],
  callback: async (feedback, context) => {
    // Note: make sure to use `parseVariablesInString` from `context`. That lets Companion know what feedback the call was for
    const text = await context.parseVariablesInString(feedback.options.text)
    return text === 'OK'
  }
}
```

## Further Reading

- [Input-field Types (Options)](./input-field-types.md)
- [Migrating Legacy Feedbacks to Boolean Feedback](../connection-advanced/migrating-legacy-to-boolean-feedbacks.md)
- [Upgrade scripts](./upgrade-scripts.md)
- [Autogenerated docs for the module `InstanceBase` class](https://bitfocus.github.io/companion-module-base/classes/InstanceBase.html)
- [Autogenerated docs for the module feedback types/definitions](https://bitfocus.github.io/companion-module-base/types/CompanionFeedbackDefinition.html)
- [Autogenerated docs for the module feedback context](https://bitfocus.github.io/companion-module-base/types/CompanionFeedbackContext.html) _TODO the linked page doesn't say much?_

Feedbacks also support the following advanced features:

- [subscribe & unsubscribe flow](../connection-advanced/subscribe-unsubscribe-flow.md)
- [learn option values](../connection-advanced/learn-action-feedback-values.md)
- [result to custom variable](../connection-advanced/setting-custom-variables.md)
