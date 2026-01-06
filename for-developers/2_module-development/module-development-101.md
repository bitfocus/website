---
title: Module Development 101
sidebar_label: Module Development 101
sidebar_position: 2
description: The essential overview of Companion module development.
---

With your environment setup, it is time to start looking at modules.

Companion uses plug-ins to expand its capabilities, we call these plug-ins modules. For every device you can control with Companion there is a "module", which is both a Javascript and Companion term.

## Changing existing modules

When you want to make changes to an existing module, you need to fork the module's repository. This gives you somewhere to store your changes, so that you can open a request for them to be merged into the official version.  
You can find the GitHub repository for each module by searching [here](https://github.com/bitfocus), there is a fork option in the top right of each module page.  
You can then clone this version into your `companion-module-dev` folder.

## Creating a new module

With over 700 published modules, often you'll want to use another module's code as your base. First you'll need to create a directory to develop your module.

Before you start, make sure there isn't already a module for the same device [here](https://developer.bitfocus.io/modules/companion-connection/discover). Perhaps there is one that is for a similar device which uses the same protocol?

Make a directory `companion-module-mymanufacturer-myproduct` inside your `companion-module-dev`. We follow a `mymanufacturer-myproduct` naming scheme, try to think of what is most appropriate for your device.  
Are there other similar device by the manufacturer that use the same protocol that the module could support later on? If so try and name it to more easily allow for that.

You now need to decide if you want to start from scratch, or start with the code from another module. Github provides a `download as zip` option, so you can download either the [template](https://github.com/bitfocus/companion-module-template-js) or another module (the [generic](https://github.com/bitfocus?q=generic&type=source&language=&sort=) modules are often a good starting point). Extract the zip to the folder you created.

Note: By using another module as a base, you could inherit some subtle misconfigurations or deviations they have made from our recommendations. The guide should still make sense, but may not be a perfect match.

In a shell inside the new folder, you should run the following:

1. `yarn` This will install any dependencies needed by the module.

In your IDE of choice (we recommend [VS Code](https://code.visualstudio.com/)), you should start by editing the name of the module to match what yours is called. The search feature is really helpful for this!

Now have a look around and see what you can figure our from the code.
These other pages will help explain some of the functionality that the module exposes to users:

TO-DO: Update links

- [Module Configuration](https://github.com/bitfocus/companion-module-base/wiki/Module-development-101)
- [Actions](https://github.com/bitfocus/companion-module-base/wiki/Actions)
- [Feedbacks](https://github.com/bitfocus/companion-module-base/wiki/Feedbacks)
- [Presets](https://github.com/bitfocus/companion-module-base/wiki/Presets)
- [Variables](https://github.com/bitfocus/companion-module-base/wiki/Variables)

## What makes up a module

There are a few files that make up every module. To get an overview of what these are, please see [File Structure](https://github.com/bitfocus/companion-module-base/wiki/File-Structure).

## The Module source code

While you can handle all your module's stuff in one big file, we strongly recommend splitting it across several files, but it's up to you.  
When the user adds an instance in Companion, it instantiates the module. This will start your module in a new process, and do some basic setup with Companion.

There are various tasks to do to get a working module, which can be divided in several categories:

1.  Base module implementation
2.  Providing functionality to the user
3.  The code behind all that stuff

### Base module implementation

When your module is started, first the `constructor` will be called, followed by your [upgrade scripts](https://github.com/bitfocus/companion-module-base/wiki/Upgrade-scripts) and then the `init` method.  
Your constructor should only do some minimal class setup. It does not have access to your instance config, so cannot be used to start doing things.

Inside of the `init` method you should initiate the connection to your device (but dont await it!) and get everything working ready for actions and feedbacks to start being used.

When the module gets deleted or disabled the `destroy` function is called. here you should clean-up whatever you don't need anymore. Make sure to not leave timers running, as that can cause performance problems in companion as the leaked timers start piling up!

### Providing functionality to the user

Most (so far all) modules do want to provide some interaction with the user. The possible items are stored in json objects. This splits up in several categories.

TO-DO: Update links

- [Module Configuration](https://github.com/bitfocus/companion-module-base/wiki/Module-development-101)
- [Actions](https://github.com/bitfocus/companion-module-base/wiki/Actions)
- [Feedbacks](https://github.com/bitfocus/companion-module-base/wiki/Feedbacks)
- [Presets](https://github.com/bitfocus/companion-module-base/wiki/Presets)
- [Variables](https://github.com/bitfocus/companion-module-base/wiki/Variables)

### Printing to log

While developing you might want to print some info or variables to the console or the in companion log.
The below commands will help you do just that:

For printing to the module debug log:

- `console.log('your data/message');`

And if you want it in the log in the web interface, see [the log method](https://bitfocus.github.io/companion-module-base/classes/InstanceBase.html#log).

## Sharing your code

TODO: Fix links:
Once your module is tested and you are ready to release it publicly, please follow the guide for [releasing your module].

If your module it not intended for public release, or you want to share it locally for testing, you can also read the guide on [packaging your module].

## Testing

In any case, your module should be tested throughout at different stages of its life.  
You should check the compatibility to the Companion core, especially to different versions of the configuration fields. Some users may not have used Companion in a long time and their configuration file might look different than what you expect.  
And last but not least you should check **all** your actions with **all** the options and feedbacks and whatever with the real device (as much as possible). Most bugs we find are typos, which would have easily been detected by complete testing. Also please don't rely solely on simulations where possible, often the real device reacts slightly differently than the simulator.

Questions? Reach out on [SLACK](https://bfoc.us/uu1kmq6qs4)! :)
