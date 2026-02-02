---
title: Module Development 101
sidebar_label: Module Development 101
sidebar_position: 5
description: The essential overview of Companion module development.
---

With your [local environment setup](./home.md), it is time to start looking at modules in greater detail. By now you should be familiar with Git and GitHub workflows, but if not, start by reading our [GitHub Crash Course](../git-workflows/git-crashcourse.md).

The general lifecycle of a module starts when you create a local repository as described in the [Getting Started](./home.md) page. Next you fill in the code to control your device. Finally you release it for others to use. Once you have completed one cycle, you continue by maintaining and updating your codebase.

## What makes up a module?

There are a few files that make up every module. Please familiarize yourself with the basic structure described in our pages on [Module Configuration](module-config/file-structure).  In particular, _package.json_, 
[_companion/manifest.json_](./module-config/manifest.json.md) and _companion/HELP.md_ define the identity of the module. Once these are defined, you will spend most of your time crafting the module source code.

## The module source code

While you can handle all your module's code in one big file, we strongly recommend splitting it across several files as illustrated [here](./module-config/file-structure#file-structure).

To understand what is needed in a module it helps to understand how the code is used. Your module is presented to Companion as a class that extends the module base class. A user can add one or more _instances_ of your module to their Companion site. When Companion starts up, it initializes each instance of the module by starting a new process and passing configuration information, as described next.

### Base module implementation

In the [typical module structure](./module-config/file-structure#file-structure), the entrypoint and module class are defined in _src/main.ts_. When your module is started, first the `constructor` of your module's class will be called, followed by your [upgrade scripts](https://github.com/bitfocus/companion-module-base/wiki/Upgrade-scripts) and then the `init` method.

Your constructor should only do some minimal class setup. It does not have access to the configuration information, so it should not be used to start doing things. Instead...

The `init` method is passed any previously-stored user-config information. (The structure of the user-config is defined by you and used as the type of the generic base class.) Inside the `init` method you should initiate the connection to your device (but dont await it! Instead use the The `updateStatus()` method to inform Companion asynchronously of the connection status). Here you also pass the module's actions, feedbacks, variables and presets to Companion for the first time.

Once the module is running the `configUpdated` (but not `init`) method will be called if the user changes the config on the Connections page. (You can programmatically change the user config by calling `saveConfig()`, defined in the base class.) You can also update the action, feedback, etc. definitions at any time.

When the module gets deleted or disabled the `destroy` function is called. here you should clean-up whatever you don't need anymore. Make sure to not leave timers running, as that can cause performance problems in companion as the leaked timers start piling up!

### Providing functionality to the user

Your module provides interaction with the user by defining user-configurations, actions, feedbacks, and variables. In addition you can define "preset" buttons that predefine combinations of common actions and feedbacks for the user's convenience. These presets can be dragged onto the button grid for "instant button configuration".

TODO: Update links

- [Module Configuration](module-config/file-structure.md)
- [Actions](https://github.com/bitfocus/companion-module-base/wiki/Actions)
- [Feedbacks](https://github.com/bitfocus/companion-module-base/wiki/Feedbacks)
- [Presets](https://github.com/bitfocus/companion-module-base/wiki/Presets)
- [Variables](https://github.com/bitfocus/companion-module-base/wiki/Variables)

### Printing to log

You might want to print some info or variables to the console or the in companion log both to aid in development and to help users identify what may have gone wrong

For printing to the module debug log use:

- `console.log('your data/message');`

And if you want it in the log in the web interface, see [the log method](https://bitfocus.github.io/companion-module-base/classes/InstanceBase.html#log).

## Sharing your code

Once your module is tested and you are ready to release it publicly, you will use the [BitFocus Developer Portal](https://developer.bitfocus.io/modules/companion-connection/discover) to list it with Companion. Please follow the guide for [releasing your module](https://github.com/bitfocus/companion-module-base/wiki/Releasing-your-module).

If your module it not intended for public release, or you want to share it locally for testing, you can also read the guide on [packaging your module](https://github.com/bitfocus/companion-module-base/wiki/Module-packaging).

## Testing

In any case, your module should be tested throughout at different stages of its life.  
You should check the compatibility to the Companion core, especially to different versions of the configuration fields. Some users may not have used Companion in a long time and their configuration file might look different than what you expect.  
And last but not least you should check **all** your actions with **all** the options and feedbacks and whatever with the real device (as much as possible). Most bugs we find are typos, which would have easily been detected by complete testing. Also please don't rely solely on simulations where possible, often the real device reacts slightly differently than the simulator.

Questions? Reach out on [SLACK](https://bfoc.us/uu1kmq6qs4)! :)
