---
title: Contributing to Companion, Git Workflow
sidebar_label: The Git Workflow
sidebar_position: 2
---

Text by @ElectricRCAircraftGuy

If you are like me you find yourself cloning a repo, making some proposed changes and then deciding to later contributing back using the [GitHub Flow](https://guides.github.com/introduction/flow/) convention. Below is a set of instructions I've developed for myself on how to deal with this scenario and an explanation of why it matters based on [jagregory's gist](https://gist.github.com/jagregory/710671).

To follow GitHub flow you should really have created a fork initially as a public representation of the forked repository and the clone that instead. My understanding is that the typical setup would have your local repository pointing to your fork as **origin** and the original forked repository as **upstream** so that you can use these keywords in other git commands.

1. Clone some repo (you've probably already done this step).

   ```bash
   git clone git@github...some-repo.git
   ```

2. Manually [fork their repo](https://guides.github.com/activities/forking/) via the Github website directly.
3. In your local system, rename your **origin** remote to **upstream**.

   ```bash
   git remote rename origin upstream
   ```

4. Add a new origin which now points to your fork you just made above (instead of to to the original repository).

   ```bash
   git remote add origin git@github...my-fork
   ```

5. Fetch from new origin.

   ```bash
   git fetch origin
   ```

6. Make local branch "master" track remote branch "origin/master" (ie: remote branch "master" from remote "origin" which you just set above). See more syntax examples here: https://stackoverflow.com/a/2286030/4561887.

   ~~`git branch --set-upstream master origin/master`~~ (deprecated)

   ```bash
   git branch --set-upstream-to origin/master master
   ```

7. Push to your fork via your "origin" remote (the word `origin` should be able to be omitted (ie: just write `git push`) if you did Step 4).

   ```bash
   git push origin
   ```
