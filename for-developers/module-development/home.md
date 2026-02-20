---
title: Getting Started with Modules
sidebar_label: Getting Started with Modules
sidebar_position: 1
description: Developer environment setup specific to module development.
---

So, you want to develop a module for Companion? Welcome!

Companion uses plug-ins to expand its capabilities, we call these plug-ins "modules". For every device you can control with Companion there is a "module" that manages the connection. This page describes how to set up your computer for developing Companion modules. Subsequent pages will provide details on the contents of the module and its lifecycle.

## Prerequisites

Before you start, make sure you have [Installed the Development Tools](../setting-up-developer-environment.md) and familiarized yourself with [Git Workflows](../git-workflows/git-crashcourse.md).

This page discusses additional setup specific to Companion modules.

## Install Companion

You can develop modules against any standard release or beta build of Companion. (To develop modules in a core-Companion development process, see the instruction for [headless development](./local-modules#headless-development))

Download and install a recent version from [the website](https://bitfocus.io/user/downloads)

:::tip
Starting with Companion v4.0, the module release cycle has been decoupled from the Companion release cycle: The timing of module version releases are determined by the module developer independently of the Companion releases.

We therefore recommend developing your module using the current stable version to ensure that users will be able to use your module right away instead of having to wait until the current beta is released.
:::

## Set up the Development Folder

- Create a modules development folder somewhere on your computer. You can call it whatever you like.
- Open the companion launcher and click the cog in the top right. In versions prior to v4.1 this will reveal a 'Developer modules path' field. Starting in Companion v4.1 it will open up a settings window in which you can set the path. Set it to the development folder you just created.

Please see the next page: [Setting up a Dev Folder](./local-modules.md) for full details.

:::tip

Companion will load any modules that are in _subfolders_ of the modules development folder.
However, starting with v4.0, note that **your new dev module will show up in the Connections page** but not in the Modules page, since it is not yet part of the official set of Companion modules.

:::

## Clone or Copy a module from GitHub

With over 700 published modules, you may find a module already written for you device. You can find the GitHub repository for each module by searching [Bitfocus in GitHub](https://github.com/bitfocus).

- If you want to **contribute to an existing module**, clone it to your development folder using your [preferred git tool](../git-workflows/installing-git.md). (See [Git Crash Course](../git-workflows/git-crashcourse.md) and [The GitHub Workflow](../git-workflows/github-workflow.md) for important details).
- If you are **writing a new module**, then download and expand the zip file for the [TypeScript template module](https://github.com/bitfocus/companion-module-template-ts/archive/refs/heads/main.zip) into the module development folder (see the next section on naming your module). If you prefer, you can clone the [template repo](https://github.com/bitfocus/companion-module-template-ts), but remember to delete the remote link (`git remote remove origin`) before continuing. We encourage you to use Typescript for all new modules but acknowledge that it isn't for everyone, so we fully support [Javascript](https://github.com/bitfocus/companion-module-template-js) too!
- Alternatively for a new module, you can start by downloading the zip or cloning a module that controls a device similar to yours -- both options can be found under the green <span style={{background: "#00CC00", borderRadius: "5px", fontSize: "0.8em", padding: "0.5em"}}> **&lt;&gt; Code &#x25BC;** </span> button for that module's GitHub repo. Beware: by using another module as a base, you could inherit some subtle misconfigurations or deviations they have made from our recommendations. As with using the template, if you cloned the repo be sure to remove the remote connection by running `git remote remove origin`, since you will be creating a new module rather than modifying the existing one.

### Additional steps for new modules

1. Rename your module's directory _companion-module-mymanufacturer-myproduct_, replacing _mymanufacturer-myproduct_ with appropriate names. Try to think of what is most appropriate for your device: Are there other similar devices by the manufacturer that use the same protocol that the module could support later on? If so try and name it to more easily allow for that.

2. In at least _package.json_, _companion/manifest.json_ and _companion/HELP.md_, edit the name and description of the module to match what yours is called. The search feature in your IDE is really helpful to find all of the places the name shows up! See the [Module Configuration section](./module-setup/file-structure.md) and especially the [documentation for the manifest.json file](./module-setup/manifest.json.md) for further details.

3. Please see [Module Configuration](./module-setup/file-structure.md) and the other pages in that section for more details and more options on starting your own module.

## Install the dependencies

In a shell inside the new folder, run the following:

```
yarn install
```

This will install any dependencies needed by the module.

:::tip

If you are using an IDE such as [VS Code](https://code.visualstudio.com/), make the clone your current project
(i.e., open the repository folder), then open a terminal (shell) inside the IDE to ensure you are running yarn in the correct folder.

:::

## Start working on your module

You are now ready to start developing your module. Here are our suggested next steps:

- Familiarize yourself with the [Module Configuration](./module-setup/file-structure.md) to understand the general file structure and configuration options, especially if working on a new module.
- Read [Module development 101](./module-development-101.md) for an overview of the development lifecycle.
- Review the recommended [GitHub Workflow](../git-workflows/github-workflow.md) to learn best practices for new features to your codebase.

You can develop code while the module is running in Companion: whenever you save a file inside your module development folder, Companion will automatically restart any connections using that module.

If it does not, or you are having issues getting your module to load in then please reach out on [Slack](https://bfoc.us/ke7e9dqgaz) and we will be happy to assist you in getting started.
