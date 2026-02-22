---
title: Module Input Field Types
sidebar_label: Input Fields (Options)
sidebar_position: 18
description: Module input field types and definition details.
---

Companion has a standardised set of input fields usable across [action](./actions.md), [feedback](./feedbacks.md), or [user-config](./user-configuration.md) definitions.  
There are some small differences in what is available where, documented here.

## Option types

When defining actions, feedbacks and module config definitions, the object includes a property called `options:` that takes a list of input-field definitions. For example,

```javascript
{
    action1: {
        name: 'My First Action',
        description: 'a bit more detail',
        options: [
            {
                type: 'number',
                label: 'Source',
                id: 'source',
                default: 1,
            },
            {
                type: 'dropdown',
                id: 'camera',
                label: 'Select Camera',
                choices: [
                    { id: 'a', label: 'Camera A' },
                    { id: 'b', label: 'Camera B' },
                ],
                default: 'a',
            },
        ],
        callback: (event) => {
            // report the user-selected options:
            console.log(JSON.stringify(event.options))
        }
    }
}
```

All the types are described in the auto-generated [api documentation](https://bitfocus.github.io/companion-module-base/), linked below. Unfortunately it is only possible to view the documentation for the latest version of `@companion-module/base`, but we do our best to clarify when things were added inside the documentation.

There are some [common properties](https://bitfocus.github.io/companion-module-base/interfaces/CompanionInputFieldBase.html) across every type of input. Each type can also take additional properties as documented:

- [Static Text](https://bitfocus.github.io/companion-module-base/interfaces/CompanionInputFieldStaticText.html) `type: 'static-text'`
- [Text](https://bitfocus.github.io/companion-module-base/interfaces/CompanionInputFieldTextInput.html) `type: 'textinput'`
- [Color Picker](https://bitfocus.github.io/companion-module-base/interfaces/CompanionInputFieldColor.html) `type: 'colorpicker'`
- [Dropdown](https://bitfocus.github.io/companion-module-base/interfaces/CompanionInputFieldDropdown.html) `type: 'dropdown'`
- [Multi Dropdown](https://bitfocus.github.io/companion-module-base/interfaces/CompanionInputFieldMultiDropdown.html) `type: 'multidropdown'`
- [Checkbox](https://bitfocus.github.io/companion-module-base/interfaces/CompanionInputFieldCheckbox.html) `type: 'checkbox'`
- [Number](https://bitfocus.github.io/companion-module-base/interfaces/CompanionInputFieldNumber.html) `type: 'number'`

Actions also accept:

- [Custom Variable](https://bitfocus.github.io/companion-module-base/interfaces/CompanionInputFieldCustomVariable.html) `type: 'custom-variable'`

User-Config options also accept:

- [Bonjour Device](https://bitfocus.github.io/companion-module-base/interfaces/CompanionInputFieldBonjourDevice.html) `type: 'bonjour-device'`
- [Input Field Secret](https://bitfocus.github.io/companion-module-base/interfaces/CompanionInputFieldSecret.html) `type: 'secret-text'`

## Further Readings

It is possible that there are some new field types not linked to in the list above. You can discover these in the 'Hierarchy' section of [the `CompanionInputFieldBase` doc page](https://bitfocus.github.io/companion-module-base/interfaces/CompanionInputFieldBase.html), or for the specific uses: Here's a starting point for [action input fields](https://bitfocus.github.io/companion-module-base/types/SomeCompanionActionInputField.html), for [feedback input fields](https://bitfocus.github.io/companion-module-base/types/SomeCompanionFeedbackInputField.html) and for [user-config input fields](https://bitfocus.github.io/companion-module-base/types/SomeCompanionConfigField.html)

### Topics mentioned here:

- [Actions](./actions.md)
- [Feedbacks](./feedbacks.md)
- [User-config](./user-configuration.md)
- [Bonjour Device Discovery](../connection-advanced/bonjour-device-discovery.md)
- [Custom Variables](../connection-advanced/setting-custom-variables.md)
