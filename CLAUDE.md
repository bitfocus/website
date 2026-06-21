# Companion Documentation Website — Agent Instructions

This is the [Bitfocus Companion](https://github.com/bitfocus/companion) documentation website, built with [Docusaurus](https://docusaurus.io/).

> [!IMPORTANT]
> Read the **Synced content — DO NOT EDIT** section before changing any file.
> Some directories are mirrors of another repository. Editing them here is
> never correct, and your changes would be silently overwritten on the next sync.

## Synced content — DO NOT EDIT

The following directories are **synced from the [`bitfocus/companion`](https://github.com/bitfocus/companion) repository** and must **not** be edited in this repository under any circumstances. Each one is marked with an empty `__DO_NOT_EDIT__` file and is listed in `.prettierignore`.

| Directory in this repo         | Source of truth                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `user-guide/`                  | `bitfocus/companion`, branch `main`, path `docs/user-guide/` (shown on the site as the "Beta" version) |
| `versioned_docs/version-v4.3/` | `bitfocus/companion`, branch `stable-4.3`, path `docs/user-guide/`                                     |
| `versioned_docs/version-v4.2/` | `bitfocus/companion`, branch `stable-4.2`, path `docs/user-guide/`                                     |
| `versioned_docs/version-v4.1/` | Manually imported snapshot — not editable anywhere; do not touch                                       |
| `whats-new/`                   | `bitfocus/companion`, branch `main`, path `docs/user-guide/9_whatsnew/`                                |

This means **no edits at all** to these trees: not content, not typo fixes, not formatting, not frontmatter, not link corrections, not renames or deletions. Even a one-character change is out of scope.

### If a change is needed in synced content

Do **not** apply it here. Instead:

1. **Stop** — do not edit the file in this repository.
2. **Report** the needed change to the user, clearly and specifically:
   - the exact file (path within this repo),
   - the corresponding source location from the table above (repo, branch, and `docs/...` path),
   - the precise change required (quote the current text and the proposed text).
3. Explain that the fix must be made in the `bitfocus/companion` source repository, on the branch shown above, so that it flows back here on the next sync.

To find the source for a specific page, you can also use the "Edit this page" link at the bottom of the rendered page, or the `editUrl` logic in `docusaurus.config.ts`.

## Content you CAN edit in this repository

These directories are owned by this website repo and are safe to edit normally:

- `for-developers/` — developer documentation (modules, core, Satellite API, git workflows, etc.)
- `satellite/` — Companion Satellite documentation
- `src/` — site source (React/CSS)
- `sidebars/` — sidebar definitions (note: `sidebars/user-guide.ts` and `sidebars/whats-new.ts` describe synced content but the sidebar files themselves live here)
- `static/` — static assets
- `docusaurus.config.ts`, `package.json`, and other root config files

When in doubt about whether a path is editable, check for a `__DO_NOT_EDIT__` marker in the directory (or an ancestor) and consult the table above. If it's synced, report instead of edit.

## Common tasks

- Install: `yarn`
- Local dev server: `yarn start` (runs on port 4005)
- Build: `yarn build`
- Format: `yarn format` (check with `yarn format:check`) — note synced trees are excluded via `.prettierignore`
- Typecheck: `yarn typecheck`

Deployment happens automatically on pushes to the `main` branch.
