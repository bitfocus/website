---
title: 'TypeScript Config with tsconfig.json'
sidebar_label: 'TypeScript Config'
sidebar_position: 5
description: Configuring the module to work with TypeScript.
---

:::important

This is an advanced topic. If you use the [recommended templates](./file-structure.md), a default typescript
config file is included and you will generally not want to change it.

:::

The [recommended templates](./file-structure.md) provide typescript config presets in _tsconfig.json_ that we believe to be best practise, but they can be configured to be too strict for some, or may need to be modified if you change the name of the source or destination directories.

A typical _tsconfig.json_ file looks like:

```json
{
  "extends": "@companion-module/tools/tsconfig/node22/recommended",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules/**", "src/**/*spec.ts", "src/**/__tests__/*", "src/**/__mocks__/*"],
  "compilerOptions": {
    "outDir": "./dist",
    "baseUrl": "./",
    "paths": {
      "*": ["./node_modules/*"]
    }
  }
}
```

Our TypeScript template splits it into two files:

```json
//tsconfig.json
{
  "extends": "./tsconfig.build.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules/**"],
  "compilerOptions": {
    "types": ["node"]
  }
}
```

```json
// tsconfig.build.json
{
  "extends": "@companion-module/tools/tsconfig/node22/recommended",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules/**", "src/**/*spec.ts", "src/**/__tests__/*", "src/**/__mocks__/*"],
  "compilerOptions": {
    "outDir": "./dist",
    "baseUrl": "./",
    "paths": {
      "*": ["./node_modules/*"]
    },
    "module": "Node16",
    "moduleResolution": "Node16"
  }
}
```

You are free to override properties as you wish, this is only our recommendation after all.

If you have any suggestions on changes to make to this base tsconfig, do [open an issue](https://github.com/bitfocus/companion-module-tools/issues) to let us know. We hope to collect some alteranate presets along with recommended.
