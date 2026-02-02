---
title: 'Unit Testing Considerations'
sidebar_label: 'Unit Testing Config'
sidebar_position: 6
description: Unit testing config and advice.
---

If you choose to include unit tests in your module repo, you can choose a framework such as Vitest, Mocha or Jest. [Vitest](https://vitest.dev/) may be especially useful for its native support of TypeScript. However, unit testing of modules is not very common: We find it quite hard to test most modules as to do so requires mocking-up the device connection.

For TypeScript repos, you may need to add information to `compilerOptions": {"types": [] }`. 

If you have any suggestions on mocks, tooling or examples we should provide to make this easier, we are open to suggestions!

Some modules which are known to have some unit tests:

- [grassvalley-kaleido-solo](https://github.com/bitfocus/companion-module-grassvalley-kaleido-solo/blob/main/index.test.js)
- [etc-eos](https://github.com/bitfocus/companion-module-etc-eos/blob/master/main.test.js)
- [youtube-live](https://github.com/bitfocus/companion-module-youtube-live/tree/master/src/__tests__)

Feel free to add yours here.
