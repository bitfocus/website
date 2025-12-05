---
title: Making a Companion Release
sidebar_label: Making a Companion Release 
sidebar_position: 1
---

This is the release procedure for Companion, not for modules. You probably don't want this file.

## Major/minor release

### Companion Core

* Starting on the main branch, ensure your local copy is up to date
* create and push a `stable-x.x` branch, we will work from this from now on
* Ensure the changelog is updated for the release
* Ensure the version in each `package.json` is correct. (unless it was already set to 0.0.0)
* Commit and push any changes you have made
* Tag and push the new release from your `stable-x.x` branch.
* Merge the result to main, ideally as a fast-forward merge
* Push the updated main
* Create the new github release https://github.com/bitfocus/companion/releases using the previous one as a template, replacing the changes with the contents of the changelog
* Make sure the builds complete successfully, retry the runs if they fail
* Once the builds have completed, run the [CompanionPi](https://github.com/bitfocus/companion-pi/actions/workflows/companionpi.yml) workflow to produce the new image, providing the name of the git tag you just created.
* Ask the moderators to make a facebook post
* Back on the `main` branch, update the version number to be for the next minor version (eg 3.1.0 should become 3.2.0) and add the new version as an entry in `shared-lib/lib/Paths.cts`
* Merge `main` into `develop`, and ensure the version number conflicts are handled correctly
* Run the release, and make sure the top bar doesnt report the build as experimental or out of date


## Patch release

* Read through the commit history of the `main` branch, to see if there are any fixes that should be applied to the stable branch.
  * If you are unsure, reach out to the author of the fix!
* Ensure the changelog is updated for the release
* Ensure the version in each `package.json` is correct. (unless it was already set to 0.0.0)
* Commit and push any changes you have made
* Tag and push the new release from your `stable-x.x` branch.
* Create the new github release https://github.com/bitfocus/companion/releases using the previous one as a template, replacing the changes with the contents of the changelog
* Make sure the builds complete successfully, retry the runs if they fail
* Once the builds have completed, run the [CompanionPi](https://github.com/bitfocus/companion-pi/actions/workflows/companionpi.yml) workflow to produce the new image, providing the name of the git tag you just created.
* (Rare) Ask the moderators to make a facebook post
* Run the release, and make sure the top bar doesnt report the build as experimental or out of date
