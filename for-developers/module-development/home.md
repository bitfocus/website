---
title: Module Development Setup
sidebar_label: Getting Started with Modules
sidebar_position: 1
description: Developer environment setup specific to module development.
---

So, you want to develop a module for Companion? Welcome!
This section describes what you need to know and do to make a beautiful module to control your favorite gear with Companion.

## Prerequisites

Before you start, make sure you have [Installed the Development Tools](../setting-up-developer-environment.md) and familiarized yourself with [Git Workflows](../git-workflows/git-crashcourse.md).

This page discusses additional setup needed in order to develop or contribute to Companion modules.

## Install Companion

You can develop modules against any standard release or beta build of Companion. (To develop modules in a core-Companion development process, see the instruction for [headless development](./local-modules#headless-development))

Download and install a recent version from [the website](https://bitfocus.io/user/downloads)

:::tip
Starting with Companion v4.0, the module release cycle has been separated from the Companion release cycle: The timing of module version releases are determined by the module developer independently of the Companion releases.

We therefore recommend developing your module using the current stable version to ensure that users will be able to use your module right away instead of having to wait until the current beta is released.
:::

## Set up Companion for Module Development

Follow the instructions in [Setting up a Development Folder](./local-modules.md) to create the folders and to setup Companion for module development. Briefly:

- Create a `companion-module-dev` folder somewhere on your computer. You can call it whatever you like.
- Once you have the companion launcher open, click the cog in the top right. In versions prior to v4.1 this will reveal a 'Developer modules path' field. Starting in v4.1 it will open up a settings window in which you can set the path. Set it to the `companion-module-dev` folder you created earlier.

:::tip
Companion will load any modules it finds in subfolders of that folder.

When files inside those folders is changed, Companion will automatically restart any connections using that module.
:::

## Clone the module

- If you are working on an existing module, clone it inside this folder using your preferred git tool.
- If you are making a new module, then clone the template module, available in [TypeScript](https://github.com/bitfocus/companion-module-template-ts) or [Javascript](https://github.com/bitfocus/companion-module-template-js), to an appropriately named folder inside of `companion-module-dev`. If you are starting a new module we encourage you to use Typescript but acknowledge that it isn't for everyone, so fully support Javascript too!

:::note
Starting with v4.0, note that **your new dev module will show up in the Connections page** but not in the Modules page, since it is not yet part of the official set of Companion modules.
:::

## Start working on your module

You are now ready to start developing your module.

You should notice that whenever you save a file inside your `companion-module-dev` folder, companion will restart itself.  
If it does not, or you are having issues getting your module to load in then please reach out on slack and we will be happy to assist you in getting started.

## Further Reading

- [Module development 101](./module-development-101.md)
- [Creating a module](https://github.com/bitfocus/companion-module-base/wiki/Creating-a-module)
- [Actions](https://github.com/bitfocus/companion-module-base/wiki/Actions)
- [Feedbacks](https://github.com/bitfocus/companion-module-base/wiki/Feedbacks)
- [Variables](https://github.com/bitfocus/companion-module-base/wiki/Variables)
