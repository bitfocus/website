---
title: Setting Up WSL for the Developer Environment
sidebar_label: '- WSL Setup Notes'
sidebar_position: 0.2
description: How to set up Windows System for Linux (WSL) for Companion development
---

For other platforms see: [Initial Setup](setting-up-developer-environment.md) instead.

## Install WSL

Although it is possible to develop directly in Windows, there are occasions when you might want to use a Linux environment under Windows. The key is to use Windows' Subsystem for Linux (WSL).

First install Windows Subsystem for Linux version 2 (WSL2),  
WSL is included with Windows but needs to be activated. Follow [Microsoft’s installation instructions](https://learn.microsoft.com/en-us/windows/wsl/setup/environment). Basically, open a command or powershell window and type:

```powershell
   wsl --install
```

After this completes, reboot your computer and WSL will automatically install the latest LTS version of Ubuntu. (24.04 at this time of writing).

## Install the basic development tools

Once this is done continue through Microsoft’s instructions, especially  
 `sudo apt update && sudo apt upgrade`,
as well as the instructions to:

- Set up Windows terminal,
- Set up VS Code, and
- Set up Git.

If you develop with Visual Studio Code, which we currently recommend, then you can do remote developing. That means VS Code runs on Windows but it opens a connection to the WSL virtual machine. It allows you to edit the files in the WSL file system. VS Code also has an integrated terminal so you can work on the WSL OS (typically Ubuntu). For that you should install the [WSL](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) extension and follow [Microsoft’s instructions here](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-vscode). You will see the connection info on the bottom left of each window and you can connect there or by the command palette. You can debug using breakpoints etc. either by starting automatic debugging from the terminal or by attaching to the running Node.js process (though it may be hard to find: it should be the first one in the list when you type ctrl-shift-P and “Debug: Attach to Node Process” but isn't always so).

You will need to install all the prerequisite tools on the WSL machine just like you would do on Linux, as described in the [Setting Up A Developer Environment](setting-up-developer-environment.md).

When you are running Companion from a VS Code terminal, VS Code will know the network ports and create automatic port forwards for you. That means although Companion runs on the virtual machine, you'll be able to access the admin page from your Windows host by accessing localhost or 127.0.0.1 and the used port.  
That makes it quite convenient but you always have to remember that Companion runs on a virtual machine inside of your computer and that virtual machine has a different IP-address. When you want to access the API of software running on your Windows host, you can't use 127.0.0.1 like you would without WSL. 127.0.0.1 is the localhost of the WSL. WSL sets up a virtual network interface for you and to access your host OS, you have to use 172.28.96.1. Verify this using the command `ip route` in your Linux shell.

## Set Up Access to USB Ports

If you want to use USB-devices in WSL, it gets complicated because WSL doesn't have built-in USB passthrough features. The solution is USB over IP software. That means you capture the USB packets at the host, transmit it to the virtual machine and then inject it to the USB system there. Here is how it's done:

You may have to run the following in a Linux shell:

```bash
apt-get update
apt-get install -y libusb-1.0-0-dev libudev-dev libfontconfig1
```

Then:

- On Windows install the [USB-IP driver](https://github.com/dorssel/usbipd-win/releases)
- Optional but highly recommended install a GUI to control the USB connections: [WSL USB Manager](https://gitlab.com/alelec/wsl-usb-gui/-/releases)
- Make sure your WSL kernel is at least version 5.15.150.1 (released Mar 2024) (`uname -a`). If not, update your kernel.
- Linux distributions need extra rules to make USB devices accessible to users:
- Copy the following code into a bash shell (terminal) to create the rules file:

```
sudo cat <<EOF |sudo tee /etc/udev/rules.d/50-companion-WSL.rules
SUBSYSTEM=="usb|hidraw", GROUP="plugdev", MODE:="0666"
EOF

```

- Now reboot the Computer (It may be sufficient to type: `sudo udevadm control --reload-rules`.)
- Open the WSL USB Manager in Windows
- Attach your USB device. You should see it popping up in the top pane of the manager.
- Check the "bound" checkbox next to your USB device (usbip will now remember this permission; you won't have to do it again.)
- Select the USB device by clicking on it and then press the "Attach" button. The device should now move from the top pane to the forwarded devices pane.
- Optional: on the linux shell use `lsusb` to check if you find your device and remember the bus and device number.
- Optional: In the linux shell use `cat /dev/bus/usb/001/003` to check if you have access to the device. Replace the numbers (/001/003) with the bus number and the device number that you have found with lsusb
- _Note: most Companions USB surfaces are handled as HID devices. WSL presents the HID interface through a separate “device” than shown by_ `lsusb` _Instead when an HID device is added via the usb-ip driver, it will set up_ `/dev/hidraw#` where # is an integer starting from 1. If permissions are incorrectly set, Companion will output an error message in the terminal. _You can also test it directly, as above._
