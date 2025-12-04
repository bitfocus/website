---
title: Setting up the Development Folder
sidebar_label: Setting a Dev Folder
sidebar_position: 1
description: How to load modules during module development.
---

Starting with Companion 3.0 you can develop, test and use your own module code without the need for the Core Companion development environment. Here is how you do it.

## Module folder structure

The structure is setup so that you can load multiple modules at the same time.  A module folder is specified as described below.
Inside of this folder should be one or more folders that use the following layouts, with each folder corresponding to a different module.

1. A git clone of a module from github  
   This requires some additional setup, as the module will need to be prepared with a `yarn install`, and for some, a `yarn build`.
2. Packaged output  
   This is a folder that contains a `companion/manifest.json`, `companion/HELP.md`, `package.json`, `main.js` (or another name), and possibly a few other files.
   No extra work is needed for this to be loaded

##  Set up a developer folder

- Create a folder on your machine where you will put these custom modules.
- Check the section above on how to structure this folder
- Open/show the launcher window of Companion:

  ![image](images/launcher.png)

- In the top right corner you will see a Cog. Click on it to show the **Advanced Settings** window:

![image](images/launcher-advanced.png)

- In the **Developer** section click on _**Select**_ to specify the directory where you have stored your developer modules.
- Make sure **Enable Developer Modules** is switched on. You can now close the window
- Click on "Launch GUI" to open the Admin interface. In the connections list you should find the connection provided by the developer module. If the developer module is using the same internal ID as a module that is distributed with Companion, be sure to choose the "dev" version in the configuration.  
  If you don't see the developers module, please check the log and switch on debug, maybe the module has crashed.
- You can replace a developers module or parts of it on the harddrive while Companion is running. Companion will detect the change and restart only that module without affecting other modules.

:::note

The development folder is the one that contains all your module folders, not a module folder itself! 

For example, if your module repo is in a folder called _module1_ and it's in a folder called _mydev_, i.e.
 _mydev/module1_,
the **Developer Module Path** is _**mydev**_ and not _mydev/module1_.

:::

## RaspberryPI / Headless Linux

- Find the developers module folder on your installation. This is often `/opt/companion-module-dev/`.
- Check the section above on how to structure this folder
- Run Companion.
- Open the Admin interface in your Browser. In the connections list you should find the connection provided by the developer module. If the developer module is using the same internal ID as a module that is distributed with Companion, it will override the distributed version.  
  If you don't see the developers module, please check the log and switch on debug, maybe the module has crashed.

## Headless development

- If you are running Companion from source in development mode, there is a folder `module-local-dev` inside the repository that gets read for your modules.
- It follows the same rules for structuring as above.
- Any changes made to the contents of the folder will cause the affected modules to be reloaded. You can force them to reload by disabling and re-enabling a connection.
