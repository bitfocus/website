---
title: 'GitHub Workflow: Contributing to Companion'
sidebar_label: The GitHub Workflow
sidebar_position: 3
description: Introduction to git and github workflow for beginners
---

![image](images/github-contribution-workflow.png)

The following is the basic workflow for contributing to Companion (and many other open-source repositories) on GitHub. The order of operations is a key to keeping everything straight... This page assumes basic knowledge of Git and GitHub. To learn Git, check out our [Git Crashcourse](git-crashcourse), or [Git's documentation](https://git-scm.com/learn) or the many online resources.

The examples below use the core Companion repo, bitfocus/companion, for specificity. If you are contributing to a module, substitute the module's repository name for bitfocus/companion. (For example, bitfocus/companion-module-generic-http.)

:::tip

1. A GUI front-end such as SmartGit, GitGUI, can greatly simplify the overall process. See the tip under [Installing Git](installing-git#install-git) for our recommendations.

2. The instructions on this page describe how to contribute to repositories for which you don't have write permission, which is typically the case when you're contributing to an existing repository. Eventually you may get write-access, for example if you become the maintainer of a Companion module, in which case the flow can be simplified...but it's still good practice to develop new features on a new branch.
   :::

:::note[Expert Note]
The following outline names the bitfocus remote "origin" and your remote fork "personal". This seems much clearer than the convention of naming the bitfocus repo "upstream" and your remote fork "origin" (which it is not!). The convention recommended here eliminates a step and also ensures that your pulls come from the Bitfocus repo. Many thanks to Brian Teeman for this and other suggestions.
:::

## 1a. Clone Companion to a local repository

:::important[Windows Users!]
If you are cloning to a Windows computer be sure to [configure git line-endings as described here](installing-git.md#configure-git) _**before**_ cloning Companion.
:::

```bash
git clone https://github.com/bitfocus/companion.git
```

(module developers: substitute the appropriate GitHub location.)

:::note
The Bitfocus repository is read-only for most users. In the next step we will create a writeable "fork" of the Bitfocus repo that will be used for sending in proposed code changes (PRs)
:::

**updating**: Once your local repository has been established, use `git fetch` or `git pull` to keep it up-to-date. (Some GUI frontends can automate this part.)

## 1b. Fork Companion to your GitHub account

Back on the [Companion GitHub page](https://github.com/bitfocus/companion) or the module's GitHub page, click on the `Fork` button in the Code tab. This will create a repository under your GitHub account that you can write to.

**updating**: Once the fork has been created, use the "Sync Fork" button in GitHub to keep it up-to-date.

### Add the fork as a remote to your local repository

Your local repository will need two "know" two remote (GitHub) repos -- one for keeping in sync with Bitfocus and the other for writing your code changes. We suggest naming this second one "personal" for clarity -- it is your personal fork of companion _on GitHub_:

On the GitHub page for your new fork, copy the HTTPS link to your fork using the green <span style={{background: "#00CC00", borderRadius: "5px", fontSize: "0.8em", padding: "0.5em"}}> **&lt;&gt; Code &#x25BC;** </span> button. Then paste it on a line starting with `it remote add personal`. It should look like this (for core Companion):

```bash
git remote add personal https://github.com/<your username>/companion.git
```

(In a GUI frontend you would select "Add Remote..." from a menu. SmartGit, for example, will automatically pick up the URL from your clipboard when you do this.)

:::note
By default, the Bitfocus remote that you cloned above, was named "origin". So "origin" refers to Bitfocus (the "origin" of your clone) and "personal" refers to your fork on GitHub.
:::

## 2. Create a new branch in your local repo

```bash
git switch -c <new-branch-name>
```

(In a GUI frontend you would select "Add Branch..." from a menu.) This creates and checks out the new branch.

Next, modify/add code for your feature of bug-fix using your favorite coding tools.

When you are satisfied with some or all of your changes, commit them to the new branch

```bash
git commit -m 'message'
```

This is where you really want to be using a GUI front-end to git to keep track of everything!

## 3. Push the branch to your GitHub fork

```bash
git push -u personal <your_branch>
```

(In a GUI frontend you would select "Push to..." from a menu and select "personal".) After the first push, you can push further commits on that branch using just `git push`

## 4. Submit a Pull Request (PR) to Bitfocus

Once you are satisfied with your code, submit a PR from the GitHub page for your fork. GitHub will guide you through the process.

Subsequent commits that you push to this branch will automatically be included in the PR.

Occasionally, you will make changes to the PR directly on GitHub. In these cases you will need to fetch or pull the changes from your GitHub fork back into your local repo to keep things synchronized.
