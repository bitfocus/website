---
title: Connecting to your device
sidebar_label: Connecting to the device
sidebar_position: 12
description: Helper classes for connecting to your device.
---

One of the most first tasks most modules have to perform is to connect to their device. You can either use an existing connection library from [NPM](https://www.npmjs.com/) if one exists, or you can write your own connection logic inside the module.

Companion provides three helper classes to help with writing your connection logic: TCPHelper, UDPHelper, TelnetHelper. These classes provide an asynchronous interface for connecting, communicating and disconnecting from your device.

Or if the device uses HTTP, we recommend using the builtin [`fetch` api](https://nodejs.org/en/learn/getting-started/fetch).

## TCPHelper class

The TCPHelper class uses the `EventEmitter` system to provide asynchronous communications.

You start by creating an instance of the class and calling its `connect()` method.
You define the various `on()` callbacks to respond to possible TCP event -- see the example, below.

Your [action](./actions.md) callbacks will call tcp.send() to send outgoing data. The on('data') callback will receive
and process incoming data.

The following events are defined in @companion-module/base:

```ts
    connect: [];
    data: [msg: Buffer<ArrayBufferLike>];
    drain: [];
    end: [];
    error: [err: Error];
    status_change: [status: TCPStatuses, message: string];
```

The `TCPHelper` code could all go in the module's `init()` function, for example:

```typescript
class MyModule extends InstanceBase<MyConfig> {
  public tcp: TCPHelper | undefined

  init() {
    // other module init

    // module connection init
    const tcp = new TCPHelper(config.host, config.portNr)
    this.tcp = tcp

    tcp.on('connect', () => {
        this.updateStatus(InstanceStatus.Ok)
        this.log('debug', 'Connected!")
    })
    tcp.on('error', (err) => {
        this.updateStatus(InstanceStatus.ConnectionFailure, 'Connection error')
        this.log('debug', 'Socket connect error: ' + err)
    })
    tcp.on('drain', () => {
        this.log('debug', 'Socket drain')
    })
    tcp.on('end', () => {
        this.updateStatus(InstanceStatus.Disconnected, 'Disconnecting')
        this.log('debug', 'Socket disconnecting')
        tcp?.destroy()
    })
    tcp.on('data', (msg_data) => {
        // process your incoming data here and call appropriate methods/functions
    })
    tcp.on('status_change', (state, message) => {
        this.updateStatus(state, message)
        this.log('debug', 'Status Changed to ' + state + (message != undefined ? ': ' + message : ''))
    }

    tcp.connect()
  }

  ...
}
```

:::note

In general, broken TCP connections are not detectable through the event system. If you must ensure that the
connection is live, you may need to write a keep-alive responder that periodically sends a query to your device.

:::

More details:

- [TCPHelper](https://bitfocus.github.io/companion-module-base/classes/TCPHelper.html)
- [TCPHelperEvents](https://bitfocus.github.io/companion-module-base/interfaces/TCPHelperEvents.html)

## TelnetHelper class

TelnetHelper is very similar to TCPHelper, with these events

```ts
    connect: [];
    data: [msg: Buffer<ArrayBufferLike>];
    drain: [];
    end: [];
    error: [err: Error];
    iac: [string, number];
    sb: [Buffer<ArrayBufferLike>];
    status_change: [status: TCPStatuses, message: string];
```

- [TelnetHelper](https://bitfocus.github.io/companion-module-base/classes/TelnetHelper.html)
- [TelentHelperEvents](https://bitfocus.github.io/companion-module-base/interfaces/TelnetHelperEvents.html)

## UDPHelper class

UDPHelper is similar to the previous two, but since UDP doesn't maintain connections, you don't have a
`connect()` method. Conversely, there are more options when creating the UDPHelper instance, see the auto-generated documentation
for [UDPHelper options](https://bitfocus.github.io/companion-module-base/interfaces/UDPHelperOptions.html).

```ts
interface UDPHelperOptions {
  bind_ip?: string
  bind_port?: number
  broadcast?: boolean
  multicast_interface?: string
  multicast_ttl?: number
  ttl?: number
}
```

```ts
interface UDPHelperEvents {
  data: [msg: Buffer<ArrayBufferLike>, rinfo: RemoteInfo]
  error: [err: Error]
  listening: []
  status_change: [status: UDPStatuses, message: string]
}
```

- [UDPHelper](https://bitfocus.github.io/companion-module-base/classes/UDPHelper.html)
- [UDPHelperEvents](https://bitfocus.github.io/companion-module-base/interfaces/UDPHelperEvents.html)

## Further reading

See also:

- [InstanceStatus](https://bitfocus.github.io/companion-module-base/enums/InstanceStatus.html)
