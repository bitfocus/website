---
title: 'Packaging a Companion Module'
sidebar_label: 'Package a module'
sidebar_position: 2
description: How to package your module for delivery to others.
---

## Background

Starting with Companion 3.0, modules must be packaged with some special tooling. This is done to reduce the number and total size of files in your module. Combining your module into just a few files can often reduce the size from multiple MB, to a few hundred KB, and lead to much shorter load times.

:::warning

Sometimes the build process introduces or reveals issues that prevent the module from running, so be sure to test it before distributing. In our experience, issues often occur when working with files from disk, or introducing a new dependency that doesn't play nice.

:::

## Packaging for testing

If you are using one of our [recommended module templates](../module-setup/file-structure.md) you can package your module for distribution by running

```bash
   yarn companion-module-build
```

If successful, there will now be a `pkg/` folder at your module root folder a `<module-name>-<version>.tgz` file in the root folder. The module name and version are taken from your _package.json_ file, so for example, if the module is named 'generic-animation' and the version number in _package.json_ is 0.7.0, then the file will be named _generic-animation-0.7.0.tgz_.

If you need to debug the package code rather than the dev code, create an empty file `DEBUG-PACKAGED` in your module folder. Companion will read the code from `pkg` instead of your source folders.

You probably don't need to do a very thorough test, as long as it starts and connects to your device and a couple of actions work it should be fine.

:::tip

Due to how the packaging is done, it can result in some errors producing unreadable stack traces, or for a wall of code to be shown in the log making it unreadable. While using `DEBUG-PACKAGED`, if you run `yarn companion-module-build --dev` (the `--dev` parameter is key here) it will produce a larger build of your module that will retain original line numbers and formatting, making it much easier to read any output.

:::

If you need help, don't hesitate to reach out on the Module Developer's [Slack channel](https://bfoc.us/ke7e9dqgaz) and we will be happy to assist you.

## Packaging for distribution

When you run `yarn companion-module-build` (without the --dev), it produces the _.tgz_ file described above. This file contains everything a user needs to be able to run your module. A `tgz` file is like a `zip` file, but different encoding. You, or your users, can load it from the Companion Modules page and Companion will be able to run it the same as if the module came from the store.

## Customising the packaging

For more complex modules, it is possible to adjust some settings in the packaging process.

Be careful when using these, as changing these settings are advanced features that can cause the build process to fail.

To start off, create a file `build-config.cjs` in your module folder, with the contents `module.exports = {}`. Each of these customisation sections will add some data to this file.

### Changing `__dirname`

Webpack has a few options for how `__dirname` behaves in packaged code. By default it gets replaced with `/` which makes everything relative to the bundled main file. Alternatively, you can set `useOriginalStructureDirname: true` and the original paths will be preserved.

### Including extra data files

:::tip
Since [API 1.12](../api-changes/v1.12.md), your module by default has read-only access to just your module folder, and not the whole filesystem.  
You can [opt into more permissions](../connection-advanced/permissions.md) if you need it, but this will require permission from the user in the future.
:::

Sometimes it can be useful to store some extra data as text files, or other formats on disk. Once your module is packaged, it wont have access to any files, from the repository unless they are JavaScript which gets included in the bundle or the files are explicitly copied. You will need to do this to allow any `fs.readFile()` or similar calls to work.

You can include these files by adding something like the following to your `build-config.cjs`:

```js
module.exports = {
  extraFiles: ['*.txt'],
}
```

You can use any glob pattern to define files to be copied.  
All files will be copied to the root folder of the package, which is the same folder where the packaged main script is in. Make sure that there are no name conflicts when copying files from different folders.  
Make sure you don't copy files you don't need, as these files will be included in the installation for all users of Companion.

### Using native dependencies

:::tip
Since [API 1.12](../api-changes/v1.12.md), you have to mark in your manifest.json that you need to do this. In the future we will use this as information for the user.
Read more about [permissions](../connection-advanced/permissions.md).
:::

Native dependencies are not possible to bundle in the same way as js ones. So to support these requires a bit of extra work on your part.

It is not yet possible to use all native dependencies. We only support ones that publish prebuilt binaries as part of their npm package.  
This means that some libraries are not possible to use. Reach out if you are affected by this, we would appreciate some input, and can work with you to find or fix a library to be compatible

To support these modules, you should make one of two changes to your build-config.cjs, depending on how the library works.

If the library is using [`prebuild-install`](https://www.npmjs.com/package/prebuild-install), then it will not work. With `prebuild-install` it is only possible to have the binaries for one platform installed, which isn't compatible with our bundling process. If you need one of these libraries, let us know and we can try to get this working with you.

If the library is using [`pkg-prebuilds`](https://www.npmjs.com/package/pkg-prebuilds) for loading the prebuilt binaries, then you can use the following syntax.

```js
module.exports = {
  prebuilds: ['@julusian/freetype2'],
}
```

If the library is using `node-gyp-build`, then there are a couple of options.  
The preferred method is to set `useOriginalStructureDirname: true` in `build-config.cjs`. This changes the value of `__dirname` in your built module, and allows `node-gyp-build` to find its prebuilds.

If you are not able to use `useOriginalStructureDirname: true`, then you can instead mark the dependency as an external:

```js
module.exports = {
  externals: [
    {
      'node-hid': 'commonjs node-hid',
    },
  ],
}
```

This isn't the most efficient solution, as it still results in a lot of files on disk. We are looking into whether we can package them more efficiently, but are currently blocked on how most of these dependencies locate the native portion of themselves to load.

If the library is using something else, let us know which of these approaches works, and we can update this page to include it.

### Using extra plugins

Sometimes the standard webpack functionality is not enough to produce working modules for the node runtime, but there is a [webpack plugin](https://webpack.js.org/plugins/) which tackles your problem.

You can include additional plugins by adding something like the following to your `build-config.cjs`:

```js
module.exports = {
  plugins: [new webpack.ProgressPlugin()],
}
```

### Disabling minification

Some libraries can break when minified, if they are relying on names of objects in a way that webpack doesn't expect. This can lead to cryptic runtime errors.

You can disable minification (module-tools >=v1.4) with:

```js
module.exports = {
  disableMinifier: true,
}
```

Alternatively, if you are having issues with error reports from users that have unreadable stack traces due to this minification, it can be disabled. We would prefer it to remain on for all modules to avoid bloating the install size (it can triple the size of a module), we do not mind modules enabling it if they have a reason to.

### Using worker threads

Worker threads need their own entrypoints, and so need their own built file to execute.

We need to investigate how to handle this correctly. Reach out if you have ideas.

## Common issues

This process can often introduce some unexpected issues, here are some of the more common ones and solutions:

_TODO_

## Further reading

- [Introduction to modules](../home.md)
- [Module development 101](../module-development-101.md)
- [Debugging Modules](../module-debugging.md)
- [Module Permissions](../connection-advanced/permissions.md)
- [Module Setup](../module-setup/)
- [Module Basics](../connection-basics/index.md)
