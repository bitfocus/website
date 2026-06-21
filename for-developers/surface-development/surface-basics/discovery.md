---
title: Discovering Surfaces
sidebar_label: Discovery
sidebar_position: 12
description: Detecting USB (HID) and remote surfaces and reporting them to Companion.
---

Before Companion can use a surface, your [plugin](./overview.md) has to tell it the device exists.
The API offers several discovery flows so it can cover everything from a USB Stream Deck to a
network surface behind a dongle. This page covers the two **common** flows — USB (HID) and
remote/network. The specialised flows (active scanning, plugin-owned detection) are covered in
[Custom Discovery](../surface-advanced/custom-discovery.md).

## USB (HID) surfaces

This is the right flow for most USB-attached surfaces, and the simplest to implement.

### 1. Declare your USB IDs in the manifest

Companion runs a single shared HID hotplug watcher for all surface plugins. It will only offer your
plugin devices whose USB vendor/product IDs you declare in your manifest's `usbIds` array — so you
never see, or have to filter out, unrelated devices:

```json
{
  "type": "surface",
  "id": "my-surface",
  "usbIds": [{ "vendorId": 4057, "productIds": [96, 109, 99] }]
}
```

> `usbIds` — "List of USB vendor and product IDs that the module supports. Your module will only be
> notified of devices matching these IDs."

`vendorId` and the `productIds` entries are **numbers** (decimal). A device that advertises itself
in hex as `0x0fd9` / `0x0060` is therefore `4057` / `96` here.

### 2. Claim matching devices with `checkSupportsHidDevice`

For each matching device, Companion calls `checkSupportsHidDevice(device)`. Inspect the
[`HIDDevice`](https://bitfocus.github.io/companion-surface-api/) info and either return a
`DiscoveredSurfaceInfo` to claim it, or `null` to decline. **Do not open the device here** — this
is a cheap, synchronous probe based only on the info provided:

```typescript
checkSupportsHidDevice(device: HIDDevice): DiscoveredSurfaceInfo<MyDeviceInfo> | null {
	// Narrow further than usbIds if one productId covers several models,
	// or use device.usagePage / device.interface to pick the right HID interface.
	if (device.vendorId !== 4057) return null

	return {
		// Typically the serial number. The host resolves collisions by adding a suffix
		// unless you set surfaceIdIsNotUnique: true.
		surfaceId: device.serialNumber,
		// Shown to the user — usually the model name.
		description: device.product ?? 'My Surface',
		// Your own data, handed back to you in openSurface().
		pluginInfo: { path: device.path },
	}
}
```

:::warning
Companion will call this for each attached device upon every scan. It is important that you return a stable surfaceId here, to stop Companion from seeing it as a new surface each time.
:::

If Companion decides to use the device, it then calls
[`openSurface(surfaceId, pluginInfo, context)`](./the-surface-instance.md) — and `pluginInfo` is
the object you returned above. That is where you actually open the hardware.

## Remote / network surfaces

For surfaces reached over the network (IP or cloud), your plugin manages the connections itself.
This flow is driven by the **remote connections the user configures in Companion** — Companion
stores the connection configs and asks your plugin to start and stop them. Implement the `remote`
property on your plugin with a `SurfacePluginRemote`, whose key pieces are:

- **`configFields`** defines the form the user fills in when adding a remote connection (for
  example an address and port — see [input field types](./input.md)). Companion persists these and
  passes them back in `startConnections()`.
- **`startConnections` / `stopConnections`** are how Companion tells you to connect to, or
  disconnect from, the configured remotes.
- As surfaces come up, you emit **`surfacesConnected`**; for surfaces you _discover_ but the user
  hasn't added yet, emit **`connectionsFound`** (and `connectionsForgotten` when they go away) so
  Companion can suggest them in the UI.

After you emit `surfacesConnected`, Companion decides what to do with each surface — exactly as for
HID. It either calls [`openSurface(surfaceId, pluginInfo, context)`](./the-surface-instance.md) to
open it, or calls `rejectSurface(surfaceInfo)` on your remote class if it opts not to; allowing you to release any
resources you were holding for that device.

`SurfacePluginRemote` is an `EventEmitter`. As with all discovery, **do not emit any events until
after `init()` has returned**, or they will be lost.

```typescript
import { EventEmitter } from 'node:events'
import type { SurfacePluginRemote, SurfacePluginRemoteEvents } from '@companion-surface/base'

class MyRemote
  extends EventEmitter<SurfacePluginRemoteEvents<MyDeviceInfo>>
  implements SurfacePluginRemote<MyDeviceInfo>
{
  readonly configFields = [{ id: 'host', type: 'textinput', label: 'Address', default: '' }]
  readonly checkConfigMatchesExpression = '$(objA:host) == $(objB:host)'

  async startConnections(connections) {
    for (const conn of connections) {
      // connect using conn.config, then announce the surface:
      this.emit('surfacesConnected', [
        {
          surfaceId: 'serial-123',
          deviceHandle: conn.connectionId,
          description: 'My Network Surface',
          pluginInfo: { path: String(conn.config.host) },
        },
      ])
    }
  }

  async stopConnections(connectionIds) {
    /* close the matching connections */
  }
  rejectSurface(_info) {
    /* release any resources for a surface the host declined */
  }
}
```

## Choosing a flow

| Your surface…                                  | Use…                                                        |
| ---------------------------------------------- | ----------------------------------------------------------- |
| Is a USB HID device                            | `checkSupportsHidDevice` + `usbIds` (above)                 |
| Is reached over the network / cloud            | `remote` / `SurfacePluginRemote` (above)                    |
| Uses a serial port, dongle, or a custom scheme | [Custom Discovery](../surface-advanced/custom-discovery.md) |

See the [generated reference](https://bitfocus.github.io/companion-surface-api/) for the exact
`HIDDevice`, `DiscoveredSurfaceInfo` and `SurfacePluginRemote` definitions. For a real
implementation of both the HID and remote flows, see the
[Elgato Stream Deck module](https://github.com/bitfocus/companion-surface-elgato-stream-deck).
