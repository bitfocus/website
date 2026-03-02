---
title: 'Unit Testing Considerations'
sidebar_label: 'Unit Testing Config'
sidebar_position: 6
description: Unit testing config and advice.
---

If you choose to include unit tests in your module repo, you can choose a
framework such as Vitest, Mocha or Jest. [Vitest](https://vitest.dev/) may be
especially useful for its native support of TypeScript. However, unit testing of
modules is not very common: We find it quite hard to test most modules as to do
so requires mocking-up the device connection.

For TypeScript repos, you may need to add information to
`"compilerOptions": {"types": [] }`.

If you have any suggestions on mocks, tooling or examples we should provide to
make this easier, we are open to suggestions!

Some modules which are known to have some unit tests:

- [allenheath-sq](https://github.com/search?q=repo%3Abitfocus%2Fcompanion-module-allenheath-sq%20path%3A*.test.ts&type=code)
- [etc-eos](https://github.com/bitfocus/companion-module-etc-eos/blob/master/src/main.test.js)
- [grassvalley-kaleido-solo](https://github.com/bitfocus/companion-module-grassvalley-kaleido-solo/blob/main/index.test.js)
- [ptzoptics-visca](https://github.com/search?q=repo%3Abitfocus%2Fcompanion-module-ptzoptics-visca%20path%3A*.test.ts&type=code)
- [youtube-live](https://github.com/search?q=repo%3Abitfocus%2Fcompanion-module-youtube-live%20path%3A*.test.ts&type=code)

Feel free to add yours here.
