---
title: 'Updating the Node.JS Version in your Module'
sidebar_label: 'Updating Node.JS'
sidebar_position: 8
description: Explanation of the companion module library.
---

Nodejs often makes new releases. In the major version jumps, these can include some breaking changes which could impact your module, so we don't want to do that without you being aware of it.

Since Companion version 3.0, we've required modules to be compatible with Node.JS v18. Starting with @companion-module/base v1.11, Node.JS v22 has been supported.

When developing your module, you need to have a similar version of nodejs installed, for when you run `yarn`. Companion v4 supports both v18 and v22 for modules, but may provide a different minor version than you have used.

:::note

Whenever Companion runs your module, it will do so with the version of nodejs that we distribute, not the one you have installed yourself.

:::

If you are using a node version manager, you can install an updated nodejs to your system, by doing something like `fnm install 22` and `fnm use 22`. See [our instructions here](../../setting-up-developer-environment.md).

### Changing your module's version of nodejs

Companion knows what version of nodejs your module is compatible with by looking at the `companion/manifest.json` in your module. Inside the `runtime` object, is a property `type` which should be set to something like `node18` or `node22`. Currently these are the only valid values, others will be allowed in the future. If this is an unknown value, your module will fail to run when adding an instance inside Companion.

Make sure that your version of the `@companion-module/base` dependency is appropriate for the version of Companion too. A table of compatibility is listed in [the readme](https://github.com/bitfocus/companion-module-base#supported-versions-of-this-library)

If you are using TypeScript, you should update your preset to have sensible `target` and `lib` values. The config presets in `@companion-module/tools`, have versions for each supported version of nodejs to make this easier for you.

If your module has an `engines` field in the package.json, make sure that has a sensible value.

Once you have done this, give it a test in Companion and ensure everything is working as expected.
