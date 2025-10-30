# Bitfocus Companion Documentation Website

This is the documentation website for [Bitfocus Companion](https://github.com/bitfocus/companion), built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

The documentation is available at `/user-guide` and is currently versioned with the `beta` version.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Versioning

This documentation site supports versioning. The current version is `beta`. To create a new version:

```bash
yarn docusaurus docs:version <version-name>
```

This will:

- Copy the current docs to `versioned_docs/version-<version-name>/`
- Create a versioned sidebar at `versioned_sidebars/version-<version-name>-sidebars.json`
- Update `versions.json` with the new version
