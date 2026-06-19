---
title: Composite Elements
sidebar_label: Composite Elements
sidebar_position: 23
description: Define reusable drawing components that can be used in layered presets and by users on their own buttons.
---

:::info
This is a new feature in [API 2.1](../api-changes/v2.1.md) (Companion 5.0+), part of the graphics overhaul.
:::

A **composite element** is a reusable drawing component that your module defines, built up from the [graphics elements](./graphics-elements.md). Think of it as a named, parameterised piece of button artwork — for example a "signal indicator", a "VU meter", or a "channel strip" — that bundles up a group of elements and exposes a few options to configure it.

Once defined, a composite element can be:

- referenced from your [layered presets](./presets.md#layered-button-presets), and
- added by users to their **own** buttons through the Companion UI, just like any of the built-in elements.

This makes composite elements the structured, reusable replacement for the old "produce a bitmap in an advanced feedback" pattern. Instead of returning an opaque image buffer, you describe the graphics declaratively, and Companion draws them — keeping your graphics logic encapsulated, configurable by the user, and resolution-independent.

## API call: `setCompositeElementDefinitions()`

You register composite elements much like actions and feedbacks, by calling [`this.setCompositeElementDefinitions({ ... })`](https://bitfocus.github.io/companion-module-base/classes/InstanceBase.html#setcompositeelementdefinitions). The argument is an object keyed by element id.

```ts
this.setCompositeElementDefinitions({
  'signal-indicator': {
    type: 'composite',
    name: 'Signal Indicator',
    description: 'A coloured dot that turns green when a signal is present',
    options: [
      {
        id: 'level',
        type: 'number',
        label: 'Level',
        default: 0,
        min: 0,
        max: 100,
      },
    ],
    elements: [
      {
        type: 'circle',
        x: { isExpression: false, value: 25 },
        y: { isExpression: false, value: 25 },
        width: { isExpression: false, value: 50 },
        height: { isExpression: false, value: 50 },
        // The element can read the composite's own options as local variables
        color: {
          isExpression: true,
          value: `$(options:level) > 0 ? 65280 : 16711680`, // green when present, otherwise red
        },
      },
    ],
  },
})
```

## Definition fields

Each composite element definition has the following fields:

| Property      | Type                  | Notes                                                                                                                    |
| ------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `type`        | `'composite'`         | Always `'composite'`.                                                                                                    |
| `name`        | `string`              | The name shown in the Companion elements list.                                                                           |
| `sortName`    | `string` _(optional)_ | An alternate value to sort by, without changing the visible `name`.                                                      |
| `description` | `string` _(optional)_ | A longer description of the element.                                                                                     |
| `options`     | input fields[]        | The user-configurable input fields, the same shape as feedback options. See [Input Field Types](./input-field-types.md). |
| `elements`    | element[]             | The [graphics elements](./graphics-elements.md) that make up the component.                                              |

The `options` you define are made available to the element expressions as local variables (referenced as `$(options:<id>)`), so a composite can react to its own configuration.

## Using a composite element

### In a layered preset

Reference a composite from a layered preset's `elements` array using the `composite` element type, selecting it by `elementId` and supplying its `options`:

```ts
elements: [
  {
    type: 'composite',
    elementId: 'signal-indicator',
    options: {
      level: { isExpression: true, value: `$(my-module:input_1_level)` },
    },
  },
],
```

### By the user

Composite elements your module defines also appear in the Companion UI, so users can drop them onto their own buttons and fill in the options themselves — no preset required.

## Validation

Composite element definitions (and layered preset data) are strictly validated when Companion receives them. An invalid definition produces a clear warning in the [module debug log](./logging.md) rather than silently corrupting button graphics, so keep an eye on the log while developing.

## TypeScript typings

As with actions and feedbacks, when you strongly type your module you can declare the schemas for your composite elements. This propagates through to your [layered presets](./presets.md#layered-button-presets), so that references to a composite (its `elementId` and `options`) are type-checked against the definition.

## Further Reading

- [Graphics Elements](./graphics-elements.md)
- [Layered presets](./presets.md#layered-button-presets)
- [Input Field Types](./input-field-types.md)
- [Logging](./logging.md)
- [API 2.1 changes](../api-changes/v2.1.md)
