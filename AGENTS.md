## Overview

A family of tools that use AI to help with:

- Suggested commit messages
- Suggested `git add` chunking
- Suggested branch names
- Support for creating GitHub issues and pull requests
- Both a CLI and a VS Code extension

## Repository structure

Monorepo layout:

```text
apps/
  tui/      # TUI app
  vscode/   # VS Code extension

packages/
  shared/   # Shared code
```

## Tech stack (repo root)

Derived from the root `package.json`. When you change dependencies or tooling, update this section to match.

- **Package manager**: pnpm (match the `packageManager` field)
- **Monorepo / tasks**: [Turbo](https://turbo.build/repo) (most `build` / `test` / `check` run via `turbo run`)
- **Language (shared)**: TypeScript (root `devDependencies`)
- **Repo-wide lint / format**: [Biome](https://biomejs.dev) (`biome check` / `biome format`)
- **Git hooks**: [lefthook](https://github.com/evilmartians/lefthook) (`prepare`)
- **Versioning / release**: [Changesets](https://github.com/changesets/changesets) (`change`, `release:version`)
- **Runtime-specific test / build** (Bun, Vitest, `vscode-test`, etc.): treat each `apps/*` / `packages/*` `package.json` as the source of truth

## Commands & package manager

- Use **pnpm** only, not `npm` or `yarn`. The root `package.json` `packageManager` field is canonical.

### Default commands (from repo root)

Use these first—do not open `package.json` every time. If you add or rename `scripts`, update this list too.

- `pnpm dev:tui` / `pnpm dev:vscode` — local development
- `pnpm test` — all packages (via turbo)
- `pnpm test:tui` / `pnpm test:vscode` / `pnpm test:shared` — one package
- `pnpm build` — build (turbo)
- `pnpm check` — typecheck and package `check` scripts (turbo)
- `pnpm lint` / `pnpm format` — Biome across the repo
- `pnpm test:coverage` and `pnpm test:coverage:*` — coverage

Read an app or package `package.json` only when you need a **package-only** command (e.g. extra scripts not mirrored at the root).

### When to read `package.json` / `pnpm-workspace.yaml`

- Adding dependencies, using `catalog`, **adding/renaming `scripts`**, or a command fails and names look wrong. Otherwise the commands above should be enough.

## Working rules for agents

1. Clarify impact, then make the **smallest** change that meets the goal.
2. **TDD** by default (see `.cursor/rules/testing.md`). Prefer **tests first** for new work and fixes.
3. **Wire dependencies at a single composition root** (see `.cursor/rules/dependency-injection.md`). Keep concrete `new` wiring at the entrypoint (or a dedicated wiring module next to it).
4. After tests pass, re-run tests that touch the files you changed.
5. On failure, record a short cause and how to reproduce.
6. Focus explanations on **why** something changed, not only what.

## Project rules (Cursor)

Conventions (language, commits, tests, DI, etc.):

- `.cursor/rules/typescript-styles.md`
- `.cursor/rules/testing.md`
- `.cursor/rules/dependency-injection.md`
- `.cursor/rules/module-boundaries.md`
- `.cursor/rules/commit-pr.md`

**All agent-facing project docs in this repository are written in English.**

## Safety rules

- Do not undo or discard the user’s existing work without their intent.
- Do not do large refactors that were not requested.
- Do not run destructive git commands (e.g. `reset --hard`) unless the user asked for them.
- Do not add secrets (tokens, keys, credentials) to the codebase.

## Testing policy

- Default to TDD; details in `.cursor/rules/testing.md`.
- Run tests **closest to the code you changed** first; full runs only when needed.
- If tests cannot be run, say why and how else you verified the change.
- Document manual checks as reproducible command steps.

## Architecture note

- DI and `new` at the composition root: `.cursor/rules/dependency-injection.md`
- **Dependency direction**: `packages/shared` must not depend on `apps/*` (see `.cursor/rules/module-boundaries.md`)

## Docs & rules (maintenance)

Align with [Cursor’s rule guidance](https://cursor.sh/docs/rules).

- **Short and split**: keep each file roughly **under 500 lines**; split topics in `.cursor/rules` (e.g. `typescript-styles.md`) when it grows.
- **Do not duplicate the linter/formatter**: let TypeScript and [Biome](https://biomejs.dev) own mechanical style; rules document architecture, patterns, and non-obvious prohibitions.
- **Do not paste long code** into rules: **point to canonical files** in the repo. Copies go stale.
- **When the same mistake repeats**, add a rule; avoid one-off edge cases in rules.
- **Verify with tools**: after edits, `pnpm check` / `test` / `lint` should be enough to describe “done”. Treat `.github/workflows/` (e.g. `test.yml`) as what CI enforces; update workflows if behavior changes.

For workflow ideas, see [Cursor: Working with agents](https://cursor.com/docs/cookbook/agent-workflows).
