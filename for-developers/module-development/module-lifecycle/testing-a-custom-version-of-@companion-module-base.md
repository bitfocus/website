---
title: 'Using a custom @companion-module/base library'
sidebar_label: 'Custom @companion-module/base'
sidebar_position: 8
description: How to test and use your module with a non-release version of the companion modules.
---

Sometimes it may be useful to test or use an unreleased version of `@companion-module/base`. This commonly happens when new features are added to this library, before they are deemed ready for general use.

:::warning

Modules using unreleased versions of `@companion-module/base` should not be distributed. There will often be subtle differences between the unreleased version and the final version that will cause bugs. Make sure to only use released versions in any distributed/published module versions.

:::

## Using an unreleased version

This can sometimes be done against a normal build of companion, unless the changes to this library require changes in companion too.

1. clone this repository somewhere on your computer if you havent already `git clone https://github.com/bitfocus/companion-module-base.git`
2. cd into the cloned folder `cd companion-module-base`
3. If the version you want is a branch, checkout the branch, or main if you want the primary branch. eg `git checkout main`
4. Install dependencies `yarn install`
5. Build the library `yarn build`. If this step fails with an error, you will need to resolve this
6. Make the library available through `yarn link` (if you have done this before, it can be skipped)
7. Inside your module folder, link in the local version `yarn link @companion-module/base`. This may need to be repeated anytime you run add/install/remove any dependencies from your module.

Note: be aware that the custom version will stay with your module as you switch branches. Once you are done, the best way to ensure you are using the version defined in your `package.json` is to delete your `node_modules` folder and run `yarn install` to regenerate it
