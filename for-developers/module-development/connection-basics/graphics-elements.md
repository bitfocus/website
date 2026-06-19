---
title: Button Graphics Elements
sidebar_label: Graphics Elements
sidebar_position: 22
description: Reference for the drawing elements used by layered presets and composite elements.
---

:::info
This is a new feature in [API 2.1](../api-changes/v2.1.md) (Companion 5.0+), part of the graphics overhaul.
:::

Companion 5.0 introduces an element-based drawing system for buttons. Instead of describing a button with a single flat style, you can build it up from a stack of **graphics elements** — text, images, boxes, lines, circles, and groups — each positioned and styled independently.

These elements are the building blocks for two things:

- [**Layered presets**](./presets.md#layered-button-presets) — a new preset type that draws its button from a list of elements.
- [**Composite elements**](./composite-elements.md) — reusable drawing components your module defines, which can be used in layered presets and added by users to their own buttons.

This page is the reference for the element types themselves. The two pages above describe how to use them in context.

:::tip
You don't have to use any of this. The [simple preset](./presets.md#simple-button-preset-definitions) style is still fully supported and is the right choice whenever you don't need detailed custom drawing — it is simpler to write and is required for compatibility with Bitfocus Buttons. Reach for graphics elements only when a button genuinely needs richer graphics than a single style can express.
:::

## The coordinate model

A few conventions apply across all elements:

- **Positions and sizes** (`x`, `y`, `width`, `height`, and the line endpoints) are expressed as **percentages from 0 to 100** of the button, not pixels. This keeps your graphics resolution-independent, so they look right regardless of the button's pixel size.
- **Colors** are packed RGB numbers, exactly as elsewhere in Companion — use `combineRgb(255, 255, 255)` or a hex literal like `0xffffff`.
- **Rotation** and angles are in **degrees** (0–359).
- **Opacity** is a percentage from 0 to 100.

## Values and expressions

Almost every property on an element is an _expression-or-value_. There are three ways to write one:

```ts
// A bare value — shorthand for a fixed value
50

// A fixed value (the explicit, wrapped form)
{ isExpression: false, value: 50 }

// An expression, evaluated live on the button
{ isExpression: true, value: '$(my-module:level) * 2' }
```

A bare value is accepted as a shortcut for `{ isExpression: false, value: ... }`, exactly as with the options on actions and feedbacks. Reach for the wrapped form only when you need an expression, or when you want to be explicit.

This is what lets a layered button react to module variables and local variables — any property can be driven by an expression, not just the text.

```ts
{
  type: 'text',
  text: { isExpression: true, value: `$(my-module:channel_1_name)` },
  color: { isExpression: false, value: 0xffffff },
}
```

## Properties common to all elements

Every element shares this set of optional base properties:

| Property  | Type      | Notes                                                                                                                                 |
| --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `id`      | `string`  | A stable id for the element. Required if a feedback needs to target it for a [style override](./presets.md#feedback-style-overrides). |
| `name`    | `string`  | A friendly name shown in the Companion UI element list.                                                                               |
| `enabled` | `boolean` | When `false`, the element is not drawn. Useful when driven by an expression.                                                          |
| `opacity` | `number`  | 0–100. Defaults to fully opaque.                                                                                                      |

Most elements (everything except `line`) also share a set of **bounds**, defining where the element is drawn:

| Property | Type     | Notes            |
| -------- | -------- | ---------------- |
| `x`      | `number` | 0–100, left edge |
| `y`      | `number` | 0–100, top edge  |
| `width`  | `number` | 0–100            |
| `height` | `number` | 0–100            |

Each of these values is an [expression-or-value](#values-and-expressions): pass a bare value for a fixed setting, or the wrapped form to drive it from an expression.

## Element types

Each element is distinguished by its `type` field.

### Text

```ts
{
  type: 'text',
  id: 'label',
  x: { isExpression: false, value: 0 },
  y: { isExpression: false, value: 0 },
  width: { isExpression: false, value: 100 },
  height: { isExpression: false, value: 100 },
  text: { isExpression: true, value: `$(my-module:channel_name)` },
  fontsize: { isExpression: false, value: 20 }, // 3-200, percentage of element height
  fontsizeAllowShrink: { isExpression: false, value: true },
  font: { isExpression: false, value: 'companion-sans' }, // 'companion-sans' | 'companion-mono'
  color: { isExpression: false, value: 0xffffff },
  halign: { isExpression: false, value: 'center' }, // 'left' | 'center' | 'right'
  valign: { isExpression: false, value: 'center' }, // 'top' | 'center' | 'bottom'
  outlineColor: { isExpression: false, value: 0x000000 },
}
```

| Property              | Type        | Notes                                                      |
| --------------------- | ----------- | ---------------------------------------------------------- |
| `text`                | `string`    | The text to draw (required).                               |
| `fontsize`            | `number`    | 3–200, as a percentage of the element height.              |
| `fontsizeAllowShrink` | `boolean`   | Let the text shrink below `fontsize` when too long to fit. |
| `font`                | font family | `'companion-sans'` \| `'companion-mono'`                   |
| `color`               | `number`    | Text color.                                                |
| `halign`              | alignment   | `'left'` \| `'center'` \| `'right'`                        |
| `valign`              | alignment   | `'top'` \| `'center'` \| `'bottom'`                        |
| `outlineColor`        | `number`    | Optional outline color.                                    |
| `rotation`            | `number`    | Degrees 0–359.                                             |

### Image

```ts
{
  type: 'image',
  base64Image: { isExpression: true, value: `$(my-module:thumbnail_base64)` },
  fillMode: { isExpression: false, value: 'fit' }, // 'crop' | 'fill' | 'fit'
  halign: { isExpression: false, value: 'center' },
  valign: { isExpression: false, value: 'center' },
}
```

| Property      | Type               | Notes                                |
| ------------- | ------------------ | ------------------------------------ |
| `base64Image` | `string` \| `null` | A base64-encoded PNG/JPG (required). |
| `fillMode`    | fill mode          | `'crop'` \| `'fill'` \| `'fit'`      |
| `halign`      | alignment          | `'left'` \| `'center'` \| `'right'`  |
| `valign`      | alignment          | `'top'` \| `'center'` \| `'bottom'`  |
| `rotation`    | `number`           | Degrees 0–359.                       |

### Box

A filled and/or stroked rectangle.

```ts
{
  type: 'box',
  x: { isExpression: false, value: 10 },
  y: { isExpression: false, value: 10 },
  width: { isExpression: false, value: 80 },
  height: { isExpression: false, value: 80 },
  color: { isExpression: false, value: 0x222222 }, // fill color
  borderWidth: { isExpression: false, value: 2 },
  borderColor: { isExpression: false, value: 0xff0000 },
}
```

| Property   | Type     | Notes          |
| ---------- | -------- | -------------- |
| `color`    | `number` | Fill color.    |
| `rotation` | `number` | Degrees 0–359. |

Plus the shared [border properties](#border-properties).

### Line

A line segment between two points. The line is drawn using the [border properties](#border-properties) — `borderWidth` is its thickness and `borderColor` its color.

```ts
{
  type: 'line',
  fromX: { isExpression: false, value: 0 },
  fromY: { isExpression: false, value: 0 },
  toX: { isExpression: false, value: 100 },
  toY: { isExpression: false, value: 100 },
  borderWidth: { isExpression: false, value: 3 },
  borderColor: { isExpression: false, value: 0xffffff },
}
```

| Property | Type     | Notes              |
| -------- | -------- | ------------------ |
| `fromX`  | `number` | 0–100, start point |
| `fromY`  | `number` | 0–100, start point |
| `toX`    | `number` | 0–100, end point   |
| `toY`    | `number` | 0–100, end point   |

Note that a line uses its own endpoints rather than the shared `x`/`y`/`width`/`height` bounds.

### Circle

A filled circle, or an arc/pie slice.

```ts
{
  type: 'circle',
  x: { isExpression: false, value: 25 },
  y: { isExpression: false, value: 25 },
  width: { isExpression: false, value: 50 },
  height: { isExpression: false, value: 50 },
  color: { isExpression: false, value: 0x00cc00 },
  startAngle: { isExpression: false, value: 0 },
  endAngle: { isExpression: false, value: 270 },
  drawSlice: { isExpression: false, value: true },
}
```

| Property        | Type      | Notes                                         |
| --------------- | --------- | --------------------------------------------- |
| `color`         | `number`  | Fill color.                                   |
| `startAngle`    | `number`  | Degrees 0–359, for drawing an arc.            |
| `endAngle`      | `number`  | Degrees 0–359, for drawing an arc.            |
| `drawSlice`     | `boolean` | When drawing an arc, close it as a pie slice. |
| `borderOnlyArc` | `boolean` | Only stroke the arc portion of the border.    |

Plus the shared [border properties](#border-properties).

### Group

A group nests other elements together so you can position, rotate, enable/disable, or fade them as one unit. Groups can be nested inside groups.

```ts
{
  type: 'group',
  x: { isExpression: false, value: 0 },
  y: { isExpression: false, value: 50 },
  width: { isExpression: false, value: 100 },
  height: { isExpression: false, value: 50 },
  rotation: { isExpression: false, value: 0 },
  squareCoords: { isExpression: false, value: false },
  children: [
    { type: 'box', /* ... */ },
    { type: 'text', /* ... */ },
  ],
}
```

| Property       | Type      | Notes                                                                       |
| -------------- | --------- | --------------------------------------------------------------------------- |
| `children`     | element[] | The elements inside the group.                                              |
| `rotation`     | `number`  | Degrees 0–359.                                                              |
| `squareCoords` | `boolean` | Constrain children to a centred square (the shorter side) coordinate space. |

### Composite

References one of the reusable [composite elements](./composite-elements.md) your module defines. The `elementId` selects the definition, and `options` provides its input values.

```ts
{
  type: 'composite',
  elementId: 'signal-indicator',
  options: {
    level: { isExpression: true, value: `$(my-module:level)` },
  },
}
```

See [Composite Elements](./composite-elements.md) for how to define these.

## Border properties

The `box`, `line`, and `circle` elements share a common set of border properties:

| Property         | Type     | Notes                                    |
| ---------------- | -------- | ---------------------------------------- |
| `borderWidth`    | `number` | Border thickness. Set to `0` to disable. |
| `borderColor`    | `number` | Border color.                            |
| `borderPosition` | position | `'inside'` \| `'center'` \| `'outside'`  |

## The canvas

A layered preset can optionally describe the base **canvas** the elements are drawn onto, via the `canvas` property. It controls the button's decoration (which replaces the old `show_topbar` toggle) and whether status icons are shown:

```ts
canvas: {
  decoration: { isExpression: false, value: 'topbar' },
  showStatusIcons: { isExpression: false, value: 'default' },
}
```

`decoration` is a [`ButtonGraphicsDecorationType`](https://bitfocus.github.io/companion-module-base/enums/ButtonGraphicsDecorationType.html) and can be one of:

| Value       | Meaning                           |
| ----------- | --------------------------------- |
| `'default'` | Follow the user's global default. |
| `'topbar'`  | Show the top bar.                 |
| `'border'`  | Show a border.                    |
| `'none'`    | No decoration.                    |

`showStatusIcons` is a [`ButtonGraphicsShowStatusIcons`](https://bitfocus.github.io/companion-module-base/enums/ButtonGraphicsShowStatusIcons.html) controlling the status icons drawn in the top-right corner of the button:

| Value       | Meaning                           |
| ----------- | --------------------------------- |
| `'default'` | Follow the user's global default. |
| `'all'`     | Show all status icons.            |
| `'none'`    | Hide status icons.                |

## Further Reading

- [Layered presets](./presets.md#layered-button-presets)
- [Composite Elements](./composite-elements.md)
- [Presets (API 2.x)](./presets.md)
- [Autogenerated docs for `SomeButtonGraphicsElement`](https://bitfocus.github.io/companion-module-base/types/SomeButtonGraphicsElement.html)
- [API 2.1 changes](../api-changes/v2.1.md)
