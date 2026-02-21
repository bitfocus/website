---
title: Setting Custom Variables in Actions
sidebar_label: Setting Custom Variables
sidebar_position: 10
description: How to set custom variables in actions.
---

:::danger

This is an experimental idea, that may be removed without notice.

Consider instead using [value feedbacks](../connection-basics/feedbacks.md#feedback-types) to allow the user to store a feedback into a local variable.

:::

Sometimes, an action can produce a bit of data that the user may want to do something with. In these cases, it doesn't make sense to write it to a variable from your module, as another action on the same button could overwrite it too soon.

Instead, you can output to a custom-variable. To do so, you can add an input field of type ['custom-variable'](https://bitfocus.github.io/companion-module-base/interfaces/CompanionInputFieldCustomVariable.html). The options to this are automatically populated for you.

Then inside your action callback, you can do a call like `this.setCustomVariableValue(action.options.result, 'Your value')` to set the value.

:::note

If the variable id is not valid you will not be informed.

:::

Some additional rules around this:

- Remember that these variables are owned by the user. You should only change them when asked.
- This must be opt-in by the user. The input field will default to 'None', and you must respect that
- You must not set the value of any custom variables at times other than the result of an action
- You must not attempt to discover the custom variables in any way other than the value of this input field.

## Further Reading

- [Actions](../connection-basics/actions.md)
- [Feedbacks](../connection-basics/feedbacks.md)
