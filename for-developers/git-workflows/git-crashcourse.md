---
title: 'GitHub Intro for Companion Contributors'
sidebar_label: Git Crash Course
sidebar_position: 2
description: Introduction to git and github workflow for beginners
---

# Git Crash Course for Companion Contributors

For first-time Git and GitHub users, contributing to open source can feel overwhelming. This guide walks you through the workflow for contributing to Companion, explaining the concepts rather than providing commands to copy and paste. The next page, [The GitHub Workflow](github-workflow.md), illustrates the process and provides specific git commands.

Companion is open source—anyone can view and modify the code. While you're free to customize it for your own use, maintaining software quality requires coordination. Git and GitHub are the tools we use to make this possible: GitHub hosts the source code and metadata, while Git manages version control and transfers code between repositories.

:::tip

1. A GUI front-end such as SmartGit, GitGUI, can greatly simplify the overall process. See the tip under [Installing Git](installing-git#install-git) for our recommendations.

2. The instructions on this page describe how to contribute to repositories for which you don't have write permission, which is typically the case when you're contributing to an existing repository. Eventually you may get write-access, for example if you become the maintainer of a Companion module, in which case the flow can be simplified...but it's still good practice to develop new features on a new branch.

:::

## The Fork and Clone Workflow

### Why You Can't Edit Directly

As a new contributor, you don't have permission to modify code directly in the Bitfocus/companion repository. Instead, you'll propose changes from your own copy of the code.

**Forking:** Your first step is to fork the repository. This creates a copy of the repository in your GitHub account while preserving a link to the original repository.

**Cloning:** GitHub's online editor is limited, so you'll want to download the code to your computer. This process, called cloning, gives you the complete source code plus all version history and metadata.

## Making and Tracking Changes

### Understanding Commits

Git is a version control system that lets you track who changed what, when, and why. Rather than recording every keystroke, Git captures meaningful snapshots of your work called commits.

**Branching:** Before you commit anything (see below) create and check out a new branch in your local repo. All changes added (committed) to this branch will be "bundled" for the subsequent pull request described in the next section. The branch allows you to organize your changes into several commits and will provide the mechanism for updating your code in response to reviewer's comments on your proposed code changes.

**Staging:** Before creating a commit, you select which changes to include by "staging" files to what git calls the "index". You don't need to commit everything at once—only the changes that logically belong together. If you edit a staged file again before committing, the file must be re-staged to include those edits in the commit. You can take advantage of this behavior by staging working versions that you can rollback to while testing further code changes.

**Committing:** The commit command creates a snapshot of your staged files. You'll write a commit message describing what the snapshot contains. Git then stores this in its database, allowing you or others to restore that exact state later.

## Sharing Your Changes

### Pushing to Your Fork

Commits initially exist only on your computer. To transfer them to GitHub, you'll "push" them to your remote repository (see the illustration on [The GitHub Workflow](github-workflow.md) page). When you cloned your fork, Git automatically added it as a remote location named "origin." (Note: on the next page we suggest renaming it "personal" -- either way, you push to your fork not to the original bitfocus repo.) Pushing to your fork uploads all commits made since your last push.

### Creating a Pull Request (PR)

Once your changes are in your GitHub fork, you'll create a pull request to propose including them in the original Bitfocus/companion repository. The GitHub website automatically detects your pushed branch and guides you through the process of creating a pull request.

## Avoiding Merge Conflicts

### The Challenge of Concurrent Changes

GitHub indicates whether your pull request can merge automatically. If you're the only person who modified those files, merging is straightforward. However, if someone else changed the same files while you were working, Git faces competing versions and can't automatically decide how to combine them.

In such cases, you or a core developer must manually review both versions and choose which lines to keep. This can break functionality, especially if you've made substantial changes that were tested against the older codebase.

### Pull Before Push

To avoid this situation, adopt the habit of "pulling before pushing"—check for others' changes before uploading yours. This matters even for files you didn't modify, since those changes might affect your code's behavior.

**The Upstream Remote:** Your local repository starts with just one remote: depending on what you cloned, "origin" points either to your fork or the bitfocus repo on GitHub. If you follow the instructions on [The GitHub Workflow](github-workflow.md) page, origin points to the bitfocus repo, so just pull from origin. Some people prefer to clone their fork and call _it_ "origin", in which case the convention is to add the Bitfocus repo as a second remote and call it "upstream." Either way, it is simplest to pull directly from the Bitfocus repo to make sure you're up-to-date.

**PR Workflow:** Pull from upstream to get the latest changes, resolve any conflicts yourself, test thoroughly, then push to your GitHub fork. A good practice is to rebase your branch onto the latest commit (aka HEAD) in the main branch before pushing.

## Growing as a Contributor

If you become a regular contributor, the core developers may grant you write access to the repository, allowing you to push changes directly rather than going through pull requests.
