### checkFeedbacksById

If you wish to optimise your module even further, it is possible to be more specific about which feedbacks get rechecked.
Instead of calling `this.checkFeedbacks('action1')`, you can call `this.checkFeedbacksById('ad9efad')`, where `ad9efad` was retrieved from the `id` field of the object passed to a call to `subscribe` for a feedback definition.

This optimisation isnt necessary for most modules, but if your users end up with hundreds of feedbacks of the same type, this will help ensure there arent performance issues.
