---
title: Bonjour Device Discovery
sidebar_label: Bonjour Device Discovery
sidebar_position: 2
description: How to set up Bonjour Device Discovery in the user configuration.
---

Bonjour is a standardised method of device discovery, utilising MDNS.

Starting with v3.2, Companion allows you to easily discover devices using the Bonjour protocol, thus helping users with configuration.

You can do this by defining a config field such as:

```js
{
	type: 'bonjour-device',
	id: 'bonjour_host',
	label: 'Bonjour Test',
	width: 6,
},
```

and in your `companion/manifest.json`:

```js
	"bonjourQueries": {
		"bonjour_host": {
			"type": "blackmagic",
			"protocol": "tcp",
			"txt": {
				"class": "AtemSwitcher"
			}
		}
	}
```

These two structures are linked by the common id, in the future this will allow us to automate device discovery further.

In the UI, this field will look like:  
![image](../images/bonjour.png)

The 'Manual' option is always shown, and must be handled to allow users to manually specify an address for environments where Bonjour does not work.  
This can be achieved with further config fields such as:

```
{
	type: 'textinput',
	id: 'host',
	label: 'Target IP',
	width: 6,
	isVisible: (options) => !options['bonjour_host'],
	default: '',
	regex: Regex.IP,
},
{
	type: 'static-text',
	id: 'host-filler',
	width: 6,
	label: '',
	isVisible: (options) => !!options['bonjour_host'],
	value: '',
},
```

Note the presence of the `isVisible` function, to control the visibility of the fields depending on whether a bonjour discovered device has been selected. In this example, it is using an empty 'static-text' field, to keep the layout consistent.

In your module code, the `bonjour_host` will have a value such as `10.0.0.1:8000` or null.

### Writing your Bonjour Query

We currently support a subset of the possible query options. In all queries, the `type` and `protocol` must be set.  
If your device needs further filtering, this can be done by specifying any `txt` field values the entries must have.
