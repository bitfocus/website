---
title: 'Renaming a Companion Module'
sidebar_label: 'Rename a module'
sidebar_position: 4
description: How to rename your module after having released it.
---

Occasionally you will need to rename a module, perhaps for example, to make the name more inclusive as you add more devices, or the manufacturer releases a new device.

_TODO: update this. I'm pretty sure it's still possible_

## This process needs a rework

Due to some technical changes on the module inclusion process, this flow may not be possible anymore. We need to review it and reconsider what is possible and allowed

---

1. Make sure you are happy for any changes in the main branch of the module to be included into beta builds of Companion

2. Ask in the module-development slack for approval on the new name  
   This is so that we can be sure the new name conforms to our standard structure of `companion-module-manufacturer-product` (or `companion-module-manufacturer-protocol`).

3. Once approved, the team will be able to rename the GitHub repository for you.

4. Some additional changes need to be made. This might be done for you, or might be left for you to do:
   - Update the `name` and any urls in the `package.json`
   - Update the `name` and related fields in `companion/manifest.json`
   - Add the old name to the `legacyIds` array in `companion/manifest.json`. This lets Companion know of the rename, so that existing users will be migrated across.

5. Once everything is updated, this can be included in the builds

A note for the maintainers running the build script, the old module name will need to be manually removed from the bundled-modules github repository.
