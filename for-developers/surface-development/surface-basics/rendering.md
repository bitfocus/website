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

LEDs require `@companion-surface/base` v1.4 — see the [changelog](../api-changes/v1.4.md#leds), and
check `supportsLeds` on the host capabilities before declaring them.

### Gamma correction

Don't send the colours to the hardware unchanged. Companion's colours are perceptually encoded
(sRGB-ish), the same as any button graphic, while most LEDs are driven linearly — so a raw
passthrough makes the top of the range look flat, with 70% and 100% nearly indistinguishable, and
wastes the bottom of the range.

Correct for this with a gamma curve. Build a lookup table once, rather than calling `Math.pow()` per
segment on every draw:

```typescript
const LED_GAMMA = 2.5 // customise this
const LED_GAMMA_LUT = new Uint8Array(256)
for (let i = 0; i < 256; i++) {
  LED_GAMMA_LUT[i] = Math.round(255 * Math.pow(i / 255, LED_GAMMA))
}

// then, per segment:
const color = readLedColor(drawProps.leds, i)
await this.device.setEncoderColor(control.encoderIndex, i, {
  r: LED_GAMMA_LUT[color.r],
  g: LED_GAMMA_LUT[color.g],
  b: LED_GAMMA_LUT[color.b],
})
```

The right exponent is a property of your hardware, not of Companion: it depends on whether the
driver is PWM or current-controlled, whether it applies a curve of its own, and how the LEDs
themselves behave. Start around `2.2` (the sRGB-ish value) and tune by eye — sweep a gauge slowly
across the whole range and check that the steps look evenly spaced.

:::tip
If your LED driver has more than 8 bits of resolution, apply the curve into that wider range instead
of back into 8 bits. An 8-bit result loses a lot of precision at the dark end, where many input
values collapse onto the same output.
:::

LEDs that aren't attached to a control at all — standalone status lights — are instead modelled as
**output transfer variables** rather than draws; see [Input & variables](./input.md).

See the [generated reference](https://bitfocus.github.io/companion-surface-api/) for the exact
`SurfaceDrawProps` and pixel formats, and the
[Elgato Stream Deck module](https://github.com/bitfocus/companion-surface-elgato-stream-deck) for
real image handling.
