To make it easier for users to configure your actions and feedbacks, you can implement the `learn` callback. This is intended to allow for the options of an action or feedback to be updated to match the current state of the device.

When this is implemented, a new button appears in the action or feedback allowing the user to trigger a learn event.

![Launcher window](../images/action-learn-button.png)

You can see the full api specification for [actions](https://bitfocus.github.io/companion-module-base/interfaces/CompanionActionDefinition.html#learn) and [feedbacks](https://bitfocus.github.io/companion-module-base/interfaces/CompanionBooleanFeedbackDefinition.html#learn).

Implementing this is the same for actions and feedbacks, but the parameters do vary a little accordingly.

For an action which has a single option called `input`, one implementation could look like:

```js
learn: (action) => {
    return {
        input: this.currentDeviceState.input,
    }
},
```

In the call, you get given the same action/feedback object as you would for other callbacks, so if one of the parameters is an identifier, that can be used to determine what the new values are:

```js
learn: (action) => {
    return {
        ...action.options,
        input: this.currentDeviceState.inputs[action.options.output],
    }
},
```

Make sure to include any other options in the result, as the returned value is used as the new options object. If any values are omitted, they will become undefined.

If for some reason you are not able to provide any new values, you can instead return `undefined` to tell Companion to abort this `learn` operation.

```js
learn: (action) => {
    const input = this.currentDeviceState.inputs[action.options.output]

    if (input === undefined) {
        // No value in the state
        return undefined
    }

    // Return the new options
    return {
        ...action.options,
        input: input,
    }
},

```
