---
title: Building Distributable Binaries
sidebar_label: Building Companion Distributables
sidebar_position: 12
description: Sharing your modified Companion with others
---

The Companion repo allows you to build a distributable binary from sources by running

```bash
yarn dist
```

You can also cross-build for a specific platform using one of the following:

- Desktop Linux: `yarn lindist`
- Raspberry Pi: `yarn rpidist`
- Windows: `yarn windist`
- macOS intel: `yarn macdist`
- macOS Apple silicon: `yarn macarmdist`

The build will be added to a sub-directory of _electron-output/_ named _xxx_-unpacked. For example _electron-output/linux-unpacked_ or _electron-output/win-unpacked_.

There you will find a binary to run a Headed build (a system with a monitor, keyboard, and mouse).
On Windows it is named _Companion.exe_ on linux it is named _companion-launcher_

Windows builds also include an installer program named _companion-win64.exe_ in _electron-output/_ (not _electron-output/win-unpacked_!), which can be distributed independently of the "unpacked" contents.

Linux builds include a shell script to run headless named _companion_headless.sh_

You can also start a "headless" run manually by running main.js from xxx-unpacked/resources, i.e.:

```bash
./node-runtimes/main/bin/node main.js
```

:::info[Linux note]
To build Windows distributables from Linux systems (even WSL) you must install Wine first:

```bash
sudo apt install wine
sudo bash -c “dpkg --add-architecture i386 && apt-get update && apt-get install wine32:i386”
```

note: if your wine config gets corrupted, delete `~/.wine`.
:::

:::info[Windows note]
The very end of ‘yarn dist’ (signing) creates symlinks. By default, Windows restricts symlink creation, so you have two options when building Companion in Windows:

1. Run `yarn dist` in a shell with Administrator privileges.
2. Set a local policy in the “Local Security Policy” editor: Security Settings > Local Policies > User Rights Assignment: Create symbolic links, to allow yourself to create symlinks:

   ![image](images/set-symlink-permission.png)

:::

:::tip[Windows Tip]
Windows Antimalware Executable can slow down build times by 50-100%. You can improve performance by excluding certain folders: After cloning the companion repo and running `yarn install` the first time (see [Developing Core Companion](development-flow.md)) go to Windows Security > Virus and Threat Protection > Exclusions and add node_modules from your companion root. For completeness and a slight additional boost add: cache, dist, electron-output, shared-lib\dist, webui\build, and companion\dist.
You may want/need to exclude these folders from backup apps too.
:::

:::danger[Raspberry Pi]
It is not recommended to run Companion on a Raspberry Pi with the desktop environment installed.
:::
