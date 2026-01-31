---
title: Companion 4.1 (API 1.13)
sidebar_position: -41
---

1.13.4
secrets not updating in configUpdated (8d867a2)

1.13.3
make newSecrets parameter to saveConfig optional, if secrets config is not being used #152 (ce8397b)
make CompanionButtonPresetDefinition presetStyle a partial (#156) (c4c8b49)

1.13.2
expose multiline option on textinput field (213347c)
exposes showMinAsNegativeInfinity and showMaxAsPositiveInfinity properties on number input field (d290a74)

1.13.1
add regex to secret-text field (51822ca)

Features

    add desciption line below input fields (d86300c)
    add option to actions to skip unsubscribe being called when options change. (3c4430d)
    add value feedback type (2e48256)
    allow actions to mark options to not treat reactively for subscription callbacks (d959218)
    connection secrets config (d030871)
    split host api methods to separate out upgrade-script calls (#118) (cfa561c)

Bug Fixes

    make context.parseVariablesInString a no-op in subscribe/unsubscribe callbacks (fbbb8a2)
    only call feedback subscribe/unsubscribe when the feedback is added/removed, not for every update. (56ba76a)
    upgrade index tracking in new flow (27f71f5)
