---
title: 'Installing and Configuring Git'
sidebar_label: Install & Configure Git
sidebar_position: 1
description: Instructions for installing git on your computer.
---

If you have never used git or github before, have a read of our [Git crashcourse](git-crashcourse.md). Before you get started, however you must install and configure git on your computer.

## Install Git

Install git following the instructions on [their website](https://git-scm.com/install/).

Consider installing a graphical front-end to git: it can greatly simplify your git workflow. The following three popular options run on Windows, Mac and Linux. Many other GUI options are listed on [the git website](https://git-scm.com/tools/guis).

:::note
You do not have to limit yourself to a single tool: because of the way Git works on your computer, you can use any or all of these simultaneously. Each tool has it's benefits, so you may find yourself quite naturally using each one to its strength.
:::

- The standard Git install, linked above, installs **Git GUI**, which though minimal is good at what it does, especially if you use the "_Visualize All Branch History_" viewer launched from the _Repository_ menu. On Windows the option to "Open Git Gui here" is added to the right-click menu for folders in the File Explorer.

- [**SmartGit**](https://www.smartgit.dev/) adds a fair bit of functionality and ease-of-use especially for keeping up with changes in the main repository and organizing multiple repositories. It is free for use with public (open-source) repositories.

- [**Visual Studio Code**](https://code.visualstudio.com/) (VS Code), the IDE we recommend, also provides some [integrated git management](https://code.visualstudio.com/docs/sourcecontrol/overview), which can be enhanced with various plugins such as [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens), [Git History](https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory), and [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph).

- [**GitHub Desktop**](https://github.com/apps/desktop) works well in simple cases and integrates well with GitHub.

## Configure Git

:::warning[Windows Note]
Companion’s `prettier` config requires `eol=lf`, but the system default (in C:/Program Files/Git/etc/gitconfig) may have set autocrlf to true during installation.

In order for `git clone` to give you `lf` endings, i.e. before you have even downloaded the repository, this default needs to be overridden _**before you clone the companion repository**_. In a git bash window type:

```bash
git config set --global core.autocrlf false
git config set --global core.eol lf
```

:::
