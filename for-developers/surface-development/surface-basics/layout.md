---
title: Declaring the Surface Layout
sidebar_label: Layout
sidebar_position: 14
description: Describing a surface's controls and what should be drawn to them.
---

Each device you [open](./the-surface-instance.md) declares a **layout** (the `surfaceLayout` field
of `registerProps`). The layout tells Companion two things: the **controls** the device has and
where they sit on a grid, and the **style** each control needs drawn — a bitmap of a given size, a
background colour, and/or text.

A layout has two parts: a set of named **style presets** (one called `default` is required), and a
map of **controls**:

```typescript
const myLayout = {
	stylePresets: {
		// Required. Used for any control that doesn't name its own preset.
		default: {
			bitmap: { w: 72, h: 72, format: 'rgb' },
		},
		// Optional extra presets, referenced by name from a control below.
		encoder: {
			text: true,
			colors: 'hex',
		},
	},
	controls: {
		// Ids are typically "row/column". Companion maps these onto its button grid.
		'0/0': { row: 0, column: 0 },
		'0/1': { row: 0, column: 1 },
		'0/2': { row: 0, column: 2, stylePreset: 'encoder' },
	},
}
```

## Style presets

A preset describes what Companion should produce for a control:

- **`bitmap: { w, h, format }`** — request a rendered image of this pixel size. `format` is one of
  `rgb`, `rgba`, `bgr`, `bgra` (default `rgb`). This is what most button surfaces use.
- **`colors: 'hex' | 'rgb'`** — request a background colour instead of (or alongside) a bitmap,
  for buttons with a plain RGB backlight.
- **`text` / `textStyle`** — request button text (and text styling) for text-only displays.

Whatever you request here is what arrives in `draw()` — see [Rendering](./rendering.md). Get the
bitmap dimensions right: the resolution you declare is the resolution of the images you'll be
given.

## Controls

Each control has a `row` and `column` (zero-based) and an optional `stylePreset` naming one of your
presets. The control id (the map key) should be unique and is typically `row/column`; it is the
`controlId` you'll see in [draw](./rendering.md) and [input](./input.md) calls.

The full schema (including pixel formats and style options) is in the
[generated reference](https://bitfocus.github.io/companion-surface-api/). For a device that
describes several different models, see the
[Elgato Stream Deck module](https://github.com/bitfocus/companion-surface-elgato-stream-deck).
