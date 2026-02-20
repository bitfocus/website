---
title: 'Preventing Common Bugs with ESLint and Prettier'
sidebar_label: 'Code Quality Configs'
sidebar_position: 4
description: Using prettier and a linter to prevent common bugs.
---

We recommend using [eslint](https://eslint.org/) and [prettier](https://prettier.io/) to improve the readability and uniformity of your code and to prevent easily-overlooked coding errors. The two tools work together to enforces the formatting and coding rules. If you are using an IDE such as VS Code, we recommend installing the prettier plugin. In that plugin you can also enable 'format on save' to automate some of the formatting.

:::important

Our [recommended templates](./file-structure.md) come with eslint and prettier configuration files. The remainder of this page is only necessary for people who are setting up their repo manually or want to upgrade an older module's repo... or if you just want to gain a deeper understanding of the mechanics of these config files.

:::

## Installation

If you are _not_ using the [recommended templates](./file-structure.md), you can configure your module for prettier and eslint as follows:

1. Run `yarn add --dev eslint prettier` in the root folder of your repo to install it as a dev dependency.
2. If you are using TypeScript you will also need to `yarn add --dev typescript-eslint`.
3. Add the line `"prettier": "@companion-module/tools/.prettierrc.json",` to your _package.json_ file.
4. Add the `scripts` block in your `package.json` to include:

```json
"lint:raw": "eslint",
"lint": "yarn lint:raw ."
"format": "prettier -w ."
```

## Prettier config

We recommend adding a `.prettierignore` file too, containing:

```
package.json
pkg
```

You can list other files/folders here that should be ignored. We want to ignore package.json as prettier and yarn disagree on how it should be formatted.

## ESLint config

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

If you have any suggestions on changes to make to this eslint config, do [open an issue](https://github.com/bitfocus/companion-module-tools/issues) to let us know. We hope that this set of rules will evolve over time based on what is and isn't useful to module developers.

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

It is a good idea to setup a GitHub Actions workflow to run the linter, so that you don't get surprised by unexpected linter failures when running it locally.

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

You can follow the steps for [ESLint Config](#eslint-config), with the following extra steps:

Removing any existing `.eslintrc.json` or `.eslintrc.cjs`, you may want to port any custom configuration across to the new config file

That should be it!
