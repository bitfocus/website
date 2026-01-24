---
title: 'The Companion Module Libraries'
sidebar_label: '@companion-module Libraries'
sidebar_position: 7
description: Explanation of the companion module library.
---

Since Companion version 3.0, we have used `@companion-module/base` and `@companion-module/tools` libraries as part of the module API.

The libraries are available on [npm](https://www.npmjs.com/) and are installed automatically when you run `yarn install` (assuming you've configured your package.json correctly or are using the [recommended templates](./file-structure.md)).

## What is the purpose of each?

### @companion-module/base

This library is added as a regular dependency of your module. It contains various helpers and utilities that we think are useful to modules, as well as the main base class that your module should extend.

If you have any suggestions for new utilities or helpers that would benefit many modules, let us know and we shall consider including it.

### @companion-module/tools

This library is added as a devDependency of your module. It contains various bits of tooling and commands that can benefit the development of modules.

For example, it contains a script to bundle your module for distribution and some eslint and typescript config presets that can be used.

We expect every module to use the build script provided from this, the rest is optional extras that you can choose to use if you like.

## When should I update them?

### @companion-module/base

The version of this library determines the versions of Companion your module can be run with. See the [GitHub README file](https://github.com/bitfocus/companion-module-base#readme) for the compatibility table.

The idea is that a module written for Companion 3.0 will be using 1.4.3 (or earlier, back to 1.0.0 is supported) of this library. And a module written for Companion 3.1 will be using 1.5 of this library. The module written for Companion 3.0 will also run in Companion 3.1, but the module written for Companion 3.1 will not work with Companion 3.0.

We recommend targeting the previous stable release of Companion. This will allow users who have not yet updated Companion to use the latest version of your module. Of course, you may wish to use newer versions if there are features that your module will benefit from.

### @companion-module/tools

This library is less picky about the version, and you will likely benefit by running an up to date version.

Make sure to check the table in the [readme](https://github.com/bitfocus/companion-module-tools#readme) to choose the newest version that is compatible with the version of `@companion-module/base` you are using.

## Why were they created? - A bit of history

Prior to Companion version 3, modules would pull various bits of code from the Companion code. This was problematic as it meant that modules had to live in one of a few specific locations to be able to access the code. In release builds, they had to be built into the release build.

This was the main issue that was blocking our ability to support adding newer versions of modules into already released versions. Additionally, now that modules run in their own processes, it was very easy for modules to accidentally load in files they werent supposed to and consume too much memory.

Everything that modules need to access Companion is now located inside of `@companion-module/base`. Some things have not been made available, as they were determined to not be appropriate and alternatives will be recommended to the few module authors who utilised them.

Another benefit of this separation is that it allows us to better isolate modules from being tied to specific versions of Companion. The `@companion-module/base` acts as a stable barrier between the two. It has intentionally been kept separate from the rest of the Companion code, so that changes made here get an extra level of scrutiny, as we want to guarantee backwards compatibility as much as possible. For example, in Companion version 2.x changes made to the module api occasionally required fixes to be applied to multiple modules. By having this barrier, we hope to avoid such problems for as long as possible.
