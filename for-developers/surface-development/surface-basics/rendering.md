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
- **`leds`** — a `Uint8Array` of packed RGB colours (3 bytes per segment, so `segments * 3` bytes
  long) for the control's LED strip or ring, if you requested `leds`. See
  [Indicator LEDs](#indicator-leds) below.
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

An addressable strip or ring of LEDs belonging to a control — an encoder's ring, a T-bar's LEDs —
is declared with `leds` on that control's [style preset](./layout.md), and arrives as the `leds`
draw prop. A gauge on the button drives it, and Companion samples the gauge down to one colour per
segment for you:

```typescript
if (drawProps.leds) {
  for (let i = 0; i < segments; i++) {
    const color = readLedColor(drawProps.leds, i)
    await this.device.setEncoderColor(control.encoderIndex, i, color)
  }
}
```

`readLedColor(buffer, index)` is exported from `@companion-surface/base`. For monochrome LEDs,
`colorToIntensity(color)` flattens a colour to a single `0`–`255` value.

LEDs that aren't attached to a control at all — standalone status lights — are instead modelled as
**output transfer variables** rather than draws; see [Input & variables](./input.md).

See the [generated reference](https://bitfocus.github.io/companion-surface-api/) for the exact
`SurfaceDrawProps` and pixel formats, and the
[Elgato Stream Deck module](https://github.com/bitfocus/companion-surface-elgato-stream-deck) for
real image handling.
