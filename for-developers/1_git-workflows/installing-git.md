---
title: 'Installing and Configuring Git'
sidebar_label: Install & Configure Git
sidebar_position: 1
description: Instructions for installing git on your computer.
---

If you have never used git or github before, have a read of our [Git crashcourse](git-crashcourse.md). Before you get started, however you must install and configure git on your computer.

## Install Git

Install git from [their website](https://git-scm.com/install/). (MacOS users can use homebrew.)

:::tip
Consider installing a graphical front-end to git: it can greatly simplify your git workflow. The following three popular options run on Windows, Mac and Linux. Many other GUI options are listed on [the git website](https://git-scm.com/tools/guis).

- Git itself installs GitGUI, which though minimal is good at what it does, especially if you use the `Visualize All Branch History` viewer launched from the `Repository` menu.

- SmartGit adds a fair bit of functionality and ease-of-use especially for keeping up with changes in the main repository and organizing multiple repositories. It is free for use with public (open-source) repositories.

- VS Code also provides some integrated git management, which can be enhanced with various plugins such as GitLens, Git History, and Git Graph.

Many more options can be found on [Git's website](https://git-scm.com/tools/guis)
:::

## Configure Git

:::important[Windows Note]
Companion’s `prettier` config requires `eol=lf`, but the system default (in C:/Program Files/Git/etc/gitconfig) may have set autocrlf to true during installation.

In order for `git clone` to give you `lf` endings, i.e. before you have even downloaded the repository, this default needs to be overridden _**before you clone the companion repository**_. In a git bash window type:

```bash
git config set --global core.autocrlf false
git config set --global core.eol lf
```

:::
