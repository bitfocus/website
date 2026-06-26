---
title: Firmware Updates
sidebar_label: Firmware Updates
sidebar_position: 3
description: Reporting available firmware updates for a surface.
---

If your hardware can report its firmware version and you know where newer firmware lives, you can
let Companion surface that to the user. This is optional — implement
`checkForFirmwareUpdates()` on your [surface instance](../surface-basics/the-surface-instance.md)
only if it applies to your device.

Companion calls it with a small cache helper and expects either update info or `null`:

```typescript
async checkForFirmwareUpdates(versionsCache) {
	// fetchJson is shared/cached across all surfaces, so several devices of the same
	// type don't each hit the network.
	const latest = await versionsCache.fetchJson('https://example.com/my-surface/firmware.json')

	if (compareVersions(this.currentFirmware, latest.version) >= 0) {
		return null // already up to date
	}

	return {
		updateUrl: 'https://example.com/my-surface/update', // where to send the user to update
	}
}
```

The current API points the user at an `updateUrl` to perform the update themselves; the actual
update process is whatever your hardware and that page require.

:::warning Use the provided cache for fetches
We strongly encourage using the supplied `SurfaceFirmwareUpdateCache.fetchJson()` (and the other
caching/util helpers) for any version lookups, rather than fetching directly. This check runs at
startup and again whenever surfaces connect and on an interval, so without caching a user with
several of your surfaces can generate a burst of duplicate requests.
:::

See the [generated reference](https://bitfocus.github.io/companion-surface-api/) for the
`SurfaceFirmwareUpdateInfo` and `SurfaceFirmwareUpdateCache` definitions.
