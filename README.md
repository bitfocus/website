# Bitfocus Companion Documentation Website

This is the documentation website for [Bitfocus Companion](https://github.com/bitfocus/companion), built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

The markdown in this repository is a mix of markdown which resides only here, and a few sections which are synced from other repositories. This syncing allows us to write the Companion documentation as part of Companion (and easily distribute it with Companion), while also allowing us to use it to build this website.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

Warning: Do **NOT** edit the files inside of user-guide directly. These are directly synced from the main branch of companion, and should be edited there instead.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

This happens automatically on pushes to the main branch

## Versioning

This user-guide portion of this is versioned. Each version is synced from a different branch of the main companion repository, and should be edited there. Check the link at the bottom of each page to find out where it resides.

Versions are created as part of the release process of Companion.
