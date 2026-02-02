---
title: Companion 3.3 (API 1.8)
sidebar_position: -33
---

### Text presets

A new 'text' preset type has been added, to allow you to put some headings and blocks of text into the presets panel.

These will also split the presets into chunks around them, allowing you to organise presets better.

### Local variables support

:::tip

Newer versions of the API, replace this with newer ways of achieving the same result. Only follow this if you can't update to those

:::

Companion has added a few variables under the `$(this:XX)` naming. (Since this release, user defined `$(local:XX)` also exist, which need the same support)

Due to the way the `parseVariablesInString` method works, Companion often doesn't know what button a string is being parsed for, so can't support variables scoped to a single button.

In order to support these, in your action/feedback callback, there is a second `context` parameter which holds an alternate `parseVariablesInString` implementation. This implementation is specific to that callback, so Companion knows what control it belongs to, and can handle the variables.  
Additionally, you can indicate that you are doing this and support these variables by setting the `useVariables` property to an object like `{ local: true }` to indicate this support. This allows us to show a hint to the user about this support, and suggest them whilst they type.

### Shared UDP Listener

A few devices have been found which are not cooperative when it comes to control, and expect to send all messages to a hardcoded UDP port.  
This makes it hard to support these, as by default only one connection can listen on a port at a time.

To help with this, Companion offers some Shared UDP listener utils, where Companion will open and manage the port for you, and you can simply receive all messages sent to it.
