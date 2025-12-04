---
title: Building Companion Binaries
sidebar_label: Building Companion 
sidebar_position: 2
---

:information_source: **Note:** This will produce a Headed build (any Debian-based Linux system with a monitor, keyboard, and mouse). There is not currently a method for creating a distributable build for headless operation.

1. Follow the [instructions for manual installation](/bitfocus/companion/wiki/Manual-Install-on-Raspberry-Pi) (any Debian-based Linux), stopping after step #7

1. This process requires another package that is not included in those instructions:
   ```bash
   sudo apt install libgconf2-dev
   ```
1. Run one of the following commands from within the companion directory to create your distributable build

   - Desktop Linux: `yarn lindist`
   - Raspberry Pi: `yarn rpidist`  
   - Windows: `yarn windist`
   - macOS intel: `yarn macdist`
   - macOS Apple silicon: `yarn macarmdist`

      :warning: _It is not recommended to run Companion on a Raspberry Pi with the desktop environment installed. This information is given simply for the sake of transparency and documentation. If you choose to do this, you do so at your own risk._

1. The build can be found in the electron-output/ sub-directory
