---
title: Debugging Surfaces
sidebar_label: Debugging Surfaces
sidebar_position: 7
description: How to debug a surface module during development.
---

Debugging a surface module works the same way as debugging a connection module. Rather than repeat
the details here, see [Debugging Modules](../module-development/module-debugging.md) in the
connection docs, which covers logging through the API, `console.log`, and attaching an interactive
debugger.

A few things worth keeping in mind that are specific to surfaces:

- **Hardware state matters.** Many surface bugs only appear with a real device attached. Where
  possible, test against the physical surface as well as any simulator.
- **Watch the discovery flow.** A surface that never appears in Companion is usually a discovery or
  registration problem rather than a rendering one — start by logging in your
  [discovery](./surface-basics/discovery.md) code.
- **Log generously around connect/disconnect.** Hotplug and reconnection edge cases are the most
  common source of surface bugs; log when surfaces are added and removed.

See also the generated API reference at
[bitfocus.github.io/companion-surface-api](https://bitfocus.github.io/companion-surface-api/) for
the exact logging helpers available to your plugin.
