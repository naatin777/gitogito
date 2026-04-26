# apps/tui — Agent guide

## Tech stack

Source of truth: `apps/tui/package.json`. When dependencies change, update this section.

- **Run / dev / typecheck / tests**: [Bun](https://bun.sh) (`dev`, `check`, `test`)
- **TUI + UI**: OpenTUI ([`@opentui/core`](https://www.npmjs.com/package/@opentui/core), [`@opentui/react`](https://www.npmjs.com/package/@opentui/react)), **React 19**, [React Router 7](https://reactrouter.com)
- **State**: [Redux Toolkit](https://redux-toolkit.js.org) + [react-redux](https://react-redux.js.org)
- **AI**: [Vercel AI SDK](https://sdk.vercel.ai/docs) (`ai`), Google / OpenRouter / Ollama providers, `@commitlint/core` for commit-related flows, etc.
- **CLI parsing**: [Cliffy](https://cliffy.io) (`@cliffy/command` from JSR)
- **Git / GitHub**: [Octokit](https://github.com/octokit/octokit.js), [isomorphic-git](https://isomorphic-git.org), [simple-git](https://github.com/steveukx/git-js)
- **i18n**: [i18next](https://www.i18next.com), `i18next-fs-backend`, `react-i18next`
- **Data / types**: [Zod](https://zod.dev), [YAML](https://github.com/eemeli/yaml) package, [neverthrow](https://github.com/supermacro/neverthrow) (`catalog`)
- **Other**: `diff`, `lodash`
- **Workspace**: `@gitogito/shared` (`workspace:*`)
- **Lint / format (this app)**: Biome (`lint` / `format` in `package.json`)

## Scope

- This app is the terminal UI: rendering, input, and terminal behavior live here.
- Keep changes focused on TUI concerns.

## Implementation rules

- Small steps; keep UI separate from business logic.
- Branch on user input with early returns for readability.
- Move reusable logic to `packages/shared` when it fits the boundaries there.
- Build the dependency graph with concrete `new` only at the entrypoint (e.g. `main` or `make_deps`) or dedicated wiring; elsewhere use constructor injection and `interface`-shaped types (see root `.cursor/rules/dependency-injection.md`).

## Testing

- TDD by default: follow the repo `AGENTS.md` and `.cursor/rules/testing.md`.
- Prefer running tests under `apps/tui` first.
- If you update snapshots, explain why in the change description.

## Output

- Describe **what the UI does differently** and **why the change is needed**.
