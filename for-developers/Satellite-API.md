---
title: Satellite API
sidebar_label: Satellite API
sidebar_position: 90
toc_max_heading_level: 4
---

It is possible to remotely connect a 'Stream Deck' to companion so that it appears as its own device and follows the paging model. This is different from how the OSC/TCP/UDP servers operate.

This page documents the protocol. The intention is to only ever add non-breaking functionality to this API, and to keep this document updated with new functionality as it is added.

## Companion version support

This lists what versions of Companion introduced support for each API version.

| API Version | Companion Versions |
| ----------- | ------------------ |
| 1.4         | v3.0+              |
| 1.5         | v3.2+              |
| 1.7         | v3.4+              |
| 1.8         | v4.0+              |
| 1.9         | v4.2+              |
| 1.10        | v4.3+              |
| 1.11        | v5.0+              |
| 1.12        | v5.0+              |
| 1.13        | v5.1+              |
| 1.14        | v5.1+              |
| 1.15        | v5.2+              |
| 1.16        | v5.2+              |

## Connection

The server by default runs on port TCP 16622, but this will become configurable in the future. You should make sure to support alternate ports to allow for future compatibility as well as firewalls or router port forwarding.  
As of Companion 3.5, it is also possible to use this protocol over websockets, with a default port of 16623.

Each message is presented as a line, with a `\n` or `\r\n` terminator.  
Messages follow the general format of `COMMAND-NAME ARG1=VAL1 ARG2=true ARG3="VAL3 with spaces"\n`.
Key numbers are in the range of 0-31.

Note: You can send boolean values can as both true/false and 0/1, you will always receive them as 0/1

Upon connection you will receive `BEGIN CompanionVersion=2.2.0-d9008309-3449 ApiVersion=1.0.0` stating the build of companion you are connected to. The `CompanionVersion` field should not be relied on to be meaningful to your application, but can be presented as information to the user, or to aid debugging. You should use the `ApiVersion` field to check compatibility with companion. The number followers [semver](https://semver.org/) for versioning. We hope to keep breaking changes to a minimum, and will do so only when necessary.

On servers that support it (since v1.10.0), `BEGIN` is immediately followed by a `CAPS` message declaring which optional features are available. See [Capabilities](#capabilities) below.

### Messages to send

Upon receiving an unknown command, the server will respond with the format `ERROR MESSAGE="Unknown command: SOMETHING"`  
Known commands will get either a success or error response like the following:

- `COMMAND-NAME ERROR MESSAGE="Some text here"\n`
- `COMMAND-NAME ERROR DEVICEID=00000 MESSAGE="Some text here"\n` (since v1.2.0, `DEVICEID` is included when it is known)
- `COMMAND-NAME OK\n`
- `COMMAND-NAME OK ARG1=arg1\n`

#### Close connection

`QUIT`
Close the connection, removing all registered devices

#### Ping/pong

`PING payload`
Check the server is alive, with an arbitrary payload
Responds with `PONG payload`  
You must call this at an interval, we recommend every 2 seconds, this is to ensure the connection doesn't get closed from being idle.

### Messages to receive

No responses are expected to these unless stated below, and to do so will result in an error.

#### Ping/pong

`PING payload`
The server is checking you are still alive, with an arbitrary payload
You must respond with `PONG payload`

#### Capabilities (Since v1.10.0) {#capabilities}

`CAPS SUBSCRIPTIONS=1`

Sent by the server immediately after `BEGIN`, before any other messages. Declares which optional features are available in this session. If a flag is absent, the client should treat it as disabled.

- `SUBSCRIPTIONS` true/false whether the [Button Subscription](#button-subscriptions-since-v1100) API (`ADD-SUB`, `REMOVE-SUB`, `SUB-PRESS`, `SUB-ROTATE`, `SUB-STATE`) is available
- `NONSQUARE` (since v1.11.0) true/false whether Companion supports rendering non-square buttons. You may wish to use this to adjust how some controls are exposed so that behave sensibly. You can report use non-square control dimensions in complex layouts without this, which will get black borders when needed to make up non-square bitmaps
- `BITMAP_FORMATS` (since v1.12.0) a comma-separated list of the bitmap encodings Companion can stream for button images, e.g. `rgb,png,webp`. `rgb` (raw 8-bit RGB pixel data) is always present as the universal fallback. A client opts into a compressed encoding by sending `BITMAP_FORMAT` in `ADD-DEVICE` or `ADD-SUB`; only formats listed here may be requested, and any other value falls back to `rgb`. See [Bitmap formats](#bitmap-formats-since-v1120).
- `BITMAP_CACHE` (since v1.16.0) true/false whether the client can cache bitmaps, so that Companion sends each one once and refers to it by id afterwards. This is optional, and a client which ignores it works as before. See [Bitmap caching](#bitmap-caching-since-v1160).
- `ROTARY_AMOUNT` (since v1.14.0) true/false whether the server honours a signed magnitude in the `DIRECTION` field of `KEY-ROTATE`/`SUB-ROTATE` to carry a rotation amount (a step count). When absent or false, only the direction is used and each message counts as a single step. See [Rotating an encoder](#rotating-an-encoder-since-v130).

If the server changes the availability of an optional feature at runtime, it will close the connection. The client should reconnect and re-read the new `CAPS` message.

Note: servers older than v1.10.0 do not send `CAPS`. Clients should rely solely on the `ApiVersion` from `BEGIN` to determine whether a feature exists at all; `CAPS` only needs to be checked for features that may be conditionally disabled within a version that otherwise supports them.

## Surfaces

The surface API is the primary way to use the Satellite protocol. It lets your client register one or more virtual surfaces with Companion — each surface appears in the Surfaces table in the UI just like a physical device, follows Companion's page model, and receives streamed button state updates (bitmaps, colours, text) that your client is responsible for rendering.

Two modes are available when registering a surface:

- **Simple mode** — a flat uniform grid of buttons with shared rendering settings. Easiest to implement and sufficient for most use cases.
- **Advanced mode** (since v1.9.0) — individually configurable controls, each with its own rendering style. Suited for mixed surfaces such as a grid of buttons alongside encoders.

Once a surface is registered with `ADD-DEVICE`, Companion will begin streaming `KEY-STATE` updates for every button on the surface. Your client reports user interactions (button presses, encoder rotations) back to Companion using `KEY-PRESS` and `KEY-ROTATE`.

### Messages to send

#### Adding a satellite device

When adding a device, you need to choose between a simple and advanced mode. The advanced mode allows finer grained control definitions, but requires a bit more work. The simple mode is more basic but is sufficient for many use cases and is easier to implement.

`ADD-DEVICE DEVICEID=00000 PRODUCT_NAME="Satellite Streamdeck"`

- `DEVICEID` a unique identifier for this device within the current session. This is the routing key used to address the device in all subsequent messages. If `SERIAL` is not set, or talking to Companion before API v1.10.0, then this is used as the stable hardware serial number (See `SERIAL` below for more)
- `PRODUCT_NAME` is the name of the product to show in the Surfaces table in the UI

Optional parameters (all modes):

- `SERIAL` - (added in v1.10.0) the stable hardware serial number or other persistent identifier for this device. Companion uses this value to match the device to its stored configuration across sessions. If not provided, Companion falls back to using `DEVICEID` for config matching (preserving backward compatibility with older satellites). Recommended format is `type:identifier` (e.g. `streamdeck:AB12CD34`) to avoid collisions between device types.
- `SERIAL_IS_UNIQUE` - (added in v1.10.0) true/false whether the `SERIAL` value uniquely identifies a single physical device. Set to `false` when the hardware does not provide a unique serial number (e.g. some devices report a shared product ID instead of a per-unit serial). When `false`, Companion will not rely on the serial for persistent identification of this specific unit. (default true)
- `BRIGHTNESS` - (added in v1.7.0) true/false whether the device supporting changing brightness (default true)
- `VARIABLES` - (added in v1.7.0) a base64 encoded json array describing any input or output variables supported for this device  
   Each item in the array should be of the form:
  ```
  {
      "id": "some-id", // This is the identifier used when sending/receiving a value for the variable
      "type": "input", // or "output". When set to `input`, this is a value that the satellite device produces. When `output`, a value will be streamed to the satellite device
      "name": "My value", // A user facing name for this variable
      "description": "Something longer about it. eg Supports values in range 0-100", // A longer user facing description of this variable
  }
  ```
- `PINCODE_LOCK` - (added in v1.8.0) you can set to indicate that you will handle display of the pincode locked state. set to `FULL` to indicate that you will handle display and input or to `PARTIAL` to indicate that you will handle display and the user will not be able to input a pincode. (Partial mode has no difference in behaviour currently, but we will utilise it in the future)
- `CONFIG_FIELDS` - (added in v1.10.0) a base64-encoded JSON array of custom config field definitions to expose in the Companion UI for this device. See schema in [`satellite-protocol/assets/satellite-config-fields.schema.json`](https://github.com/bitfocus/companion/blob/main/satellite-protocol/assets/satellite-config-fields.schema.json). When provided, Companion will render these fields in the surface settings panel and push the stored values back to the device via `DEVICE-CONFIG` after the device is registered and again whenever the user changes them.
- `CAN_CHANGE_PAGE` - (added in v1.10.0) a label string indicating that the device is capable of initiating page changes (e.g. via a swipe gesture or dedicated page-up/down button). When provided, Companion adds a checkbox with this label to the surface settings panel, letting the user control whether the device is allowed to change pages. The device can then send `CHANGE-PAGE` messages to navigate between pages.
- `BITMAP_FORMAT` - (added in v1.12.0) the encoding Companion should use for streamed button bitmaps. Must be one of the values advertised in `BITMAP_FORMATS` in [`CAPS`](#capabilities) (`rgb`, `png` or `webp`). Defaults to `rgb` when omitted, or when set to a format that was not advertised. See [Bitmap formats](#bitmap-formats-since-v1120) for how this affects the `BITMAP` field in `KEY-STATE`.

##### Simple mode

Describe the surface as a flat grid of uniform buttons. All buttons share the same rendering settings.

- `KEYS_TOTAL` - number of keys the device has. (default 32) Valid values varies depending on API Version:
  - Since 1.5.1, this can be any integer value >= 1
  - Before 1.5.1, must be in the range 1-32
- `KEYS_PER_ROW` - number of keys per row. (default 8) Valid values varies depending on API Version:
  - Since 1.5.1, this can be any integer value >= 1
  - Before 1.5.1, must be in the range 1-8
- `BITMAPS` - This varies depending on API Version:
  - Since 1.5.0, this is a number specifying the desired size of the bitmaps. If 0 or false, then bitmaps will not be streamed. If 1 or true, they will be 72px (default 72)
  - Before 1.5.0, this is true/false whether you want to be streamed bitmaps for display on the buttons (default true)
- `COLORS` - This varies depending on API Version:
  - Since 1.6.0 true/false/'hex'/'rgb'
  - Before 1.6 true/false whether you want to be streamed colors for display on the buttons and in which format (default false).  
    If you specify true or 'hex', you'll get color readouts in hexadecimal notation, if you specify 'rgb', you'll get color readouts in css rgb notation without spaces.
- `TEXT` - true/false whether you want to be streamed button text for display on the buttons (default false)
- `TEXT_STYLE` - (added in v1.4.0) true/false whether you want to be streamed text style information for display on the buttons (default false)

In simple mode, `KEY-PRESS`, `KEY-ROTATE` and `KEY-STATE` use `KEY` to identify controls.

##### Advanced mode (since v1.9.0)

Describe a surface with individually configurable controls, where each control can have its own rendering settings. When `LAYOUT_MANIFEST` is provided, the simple mode parameters (`KEYS_TOTAL`, `KEYS_PER_ROW`, `BITMAPS`, `COLORS`, `TEXT`, `TEXT_STYLE`) are ignored. `KEY-PRESS`, `KEY-ROTATE` and `KEY-STATE` use `CONTROLID` to identify controls by the ID defined in the manifest.

- `LAYOUT_MANIFEST` - a base64-encoded JSON object describing the surface layout. The full schema is defined in [`satellite-protocol/assets/satellite-surface.schema.json`](https://github.com/bitfocus/companion/blob/main/satellite-protocol/assets/satellite-surface.schema.json).

The manifest has two top-level properties:

- `stylePresets` — a named map of rendering style presets. The `default` preset is required and is used as the fallback for any control that does not specify its own. Each preset can define:
  - `bitmap` — if set, bitmaps of the given pixel dimensions will be streamed, e.g. `{ "w": 72, "h": 72 }`
  - `colors` — stream colour data; `"hex"` for hexadecimal notation or `"rgb"` for CSS rgb notation
  - `text` — `true` to stream button text
  - `textStyle` — `true` to stream text style properties (e.g. font size)
  - `leds` — (since v1.13.0) if set, the control has an addressable strip or ring of LEDs (e.g. the ring around a Stream Deck Studio encoder) which a gauge on the button can drive. Takes `{ "segments": 24, "mode": "full-ring" }`, where `segments` is the number of individually addressable LEDs and `mode` is `"full-ring"` or `"simple"`. The colours are streamed in the `LEDS` field of `KEY-STATE`. See [LED strips and rings](#led-strips-and-rings-since-v1130).
- `controls` — a map of control IDs to their definitions. The ID (alphanumeric, `-`, `/`) is what gets used as `CONTROLID` in subsequent messages. Each entry defines:
  - `row` — zero-based row index (required)
  - `column` — zero-based column index (required)
  - `stylePreset` — name of a style preset to use for this control (optional, defaults to `default`)

Example manifest (before base64 encoding):

```json
{
  "stylePresets": {
    "default": { "bitmap": { "w": 72, "h": 72 }, "colors": "hex" },
    "encoder": { "colors": "hex", "leds": { "segments": 24, "mode": "full-ring" } }
  },
  "controls": {
    "0/0": { "row": 0, "column": 0 },
    "0/1": { "row": 0, "column": 1 },
    "enc/0": { "row": 0, "column": 2, "stylePreset": "encoder" }
  }
}
```

#### Removing a satellite device

`REMOVE-DEVICE DEVICEID=00000`

- `DEVICEID` the unique identifier used to add the device

#### Pressing a key

Simple mode: `KEY-PRESS DEVICEID=00000 KEY=0 PRESSED=true`  
Advanced mode (since v1.9.0): `KEY-PRESS DEVICEID=00000 CONTROLID="0/0" PRESSED=true`

- `DEVICEID` the unique identifier used to add the device
- `KEY` (simple mode) number of the key which is pressed/released. Since v1.6 this can be either a legacy key number or the local row/column starting at top left with `0/0` and counting up towards bottom/right
- `CONTROLID` (advanced mode, since v1.9.0) the ID of the control as defined in the `LAYOUT_MANIFEST`
- `PRESSED` true/false whether the key is pressed

#### Rotating an encoder (Since v1.3.0)

Note: there is a checkbox to enable this per bank inside Companion, allowing users to define the actions to execute

Simple mode: `KEY-ROTATE DEVICEID=00000 KEY=0 DIRECTION=1`  
Advanced mode (since v1.9.0): `KEY-ROTATE DEVICEID=00000 CONTROLID="enc/0" DIRECTION=1`

- `DEVICEID` the unique identifier used to add the device
- `KEY` (simple mode) number of the key/encoder which is rotated. Since v1.6 this can be either a legacy key number or the local row/column starting at top left with `0/0` and counting up towards bottom/right
- `CONTROLID` (advanced mode, since v1.9.0) the ID of the control as defined in the `LAYOUT_MANIFEST`
- `DIRECTION` direction and number of steps, as a signed number: positive is right (clockwise), negative is left. `1`/`-1` are a single step, and `0` is a single step left (legacy). Magnitudes above 1 require `ROTARY_AMOUNT=1` in [`CAPS`](#capabilities) (since v1.14.0); older servers treat any non-zero value as a single step, so it degrades gracefully.

#### Updating a variable (Since v1.7.0)

This can be used when input variables are defined as part of `ADD-DEVICE`.

`SET-VARIABLE-VALUE DEVICEID=00000 VARIABLE="some-id" VALUE="abc="`

- `DEVICEID` the unique identifier used to add the device
- `VARIABLE` the id of the variable being updated
- `VALUE` the value of the variable, base64 encoded. The encoding is so that special characters and newlines don't have to be escaped, avoiding a wide range of easy to trigger bugs.

The success response echoes the variable name: `SET-VARIABLE-VALUE OK VARIABLE="some-id"` (since v1.7.1)

#### Pincode key press (Since v1.8.0)

When handling the pincode locked state yourself, report a pincode key was pressed

`PINCODE-KEY DEVICEID=00000 KEY=1`

- `DEVICEID` the unique identifier used to add the device
- `KEY` the value of the pressed key (0-9)

Note: depending on your surface, this may not translate directly to a button press.

#### Changing page (Since v1.10.0)

Request that Companion navigate the surface to the next or previous page. This message is only valid if `CAN_CHANGE_PAGE` was set when adding the device.

The request is silently ignored if the user has disabled the page-change checkbox for this surface in the settings UI. Companion will always respond with `OK`.

`CHANGE-PAGE DEVICEID=00000 DIRECTION=1`

- `DEVICEID` the unique identifier used to add the device
- `DIRECTION` direction to navigate. `1` for next page, `0` for previous page. Next/previous respects Companion's page order and any page restrictions configured for the surface group.

#### Firmware update available (Since v1.10.0)

Notify Companion that a firmware update is available (or no longer available) for this device. When `UPDATE_URL` is set to a non-empty value, Companion will show a firmware update indicator in the UI with a link to that URL. Set `UPDATE_URL` to an empty string to clear the update notification.

`FIRMWARE-UPDATE-INFO DEVICEID=00000 UPDATE_URL="https://example.com/firmware"`

`FIRMWARE-UPDATE-INFO DEVICEID=00000 UPDATE_URL=""`

- `DEVICEID` the unique identifier used to add the device
- `UPDATE_URL` URL to the firmware update page or download; set to empty string to clear the update notification

#### Describing the surface appearance (Since v1.15.0)

Tell Companion how to draw the face of the device in its UI. Send this after `ADD-DEVICE` has replied `OK`, every time the device is added. Companion does not keep the appearance from a previous connection. You can send it again at any time to replace the appearance.

`DEVICE-APPEARANCE DEVICEID=00000 APPEARANCE="eyJzaXplIjp7IndpZHRoIjo..."`

- `DEVICEID` the unique identifier used to add the device
- `APPEARANCE` a base64-encoded JSON object describing the face of the surface. The schema is defined in [`satellite-protocol/assets/satellite-surface-appearance.schema.json`](https://github.com/bitfocus/companion/blob/main/satellite-protocol/assets/satellite-surface-appearance.schema.json). See [Surface appearance](#surface-appearance-since-v1150).

Companion replies `DEVICE-APPEARANCE OK DEVICEID=00000`. If the appearance is not valid, it replies `DEVICE-APPEARANCE ERROR DEVICEID=00000 MESSAGE="..."` with the reason, and keeps the appearance it had before. The device stays added either way.

### Messages to receive

No responses are expected to these unless stated below, and to do so will result in an error.

#### State change for key

Simple mode: `KEY-STATE DEVICEID=00000 KEY=0 BITMAP=abcabcabc COLOR=#00ff00`  
Advanced mode (since v1.9.0): `KEY-STATE DEVICEID=00000 CONTROLID="0/0" BITMAP=abcabcabc COLOR=#00ff00`

- `DEVICEID` the unique identifier of the device
- `KEY` (simple mode) number of the key which the pixel buffer is for
- `CONTROLID` (advanced mode, since v1.9.0) the ID of the control as defined in the `LAYOUT_MANIFEST`
- `TYPE` type of the key. (added in v1.1.0) Either `BUTTON`, `PAGEUP`, `PAGEDOWN` or `PAGENUM`
- `PRESSED` true/false whether the key is currently held down. (added in v1.1.0)
- `LOCATION` (since v1.10.0) the absolute location of the button in the format `page/row/column` (e.g. `3/1/0`). This is sent for all button types, but is not always set.

Optional parameters (sent based on the control's resolved style preset):

- `BITMAP` button image data. Sent when the control's style preset has `bitmap` set (simple mode: when `BITMAPS` was enabled). Resolution follows the size defined in the style preset. The encoding depends on the `BITMAP_FORMAT` negotiated in `ADD-DEVICE` (since v1.12.0): when `rgb` (the default) this is base64-encoded raw 8-bit RGB pixel data; when `png` or `webp` this is a self-describing data url (e.g. `data:image/webp;base64,...`). See [Bitmap formats](#bitmap-formats-since-v1120).
- `BITMAP_ID` (added in v1.16.0) only sent when the client has opted in to [Bitmap caching](#bitmap-caching-since-v1160), which also changes when `BITMAP` is sent.
- `COLOR` hex or css encoded 8-bit RGB color for the key background. Sent when the control's style preset has `colors` set (simple mode: when `COLORS` was set)
- `TEXTCOLOR` hex or css encoded 8-bit RGB color for the key text. Sent when the control's style preset has `colors` set (simple mode: when `COLORS` was set) (added in v1.6)
- `TEXT` base64 encoded text as should be displayed on the key. Sent when the control's style preset has `text` set (simple mode: when `TEXT` was true)
- `FONT_SIZE` numeric size that should be used when displaying the text on the key. Sent when the control's style preset has `textStyle` set (simple mode: when `TEXT_STYLE` was true) (added in v1.4.0)
- `LEDS` (added in v1.13.0) the colour of each LED segment, as base64 of a packed raw RGB buffer (3 bytes per segment, `segments * 3` bytes in total). Sent when the control's style preset has `leds` set and a gauge on the button is driving them; when it is absent, treat the LEDs as off. Unlike `BITMAP`, this is always raw RGB and is unaffected by `BITMAP_FORMAT`. See [LED strips and rings](#led-strips-and-rings-since-v1130).

Note: expect more parameters to be added to this message over time. Some could increase the frequency of the message being received.

#### Reset all keys to black

`KEYS-CLEAR DEVICEID=00000`

- `DEVICEID` the unique identifier of the device

#### Change brightness

`BRIGHTNESS DEVICEID=00000 VALUE=100`

- `DEVICEID` the unique identifier of the device
- `VALUE` brightness number in range 0-100

#### Update of a variable (Since v1.7.0)

This can be received when output variables are defined as part of `ADD-DEVICE`.

`VARIABLE-VALUE DEVICEID=00000 VARIABLE="some-id" VALUE="abc="`

- `DEVICEID` the unique identifier used to add the device
- `VARIABLE` the id of the variable being updated
- `VALUE` the value of the variable, base64 encoded. The encoding is so that special characters and newlines don't have to be escaped, avoiding a wide range of easy to trigger bugs.

#### Locked state update (Since v1.8.0)

This can be received when `PINCODE_LOCK` was specified when adding the device

`LOCKED-STATE DEVICEID=00000 LOCKED=true CHARACTER_COUNT=0`

- `DEVICEID` the unique identifier used to add the device
- `LOCKED` whether the surface is locked
- `CHARACTER_COUNT` how many characters have been entered for the pincode
- `ROTATION` (optional) the current rotation of the surface in degrees (0, 90, -90, 180) (added in v1.10.1)

Between this reporting `LOCKED=true` and `LOCKED=false`, you will not receive any other drawing messages, and any input messages you send will be ignored.

#### Device config update (Since v1.10.0)

Sent when `CONFIG_FIELDS` was declared in `ADD-DEVICE`. If your surface defines any config fields, Companion will send this message once immediately after the device is registered (`ADD-DEVICE OK`) and again whenever the user changes a config value in the UI.

`DEVICE-CONFIG DEVICEID=00000 CONFIG="eyJteS1maWVsZCI6InNvbWUtdmFsdWUifQ=="`

- `DEVICEID` the unique identifier used to add the device
- `CONFIG` base64-encoded JSON object where each key is a field `id` from `CONFIG_FIELDS` and the value is the current stored value for that field

## Button Subscriptions (Since v1.10.0)

The subscription API lets a client observe any individual button at an absolute location in Companion — without registering a surface. This is useful for custom UIs, secondary displays, or any scenario where you want to monitor or interact with a specific button rather than presenting a full surface to Companion.

Each subscription is identified by a client-chosen `SUBID`. The `SUBID` may contain alphanumeric characters, `-`, and `/` (the same rules as `CONTROLID`). It must be unique within the connection.

A location is expressed as `PAGE/ROW/COL` using Companion's native location syntax, e.g. `1/2/3` for page 1, row 2, column 3.

Subscribing to a location that does not contain a button is valid — Companion will respond with `OK` and immediately stream an empty button.

### Messages to send

#### Subscribe to a button

`ADD-SUB SUBID=myid LOCATION=1/2/3`

- `SUBID` unique identifier for this subscription, chosen by the client
- `LOCATION` the button location in `PAGE/ROW/COL` format
- `BITMAP_FORMAT` (since v1.12.0) the encoding Companion should use for streamed bitmaps. Must be one of the values advertised in `BITMAP_FORMATS` in [`CAPS`](#capabilities) (`rgb`, `png` or `webp`). Defaults to `rgb` when omitted or set to a format that was not advertised. Applies whether simple or advanced style is used. See [Bitmap formats](#bitmap-formats-since-v1120).

Two modes are available for specifying what should be streamed. At least one style option should be set for useful output.

##### Simple style

Flat parameters, mirrors the simple surface mode:

- `BITMAP` a number specifying the desired square bitmap size in pixels. If 0 or false, bitmaps will not be streamed.
- `COLORS` stream colour data; `hex` for hexadecimal notation or `rgb` for CSS rgb notation
- `TEXT` true/false whether you want button text streamed (default false)
- `TEXT_STYLE` true/false whether you want text style properties streamed (default false)

##### Advanced style

- `STYLE` a base64-encoded JSON object following the `SatelliteControlStylePreset` schema defined in [`satellite-protocol/assets/satellite-surface.schema.json`](https://github.com/bitfocus/companion/blob/main/satellite-protocol/assets/satellite-surface.schema.json). When `STYLE` is provided, the simple style parameters (`BITMAP`, `COLORS`, `TEXT`, `TEXT_STYLE`) are ignored.

The object can define:

- `bitmap` — if set, bitmaps of the given pixel dimensions will be streamed, e.g. `{ "w": 72, "h": 72 }`. Unlike the simple mode `BITMAP`, this allows non-square dimensions.
- `colors` — stream colour data; `"hex"` for hexadecimal notation or `"rgb"` for CSS rgb notation
- `text` — `true` to stream button text
- `textStyle` — `true` to stream text style properties (e.g. font size)
- `leds` — (since v1.13.0) if set, the colours for an addressable strip or ring of LEDs will be streamed in the `LEDS` field of `SUB-STATE`. Takes `{ "segments": 24, "mode": "full-ring" }`. There is no simple style equivalent of this. See [LED strips and rings](#led-strips-and-rings-since-v1130).

Example `STYLE` value (before base64 encoding):

```json
{ "bitmap": { "w": 72, "h": 72 }, "colors": "hex", "text": true }
```

This matches the json format used for the surface advanced mode.

Upon success, Companion immediately sends a `SUB-STATE` message with the current state of the button.

#### Unsubscribe from a button

`REMOVE-SUB SUBID=myid`

- `SUBID` the identifier of the subscription to remove

No further `SUB-STATE` messages will be sent for this `SUBID`.

#### Reporting a button press

`SUB-PRESS SUBID=myid PRESSED=true`

- `SUBID` the subscription identifier
- `PRESSED` true/false whether the button is pressed

#### Reporting an encoder rotation

`SUB-ROTATE SUBID=myid DIRECTION=1`

- `SUBID` the subscription identifier
- `DIRECTION` direction and number of steps, as a signed number: positive is right (clockwise), negative is left. `1`/`-1` are a single step, and `0` is a single step left (legacy). Magnitudes above 1 require `ROTARY_AMOUNT=1` in [`CAPS`](#capabilities) (since v1.14.0); older servers treat any non-zero value as a single step, so it degrades gracefully.

Note: there is a checkbox to enable rotation actions per button inside Companion, allowing users to define the actions to execute.

### Messages to receive

No response is expected to these messages.

#### Button state update

`SUB-STATE SUBID=myid TYPE=BUTTON`

Sent immediately after a successful `ADD-SUB` and again whenever the button's state changes.

- `SUBID` the subscription identifier
- `TYPE` type of the location. Either `BUTTON`, `PAGEUP`, `PAGEDOWN` or `PAGENUM`
- `PRESSED` true/false whether the button is currently held down.

Optional parameters (sent based on the style options specified in `ADD-SUB`):

- `BITMAP` button image data. Sent when `BITMAP` (or `bitmap` in advanced style) was set in `ADD-SUB`. Resolution matches the size requested. The encoding depends on the `BITMAP_FORMAT` negotiated in `ADD-SUB` (since v1.12.0): when `rgb` (the default) this is base64-encoded raw 8-bit RGB pixel data; when `png` or `webp` this is a self-describing data url (e.g. `data:image/png;base64,...`). See [Bitmap formats](#bitmap-formats-since-v1120).
- `BITMAP_ID` (added in v1.16.0) only sent when the client has opted in to [Bitmap caching](#bitmap-caching-since-v1160), which also changes when `BITMAP` is sent.
- `COLOR` hex or css encoded 8-bit RGB color for the button background. Sent when `COLORS` was set in `ADD-SUB`.
- `TEXTCOLOR` hex or css encoded 8-bit RGB color for the button text. Sent when `COLORS` was set in `ADD-SUB`.
- `TEXT` base64 encoded text as should be displayed on the button. Sent when `TEXT=true` was set in `ADD-SUB`.
- `FONT_SIZE` numeric size that should be used when displaying the text on the button. Sent when `TEXT_STYLE=true` was set in `ADD-SUB`.
- `LEDS` (added in v1.13.0) the colour of each LED segment, as base64 of a packed raw RGB buffer (3 bytes per segment). Sent when `leds` was set in the advanced style and a gauge on the button is driving them; when it is absent, treat the LEDs as off. Unlike `BITMAP`, this is always raw RGB and is unaffected by `BITMAP_FORMAT`. See [LED strips and rings](#led-strips-and-rings-since-v1130).

Note: expect more parameters to be added to this message over time. Some could increase the frequency of the message being received.

## Bitmap formats (Since v1.12.0)

By default, button bitmaps are streamed as raw 8-bit RGB pixel data, base64 encoded. From v1.12.0, a client can instead negotiate a compressed image encoding, which can significantly reduce the amount of data sent for each button update.

### Negotiation

1. On connection, Companion advertises the encodings it can produce in the `BITMAP_FORMATS` field of the [`CAPS`](#capabilities) message, e.g. `BITMAP_FORMATS=rgb,png,webp`. `rgb` is always present as the universal fallback.
2. The client requests one of these encodings via the `BITMAP_FORMAT` parameter when registering a surface (`ADD-DEVICE`) or a subscription (`ADD-SUB`).
3. Companion streams the `BITMAP` field of `KEY-STATE`/`SUB-STATE` using the negotiated encoding.

If `BITMAP_FORMAT` is omitted, or set to a value that was not advertised in `BITMAP_FORMATS`, Companion falls back to `rgb`. This keeps older satellites — which never send `BITMAP_FORMAT` and have no image decoder — working unchanged. Servers older than v1.12.0 do not send `BITMAP_FORMATS` and ignore `BITMAP_FORMAT`; such clients always receive `rgb`.

### Available formats

- `rgb` — raw 8-bit RGB pixel data, base64 encoded. The `BITMAP` field is the bare base64 string.
- `png` — PNG image, encoded losslessly.
- `webp` — WebP image, encoded losslessly.

`png` and `webp` are encoded losslessly, so the decoded image is pixel-identical to the equivalent `rgb` buffer.

### Distinguishing the encoding on receipt

When a compressed format is used, the `BITMAP` field is a self-describing [data url](https://developer.mozilla.org/en-US/docs/Web/URI/Schemes/data) (e.g. `data:image/webp;base64,...`), rather than a bare base64 string. A client can therefore tell raw rgb apart from a compressed image by checking for the `data:` prefix, which is useful if your client may receive either encoding (for example across reconnects).

## LED strips and rings (Since v1.13.0)

Some surfaces have an addressable strip or ring of LEDs attached to a control, such as the ring around a Stream Deck Studio encoder. From v1.13.0, a gauge element on a button can drive these LEDs, with Companion sampling the gauge down to one colour per LED segment and streaming the result.

There is no `CAPS` flag for this; a client can use it whenever the `ApiVersion` from `BEGIN` is 1.13.0 or newer.

### Declaring the LEDs

LEDs are declared on a style preset, so this is only available in the advanced modes — the `LAYOUT_MANIFEST` of `ADD-DEVICE` for a surface, or the `STYLE` of `ADD-SUB` for a subscription. There is no simple mode equivalent.

```json
{ "colors": "hex", "leds": { "segments": 24, "mode": "full-ring" } }
```

- `segments` — the number of individually addressable LED segments. Must be 1 or more.
- `mode` — how Companion should map a gauge onto these LEDs:
  - `full-ring` — the LEDs form a complete circle, so the gauge can be rendered faithfully: its angles, deadzone and colours are respected 1:1. Segment 0 is at 6 o'clock and indices increase clockwise. This is only honoured when the button's gauge is actually a ring; other gauge shapes fall back to `simple`.
  - `simple` — any other shape, such as a straight strip. The gauge's value is swept across all of the segments, with segment 0 as the 0% end and the last segment as the 100% end. The gauge's angles are ignored.

These describe the logical ordering that Companion streams. If your hardware is wired differently (a different starting LED, or the opposite direction), re-map the segments locally when applying them.

### Applying the colours

When a gauge on the button is driving the LEDs, `KEY-STATE`/`SUB-STATE` include a `LEDS` field. This is base64 of a packed raw RGB buffer, with 3 bytes per segment in the logical order described above, so it always decodes to exactly `segments * 3` bytes.

Unlike `BITMAP`, this is always raw RGB — it is never a data url and is not affected by the [bitmap format](#bitmap-formats-since-v1120) negotiated in `ADD-DEVICE`/`ADD-SUB`.

A few things to expect:

- If the button has no gauge assigned to LED output, the `LEDS` field is not sent at all. Treat this as all segments being off.
- In `full-ring` mode, segments which fall in the gauge's deadzone (outside its swept arc) are black.
- If your LEDs are monochrome, you can flatten each colour to a single intensity, for example with the Rec.709 luma coefficients (`0.2126 * r + 0.7152 * g + 0.0722 * b`).

## Surface appearance (Since v1.15.0)

Companion can draw a picture of a surface in its UI. Without any extra information it works this out from the rows and columns of the layout, which gives a plain grid. From v1.15.0 a client can send [`DEVICE-APPEARANCE`](#describing-the-surface-appearance-since-v1150) to describe what the device actually looks like, so that it is drawn like the real hardware.

This is a separate message rather than part of `ADD-DEVICE` so that a large `bodyImage` does not push `ADD-DEVICE` past the maximum line length. Companion closes the connection if a single line is longer than 2MB.

There is no `CAPS` flag for this. A client can send it whenever the `ApiVersion` from `BEGIN` is 1.15.0 or newer.

The appearance sits on top of the layout and uses the same control IDs. In advanced mode these are the IDs in `LAYOUT_MANIFEST`. In simple mode they are `row/column` for each key, for example `0/0`, `0/1`. The appearance only changes how the surface is drawn. It does not change which controls exist or what Companion streams to them.

### The appearance object

Positions are measured from the top left of the face, with y going down. All measurements are in arbitrary "face units" set by `size`, and only the proportions matter. Many clients use millimetres.

- `size` (required) — `{ "width": 120, "height": 80 }`, the size of the whole face.
- `bodyColor` (required) — the colour of the device itself, as `#rrggbb`. This should be the real colour of the case, not a colour picked to suit a theme. Without a `bodyImage` it fills the face. With one, it is still used to tell the face apart from whatever is behind it.
- `bodyImage` (optional) — artwork for the face, as a base64 `data:` URI (`data:image/svg+xml;base64,...`, `data:image/png;base64,...` or `data:image/webp;base64,...`). It is drawn over `bodyColor` and under the controls. SVG is preferred. An SVG must use a `viewBox` of `0 0 <size.width> <size.height>` so the artwork lines up with the control positions. A raster image is stretched to fill `size`. The whole URI is limited to 512KiB.
- `controls` (required) — a map of control IDs to where each control sits. **Every control in the layout must be listed here, or the whole appearance is refused.** IDs that are not in the layout are ignored. Each entry has:
  - `x`, `y` (required) — the position of the control's top left corner on the face.
  - `width`, `height` (required) — the size of the control.
  - `kind` (optional) — what kind of control it is, so it can be drawn as one: `button` (default), `encoder`, `jog`, `shuttle` or `lcd-segment`.
  - `shape` (optional) — how the control is drawn, either `{ "shape": "rect", "cornerRadius": 2 }` or `{ "shape": "ellipse" }`. An `ellipse` fits inside the control's bounds. The default is an ellipse for `jog` and `shuttle`, and a square-cornered rectangle for everything else. This is ignored for an `encoder`, which is always drawn as an ellipse. For a pill shape, such as a touch strip segment, use half the shorter side as the `cornerRadius`.
  - `label` (optional) — the text printed on the hardware, if there is any, such as `CUT`. Up to 64 characters. It is drawn on the face where there is no artwork.

Controls may go past the edges of `size`, and they may overlap. A later entry is drawn and hit-tested on top of an earlier one.

Example appearance for the manifest shown in [Advanced mode](#advanced-mode-since-v190) (before base64 encoding):

```json
{
  "size": { "width": 90, "height": 34 },
  "bodyColor": "#202020",
  "controls": {
    "0/0": { "x": 4, "y": 6, "width": 22, "height": 22, "shape": { "shape": "rect", "cornerRadius": 3 } },
    "0/1": {
      "x": 32,
      "y": 6,
      "width": 22,
      "height": 22,
      "shape": { "shape": "rect", "cornerRadius": 3 },
      "label": "CUT"
    },
    "enc/0": { "x": 62, "y": 5, "width": 24, "height": 24, "kind": "encoder" }
  }
}
```

## Bitmap caching (Since v1.16.0)

An animated button is redrawn on every tick of Companion's 10Hz render clock, and a button which flips between states shows the same few images over and over. Normally each of those is sent as a full `BITMAP`. From v1.16.0 a client can opt in to caching bitmaps, so that Companion sends each one once and afterwards refers to it by a short id. This saves bandwidth, and Companion also skips drawing and encoding a bitmap the client already has.

Caching is optional. A client which never opts in receives exactly what it did before. It is a good idea to get a client working without caching first, then add it.

Companion advertises support with `BITMAP_CACHE` in [`CAPS`](#capabilities).

### How it works

**Companion manages the cache, and the client follows its instructions.** Companion decides which bitmaps the client stores and which it evicts, and keeps an exact record of what the client holds. The client never evicts anything on its own. This means a reference to a bitmap never misses, and there are no round trips in normal operation.

- The cache belongs to the connection, not to a device. All the devices and subscriptions on one connection share it. Bitmap ids depend on the image and its size, so the same frame at the same size is stored once.
- The client sets a budget in bytes. Companion evicts the least recently used bitmaps to stay within it.
- Each bitmap is assumed to cost its size as RGBA (`width × height × 4`), whatever format it was sent in. If the client stores bitmaps differently, it can report what each one really costs, and Companion uses that instead.
- The client can change the budget at any time, and can purge the cache by setting the budget to 0.
- The cache only lasts as long as the connection.

### Rules for clients

These rules are what make it safe for Companion to refer to a bitmap without checking first. A client that breaks any of them will be told to draw bitmaps it doesn't have.

1. **Apply every message in the order it arrives.** In particular, apply a `BITMAP-EVICT` before storing the bitmap in the message that follows it. Companion sends the eviction first precisely so that there is room.
2. **Store exactly what you are told to, and evict only what you are told to.** When a `KEY-STATE` or `SUB-STATE` has both `BITMAP` and `BITMAP_ID`, store it. When a `BITMAP-EVICT` arrives, drop those bitmaps. Never drop a bitmap for any other reason.
3. **Never evict anything on your own, even when short of memory.** Send a smaller budget with `BITMAP-CACHE` instead, and let Companion choose what goes. Keep everything until the `BITMAP-EVICT` messages arrive. To free everything, send `BYTES=0` and wait for the `OK`.
4. **Report the real cost if you store bitmaps as anything other than RGBA.** Otherwise Companion assumes `width × height × 4` bytes per bitmap, and your real memory use won't match the budget.

### Messages to send

#### Setting the cache budget

`BITMAP-CACHE BYTES=4000000`

- `BYTES` the budget in bytes. The first time this is sent with a non-zero value, caching is turned on. After that, sending it again resizes the cache. `0` purges the cache and turns caching off.

Companion replies with `BITMAP-CACHE OK BYTES=4000000`. Before the reply it sends any `BITMAP-EVICT` messages needed to fit the new budget, so by the time the client receives the `OK` its cache already fits. Every message after the `OK` uses the new budget.

This can be sent at any time, for example when a device is added or removed, or when the client is short of memory. Shrinking evicts the least recently used bitmaps. Growing evicts nothing.

To get its memory back quickly, a client can send `BYTES=0`. **The client must not empty its cache itself until it receives the `OK`.** Messages that are already on their way may still refer to cached bitmaps. Companion sends `BITMAP-EVICT ALL=1` before the `OK`, and that is the point at which the client should drop everything. After the `OK`, Companion sends full bitmaps with no ids until caching is turned on again.

#### Reporting the cost of a bitmap

`BITMAP-COST BITMAP_ID=AbCdEf0123456789 BYTES=2048`

- `BITMAP_ID` the id of a bitmap the client is holding
- `BYTES` what the bitmap really costs the client to store

This is optional. A client which stores bitmaps as RGBA, or is happy for Companion to count them that way, never needs to send it. It is useful when the client stores something smaller, such as the compressed data as received or a device-specific format, as more bitmaps can then fit in the same budget. It can be sent whenever the client knows the cost, and again if the cost changes later.

Reporting a cost does not count as using the bitmap, so it doesn't change which bitmaps are evicted first. If the new cost takes the total over budget, Companion evicts the least recently used bitmaps, which may include this one. A report for a bitmap which has already been evicted is ignored. There is no reply unless the message is invalid.

### Messages to receive

#### Evicting bitmaps

`BITMAP-EVICT BITMAP_IDS=AbCdEf0123456789,GhIjKl9876543210`  
`BITMAP-EVICT ALL=1`

The client must drop the listed bitmaps, or all of them for `ALL=1`. Companion sends this before a bitmap that needs the room, after a cost report that pushes the total over budget, or while shrinking the cache. A long list may be split over several messages.

#### Bitmaps in state updates

Once caching is on, `KEY-STATE` and `SUB-STATE` may carry a `BITMAP_ID`:

- `BITMAP_ID` with `BITMAP`: store the bitmap under this id, then draw it.
- `BITMAP_ID` without `BITMAP`: draw the bitmap already stored under this id.
- `BITMAP` without `BITMAP_ID`: draw it, and do not store it. Companion may do this for any bitmap, at any time and for any reason, for example for an image which is larger than the whole budget, or for the frames of an animation with too many frames to keep in the cache together, which would be evicted before they came round again. Clients must always handle it.

Messages are applied strictly in the order they arrive. Companion relies on this: an eviction is always sent before the bitmap that needs the room.

### Example

```
> BITMAP-CACHE BYTES=4000000
< BITMAP-CACHE OK BYTES=4000000
< KEY-STATE DEVICEID=00000 KEY=0 BITMAP_ID=AbCdEf0123456789 BITMAP=... TYPE=BUTTON PRESSED=0
< KEY-STATE DEVICEID=00000 KEY=0 BITMAP_ID=GhIjKl9876543210 BITMAP=... TYPE=BUTTON PRESSED=0
< KEY-STATE DEVICEID=00000 KEY=0 BITMAP_ID=AbCdEf0123456789 TYPE=BUTTON PRESSED=0
< KEY-STATE DEVICEID=00000 KEY=0 BITMAP_ID=GhIjKl9876543210 TYPE=BUTTON PRESSED=0
> BITMAP-CACHE BYTES=0
< BITMAP-EVICT ALL=1
< BITMAP-CACHE OK BYTES=0
< KEY-STATE DEVICEID=00000 KEY=0 BITMAP=... TYPE=BUTTON PRESSED=0
```

### Choosing a budget

Only the client knows how much memory it can spare, so the budget is up to it.

- Scale the budget with the number of devices on the connection and the size of their bitmaps. For example, a device with large LCD buttons needs far more room per frame than one with small keys. Send a new budget when devices are added or removed.
- Leave room for at least a full loop of an animation on every key that might show one. Otherwise the oldest frames are evicted just before they are needed again, and each frame gets sent in full every loop. Companion does not cache the frames of an animation which would take more than about half of the budget.
- Cap the budget at a sensible share of the available memory, and send a smaller budget if memory becomes tight.
- Give users a way to turn caching off, for low-memory machines or for troubleshooting. When it is off, simply don't send `BITMAP-CACHE`.
