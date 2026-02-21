---
title: 'Renaming a Companion Module'
sidebar_label: 'Rename a module'
sidebar_position: 4
description: How to rename your module after having released it.
---

Occasionally you will need to rename a module, perhaps for example, to make the name more inclusive as you add more devices, or the manufacturer releases a new device.

1. Ask in the module-development slack for approval on the new name  
   This is so that we can be sure the new name conforms to our standard structure of `companion-module-manufacturer-product` (or `companion-module-manufacturer-protocol`).

2. Once approved, the team will be able to rename the GitHub repository for you.

3. Some additional changes need to be made. This might be done for you, or might be left for you to do:
   - Update the `name` and any urls in the `package.json`
   - Update the `name` and related fields in `companion/manifest.json`
   - Add the old name to the `legacyIds` array in `companion/manifest.json`. This lets Companion know of the rename, so that existing users will be migrated across.

4. Once everything is updated, you will want to publish a new version and submit that for inclusion

:::tip

When renaming a module like this, you must not decrease the number of upgrade scripts. The count will continue from the old module name, so removing any upgrade scripts will cause new ones to be missed for many users.

:::
