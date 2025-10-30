# Bitfocus Companion Documentation Website

This is the documentation website for [Bitfocus Companion](https://github.com/bitfocus/companion), built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

The documentation is available at `/user-guide` with a landing page

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

This happens automatically on pushes to the main branch

## Versioning

This documentation site supports versioning To create a new version:

```bash
yarn docusaurus docs:version <version-name>
```

This will:

- Copy the current docs to `versioned_docs/version-<version-name>/`
- Create a versioned sidebar at `versioned_sidebars/version-<version-name>-sidebars.json`
- Update `versions.json` with the new version
