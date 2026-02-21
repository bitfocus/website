---
title: Migrating Legacy Feedbacks to Boolean Feedbacks
sidebar_label: Migrating to Boolean Feedbacks
sidebar_position: 10
description: How to set up migrate legacy feedbacks to boolean feedbacks.
---

## Why update your feedbacks?

Since Companion v3, most feedbacks are best defined as 'boolean' feedbacks, as they give the user more flexibility and will end up with a more consistent interface.

Previously, it was up to the module author to decide what properties a feedback should change. This tended to limit feedbacks to changing the background and text colour. But what if the user wants to change a png, or the text? They could ask for that to be possible, but that would likely require the module author to duplicate the feedback with different style options.

With boolean feedbacks, the module author simply has to make the feedback be a true or false value, and the user can decide what style properties that should change.

A side-benefit of using boolean feedbacks is that they can be used as conditions in the triggers system.

## Steps to migrate to boolean feedbacks

The process may involve a bit of work, but it is pretty straightforward.

### 1. Update feedback definitions

The feedback definitions need updating to the new style.  
From:

```javascript
feedbacks['set_source'] = {
    type: 'advanced',
    name: 'Brief description of the feedback here',
    description: 'Longer description of the feedback',
    options: [{
        type: 'colorpicker',
        label: 'Foreground color',
        id: 'fg',
        default: combineRgb(0, 0, 0)
    }, {
        type: 'colorpicker',
        label: 'Background color',
        id: 'bg',
        default: combineRgb(255, 0, 0)
    }, {
        type: 'number',
        label: 'Source'
        id: 'source',
        default: 1
    }],
    callback: (feedback) => {
        if (this.currentSource == feedback.options.source) {
            return {
                bgcolor: feedback.options.bg,
                color: feedback.options.fg,
            }
        }
    },
}
```

To:

```js
feedbacks['set_source'] = {
  type: 'boolean', // Change this
  name: 'Brief description of the feedback here',
  description: 'Longer description of the feedback',
  defaultStyle: {
    // Move the values from options to here
    color: combineRgb(0, 0, 0),
    bgcolor: combineRgb(255, 0, 0),
  },
  // remove the old style properties from options
  options: [
    {
      type: 'number',
      label: 'Source',
      id: 'source',
      default: 1,
    },
  ],
  callback: (feedback) => {
    // Update this to return the boolean value you used to use to decide to return the style object
    return this.currentSource == feedback.options.source
  },
}
```

### 2. Update presets

Any presets defined in the module will need to be updated to match the changes in the definition

From:

```js
{
    type: 'press',
    category: `Category description`,
    name: `Button description`,
    style: {
        ...
    },
    feedbacks: [
        {
            feedbackId: 'set_source',
            options: {
                bg: combineRgb(0, 255, 0),
                fg: combineRgb(255, 255, 255),
                input: src.id,
                mixeffect: me,
            },
        },
    ],
    actions: [
       ...
    ],
}
```

To:

```js
{
    type: 'press',
    category: `Category description`,
    name: `Button description`,
    style: {
        ...
    },
    feedbacks: [
        {
            feedbackId: 'set_source',
            options: {
                input: src.id,
                mixeffect: me,
            },
            style: {
                bgcolor: combineRgb(0, 255, 0),
                color: combineRgb(255, 255, 255),
            }
        },
    ],
    actions: [
       ...
    ],
}
```

### 3. Add an upgrade script

Users will have feedbacks assigned to buttons already, and these will all need updating to the new format. A helper has been added to help with this.

Quick tip: The script will only be run once, if you want to force it to be run again locally, (Pending, this step has changed) to force all the upgrade scripts to be rerun. Make sure to _not_ commit that line

```js
const upgradeToBooleanFeedbacks = CreateConvertToBooleanFeedbackUpgradeScript({
  set_source: true,
  set_output: true,
  // List as many feedback types as you like
})

runEntrypoint(MyInstance, [myOtherUpgradeScript, upgradeToBooleanFeedbacks])
```

This script will handle moving the options properties across to the style object for you.
It handles the most common cases of property naming, which may not match what your module does.  
If this is the case, you can customise the behaviour by providing more details:

```js
CreateConvertToBooleanFeedbackUpgradeScript({
  set_source: {
    bg: 'bgcolor',
    fg: 'fgcolor',
  },
})
```

### 4. Test it

Make sure to test it all thoroughly, then you are done!

Feel free to ask on slack if you have any questions, or anything here doesn't make sense.

### Further Reading

- [Upgrade Scripts](../connection-basics/upgrade-scripts.md)
- [Feedbacks](../connection-basics/feedbacks.md)
