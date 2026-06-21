---
title: Locking and Pincode Entry
sidebar_label: Locking & Pincode
sidebar_position: 17
description: Declaring a pincode map and handling the locked state.
---

Companion can lock surfaces, requiring a pincode before the surface can be used. **Every surface is
expected to handle this** — it's part of the core surface experience, not an advanced extra. You
declare how pincode entry works through the `pincodeMap` field of
[`registerProps`](./the-surface-instance.md).

## Pincode maps

There are three kinds of pincode map:

- **`single-page`** — the digits `0`–`9` are mapped to control ids, plus an optional `pincode`
  control. Companion drives the lock screen for you using these controls.

  ```typescript
  pincodeMap: {
  	type: 'single-page',
  	pincode: '0/0',
  	0: '1/0', 1: '1/1', 2: '1/2', 3: '1/3', 4: '1/4',
  	5: '2/0', 6: '2/1', 7: '2/2', 8: '2/3', 9: '2/4',
  }
  ```

- **`multiple-page`** — for surfaces with too few buttons to show all digits at once; adds a
  `nextPage` control and an array of `pages`.

- **`custom`** — for surfaces that present their own pincode UI. Companion won't lay the digits out
  for you; instead you implement `showLockedStatus()` on your [surface instance](./the-surface-instance.md).

Set `pincodeMap` to `null` to disable pincode entry entirely.

## The locked state

While a surface is locked, Companion shows the lock screen instead of the normal grid. You can read
the current state from `context.isLocked`.

If you used the **`custom`** map, implement `showLockedStatus(locked, characterCount)`: show your
lock UI when `locked` is true (using `characterCount` to indicate how many digits have been
entered), and return to normal [rendering](./rendering.md) when it becomes false. The
[input](./input.md) you report while locked is what lets the user type their code.

See the [generated reference](https://bitfocus.github.io/companion-surface-api/) for the full
`SurfacePincodeMap` definitions.
