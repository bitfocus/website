---
title: Custom Discovery Flows
sidebar_label: Custom Discovery
sidebar_position: 2
description: Active scanning and plugin-owned detection for non-HID surfaces.
---

The [common discovery flows](../surface-basics/discovery.md) — USB HID and remote/network — cover
most hardware. For surfaces that don't fit either, the API provides two more mechanisms. Reach for
these only when the common flows don't work.

## Active scan: `scanForSurfaces`

Some surfaces aren't USB HID devices, so they won't be picked up by Companion's USB hotplug
watcher. When there's no hotplug notification for your device, implement `scanForSurfaces()` on your
plugin to look for them on demand; Companion calls it (for example when the user triggers a scan)
and you return the devices you found:

```typescript
async scanForSurfaces() {
	const ports = await listSerialPorts()
	return ports
		.filter(isMyDevice)
		.map((port) => ({
			surfaceId: port.serialNumber,
			deviceHandle: port.path, // stable handle used to re-identify the device between scans
			description: 'My Serial Surface',
			pluginInfo: { path: port.path },
		}))
}
```

Each result is a `DetectionSurfaceInfo` — like the HID `DiscoveredSurfaceInfo`, but with an extra
**`deviceHandle`**: a stable identifier (a serial path, etc.) Companion uses to recognise the same
physical device between scans. Companion then calls
[`openSurface()`](../surface-basics/the-surface-instance.md) for the ones it wants.

This is the right flow for **serial-port** surfaces. See the
[Loupedeck module](https://github.com/bitfocus/companion-surface-loupedeck) for a real serial-port
implementation.

## Plugin-owned detection: `SurfacePluginDetection`

When a device or its vendor library insists on running its _own_ detection (for example a wireless
dongle that surfaces appear and disappear behind), implement the `detection` property — an
`EventEmitter` that:

- emits **`surfacesAdded`** as devices appear and **`surfacesRemoved`** as they go (emitting
  `surfacesRemoved` is important — it releases the unique id reserved for that device),
- implements **`triggerScan()`** to refresh when the user asks for a rescan, and
- implements **`rejectSurface()`** to release resources for a surface Companion chose not to open.

```typescript
class MyDetection extends EventEmitter<SurfacePluginDetectionEvents<MyDeviceInfo>> /* … */ {
  private onDeviceArrived(dev) {
    this.emit('surfacesAdded', [
      {
        surfaceId: dev.serial,
        deviceHandle: dev.handle,
        description: 'My Surface',
        pluginInfo: {
          /* … */
        },
      },
    ])
  }
  async triggerScan() {
    /* ask the library to re-enumerate */
  }
  rejectSurface(info) {
    /* release resources for this surface */
  }
}
```

:::note
This mechanism is discouraged where avoidable — the built-in [HID](../surface-basics/discovery.md)
and `scanForSurfaces` abstractions exist to reduce the cost of scanning. Use `detection` only when
the hardware or library gives you no choice. As with all discovery, **don't emit events before
`init()`** has run.
:::

See the [generated reference](https://bitfocus.github.io/companion-surface-api/) for the exact
`SurfacePluginDetection` and `DetectionSurfaceInfo` definitions.
