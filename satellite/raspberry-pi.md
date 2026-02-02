---
title: Raspberry Pi Tips
description: Configuration details specific to the Raspberry Pi edition of Companion Satellite.
sidebar_position: 3
---

# Raspberry Pi Tips

This section contains details which are specific to the Raspberry Pi edition of Companion Satellite.

## Setting a Static IP Address

Sometimes you may wish to set a static IP address on your Satellite Pi.

### View Current Connections

You can view your Raspberry Pi's connections with the following command:

```bash
sudo nmcli -p connection show
```

### Configure Static IP

To set the IP address (in this example on "Wired connection 1"), run the following commands to set the Satellite IP and Subnet, Default Gateway, and DNS Server:

```bash
sudo nmcli con mod "Wired connection 1" ipv4.addresses 10.1.1.123/24 ipv4.method manual
sudo nmcli con mod "Wired connection 1" ipv4.gateway 10.1.1.1
sudo nmcli con mod "Wired connection 1" ipv4.dns "10.1.1.1"
```

:::tip
Replace `10.1.1.123/24`, `10.1.1.1`, and the DNS server address with values appropriate for your network.
:::

### Apply the Changes

If you are on the console directly, you can restart the network with the following command:

```bash
sudo nmcli con down "Wired connection 1" && sudo nmcli con up "Wired connection 1"
```

Alternatively, you may reboot the device.

## Reverting to DHCP

To revert back to DHCP, use the following command:

```bash
sudo nmcli con modify "Wired connection 1" ipv4.method auto
```

Then restart the network or reboot.
