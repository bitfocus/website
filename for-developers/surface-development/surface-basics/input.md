---
title: Reporting Input and Variables
sidebar_label: Input & Variables
sidebar_position: 16
description: Sending button, encoder and other input back to Companion via SurfaceContext.
---

The other half of a surface is input. When the user interacts with the hardware, you report it back
to Companion through the **`SurfaceContext`** you were given in
[`openSurface()`](./the-surface-instance.md). Hold onto that context in your surface instance.

## Button and encoder events

Map each physical control to its [layout](./layout.md) `controlId`, then call the matching context
method:

```typescript
// In your device's event handlers:
this.context.keyDownById('0/2') // press
this.context.keyUpById('0/2') // release
// or, if your hardware only signals a single "click":
this.context.keyDownUpById('0/2')

// Encoders / rotary controls:
this.context.rotateLeftById('0/2')
this.context.rotateRightById('0/2')
```

Report both down and up where the hardware distinguishes them — many user configurations rely on
press-and-hold behaviour.

## Page changing

If your surface drives page changes itself (for example a swipe gesture), enable it by setting
`canChangePage` in [`registerProps`](./the-surface-instance.md) and call `context.changePage(forward)`.
The user must opt in to this in the surface settings before Companion accepts it.

## Transfer variables

Buttons aside, surfaces often have non-button values to exchange — a T-bar position, a battery
level, or LEDs next to a control. These are modelled as **transfer variables**, declared in
`registerProps.transferVariables`. Values the surface produces are sent with
`context.sendVariableValue(name, value)`; values the surface consumes arrive via your instance's
`onVariableValue(name, value)` method. See the
[generated reference](https://bitfocus.github.io/companion-surface-api/) for the exact direction
semantics of `input` vs `output` variables.

How these show up for the user is worth knowing:

- For values the surface **produces** (e.g. a T-bar), the user can store the value into a Companion
  custom variable and then use it however they like.
- For values the surface **consumes** (e.g. an LED), the user provides a Companion expression that
  drives the value, and Companion pushes the result to your surface.

## Configuration fields

If your surface needs user configuration, define `configFields` in `registerProps` using the
standard Companion input field types (`textinput`, `dropdown`, `number`, `checkbox`,
`static-text`). Companion renders them and calls your instance's `updateConfig(config)` when they
change. These are the same field definitions used by connection modules — see
[Input Field Types](../../module-development/connection-basics/input-field-types.md) for the field
shapes (note surfaces support a subset).

For a worked example of translating raw HID input into Companion events, see the
[Elgato Stream Deck module](https://github.com/bitfocus/companion-surface-elgato-stream-deck).
