---
title: Module Upgrade Scripts
sidebar_label: Upgrade Scripts
sidebar_position: 25
description: Module upgrade script details.
---

Over time you will add new functionality to your module. Sometimes, this can involve changing how existing actions or feedbacks are implemented.

When this happens, existing usages of the action or feedback may become broken. The job of the upgrade script is to fix up the actions and feedbacks that the user has already added to their site to handle the changes.

## Exposing upgrade scripts

The [TypeScript module template](https://github.com/bitfocus/companion-module-template-ts) includes a separate file:
`src/upgrades.ts`, which is where your upgrades should be defined. It is not required to use this structure, but it keeps it more readable than having everything in one file. More complex modules will likely want to split the upgrade definitions into even more files/folders. For example: a different file for each major upgrade.

The upgrades.ts file can export a single variable that contains an array of scripts, to be described next.

```ts
// upgrades.ts

export const upgradeScripts = [
  // add your scripts here
]
```

### API 2.x

In your main file of code, typically _src/main.ts_ or _src/main.js_ (if you're using the [recommended file structure](../module-setup/file-structure.md)), you should have either `export default class ...` or `module.exports = class ...` to export the class for your module.

To expose your upgrade scripts, you should do one of:

```ts
// If using ESM syntax, one of:
export const UpgradeScripts = [....] // if defining the array locally in this file
export { UpgradeScripts } // if `UpgradeScripts` is imported from another file.

// If using Commonjs syntax
module.exports.UpgradeScripts = ....
```

Which one you use will depend on exactly how they are defined

### API 1.x

The main entrypoint for modules, as described in the [overview page](./overview.md) is the call `runEntrypoint(ModuleInstance, UpgradeScripts)` that you typically place at the top-level of _src/main.ts_ (if you're using the [recommended file structure](../module-setup/file-structure.md)). When Companion loads the "main" file, this function will pass to Companion your module class and a list of upgrade scripts, as will be described here.

The upgrades.ts file can export a single variable that contains an array of scripts, to be described next.

```ts
// upgrades.ts

export const upgradeScripts = [
  // add your scripts here
]
```

```ts
// main.ts

import { MyModuleConfig } from './config'
import { upgradeScripts } from './upgrades'

class MyModuleClass extends InstanceBase<MyModuleConfig> {
	...
}

runEntrypoint(MyModuleClass, upgradeScripts)
```

## Writing an upgrade script

:::tip
Each upgrade script will only get run once for each action and feedback, but it is good practice to write the scripts so that they can be executed multiple times. This will help you when testing your script, or if jumping between versions of companion.
:::

We recommend defining the functions in a dedicated `upgrades.ts` file, as they should not depend on your main class and this helps avoids files growing too long to be manageable.

A simple example of a script is:

```ts
const UpgradeScripts = [
  function example_conversion(context, props) {
    const result = {
      updatedConfig: null,
      updatedSecrets: null,
      updatedActions: [],
      updatedFeedbacks: [],
    }

    // write your script in here

    for (const action of props.actions) {
      if (action.actionId === 'test') {
        // Mutate an option
        action.options.value = action.options.value + 1
        // Tell companion that this one was changed
        result.updatedActions.push(action)
      }
    }

    return result
  },

  // more can be added here later
]
```

:::warning
It is very important to not _remove_ an upgrade script once it has been defined. You can change old upgrade scripts if needed, but if the number of scripts gets reduced, then Companion will skip the next one you add for some users (it counts how many have been run)
:::

The script gets fed the bits of data you may need to do the upgrades.

### The `context` parameter

Currently this contains a single property `currentConfig`, which describes the current state of the user-config object of the instance. This cannot be mutated, and is intended as a reference. If it needs updating it will be present in the `props` too.

More will be added onto this `context` in the future, when there is a need to.

### The `props` parameter

This contains all the actions, feedbacks, and config that may need upgrading.

This looks something like:

```ts
{
	config: { ... }, // or null if no upgrade is needed
	secrets: { ... }, // or null if no upgrade is needed
	actions: [
		{
			id: 'abc', // You must not edit this, or Companion will ignore any other changes
			controlId: 'bank:def', // This is readonly
			actionId: 'my-action',
			options: { ... },
		},
	],
	feedbacks: [
		{
			id: 'abc', // You must not edit this, or Companion will ignore any other changes
			controlId: 'bank:def', // This is readonly
			feedbackId: 'my-action',
			options: {
				valA: { isExpression: false, value: 1 },
			},
			isInverted: { isExpression: false, value: false }
		},
	]
}
```

:::warning
The options objects on these actions and feedbacks look _very_ different from how they do in the callback of your action or feedback.
:::

### The return value

In your upgrade script, you are expected to return an object which describes which actions or feedbacks changed and whether the new config object.

Any values in this can be new or cloned objects, or a mutated in place object from props.

This allows Companion to determine which have been changed and avoid excessive work for the unchanged ones.

## Handling expressions

As the options for your actions and feedbacks in upgrade scripts are either wrapped plain values or wrapped expressions, some care needs to be taken in your upgrade script to ensure the upgrade is safe and won't break or lose the user defined expression.

We offer a few utility scripts which you can import from `@companion-module/base` to help with common cases. If you have something you think would be useful to add, let us know or open a PR.

- `FixupNumericOrVariablesValueToExpressions`: If you have a field which used to be a `textinput` and expected a number or variable containing a number, this will take in the wrapped value and convert it to a new wrapped value (or expression) which can be used for `number` input field

## Boolean feedbacks

If you are looking to convert 'advanced' feedbacks to 'boolean' feedbacks, we have [a guide on this process](../connection-advanced/migrating-legacy-to-boolean-feedbacks.md)

## Further Reading

- [Autogenerated docs for the module `InstanceBase` class](https://bitfocus.github.io/companion-module-base/classes/InstanceBase.html)
- [API Overview](./overview.md)
- [User-configuration management](./user-configuration.md)
- [Actions](./actions.md)
- [Feedbacks](./feedbacks.md)
- [Variables](./variables.md)
- [Presets](./presets.md)
