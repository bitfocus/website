---
title: 'manifest.json Config'
sidebar_label: 'manifest.json file'
sidebar_position: 2
description: Specification of the Companion manifest file
---

Starting with Companion 3.0, Companion looks at the `companion/manifest.json` file for module information (before 3.0 it looked at `package.json`) This provides a companion specific and programming language agnostic manifest about your module. In the future this will allow us to do more powerful things!

You can see the auto-generated documentation for this file as a typescript interface [here](https://bitfocus.github.io/companion-module-base/interfaces/ModuleManifest.html).

Tip: At any point you can validate your `manifest.json` by running `yarn companion-module-check`.

### Format

If you are comfortable reading or working with JSON Schema, you can find the formal definition [here](https://github.com/bitfocus/companion-module-base/blob/main/assets/manifest.schema.json)

A full manifest definition is:

```json
{
  "id": "fake-module",
  "name": "fake module",
  "shortname": "fake",
  "description": "Fake Module",
  "manufacturer": "Fake Module",
  "products": ["Fake"],
  "keywords": ["Fake"],
  "version": "0.0.0",
  "license": "MIT",
  "repository": "git+https://github.com/bitfocus/companion-module-fake-module.git",
  "bugs": "https://github.com/bitfocus/companion-module-fake-module/issues",
  "maintainers": [
    {
      "name": "Your name",
      "email": "your.email@example.com"
    }
  ],
  "legacyIds": [],
  "runtime": {
    "type": "node22",
    "api": "nodejs-ipc",
    "apiVersion": "0.0.0",
    "entrypoint": "../dist/index.js"
  }
}
```

### Properties

- `id` unique id of your module. This has to match the repository name excluding the `companion-module-`
- `name` ???
- `shortname` ???
- `description` ???
- `manufacturer` ???
- `products` An array of strings with the names of the products supported by your module. Often there is only a single product or sometimes the name of a series of products is better known than the products itself, then it is also good to give the series name. Your module will be listed with all associated product names.
- `keywords` Keywords to allow users to more easily find your module by searching, please do not repeat the manufacturer or product names here.
- `version` Version of your module. This should be left as `0.0.0`, the build process populates with the value in your `package.json`
- `license` License of your module code. This needs to be something MIT compatible to be allowed to be distributed with the official builds
- `repository` Git URL to the repository
- `bugs` URL to the issue tracker. Users can follow this link to report bugs
- `maintainers` List of maintainers of this module.
- `legacyIds` (Optional) List of old module ids. If the module has been renamed, the old names should be listed here to allow for seamless upgrading of old configs
- `runtime` This defines the runtime requirements of your module. Described more below

The runtime block is defined as:

- `type` This can be either `node18` or `node22`, depending on the required version of Node.js. In the future this may allow for other languages to be used.
- `api` This must be `nodejs-ipc`. It defines the protocol used between your module and Companion. In the future more options will be possible, to allow for other languages.
- `apiVersion` This should be left as `0.0.0`, the build process populates with the correct value
- `entrypoint` The main javascript file for your module. This is what companion will execute to start your module.
