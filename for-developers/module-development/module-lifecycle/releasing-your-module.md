---
title: 'Releasing a Companion Module'
sidebar_label: 'Release a module'
sidebar_position: 3
description: How to release your module for delivery to others using Companion's "web store".
---

Since Companion 4.0, modules get installed on demand from our api. This allows new updates to your module to get into users hands much quicker than before, as long as your module uses a compatible version of the module api.

## First Release

If this is the first release of your module, you will need to request the repository on [Slack](https://bfoc.us/ke7e9dqgaz).

Please post a message in the `#module-development` channel the includes your GitHub username and the desired name of your module in the `manufacturer-product` format.

Once you have a repository, and have pushed your code, you can [release a new version](#releasing-a-new-version)

## Releasing a New Version

When a new version of your module has been tested and is ready for distribution, use the following guide to submit it for review:

1. **Update `package.json` version**
   - Use the `major.minor.patch` format (e.g., `1.2.3`).
   - Refer to the [Versioning of Modules guide](../../git-workflows/versioning.md#version-of-modules) for details.

2. **(Optional) Update `companion/manifest.json` version**
   - This is not required; the build process will override this value with the version from the `package.json`.

3. **Create a Git tag**
   - Prefix the version number with `v` (e.g., `v1.2.3`).
   - You can create the tag by either:
     - [Creating a release on GitHub](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release), or
     - [Creating a local tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging) and pushing it to the repository.

4. **Submit the new version in the [Bitfocus Developer Portal](https://developer.bitfocus.io/)** (login with GitHub).
   - In the sidebar, go to **My Connections** and select the module.
   - Click **Submit Version** (bottom of page).
   - Choose the Git Tag to submit.
   - (Optional) Check **Is Prerelease** if this is a beta release.
   - Click **Submit** to send for review. The version status should show "Pending" after this.

**Notes about the review process:**

- Only versions submitted to the developer portal will be reviewed.
- Reviews are done by volunteers, so review time depends on member availability and the complexity of code changes to be reviewed.
- If adjustments are needed, you'll receive feedback through the developer portal.
- Once approved, the new version of the module becomes immediately available to download for users on Companion v4.0.0+.
