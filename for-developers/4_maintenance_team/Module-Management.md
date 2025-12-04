---
title: Module Management for Core Maintainers
sidebar_label: Module Management 
sidebar_position: 2
---

This section is only for Companion core maintainers. If you want your module added to Companion for general release you need to request a new repository for your module from one of the maintainers. Usually this is done on [our slack](https://bitfocus.io/api/slackinvite) in the #module-development channel.

## Adding a module

First create a new module repo: `companion-module-[brand]-[product]` (all small letters)

Then when the module is ready, tested, and an initial version tag has been added, follow the steps for 'Updating a module'

## Updating a module

Once the changes have been tested, checked, and a new version tag applied in the module repo; trigger the [Github Actions workflow](https://github.com/bitfocus/companion-bundled-modules/actions/workflows/update-module.yml) with the 'Run workflow' button on the right side of the blue info bar, supplying the name and git tag of the module to be updated.

Make sure the workflow doesn't fail (you should get an email if it does). If it fails then you will need to work with the module dev to fix the issue, create a new tag in the repository and try again.

Once that has passed, this will be pulled into the Companion beta builds within 6 hours.

## Removing a module

If there is a need to remove a module, you will need to clone the [bundled modules repository](https://github.com/bitfocus/companion-bundled-modules), delete the folder for the module, then commit and push the changes.

## Renaming a module

This is described for module developers [here](https://github.com/bitfocus/companion-module-base/wiki/Renaming-your-module)