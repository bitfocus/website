---
title: Module Upgrade Scripts
sidebar_label: Upgrade Scripts
sidebar_position: 21
description: Module upgrade script details.
---

Over time you will add new functionality to your module. Sometimes, this can involve changing how existing actions or feedbacks are implemented.  
A common example is changing a on/off option to be an on/off/toggle option.

When this happens, existing usages of the action or feedback will become broken. The job of the upgrade script is to fix up the actions and feedbacks to handle the changes.

Each upgrade script will only get run once for each action and feedback, but it is good practise to write the scripts so that they can be executed multiple times. This will help you when testing your script, or if jumping between versions of companion.

### Adding a script

It is recommended to put them in an `upgrades.js` file, and to import them into `index.js` with the following:

```
const upgradeScripts = require('./upgrades')
```

The second parameter to the `runEntrypoint()` method in your `index.js` is an array of upgrade scripts. So it should be added there

### Writing the script

It is intentional that the script is a method that is unrelated to your Instance class. They previously were part of the class, but that limited when they could be run and could lead to unpredictable behaviour that depended on the current state of the class.

A minimal example of a script is:

```js
module.exports = {
	example_conversion: function (context, props) {
		const result = {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}

		// write your script in here

		return result
	},

	// more will be added here later
}
```

The script gets fed the bits of data you may need to do the upgrades.

#### context

This is a collection of methods that may be useful for your script. There aren't currently any, some will be added here later on

#### props

This is all the data that needs upgrading. It contains a few properties

##### config

Sometimes, the config of your module may be provided here, in case it needs upgrading.

You can change anything you like here. To save the change, set the new value as `updatedConfig` in the result.

_Warning_: Often this value will be null. Make sure you don't throw an error when that happens!

##### actions

This is an array of the actions that may need upgrading to the new version.

Note: This may not be all of the actions that exist. Sometimes it will be called with actions that have been imported from a page from an older version of companion

Any changed actions should be added to the `updatedActions` array in the result.

##### feedbacks

This is an array of the feedbacks that may need upgrading to the new version.

Note: This may not be all of the actions that exist. Sometimes it will be called with actions that have been imported from a page from an older version of companion

Any changed feedbacks should be added to the `updatedFeedbacks` array in the result.

##### return result

This tells Companion what had changed in your script. Anything changes made to actions or feedbacks not listed in the result object will be discarded.
