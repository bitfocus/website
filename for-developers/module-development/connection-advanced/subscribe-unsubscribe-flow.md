Sometimes it is useful to know what actions/feedbacks are being used. This is common for devices which have thousands of properties, or if loading and maintining a bit of data has a cost, such as requiring polling to fetch.

On the action/feedback definition, it is possible to register some additional callbacks to be informed about the actions/feedbacks.

Note: the example below is for feedbacks, but works for actions too

```js
const feedbacks = {}
feedbacks['set_source'] = {
    name: 'Brief description of the feedback here',
    description: 'Longer description of the feedback',
    options: [{
        type: 'number',
        label: 'Source'
        id: 'source',
        default: 1
    }],
    callback: (feedback) => {
        ...
    },
    subscribe: (feedback) => {
        ...
    },
    unsubscribe: (feedback) => {
        ...
    }
}
```

Whenever a feedback is added to a button, subscribe will be called.
Whenever a feedback is removed from a button, unsubscribe will be called.
Whenever the options of a feedback on a button is changed, unsubscribe will be called, followed by subscribe. (Note: this is not triggered when the style properties are changed for boolean feedbacks)

It is also possible to force either unsubscribe or subscribe to be called for every feedback, by calling `this.subscribeFeedbacks()` or `this.unsubscribeFeedbacks()`. Both functions accept `feedbackIds` parameters, to only run on a certain feedback type (eg `this.unsubscribeFeedbacks('set_source', 'set_source2')`).
When using these callbacks, it is common to call `this.subscribeFeedbacks()` once the connection to the device has been established, to help ensure all the required data gets loaded.

For actions, the methods `this.subscribeActions()` and this.unsubscribeActions()` can be used instead

### checkFeedbacksById

If you wish to optimise your module even further, it is possible to be more specific about which feedbacks get rechecked.
Instead of calling `this.checkFeedbacks('action1')`, you can call `this.checkFeedbacksById('ad9efad')`, where `ad9efad` was retrieved from the `id` field of the object passed to a call to `subscribe` for a feedback definition.

This optimisation isnt necessary for most modules, but if your users end up with hundreds of feedbacks of the same type, this will help ensure there arent performance issues.
