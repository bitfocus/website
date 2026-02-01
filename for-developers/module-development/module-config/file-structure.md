---
title: 'File Structure Overview'
sidebar_label: 'Essential Files'
sidebar_position: 1
description: Introduction to the file structure of a Companion module repository
---

When creating a new module, we strongly recommend using our

- [TypeScript module template](https://github.com/bitfocus/companion-module-template-ts)

as this will incorporate the latest module features and improvements. For those who prefer Javascript, we also have a [JavaScript template](https://github.com/bitfocus/companion-module-template). To get an idea of how a completed module looks, search for an existing module that may provide services similar to your equipment, or refer to reference modules such as [homeassistant-server](https://github.com/bitfocus/companion-module-homeassistant-server) (TypeScript) and [generic-osc](https://github.com/bitfocus/companion-module-generic-osc) (JavaScript).

Below are the minimum files necessary to create a control module for Companion (aka Connection). You can add subfolders and other support files as needed.

:::tip

All of these files, and more, are included in the templates mentioned above. Using the templates will save you time in setting
things up and even more time by making sure the essential content has been included correctly -- especially for the package.json file!

The templates also include sample source code to get you started programming the module's functionality.

:::

### File Structure

The essential repository structure includes the source code (in _src_ here), libraries that are automatically loaded by yarn (in _node_modules_) and a number of configuration files as follows:

```text
├───companion
│   ├── HELP.md
│   └── manifest.json
├───node_modules
├───src
│   ├── main.ts
│   ├── actions.ts  (these files are all optional but recommended)
│   ├── feedbacks.ts
│   ├── presets.ts
│   ├── upgrades.ts
│   └── variables.ts
│
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

### companion/HELP.md

A structured 'Help' document that Companion users will see when clicking on the module help icon in the Connections page.

Describe the module's capabilities and anything else they might need to know to use the module.

Format the contents using [markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).

### companion/manifest.json

Provides information to Companion about the module. See the [manifest.json](./manifest.json.md) page for full details.

### node_modules folder

When you run `yarn install`, yarn reads the _package.json_ file and installs or updates all of the listed dependencies into the _node_modules_ folder. (It will create this folder if it doesn't already exist.)

At a minimum, for Companion modules, it should install @companion-module/base and @companion-module/tools

### src/main.ts (or main.js, for the JavaScript template)

This main entrypoint for the module. The file and folder can be called something else, as long as the `"runtime": { "entrypoint": }` field in `companion/manifest.json` and the `"main":` field in `package.json` are updated to match. (Older JavaScript repos skip the subdirectory altogether, though this is no longer recommended.)

Generally you will create additional source-code files for each major module element: actions, feedback, presets, variables, user-configurations and upgrade scripts. (These files are already present in the template modules mentioned above.)

:::note

When TypeScript is "transpiled" into JavaScript, the code in `src/` is used to generate a `dist/` folder containing the corresponding JavaScript code. In a TypeScript repo, the manifest and package.json files therefore refer to the `dist/` folder even though your development code is in the `src/` folder. (But note that `dist/` is _not_ part of the git repository and must be listed in .gitignore file.)

:::

### .gitignore

This is a standard Git file that lists files and folders to be excluded from Git version control. `node_modules/` should always be included in the `.gitignore` as should `dist/` in TypeScript modules.

### LICENSE

Companion is an MIT licensed project. We recommend modules released with the project are also MIT, and are open to other licenses being used if there is a good reason for it.

In the future it might be possible to use different licenses for modules, but that is not yet certain.

:::important

Consult the Companion team if you wish to incorporate a dependency that does not have an MIT license.

:::

### package.json

This is a standard node.js file to tell it about your project. It is required to be able to install dependencies to your module such as [@companion-module/base and  and @companion-module/tools](../module-lifecycle/companion-module-library.md).

### README.md

This file should include any relevant developer documentation that the Companion Core and Module Development teams should be aware of, as well as any helpful information for people who wish to fork and contribute. It is only shown on github and when editing the module, so can be reasonably technical.

As with the HELP.md file, you can format it with markdown.

### Additional files for good practices

In addition to the essential files we recommend several other files that help enforce good coding practices.
These files are all included in the templates recommended above and are discussed on separate pages of this section.

- [Code Quality Enforcement](./code-quality.md): prettier and eslint configuration
- [TypeScript configuration](./typescript-config.md) if you are using TypeScript (as recommended)
- [Unit Testing Setup](./unit-testing.md) (there's not much there..)

## Next steps

- Set up your [_manifest.json_](./manifest.json.md) and _HELP.md_ files in the _companion/_ folder.
- Look through the optional files mentioned above
- Familiarize yourself with the [Companion Module Library](../module-lifecycle/companion-module-library.md) concept
- Read through our introduction to module development: [Module Development 101](../module-development-101.md)

