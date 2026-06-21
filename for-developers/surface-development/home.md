---
title: Getting Started with Surfaces
sidebar_label: Getting Started with Surfaces
sidebar_position: 1
description: Developer environment setup and orientation for surface module development.
---

So, you want to develop a surface module for Companion? Welcome!

A **surface** module teaches Companion how to talk to a physical control surface — reading button
presses and encoder turns, and drawing button graphics, indicators and brightness onto the
hardware. Surface modules are plugins, just like connection modules, and they are built with the
same tooling and released through the same workflows.

:::tip Most tooling is shared with connection modules
Surface and connection modules share almost all of their development environment, repository
tooling and release process. Rather than duplicate that here, this section links you to the
relevant [Connection Development](../module-development/home.md) pages and concentrates on what is
genuinely different for surfaces. Connection modules are far more common, so if a topic isn't
covered here, the connection docs are almost always the right place to look.
:::

## Prerequisites

Before you start, make sure you have [installed the development tools](../setting-up-developer-environment.md)
and are comfortable with [Git workflows](../git-workflows/git-crashcourse.md). These are the same
for all Companion module development.

## Shared setup — reuse the connection docs

The following steps are identical for surface and connection modules. Follow the connection pages
and come back here for the surface-specific API:

- [Installing Companion and setting up the development folder](../module-development/home.md)
- [Setting up a dev folder](../module-development/local-modules.md) so Companion loads your module
  while you work
- [Repository file structure](../module-development/module-setup/file-structure.md)
- [The `manifest.json` file](../module-development/module-setup/manifest.json.md) — note that
  surface modules declare some surface-specific fields; see [Surface Plugin Overview](./surface-basics/overview.md)
- [Module development 101](../module-development/module-development-101.md) for the general
  build → release → maintain lifecycle
- [Packaging](../module-development/module-lifecycle/module-packaging.md) and
  [releasing](../module-development/module-lifecycle/releasing-your-module.md) a module

## What's different for surfaces

Where a connection module defines actions, feedbacks and variables, a surface module implements
the [`SurfacePlugin`](./surface-basics/overview.md) interface and is responsible for:

- [Discovering and connecting to surfaces](./surface-basics/discovery.md)
- Representing [each connected surface](./surface-basics/the-surface-instance.md)
- Declaring the surface's [physical layout](./surface-basics/layout.md)
- [Rendering](./surface-basics/rendering.md) the images Companion pushes, plus brightness and LEDs
- Reporting [input events](./surface-basics/input.md) back to Companion
- Handling the [lock screen / pincode entry](./surface-basics/locking-and-pincode.md)

Read on in [Surfaces: Basics](./surface-basics/index.md).

## Reference material

- Generated API reference: [bitfocus.github.io/companion-surface-api](https://bitfocus.github.io/companion-surface-api/)
- [companion-surface-api wiki](https://github.com/bitfocus/companion-surface-api/wiki)

Existing modules are the best reference for a real, working implementation. Which one to look at
depends on how your surface connects — there's no single "canonical" example because the discovery
flows differ:

- USB (HID) and remote/network: [`companion-surface-elgato-stream-deck`](https://github.com/bitfocus/companion-surface-elgato-stream-deck)
  (comprehensive, but a large codebase)
- Serial port: [`companion-surface-loupedeck`](https://github.com/bitfocus/companion-surface-loupedeck)

Questions? Reach out on [Slack](https://l.companion.free/q/zYXXxnGyd)! :)
