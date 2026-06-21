---
title: Surface Plugin Overview
sidebar_label: Overview
sidebar_position: 10
description: The SurfacePlugin model — one plugin per surface type, many connected devices.
---

A surface module exports a single object that implements the **`SurfacePlugin`** interface from
`@companion-surface/base`. Where a connection module exposes a _class_ that Companion instantiates
once per connection, a surface plugin is one long-lived object that manages **every** device of
the type it supports.

:::tip
**One plugin handles all surfaces of a given type.** The plugin discovers and opens devices; each
opened device is then represented by its own [surface instance](./the-surface-instance.md).
:::

The interface is generic over `TInfo` — a type you define to carry whatever plugin-specific data
you want to associate with a discovered device (a device path, an IP address, a handle into a
vendor library, …). Companion hands it back to you when it asks you to open that device.

A minimal plugin looks like this:

```typescript
import type { SurfacePlugin } from '@companion-surface/base'

interface MyDeviceInfo {
	path: string
}

export const plugin: SurfacePlugin<MyDeviceInfo> = {
	async init() {
		// Set up anything the plugin needs. Don't block on hardware that may not be present yet.
	},
	async destroy() {
		// Tear down anything created in init().
	},

	// Tell Companion which connected devices are yours — see Discovery.
	checkSupportsHidDevice(device) {
		return null
	},

	// Open a device Companion has chosen to use — see The Surface Instance.
	async openSurface(surfaceId, pluginInfo, context) {
		throw new Error('not implemented')
	},
}
```

See the [generated API reference](https://bitfocus.github.io/companion-surface-api/) for the full,
always-current interface and its types.

## The two halves of a plugin

1. **Discovery** — telling Companion which devices exist. The flow depends on how your hardware
   connects; the common ones (USB HID and remote/network) are covered in
   [Discovery](./discovery.md), the rest in [Custom Discovery](../surface-advanced/custom-discovery.md).
2. **The surface instance** — once Companion decides to use a device it calls `openSurface()`,
   which returns the live [surface instance](./the-surface-instance.md) plus a description of the
   device's [layout](./layout.md), brightness support, [pincode handling](./locking-and-pincode.md)
   and [config fields](./input.md).

## `SurfaceContext`

`openSurface()` is given a `SurfaceContext`. This is your channel _back_ to Companion: you use it
to report [input events](./input.md) (key presses, encoder rotation, …), to disconnect when the
device goes away, and to read host state such as whether the surface is locked. Hold onto it inside
your surface instance.

## The manifest

Surface manifests look like connection manifests but have `"type": "surface"` and some
surface-specific fields — most importantly `usbIds`, which determines the HID devices you are
offered (covered on the [Discovery](./discovery.md) page). For the fields shared with connection
modules, see the [connection manifest docs](../../module-development/module-setup/manifest.json.md).

## Reference

- [Generated API reference](https://bitfocus.github.io/companion-surface-api/)
- [companion-surface-api wiki](https://github.com/bitfocus/companion-surface-api/wiki)
