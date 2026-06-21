---
title: Rendering, Brightness and LEDs
sidebar_label: Rendering
sidebar_position: 15
description: Drawing what Companion pushes, plus brightness and clearing the display.
---

Companion does the drawing. It renders each control according to the user's configuration and
pushes the result to your [surface instance](./the-surface-instance.md) for the matching control.
Your job is to put that onto the hardware — you don't draw button graphics yourself.

## `draw`

`draw(signal, drawProps)` is called whenever a control changes. What `drawProps` contains depends
on what you asked for in that control's [style preset](./layout.md):

- **`controlId`** — which control this is (the id from your layout).
- **`image`** — a `Uint8Array` of pixels, in the size and format you requested via `bitmap`.
- **`color`** — a hex background colour, if you requested `colors`.
- **`text`** — button text, if you requested `text`.
- **`pageNumber`** — the Companion page the surface is on, where applicable.

```typescript
async draw(signal: AbortSignal, drawProps) {
	if (signal.aborted) return

	const control = this.layoutLookup.get(drawProps.controlId)
	if (!control) return

	if (drawProps.image) {
		await this.device.fillKeyBuffer(control.keyIndex, drawProps.image)
	} else if (drawProps.color) {
		await this.device.fillKeyColor(control.keyIndex, drawProps.color)
	}
}
```

The `signal` is an `AbortSignal` that fires if the draw is superseded before you finish — check it
and bail out early on slow hardware so you don't draw stale frames.

Because Companion pushes finished output, you generally don't need to track button state yourself —
render what you're given, when you're given it.

## Brightness and clearing

Two related methods round out output:

- **`setBrightness(percent)`** — `0`–`100`. Only called if you set `brightness: true` in
  [`registerProps`](./the-surface-instance.md).
- **`blank()`** — set all pixels to black/off, e.g. on shutdown.

## Indicator LEDs

LEDs that aren't part of the button grid (status lights, encoder rings, a T-bar's LEDs) are modelled
as **output transfer variables** rather than draws — see [Input & variables](./input.md).

See the [generated reference](https://bitfocus.github.io/companion-surface-api/) for the exact
`SurfaceDrawProps` and pixel formats, and the
[Elgato Stream Deck module](https://github.com/bitfocus/companion-surface-elgato-stream-deck) for
real image handling.
