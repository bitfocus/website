---
title: Setting up a Developer Environment
sidebar_label: Setup the Developer Tools
sidebar_position: 1
description: Setting up a Developer Environment
---

import UserGuideLink from '@site/src/UserGuideLink';

Companion is written in Javascript/Typescript and uses the [Node.js](https://nodejs.org/en/) runtime. In addition, all parts of Companion are organized and tracked using [Git](../1_git-workflows/installing-git.md). Here we will provide instructions for installing the development tools you will need for contributing to Companion, whether as a module or a part of core Companion.

Companion, Javascript and Node.js are platform independent, so you can develop on Windows, macOS or Linux and the code you write will be able to run on all three platforms.

:::note
For module development you may be able to skip step 5, below, "Enabling USB on Unix". Instead
simply install Companion according to the instructions in the <UserGuideLink to="getting-started/Installation">getting started guide</UserGuideLink>.
:::

## 1. Install Node.js manager (fnm)

We strongly recommend using the [fnm](https://github.com/Schniz/fnm#installation) version manager to allow for easily updating and switching between Node.js versions. If you choose to install Node.js without fnm, you will still need to ensure you a running the right Node.js versions as Companion evolves.

### Installing fnm on Windows

:::note
If you want to run in Linux Subsystem for Windows (aka WSL), please follow the [WSL Instructions page](setting-up-WSL.md) and then follow the instructions, below, in the [Linux section, below](#installing-fnm-on-linux-and-macos).
:::

:::tip
If PowerShell complains about unsigned apps, go to Settings, search for "developer settings" and enable "Change execution policy to allow local PowerShell scripts to run without signing" or in a PowerShell with elevated permissions run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
:::

If you are new to code development on Windows, the built-in `winget` command is probably the simplest way to install fnm. (Other popular package managers such as Chocolatey and Scoop work similarly.)

In Powershell (admin mode) type:

```powershell
winget install Schniz.fnm
```

Once it has loaded, configure PowerShell as described in the fnm GitHub repo. Briefly you need to add a line to the end of the powershell startup script (aka profile). The following opens the profile file in a text editor

```powershell
if (-not (Test-Path $profile)) { New-Item $profile -Force }
Invoke-Item $profile
```

...put the following line at the end of the file:

```powershell
fnm env --use-on-cd --corepack-enabled --version-file-strategy=recursive --shell powershell | Out-String | Invoke-Expression
```

### Installing fnm on Linux and MacOS

Use the following script (see [fnm instructions in GitHub](https://github.com/Schniz/fnm?tab=readme-ov-file#installation))

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

:::note
The install script requires unzip to be installed on your system. If it isn't, install it by typing:

```
sudo apt install unzip
```

:::

**upgrading fnm**:

on MacOS upgrade fnm using Homebrew: `brew upgrade fnm` (you can also install using manually using Homebrew)

on other Linux systems upgrade using:

```bash
curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell
```

## 2. Install Node.js using fnm

Once you have installed fnm, execute the following in a terminal/PowerShell.
To install Node.js v22 (the version required for Core Companion development at the time of writing) and make it the default.

```bash
fnm install 22
fnm use 22
fnm default 22
corepack enable
```

(Note: `corepack enable` may not be needed in Windows if using PowerShell with the setup described above.)

:::note
Some older modules uses node v18 instead of v22, but are encouraged to update to v22. Sometimes updating the node version can introduce new bugs, but staying on older versions makes development harder as tools drop support for those versions. At some point, Companion will require modules to be node v22 (or perhaps a newer version).

With fnm you can install both v18 and v22 and let yarn determine the correct version to use based on package.json.
:::

:::warning

Do not install yarn directly. Instead, let corepack ensure that the right version is installed
when you run [`yarn install`](development-flow#every-time-install-the-dependencies). If you have already installed
yarn globally and are having problems, consider removing the global install.

:::

## 3. Install and setup git

See the [instructions for installing Git here](../1_git-workflows/installing-git.md).

:::important[Windows Note]
As per [the windows note here](../1_git-workflows/installing-git.md#configure-git):

In order for `git clone` to give you `lf` endings, this default needs to be overridden _**before you clone the companion repository**_. In a git bash window type:

```bash
git config set --global core.autocrlf false
git config set --global core.eol lf
```

:::

## 4. Enabling USB access on Linux Systems

If you are using linux, you should follow the dependencies and udev rules steps as described in the README included in the release builds https://github.com/bitfocus/companion/tree/main/assets/linux.

For WSL, follow the [WSL setup instructions](setting-up-WSL.md) instead.

## 5. Editing Code / Integrated Development Environment (IDE)

To edit the source code or write new code you can use any text editor you like, but there are many editors which are made especially for developing computer code or even better especially for JavaScript.
If you have no prior experience, we recommend the [Visual Studio Code](https://code.visualstudio.com/) editor (VS Code).

:::tip
We recommend installing the _ESLint_, _prettier_ and _typos_ plugins for VS Code.
:::

:::note[Linux Note]
If you want a simple windowing text-editor in Linux, you can try gedit. Install it with `sudo apt install gedit`
:::
