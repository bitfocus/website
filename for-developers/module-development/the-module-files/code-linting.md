---
title: 'Preventing Common Bugs with ESLint'
sidebar_label: 'Code Linting'
sidebar_position: 4
description: Using a linter to prevent common bugs.
---

We recommend using [eslint](https://eslint.org/) to lint your code. This can find some easily overlooked but common bugs in your code, among other things.

This also requires you to be using [code formatting](./code-formatting.md), as the linter enforces that the formatting is followed.

## Setup

Install the needed tools `yarn add --dev eslint prettier`. If you are using typescript you will also need to `yarn add --dev typescript-eslint`.

Add the `scripts` block in your `package.json` to include:

```js
"lint:raw": "eslint",
"lint": "yarn lint:raw ."
```

A new basic config should be called `eslint.config.mjs`, and could contain:

```js
import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

export default generateEslintConfig({})
```

If using typescript, you should specify a `typescriptRoot`

```js
import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

export default generateEslintConfig({
	enableTypescript: true,
})
```

You can now run `yarn lint` and see any linter errors. If you need any help understanding the errors or warnings you are given, the eslint docs are really helpful.

:::note

If you have any suggestions on changes to make to this eslint config, do [open an issue](https://github.com/bitfocus/companion-module-tools/issues) to let us know. We hope that this set of rules will evolve over time based on what is and isnt useful to module developers.

:::

### Enabling linting on commit

You can set it up so that git runs the linter when you make a commit, so you can be sure that only good code is committed.

Install the needed tools `yarn add --dev lint-staged husky`.

Add the `scripts` block in your `package.json` to include:

```json
"postinstall": "husky",
```

And a block to the `package.json`:

```json
"lint-staged": {
	"*.{css,json,md,scss}": [
		"run prettier"
	],
	"*.{ts,tsx,js,jsx}": [
		"run lint:raw"
	]
},
```

Create a file `.husky/pre-commit` with the content `yarn lint-staged`

Run `yarn husky` to ensure husky is initialised.

### Running the linter on push

It is a good idea to setup a Github Actions workflow to run the linter, so that you don't get surprised by unexpected linter failures when running it locally.

To do this, create a new file in the repository at `.github/workflows/lint.yaml`, with the content:

```yaml
name: Lint

on:
  push:
    branches:
      - '**'
    tags:
      - 'v[0-9]+.[0-9]+.[0-9]+*'
  pull_request:

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - uses: actions/checkout@v6
      - name: Use Node.js 22.x
        uses: actions/setup-node@v6
        with:
          node-version: 22.x
      - name: Prepare Environment
        run: |
          corepack enable
          yarn install
          yarn build
        env:
          CI: true
      - name: Run lint
        run: |
          yarn lint
        env:
          CI: true
```

:::tip

Make sure to set the correct nodejs version in the workflow

:::

## Customising the rules

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

## Upgrading to @companion-module/tools v2.x

If you are upgrading your config from v1.x, you will need to reconfigure eslint, due to changes in both eslint and how the tools library provides config templates.

You can follow the steps for [#setup], with the following extra steps:

Removing any existing `.eslintrc.json` or `.eslintrc.cjs`, you may want to port any custom configuration across to the new config file

That should be it!
