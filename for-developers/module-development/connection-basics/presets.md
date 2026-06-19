---
title: Module Preset Definitions (API 2.x)
sidebar_label: Presets (API 2.x)
sidebar_position: 20
description: Module presets definition details.
---

:::info
This describes the current state of presets, as overhauled in [API 2.0](../api-changes/v2.0.md) and extended in [API 2.1](../api-changes/v2.1.md).  
If your module is using an older API version, you want the [old presets page](./presets-1.x.md).
:::

Presets are a description of ready-made buttons that will be presented to the user in the Presets tab on the Buttons page.
The user can then drag-and-drop the preset onto the button-grid, to build out config quickly without having to code it from scratch.

## API call: `setPresetDefinitions()`

In order to add presets to a module, you call `this.setPresetDefinitions(presetsStructure, presetsDefinitions)` much like how you define actions and feedbacks. However for presets you define your presets and a structure defining the layout separately. This allows for a lot more flexibility, and to reduce a lot of repetition

:::tip
Make sure you call this after the `this.setActionDefinitions()` and `this.setFeedbackDefinitions()` calls.
If you do it before, the variable replacement will be incomplete, and you will get errors in the logs about the missing action and feedback definitions.
:::

## Preset types

There are two types of preset:

- [Simple Button Preset](https://bitfocus.github.io/companion-module-base/interfaces/CompanionSimplePresetDefinition.html) (`type: "simple"`) — a button described by a single flat style. This is the default, and covers most use cases.
- [Layered Button Preset](https://bitfocus.github.io/companion-module-base/interfaces/CompanionLayeredButtonPresetDefinition.html) (`type: "layered"`) — new in [API 2.1](../api-changes/v2.1.md), a button drawn from a stack of [graphics elements](./graphics-elements.md) for richer, detailed graphics.

:::tip
We recommend continuing to use **simple** presets whenever possible. They are easier to write, and are required for compatibility with Bitfocus Buttons. Only reach for a [layered preset](#layered-button-presets) when a button genuinely needs the detailed drawing it offers.
:::

:::info
In API 1.x, there used to be a 'text' preset type too. That has been replaced with the new [structure](#preset-structure) object.
:::

## Simple button preset definitions

This preset type is referred to the 'simple' preset as it offers a bit less flexibility than the other preset types, but is intended to be easier to write while still covering most use cases.

Let's start with a minimal example preset button:

```javascript
const presets = {}
presets[`my_first_preset`] = {
  type: 'simple',
  name: `My button`, // A name for the preset. Shown to the user when they hover over it, and used when using the searchbox
  style: {
    // This is the minimal set of style properties you must define
    text: `$(my-module:some-variable)`, // You can use variables from your module here
    size: 'auto',
    color: 0xffffff, // or combineRgb(255, 255, 255),
    bgcolor: 0x000000, // or combineRgb(0, 0, 0),
  },
  steps: [
    {
      down: [
        {
          // add an action on down press
          actionId: 'my-action',
          options: {
            // options values to use
            brightness: 100,
          },
        },
      ],
      up: [],
    },
  ],
  feedbacks: [], // You can add some presets from your module here
}
const structure = [
  {
    id: 'section-main',
    name: 'Main',
    definitions: ['my_first_preset'],
  },
]
this.setPresetDefinitions(structure, presets)
```

### Actions

The `steps` property is where the magic happens. This describes what the action will do when pressed. In the typical case a button will have a single step, which will give the behaviour of a normal button.  
You can make a latching button by defining a second step which does something different. By default, each time the button is released it will shift to the next step, this can be disabled by setting `options: { stepAutoProgress: false }` for the preset.

You can add as many steps as you like, and build a button which runs through a whole cue list by simply pressing it. There are internal actions that a user can use to change the step manually, and since [API 2.1](../api-changes/v2.1.md) a small set of these can also be used directly in your presets — see [Internal actions and feedbacks in presets](#internal-actions-and-feedbacks-in-presets).

Tip: You can build a preset for a rotary encoder by defining `rotate_left` and `rotate_right` actions on each step of your button:

```ts
steps: [
  {
    down: [],
    up: [],
     rotate_left: [
      {
        actionId: 'my-action',
        options: { },
      },
    ],
    rotate_right: [
      {
        actionId: 'my-action',
        options: { },
      },
    ],
  },
],
```

To define a duration group with a specific delay, you can set additional values inside a step with the delay in milliseconds as the key. This should contain the same structure as the `up` and `down` lists. See the example below as a reference:

```ts
steps: [
  {
    down: [],
    up: [],
    // Duration group that gets executed 2s after button release
    2000: {
      // Execute the actions after 2s while the button is held or only after it is released
      options: { runWhileHeld: true },
      actions: [{
        actionId: 'my-action',
        options: { },
      }],
    },
  },
],
```

Each action defined can also have a `delay` property specified (in milliseconds).

:::tip

You can "simulate" an `internal:wait` action by adding the property `delay:` (in ms) to any action definition.
This will cause it to execute _after_ the delay, and is converted internally to `internal:wait`.

:::

### Feedbacks

The `feedbacks` property allows you to define style changes using feedbacks from your module.

These look similar to actions, but a little different:

```javascript
feedbacks: [
  {
    feedbackId: 'my-feedback',
    options: {
      channel: 1,
    },
    style: {
      // The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
      color: combineRgb(255, 255, 255),
      bgcolor: combineRgb(255, 0, 0),
    },
  },
]
```

The feedbackId should match a feedback you have defined, and the options should contain the parameters as you defined as the options.

### Local Variables

You can also set a `localVariables` property to create some local variables on the button. These make it easier to use a value across the actions, feedbacks and style without repeating it.  
By doing this, it becomes much easier for the user to change it if needed. This also allows for better reusing one preset within the preset structure with [the templating groups](#template-groups).

There are two kinds of local variable:

- **`simple`** — a fixed value, set once at startup. Intended as a single place to define a value that is used in several places on the button.
- **`feedback`** — new in [API 2.1](../api-changes/v2.1.md), a value driven _live_ by the result of one of your module's feedbacks. The feedback's evaluated value is exposed under the variable name, so it can be referenced from expressions anywhere on the button — without the user having to wire it up themselves. This pairs especially well with [value feedbacks](./feedbacks.md#value-feedbacks).

An example of each:

```javascript
localVariables: [
  {
    // This 'simple' type translates to the `internal: User variable` inside companion
    variableType: 'simple',
    variableName: 'input',
    startupValue: 1,
  },
  {
    // This 'feedback' type is driven live by one of your module's feedbacks
    variableType: 'feedback',
    variableName: 'current_level',
    feedbackId: 'get-level', // one of your module's feedbacks
    options: { channel: 1 },
  },
],
```

You can then reference these variables like normal variables elsewhere in your presets:

```javascript
  style: {
    text: `$(local:output)`,
  },
  steps: [
  ],
  feedbacks: [
    {
      feedbackId: 'my-feedback',
      options: {
        channel: { isExpression: true, value: `$(local:output)` }, // Confused? Check the 'Using Expressions' section
      },
      style: {
        // The style property is only valid for 'boolean' feedbacks, and defines the style change it will have.
        color: combineRgb(255, 255, 255),
        bgcolor: combineRgb(255, 0, 0),
      },
    },
  ],
```

### Using Expressions

Since API 2.0, most fields in your actions and feedbacks will support expressions (except for the ones which you set `disableAutoExpressions: true` to opt out of this behaviour).

Not only can the user define these expressions, but you can do so in your presets too.

For example:

```javascript
feedbacks: [
  {
    feedbackId: 'my-feedback',
    options: {
      value1: 1, // You can define plain values like before
      value2: { isExpression: false, value: 1 }, // Or wrap it if that is easier
      value3: { isExpression: true, value: `$(local:output) + 1` }, // If it is an expression it must be wrapped
    },
    style: { ... },
  },
],
```

When the action or feedback is executed, the expressions will have been precomputed, with the computed value provided directly to you.

## Internal actions and feedbacks in presets

Since [API 2.1](../api-changes/v2.1.md), your presets can reference a small, reserved set of Companion's built-in **internal** actions and feedbacks alongside your module's own, using `internal:*` ids. Companion translates each of these to the matching internal action/feedback when the preset is imported onto a control, resolving any references (such as the button location) to the control the preset is placed on.

The internal **actions** available in presets are:

- **`internal:wait`** — `{ time: number }` — wait for an amount of time (ms)
- **`internal:customLog`** — `{ message: string }` — write a message to the Companion log
- **`internal:abortButton`** — `{ skipReleaseActions?: boolean }` — abort the actions currently running on this button
- **`internal:localVariableSet`** — `{ name: string; value: string }` — set one of this button's local variables

The internal **feedbacks** available in presets are:

- **`internal:checkExpression`** — `{ expression: string }` — boolean, driven by an expression
- **`internal:buttonPushed`** — `{ treatSteppedAsPressed?: boolean }` — boolean, true while the button is pressed
- **`internal:buttonCurrentStep`** — `{ step: number }` — boolean, true when the button is on the given step

In addition, you can use the logic/flow **building blocks**, which nest other actions or conditions via named `children` groups:

- **`internal:actionGroup`** — `{ executionMode?: 'inherit' | 'concurrent' | 'sequential' }`, children: `{ default: actions }`
- **`internal:logicIf`** — children: `{ condition: conditions; actions; elseActions? }`
- **`internal:logicWhile`** — children: `{ condition: conditions; actions }`
- **`internal:logicOperator`** (feedback) — `{ operation: 'and' | 'or' | 'xor' }`, children: `{ default: conditions }`

```ts
;[
  {
    down: [
      {
        actionId: 'my-recall',
        options: { preset: 1 },
      },
      {
        actionId: 'internal:wait',
        options: { time: 500 },
      },
      {
        actionId: 'internal:logicIf',
        options: {},
        children: {
          condition: [
            {
              feedbackId: 'internal:checkExpression',
              options: { expression: '$(this:step) == 1' },
            },
          ],
          actions: [
            {
              actionId: 'internal:customLog',
              options: { message: 'On first step' },
            },
          ],
        },
      },
    ],
    up: [],
  },
]
```

:::info
All of these require a module built against API 2.1 (`2.1.0` or newer). The host drops, with a warning, any internal preset entry that the module is too old to use, so the catalog can grow in future API versions without older modules being able to emit ids they predate.
:::

## Layered button presets

A `layered` preset is a new preset type in [API 2.1](../api-changes/v2.1.md). Instead of a single flat `style`, it draws its button from a stack of [graphics elements](./graphics-elements.md) — text, images, boxes, lines, circles and groups, plus any [composite elements](./composite-elements.md) your module defines.

:::tip
Layered presets are for cases where you need detailed, custom drawing that a single style cannot express. For everything else, prefer a [simple preset](#simple-button-preset-definitions) — they are easier to write and are required for compatibility with Bitfocus Buttons.
:::

A minimal layered preset looks like this:

```javascript
presets[`my_layered_preset`] = {
  type: 'layered',
  name: `Channel meter`,
  elements: [
    {
      type: 'text',
      id: 'label',
      x: { isExpression: false, value: 0 },
      y: { isExpression: false, value: 0 },
      width: { isExpression: false, value: 100 },
      height: { isExpression: false, value: 40 },
      text: { isExpression: true, value: `$(my-module:channel_1_name)` },
      color: { isExpression: false, value: 0xffffff },
    },
    {
      type: 'box',
      id: 'bar',
      x: { isExpression: false, value: 10 },
      y: { isExpression: false, value: 50 },
      width: { isExpression: false, value: 80 },
      height: { isExpression: false, value: 40 },
      color: { isExpression: false, value: 0x00cc00 },
    },
  ],
  // Optional: describe the base canvas (eg the top bar)
  canvas: {
    decoration: { isExpression: false, value: 'topbar' },
  },
  steps: [
    {
      down: [{ actionId: 'my-action', options: { channel: 1 } }],
      up: [],
    },
  ],
  feedbacks: [],
}
```

The `steps` and `localVariables` properties work exactly as they do for [simple presets](#simple-button-preset-definitions), including [internal actions](#internal-actions-and-feedbacks-in-presets) and [feedback-driven local variables](#local-variables). The drawing elements (and the `canvas`) are documented in full on the [Graphics Elements](./graphics-elements.md) page. The one part that differs is how feedbacks apply their styling.

### Feedback style overrides

A simple preset's boolean feedbacks carry a single `style` object that overrides the whole button. A layered preset is made of many independent elements, so instead its feedbacks declare **per-element style overrides**: each override targets a specific element (by its `id`) and a specific property on that element, and replaces it while the feedback is active.

```javascript
feedbacks: [
  {
    feedbackId: 'channel-active',
    options: { channel: 1 },
    styleOverrides: [
      {
        elementId: 'bar', // the `id` of the element to change
        elementProperty: 'color', // the property on that element
        override: { isExpression: false, value: 0xff0000 },
      },
    ],
  },
],
```

This is why elements you want a feedback to change should be given a stable `id`.

:::tip
When overriding a property that is fed by an **advanced** feedback, set the `override` to indicate which property it provides, eg `{ isExpression: false, value: 'color' }`.
:::

## Preset Structure

In the API 2.0, we now expect you to provide a separate structure alongside the presets to define how they should be arranged within the UI.

A minimal example of this:

```javascript
const structure = [
  {
    id: 'section-main',
    name: 'Main',
    description: 'The things you usually want',
    definitions: ['my_first_preset', 'my_second_preset'], // This should match the keys when setting them on the `presets` object
  },
]
```

In this example, there is a single section containing just 2 presets. This is a very basic presentation, but matches what most modules were doing before API 2.0.

### Simple Groups

You can get a bit more structure to how your presets are displayed by using some groups inside each section:

```javascript
const structure = [
  {
    id: 'section-main',
    name: 'Main',
    description: 'The things you usually want',
    definitions: [
      {
        id: 'main-1',
        type: 'simple',
        name: 'First',
        description: 'A second line of text',
        presets: ['my_first_preset', 'my_second_preset'], // This should match the keys when setting them on the `presets` object
      },
      {
        id: 'main-2',
        type: 'simple',
        name: '',
        presets: ['my_first_preset', 'my_third_preset'], // You can repeat presets within the structure if needed
      },
    ],
  },
]
```

These groups will separate out each list of presets into their own blocks, with headings and an optional description between each of them.

This allows for much more organisation of presets than before, without creating hundreds of sections/categories.

However, this is still a pretty manual and repetitive way of defining presets. For many, they could use some [templating](#template-groups)

:::tip
If you were using the 'text' preset type previously, these groups will help you create the same effect and are just a bit more formalised.
:::

### Template Groups

In a lot of modules, they have many channels/outputs/inputs or some other resource where presets are identical except for one number varying between them.

A simple matrix/video router module, will commonly produce a preset for each input+output combination, to quickly route each input to each output. This can often produce 100s or 1000s of presets which are almost identical.  
In some cases, this has caused issues due to the size of the data produced being a performance drain and occasionally making the modules crash on lower powered machines

Instead, groups in the new structure can be defined as 'template' groups. This templating, allows for overriding local variables you defined on the presets with different values.

An example template group:

```javascript
{
  id: `route_to_1`,
  name: `To Output 1`,
  type: 'template',
  presetId: 'route_output',

  // define which variable to override, and the values to use
  templateVariableName: 'input',
  templateValues: [
    // Tip: the name will override the 'name' field of the preset itself
    { name: `Input 1 to Output 1`, value: 1 },
    { name: `Input 2 to Output 1`, value: 2 },
  ],

  // Optionally, define a fixed override for other variables
  commonVariableValues: {
    output: 1,
  },
}
```

Using the preset:

```javascript
presets[`route_output`] = {
  name: `Input X to Output Y`,
  type: 'simple',
  style: {
    text: `$(videohub:input_$(local:input))`,
    size: '18',
    color: 0xffffff,
    bgcolor: 0x000000,
  },
  feedbacks: [
    {
      feedbackId: 'input_bg',
      style: {
        bgcolor: 0xffff00,
        color: 0x000000,
      },
      options: {
        input: { isExpression: true, value: '$(local:input)' },
        output: { isExpression: true, value: '$(local:output)' },
      },
    },
  ],
  steps: [
    {
      down: [
        {
          actionId: 'route',
          options: {
            source: { isExpression: true, value: '$(local:input)' },
            destination: { isExpression: true, value: '$(local:output)' },
            ignore_lock: false,
          },
        },
      ],
      up: [],
    },
  ],
  localVariables: [
    {
      variableType: 'simple',
      variableName: 'input',
      startupValue: 0,
    },
    {
      variableType: 'simple',
      variableName: 'output',
      startupValue: 0,
    },
  ],
}
```

In this way, you can use one `route_output` preset as a template for hundreds of combinations inside the Companion UI, with a much much lower cost.

As a bonus, these variables also make it easier for users to adjust which input or output is used later if they need to, without finding the correct preset again.

## TypeScript typings

When using typescript, if you strongly type your [actions](./actions.md#typescript-typings) and [feedbacks](./feedbacks.md#typescript-typings) as explained in their respective pages, then in your presets, the API will expect your presets to also be typed as `CompanionPresetDefinitions<MyTypes>`.

These types get propagated through to the actions and feedback properties on the presets, ensuring that they are also strongly typed. This will help you ensure that your usage of the actions and feedbacks in your presets match the definitions you have created

## Standard Colors

Below are some color profiles for typical action and/or feedback combinations we recommend.

| Color  | RGB Value | Text color | Usage                                                                                |
| ------ | --------- | ---------- | ------------------------------------------------------------------------------------ |
| RED    | 0xff0000  | 0x000000   | STOP,HALT,BREAK,KILL and similar terminating functions + Active program on switchers |
| GREEN  | 0x00ff00  | 0xffffff   | TAKE,GO,PLAY, and similar starting functions. + Active Preview on switchers          |
| YELLOW | 0xffff00  | 0x000000   | PAUSE,HOLD,WAIT and similar holding functions + active Keyer on switchers            |
| BLUE   | 0x0000ff  | 0xffffff   | Active AUX on switchers                                                              |
| PURPLE | 0xff00ff  | 0xffffff   | Presets that need user configuration after they have been dragged onto a button      |

## Icons

It is possible to use almost any unicode character or emoji within button text.

Some common ones are listed below (you can copy and paste the glyph directly into your code), or find more. [emojipedia](https://emojipedia.org/) can help you find one suitable for what you need, but we recommend keeping it simple and letting the user change it themselves.

| Glyph | Hex Code | font size | Usage                     |
| ----- | -------- | --------- | ------------------------- |
| ⏵     | 23F5     | 44        | Play,Start,Go, TAKE       |
| ⏹     | 23F9     | 44        | Stop, Halt, Break, KILL   |
| ⏸     | 23F8     | 44        | Pause, Hold, Wait         |
| ⏯    | 23EF     | 44        | Toggle Play/Pause         |
| ⏺     | 23FA     | 44        | Rec, Save, Store          |
| ⏭    | 23ED     | 44        | Next, Skip, FWD           |
| ⏮    | 23EE     | 44        | Previous, Back, Rev       |
| ⏩    | 23E9     | 44        | Fast FWD, Shuttle Fwd     |
| ⏪    | 23EA     | 44        | Fast Rewind , Shuttle rev |
| ⏏️    | 23CF     | 44        | Eject, Unload             |
| 🔁    | 1F501    | 44        | Loop, Cycle               |
| ❄︎     | 2744     | 44        | Freeze                    |
| ⬆️    | 2B06     | 44        | Up                        |
| ↗️    | 2197     | 44        | Up Right                  |
| ➡️    | 27A1     | 44        | Right                     |
| ↘️    | 2198     | 44        | Down Right                |
| ⬇️    | 2B07     | 44        | Down                      |
| ↙️    | 2199     | 44        | Down Left                 |
| ⬅️    | 2B05     | 44        | Left                      |
| ↖️    | 2196     | 44        | Up Left                   |
| 🔀    | 1F500    | 44        | Transition                |
| 🔇    | 1F507    | 44        | Mute                      |
| 🔈    | 1F508    | 44        | Unmute                    |
| ⏻     | 23FB     | 44        | Power Toggle              |
| ⏾     | 23FE     | 44        | Power Sleep               |
| ⏽     | 23FD     | 44        | Power On                  |
| ⏼     | 23FC     | 44        | Power Off                 |
| 😱    | 1F631    | 44        | Panic                     |

## Further Reading

- [Graphics Elements](./graphics-elements.md) — the drawing elements used by layered presets
- [Composite Elements](./composite-elements.md) — reusable drawing components
- [Presets for Module API 1.x](./presets-1.x.md)
- [Autogenerated docs for the module `InstanceBase` class](https://bitfocus.github.io/companion-module-base/classes/InstanceBase.html)
- [API Overview](./overview.md)
- [User-configuration management](./user-configuration.md)
- [Actions](./actions.md)
- [Feedbacks](./feedbacks.md)
- [Variables](./variables.md)
