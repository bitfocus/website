---
title: 'Formatting Code with Prettier'
sidebar_label: 'Code Formatting'
sidebar_position: 3
description: Enabling prettier to format your code
---

We recommend setting up code formatting for your module. This helps with the readability of code. It is completely optional.

We use [prettier](https://prettier.io/) to format the Companion code, and you can do the same. `@companion-module/tools` provides a config preset that you can use, but you are also welcome to use your own or a different tool. Be aware that by using a different tool, it will be harder for contributors to format any contributions.

To configure your module for prettier, add the line `"prettier": "@companion-module/tools/.prettierrc.json",` to your package.json.
You should also add `"format": "prettier -w ."` to the `scripts` block, so that you can run `yarn format` to format all the code

We recommend adding a `.prettierignore` file too, containing:

```
package.json
pkg
```

You can list other files/folders here that should be ignored. We want to ignore package.json as prettier and yarn disagree on how it should be formatted.

:::tip

If you use VS Code, you can install the prettier plugin, and enable 'format on save'. This means you never have to worry about triggering a format as it will be done for you! Many other code editors will have similar plugins available.

:::