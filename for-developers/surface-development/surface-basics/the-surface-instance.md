---
title: The Surface Instance
sidebar_label: The Surface Instance
sidebar_position: 13
description: Opening a device and implementing the live SurfaceInstance.
---

While the [plugin](./overview.md) manages a whole _type_ of surface, each individual connected
device is a **surface instance**. Companion creates one by calling your plugin's `openSurface()`
when it decides to use a device that [discovery](./discovery.md) reported.

## `openSurface`

`openSurface(surfaceId, pluginInfo, context)` is where you actually open the hardware. `pluginInfo`
is the object you returned from discovery; `context` is the [`SurfaceContext`](./input.md) you use
to talk back to Companion. It returns two things:

- **`surface`** — your `SurfaceInstance` implementation (below).
- **`registerProps`** — a description of the device's capabilities: its [layout](./layout.md),
  whether it supports brightness, its [pincode map](./locking-and-pincode.md), any
  [config fields](./input.md) and transfer variables, and an optional user-facing `location`.

```typescript
async openSurface(surfaceId, pluginInfo, context) {
	const surface = new MySurface(surfaceId, pluginInfo, context)
	return {
		surface,
		registerProps: {
			brightness: true,
			surfaceLayout: myLayout, // see Layout
			pincodeMap: { type: 'single-page', /* … */ }, // see Locking & Pincode
			location: null,
			configFields: null,
		},
	}
}
```

:::tip
If opening the hardware can throw partway through, make sure you don't leak the underlying device
handle — open inside a `try`/`catch` and close what you've opened before re-throwing, so a failed
open doesn't leave a dangling connection.
:::

## Implementing `SurfaceInstance`

The instance carries a `surfaceId` (a stable id, typically the serial number — Companion uses it to
re-associate the device with the user's config across reconnects) and a `productName`. Beyond that
it implements the lifecycle and operation methods Companion calls:

- **`init()`** — open and prepare the hardware. Called once after creation.
- **`ready()`** — Companion is about to start drawing; transition into normal operation.
- **`draw(signal, drawProps)`** — render a control — see [Rendering](./rendering.md).
- **`setBrightness(percent)`** / **`blank()`** — backlight and clear, also covered in
  [Rendering](./rendering.md).
- **`close()`** — clean up and disconnect. Stop any timers and release handles here.
- Optional: **`updateConfig(config)`**, **`onVariableValue(name, value)`** (see
  [Input & variables](./input.md)), **`showLockedStatus(...)`** (see
  [Locking & pincode](./locking-and-pincode.md)) and **`checkForFirmwareUpdates(...)`** (see
  [Firmware updates](../surface-advanced/firmware-updates.md)).

## Disconnecting

When the device goes away (unplugged, network dropped), call `context.disconnect(error)` so
Companion knows it is gone. For the [detection](../surface-advanced/custom-discovery.md) and
[remote](./discovery.md) flows you also emit the relevant "removed" event so the reserved id is
released.

See the [generated reference](https://bitfocus.github.io/companion-surface-api/) for the full
`SurfaceInstance` and `SurfaceRegisterProps` definitions, and the
[Elgato Stream Deck module](https://github.com/bitfocus/companion-surface-elgato-stream-deck) for a
complete implementation.
