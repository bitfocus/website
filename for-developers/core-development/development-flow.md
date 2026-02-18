---
title: Developing Core Companion
sidebar_label: Developing Core Companion
sidebar_position: 10
description: The basic workflows for developing core companion code.
---

Once you've [configured your development environment](../setting-up-developer-environment.md), the following steps will get you started. The first section is for seasoned experts. For the rest of us, read on, and most importantly remember that help is only a Slack message away...

## TL;DR

```bash
yarn install
yarn dev
```

Connect to it at http://localhost:8000/

Optionally, to run the front end in dev mode with auto-refresh, open another terminal:

```bash
yarn dev:webui
```

Connect to it at http://localhost:5173/

See topics below for running the launcher and docs in development mode.

## Cloning and updating your repo

### Getting Started: Cloning

:::important[Windows Note]
Be sure to [setup git line-endings behavior](../setting-up-developer-environment.md#3-install-and-setup-git) **before** cloning!
:::

Using your git client, you can clone Companion. To do it from a command line interface, change to the directory you want to contain the repo (the repo will be added as a subdirectoy) then:

```bash
git clone https://github.com/bitfocus/companion.git
```

This command will create a new folder called companion, containing a clone of the Bitfocus repo. Make sure to cd into this folder before continuing!!!

```bash
cd companion
```

### Every time: Install the dependencies

When you first install and each time you update your local repository you must run the following in a terminal to install or update the dependencies. (The terminal window inside vscode is perfect for this):

```bash
yarn install
```

If this fails immediately after the clone, you probably did not enable corepack. Check our instructions on [Setting up your Developer Environment](../setting-up-developer-environment.md).

Note that you may have to manually rebuild the webui front-end after each update:

```bash
yarn dist:webui
```

:::tip[Windows Tip]
Windows Antimalware Executable can slow down install and build times by 50-100%. You can improve performance by excluding certain folders: After cloning the companion repo and running `yarn install` the first time (see above) go to Windows Security > Virus and Threat Protection > Exclusions and add node_modules from your companion root. For completeness and a slight additional boost add: cache, dist, electron-output, shared-lib\dist, webui\build, and companion\dist.
You may want/need to exclude these folders from backup apps too.
:::

### Updating: Fetch or Pull

Keep the up-to-date by fetching (`git fetch`) or pulling (`git pull`). See our pages [Git Crash Course](../git-workflows/git-crashcourse.md) and [GitHub Workflow](../git-workflows/github-workflow.md) if you need an introduction or refresher on these topics.

:::tip
Consider using a graphical front-end such as SmartGit, or even the GitGUI program included with git, to visualize and simplify the process.
:::

## Working with the back-end code

After updating the code and possibly making your own additions, you can run and test the code by typing

```bash
yarn dev
```

in a shell window such as powershell, bash. If you are using Visual Studio Code (VS Code), you can open a Terminal window right in the IDE.

Any changes you make to the code while running `yarn dev` will automatically recompile and restart Companion.

To debug the back-end code you can:

1. Add `console.log()` or `this.logger...` (or `this.#logger...`) calls to the code. This method is particularly useful when timing is critical.
2. Use an interactive debugger. This has the advantage of allowing you to explore the current state more thoroughly, and to avoid adding "throw-away" code just for debugging.

   In VS Code, the simplest way to debug is to open a _Javascript Debug Terminal_ from the _Add Terminal_ pulldown menu (the '+' menu) and run either `yarn dev` (normal logging) or `yarn dev:debug` (voluminous reporting, debug-level: 'silly'). It is also possible to start these options from a menu using "_Debug: Debug npm script_"

:::tip  
To include dev modules when running `yarn dev`, put the following in a file named `.env` in your top-level companion folder:

```
COMPANION_DEV_MODULES=<dev modules path>
```

(Replace "\<dev modules path>" with the actual path.)

See [Setting a Dev Folder](../module-development/local-modules.md) for further details and options.
:::

## Working with the (front-end) UI code

Running `yarn dev` from the base folder, will serve the prebuilt version of the webui, which will not update as you make changes to webui code. You can recompile the webui using `yarn dist:webui`, but if you wish to run the webui itself in development mode open a a second terminal window/tab and run

```bash
yarn dev:webui
```

This will launch the development version of the webui on a different port, typically [http://localhost:5173](http://localhost:5173)

:::important
You still need to have `yarn dev` (in the base folder) running separately for this to work
:::

:::tip
You can open more than one terminal inside VS Code using the '+' menu, so in the first terminal run `yarn dev` and in the second one you can run `yarn dev:webui`
:::

:::note
`yarn dev:webui` is equivalent to running `yarn dev` from the webui folder, i.e. `cd webui; yarn dev`
:::

#### Debugging the webui in Visual Studio Code:

The webui is written in a combination of CSS/Sass (_.scss) and [React](https://react.dev/learn) (_.tsx) code. You can debug CSS by using the Inspect feature in your web browser. To debug the React code in VS Code, follow [Microsoft's instructions to set up a _launch.json_ file](https://code.visualstudio.com/docs/nodejs/reactjs-tutorial#_debugging-react) with the following adjustments:

- If using Chrome as your browser, select "Launch Chrome" from the menu or make sure the file shows: `"type": "chrome"` instead of `"type": "msedge",` and adjust `"name:"` as well
- Set the port number: `"url": "http://localhost:5173/"` (you can add a specific page to the URL, if desired, for fast access to that page).
- Add the subfolder: `"webRoot": "${workspaceFolder}/webui/src"`
- The entry should in _launch.json_ should be similar to this (if using Chrome)

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Companion Webui (in Chrome)",
      "url": "http://localhost:5173/",
      "webRoot": "${workspaceFolder}/webui/src"
    }
  ]
}
```

- After starting `yarn dev:webui` (and `yarn dev`, as above), press **F5** to launch a web browser and start debugging. You can set breakpoints, explore the stack and current state, etc., in the usual way.

- Note that breakpoints will generally cause timeouts in the webui. If you need to debug timing-critical features, you may have to insert logging entries into the code instead.

## Working with the Launcher code

The instructions above will run the 'headless' version of Companion, without the red launcher window. If you want to run or develop the launcher window, _cd_ into the `launcher` folder and run `yarn dev`

```bash
cd launcher
yarn dev
```

To access the Advanced Settings window: in a separate terminal _cd_ into `launcher-ui`, and run `yarn dev` from there. As with the front-end development, you need to run both of these commands to get the Advanced Settings window working.

```bash
cd launcher-ui
yarn dev
```

Launcher uses a combination of Electron (for the red window) and React (for the Advanced Settings window).

## Working with the Documentation

The **User Guide** and **What's New** pages, stored in the 'docs' folder of the Companion repo, are written in Markdown with [Docusaurus enhancements](https://docusaurus.io/docs/markdown-features). The help pages are built using Docusaurus. For development run the following to open a browser window that will dynamically update as you save changes.

```bash
yarn dev:docs
```

or

```bash
cd docs
yarn start
```

**Developer documentation** (what you're reading now!) is maintained separately in the [Bitfocus website repo](https://github.com/bitfocus/website) under the folder _for-developers_. To contribute to the developer documentation, clone that repository, then use `yarn start` to get dynamic updates, as above.

:::danger[warning]
Do not edit the _user-guide_, _versioned\*_ and _whats-new_ folders in the _**website**_ repo! They are automatically updated from the main companion repo. Edit the source for those folders in the _**companion**_ repo, as described above.
:::
