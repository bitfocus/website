---
title: Module Variable Definitions
sidebar_label: Variables
sidebar_position: 19
description: Module variable definition details.
---

Modules are able to expose values to the user, which they can use as part of the button text, or as input to some actions.

This section explains how to define variables and change update their values.

Your module can define the list of variables it exposes by making a call to `this.setVariableDefinitions({ ...some variables here... })`. You will need to do this as part of your `init()` method, but can also call it at any other time if you wish to update the list of variables exposed.

:::warning
Please try not to call this method too often, as updating the list has a cost. If you are calling it multiple times in a short span of time, consider if it would be possible to batch the calls so it is only done once.
:::

The boilerplate has a file `variables.js` which is where your variables should be defined. It is not required to use this structure, but it keeps it more readable than having it all in one file.

All the variable definitions are passed in one javascript array, such as:

```js
;[
	{ variableId: 'variable1', name: 'My first variable' },
	{ variableId: 'variable2', name: 'My second variable' },
	{ variableId: 'variable3', name: 'Another variable' },
]
```

Note: variableId must only use letters [a-zA-Z], numbers, underscore, hyphen.

At any point in your module you can call `this.setVariableValues({ ... new values ... })`. You can specify as many or few variables as you wish in this call. Only the ones you specify will be updated.

This may look like:

```js
this.setVariableValues({
    'variable1': 'new value'
    'variable2': 99,
    'old_variable': undefined // This unsets a value
})
```

Note: Please try to batch variable updates whenever possible, as updating the values has a cost. If you are calling it multiple times in a short span of time, consider if it would be possible to batch the calls so it is only done once.
