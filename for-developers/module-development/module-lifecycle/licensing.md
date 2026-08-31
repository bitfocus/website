---
title: 'Licensing a Companion Module'
sidebar_label: 'License a module'
sidebar_position: 2
description: The licensing rules for module source and distribution, and how MIT and GPL modules are handled.
---

A module has **two** licenses, and they are not the same thing:

- The `license` in your **`package.json`** is the license of the code _you_ wrote.
- The `license` in your **`companion/manifest.json`** is the license the _packaged_ module is distributed under.

They are separate because a build bundles your code together with all of its dependencies, so the manifest license has to be one that the whole bundled blob can be shipped under, while your own source can stay under a simpler license.

## Your source must be MIT

The `license` in `package.json` **must be `MIT`**.

Keeping every module's source under MIT means code can be shared freely between modules and kept up to date as common patterns and fixes emerge, without licensing getting in the way. This is a hard requirement for modules distributed with the official builds.

:::note
This is the current policy. If you have a strong reason to use a different license for your source, reach out on the [`#module-development` Slack channel](https://bfoc.us/ke7e9dqgaz) — we are willing to hear justifications for other options.
:::

## Prefer fully MIT-compatible modules

We prefer modules to be **completely MIT compatible**, including all of their dependencies. This keeps the whole module — source and packaged build alike — freely reusable, and lets you declare `MIT` in your manifest.

Before pulling in a dependency, check that its license (and the licenses of _its_ dependencies) are MIT compatible.

## Opting into GPL distribution

Sometimes the best library for the job is licensed under the GPL. A module can **opt into being distributed as GPL** by declaring a matching SPDX license in its `companion/manifest.json`. This allows it to bundle a matching GPL-licensed library.

The supported values for the manifest `license` field are:

- **`MIT`** — recommended, as it can use the most of npm.
- **`GPL-2.0-only`**
- **`GPL-3.0-only`**

Importantly, **your own source stays MIT even when a dependency is copyleft.** If you bundle a GPL-3.0 dependency, your source stays MIT while the manifest declares `GPL-3.0-only`, because that is what the combined package must be distributed as. Anyone reusing your source on its own still gets it under MIT.

## How licenses are validated

The build and check commands (`yarn companion-module-build` and `yarn companion-module-check`) validate every bundled and external dependency against the license declared in your manifest. If a dependency's license is not compatible, the command fails.

If you need to work around a validation failure temporarily, or are making a private module, pass `--ignore-license-rules` to report license problems as warnings instead of failing the command.

## Packages with missing licenses

Some npm packages omit their license information — declaring no license in their `package.json`, or none at all — so the tooling has nothing to check against. For these, we maintain a short list of confirmed licenses the `@companion-module/tools` package. A license that a package declares itself always takes precedence over this list.

If you hit a package that is missing a valid license, open a PR to add it to that list once you have confirmed the license it actually publishes, or reach out on the [`#module-development` Slack channel](https://bfoc.us/ke7e9dqgaz) and we will help work through it.

## Further reading

- [manifest.json Config](../module-setup/manifest.json.md) — where the manifest `license` field is defined
- [Packaging a Companion Module](./module-packaging.md)
- [companion-module-tools](https://github.com/bitfocus/companion-module-tools/) — the source of truth for these rules
