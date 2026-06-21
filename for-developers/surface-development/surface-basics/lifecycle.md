---
title: Plugin Lifecycle
sidebar_label: Lifecycle
sidebar_position: 11
description: Initialising and tearing down a surface plugin.
---

A `SurfacePlugin` has a simple top-level lifecycle built around two methods:

- **`init()`** — called once when the plugin is loaded, before any surfaces or events are used. Set
  up whatever your plugin needs to begin [discovering](./discovery.md) surfaces. Don't block on
  hardware that may not be present — report surfaces as they appear instead.
- **`destroy()`** — called once when the plugin is about to be unloaded. Reset and close any open
  surfaces and release everything you created in `init()`. As with connection modules, leaking
  timers or handles here causes problems that accumulate over time.

:::warning Don't emit discovery events before `init()`
If your plugin uses the [detection](../surface-advanced/custom-discovery.md) or
[remote](./discovery.md) mechanisms (both are `EventEmitter`s), it must **not** emit any events
until after `init()` has returned — anything emitted earlier is lost.
:::

The lifecycle of an individual connected device is separate from the plugin lifecycle and is
described in [The Surface Instance](./the-surface-instance.md).

The build → release → maintain lifecycle of the _module repository_ (packaging, versioning,
releasing) is shared with connection modules — see
[Module Development 101](../../module-development/module-development-101.md).
