---
title: 'The Companion Module Libraries'
sidebar_label: '@companion-module Libraries'
sidebar_position: 1
description: Explanation of the companion module library.
---

Since Companion version 3.0, we have used `@companion-module/base` and `@companion-module/tools` libraries as part of the module API.

The libraries are available on [npm](https://www.npmjs.com/) and are installed automatically when you run `yarn install`.

## What is the purpose of each library?

### @companion-module/base

This library is added as a regular dependency of your module. It contains various helpers and utilities that we think are useful to modules, as well as the main base class that your module should extend.

If you have any suggestions for new utilities or helpers that would benefit many modules, let us know and we shall consider including it.

### @companion-module/tools

This library should be added as a devDependency of your module. It contains various bits of tooling and commands needed during the development or distribution of modules.

For example, it contains a script to bundle your module for distribution and some eslint and typescript config presets that can be used.

We expect every module to use the build script provided from this, the rest is optional extras that you can choose to use if you like.

## When should I update them?

### @companion-module/base

The version of this library determines the versions of Companion your module can be run with. See the [version compatibility table](https://github.com/bitfocus/companion-module-base#readme).

For example, modules targeting Companion 3.0 should use @companion-module/base v1.4.3 (or any 1.x release back to v1.0.0). Modules targeting Companion 3.1 should use v1.5. A module written for 3.0 will run on 3.1, but a module written for 3.1 may not be compatible with 3.0.

We recommend targeting the previous stable release of Companion. This will allow users who have not yet updated Companion to use the latest version of your module. But of course, you may wish to use newer versions if there are features that your module will benefit from.

### @companion-module/tools

This library is less picky about the version, and you will benefit by running an up to date version.

## Why were they created? - A bit of history

Prior to Companion version 3, modules would pull various bits of code from the Companion code. This was problematic as it meant that modules had to live in one of a few specific locations to be able to access the code. In release builds, they had to be built in before Companion was packaged.

This was the main issue that was blocking our ability to support adding newer versions of modules into already released versions.

Everything that modules need to access Companion is now located inside of `@companion-module/base`. Some things have not been made available, as they were determined to not be appropriate and alternatives will be recommended to the few module authors who utilised them.

Another benefit of this separation is that it allows us to better isolate modules from being tied to specific versions of Companion. The `@companion-module/base` acts as a stable barrier between the two. It has intentionally been kept separate from the rest of the Companion code, so that changes made here get an extra level of scrutiny, as we want to guarantee backwards compatibility as much as possible. For example, in Companion version 2.x changes made to the module API occasionally required fixes to be applied to multiple modules. By having this barrier, we can avoid such problems for as long as possible, and can more easily create compatibility layers as needed.

## Further reading

- [Introduction to modules](../home.md)
- [Module development 101](../module-development-101.md)
- [Module Basics](../connection-basics/)
