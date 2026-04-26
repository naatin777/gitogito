# packages/shared — Agent guide

## Tech stack

Source of truth: `packages/shared/package.json`. When dependencies change, update this section.

- **Language**: TypeScript (`main`: `src/index.ts` — library code imported by other packages)
- **Tests**: [Vitest](https://vitest.dev) + `@vitest/coverage-v8` (`test` / `test:coverage`)
- **Data / types**: [Zod](https://zod.dev), [YAML](https://github.com/eemeli/yaml) package, [neverthrow](https://github.com/supermacro/neverthrow) (`catalog`)
- **Lint / format**: Biome (`lint` / `format` in `package.json`)
- No front-end, VS Code–only, or CLI-only heavy dependencies; those live in `apps/`. See the repo `AGENTS.md` (**Architecture** / **Module boundaries**) and `.cursor/rules/module-boundaries.md`.

## Scope

- Shared, app-agnostic logic used by more than one package.
- Do not add implementations that are specific to a single app.

## Module boundaries

- `packages/shared` **must not depend on `apps/*`** (neither `import` paths nor `package.json` dependencies).
- TUI- or VS Code–only types and constants go under `apps/...`, not here.
- When both apps need the same shape, keep abstractions in `shared` as **`interface` / generic types**; push app-specific details into `apps` and pass them in.

## Implementation rules

- Treat public API changes as **backward compatible** by default; if you must break, add migration steps or a replacement API.
- Before adding a dependency, confirm it is needed in **both** (or all) consumers.
- Do not assemble the full app dependency graph here; composition roots live in `apps/*`. Prefer pure logic and `interface` boundaries; I/O and concrete `new` are supplied by callers.

## Testing

- TDD by default (`.cursor/rules/testing.md`).
- Shared code must have tests; include at least one edge or failure case.
- If consumers are affected, state the impact in the change description.

## Output

- Say which app(s) benefit and how.
