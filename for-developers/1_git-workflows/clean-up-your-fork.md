---
title: Git Tips and Tricks
sidebar_label: Git Tips and Tricks
sidebar_position: 5
---

### Cleaning up a messed up fork
When you messed up a fork ;-) you can reset this with the following lines (replace the link when you have a different fork)

`git remote add upstream https://github.com/bitfocus/companion.git`

`git fetch upstream`

`git checkout master`

`git reset --hard upstream/master`

`git push origin master --force`
