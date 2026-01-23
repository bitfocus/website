---
title: 'Preventing Common Bugs with ESLint'
sidebar_label: 'Code Linting'
sidebar_position: 4
description: Using a linter to prevent common bugs.
---

We recommend using [eslint](https://eslint.org/) to lint your code. This can find some easily overlooked but common bugs in your code, among other things.

### @companion-module/tools v2.x

If you are upgrading your config from v1.x, you will need to reconfigure eslint, due to changes in both eslint and how the tools library provides config templates.

Start by removing any existing `.eslintrc.json` or `.eslintrc.cjs`, if they exist.

Then add the needed libraries `yarn add --dev eslint prettier`. If you are using typescript you will also need to `yarn add --dev typescript-eslint`.

Update the `scripts` block in your `package.json` to include:

```js
"lint:raw": "eslint",
"lint": "yarn lint:raw ."
```

You can now run `yarn lint` and see any linter errors. If you need any help understanding the errors or warnings you are given, the eslint docs are really helpful.

A new basic config should be called `eslint.config.mjs`, and could contain:

```js
import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

export default generateEslintConfig({})
```

If using typescript, you should specify a `typescriprRoot`

```js
import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

export default generateEslintConfig({
	enableTypescript: true,
})
```

You can easily override rules in this setup with:

```js
import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const baseConfig = await generateEslintConfig({
	enableTypescript: true,
})

const customConfig = [
	...baseConfig,

	{
		rules: {
			'n/no-missing-import': 'off',
			'node/no-unpublished-import': 'off',
		},
	},
]

export default customConfig
```

Tip: You can set it up so that git runs the linter when you make a commit, so you can be sure that only good code is committed. Take a look at xxxxx for an example of how to setup husky & lint-staged to achieve this.

If you have any suggestions on changes to make to this eslint config, do [open an issue](https://github.com/bitfocus/companion-module-tools/issues) to let us know. We hope that this set of rules will evolve over time based on what is and isnt useful to module developers.

### @companion-module/tools v1.x

To configure it, create a file called `.eslintrc.cjs` with the contents:

```js
module.exports = require('@companion-module/tools/eslint/index.cjs')({})
```

Note: This changed in v1.3.0 of `@companion-module/tools`, if you are using an older version you will need to update it first

and to the `scripts` block in your `package.json` add:

```js
"lint:raw": "eslint --ext .ts --ext .js --ignore-pattern dist --ignore-pattern pkg",
"lint": "yarn lint:raw ."
```

You can now run `yarn lint` and see any linter errors. If you need any help understanding the errors or warnings you are given, the eslint docs are really helpful.

There are some options that can be defined to customise the provided configuration:

```js
module.exports = require('@companion-module/tools/eslint/index.cjs')({
	// Enable support for jest globals in test files
	enableJest: false,
	// Enable support for typescript
	enableTypescript: false,
})
```

You are free to override any rules you wish in your `.eslintrc.cjs`, these steps will give you our recommended (and rather strict) configuration preset.

:::tip

 You can set it up so that git runs the linter when you make a commit, so you can be sure that only good code is committed. (I believe this is done in the latest templates?) Take a look at xxxxx for an example of how to setup husky & lint-staged to achieve this.

:::

If you have any suggestions on changes to make to this eslint config, do [open an issue](https://github.com/bitfocus/companion-module-tools/issues) to let us know. We hope that this set of rules will evolve over time based on what is and isnt useful to module developers.
