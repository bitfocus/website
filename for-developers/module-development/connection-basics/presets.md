---
title: Module Preset Definitions
sidebar_label: Presets
sidebar_position: 20
description: Module presets definition details.
---

Presets are a description of ready-made buttons that will be presented to the user in the Presets tab on the Buttons page.
The user can then drag-and-drop the preset onto the button-grid, without having to code it from scratch.

## API call: `setPresetDefinitions()`

In order to add presets to a module, you call `this.setPresetDefinitions(presetsDefinitions)`much like how you define actions and feedbacks.

## Preset types

Companion currently defines two types of presets

- [Button Presets](https://bitfocus.github.io/companion-module-base/interfaces/CompanionButtonPresetDefinition.html) (`type: "button"`)
- [Text Presets](https://bitfocus.github.io/companion-module-base/interfaces/CompanionTextPresetDefinition.html) (`type: "text"`)

For the most part you will be defining button presets. See the linked documentation, above, for text presets.

## Button preset definitions

Presets are placed into categories, which show up as separate groups in the Companion admin UI. Other than that,
the property-names for the button preset definition correspond to the nomenclature on the button definitions.

The only tricky part is that action-lists are nested inside steps, so you don't explicitly write "step 1", but rather the
steps are determined by positions in the steps array. Inside the element of the array, the press action-list is labeled `down:`; the release action-list is labeled `up:`, see the [Actions section](#actions), below for additional options.

The basic structure looks like:

```ts
   steps: [
    { // step 1
       up: [...],
       down: [...],
    }
    { // step 2
       up: [...],
       down: [...],
    }
   ]
```

Let's start with a minimal example preset button:

```javascript
const presets = {}
presets[`my_first_preset`] = {
	type: 'button',
	category: 'Test', // This groups presets into categories in the ui. Try to create logical groups to help users find presets
	name: `My button`, // A name for the preset. Shown to the user when they hover over it
	style: {
		// This is the minimal set of style properties you must define
		text: `$(my-module:some-variable)`, // You can use variables from your module here
		size: 'auto',
		color: combineRgb(255, 255, 255),
		bgcolor: combineRgb(0, 0, 0),
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
this.setPresetDefinitions(presets)
```

### Configuring a preset

There is [generated documentation](https://bitfocus.github.io/companion-module-base/interfaces/CompanionButtonPresetDefinition.html) detailing all of the properties that can be set for presets.

In addition to the minimal example shown above there are more properties that can be set.

You can see the full list of values that can be set and their valid values in the `style` object [here](https://bitfocus.github.io/companion-module-base/interfaces/CompanionButtonStyleProps.html)

Additionally, there are some behaviour options that can be set in the `options` object [described here](https://bitfocus.github.io/companion-module-base/interfaces/CompanionButtonPresetOptions.html)

### Actions

The `steps` property is where the magic happens. This describes what the action will do when pressed. This used to be defined with `actions` and `release_actions`, but it has been restructured in 3.0 to give some new functionality.

In 2.x it was possible to latch buttons, that has been removed and replaced with steps. In the typical case a button will have a single step, which will give the behaviour of a normal button.
You can make a latching button by defining a second step which does something different. By default, each time the button is released it will shift to the next step, this can be disabled by setting `options: { stepAutoProgress: false }` for the preset. This likely isnt very useful right now, due to it not being possible to use internal actions in presets.

You can add as many steps as you like, and build a button which runs through a whole cue list by simply pressing it. There are internal actions that which a user can use to change the step manually.

Tip: You can build a preset for a rotary encoder by setting `options: { rotaryActions: true }`, and defining `rotate_left` and `rotate_right` actions on each step of your button:

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

Each action inside of the `steps` property can also have a `delay` property specified (in milliseconds).

:::tip

You can "simulate" an `internal:wait` action by adding the property ` delay:` (in ms) to any action definition.
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

## Standard Colors

Below are some color profiles for typical action and/or feedback combinations we recommend.

| Color  | RGB Value | Text color | Usage                                                                                |
| ------ | --------- | ---------- | ------------------------------------------------------------------------------------ |
| RED    | 255,0,0   | White text | STOP,HALT,BREAK,KILL and similar terminating functions + Active program on switchers |
| GREEN  | 0,204,0   | White text | TAKE,GO,PLAY, and similar starting functions. + Active Preview on switchers          |
| YELLOW | 255,255,0 | Black text | PAUSE,HOLD,WAIT and similar holding functions + active Keyer on switchers            |
| BLUE   | 0,51,204  | White text | Active AUX on switchers                                                              |
| PURPLE | 255,0,255 | White text | Presets that need user configuration after they have been dragged onto a button      |

## Icons

There are some icons you can use that are part of the fonts.

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

- [Autogenerated docs for the module `InstanceBase` class](https://bitfocus.github.io/companion-module-base/classes/InstanceBase.html)
- [API Overview](./overview.md)
- [User-configuration management](./user-configuration.md)
- [Actions](./actions.md)
- [Feedbacks](./feedbacks.md)
- [Variables](./variables.md)
- [Presets](./presets.md)
