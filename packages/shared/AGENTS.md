# packages/shared — Agent guide

## Tech stack

Source of truth: `packages/shared/package.json`. When dependencies change, update this section.

- **Language**: TypeScript (`main`: `src/index.ts` — utility code imported by other packages)
- **Tests**: [Vitest](https://vitest.dev) + `@vitest/coverage-v8` (`test` / `test:coverage`)
- **Data / types**: [Zod](https://zod.dev) for reusable validators
- **Lint / format**: Biome (`lint` / `format` in `package.json`)
- No app/framework-specific dependencies; those live in `apps/*` or `packages/core`.

## Layout

- `src/index.ts` — re-exports the public API (consumers use `@gitogito/shared` only; do not import deep paths from apps).
- `src/utils/` — app-agnostic utility modules (current focus: reusable Zod helpers).

## Scope

- Shared, app-agnostic logic used by more than one package.
- Keep this package free from gitogito-specific business terms and rules.
- If code requires gitogito domain context, move it to `packages/core`.

## Module boundaries

- `packages/shared` **must not depend on `apps/*`** (neither `import` paths nor `package.json` dependencies).
- `packages/shared` **must not depend on `packages/core`**.
- TUI- or VS Code–only types and constants go under `apps/...`, not here.

## Implementation rules

- Keep APIs small and generic enough for reuse beyond this repository.
- Avoid side-effectful I/O in shared utilities.
- Treat public API changes as backward compatible by default; if breaking, provide migration guidance.

## Testing

- TDD by default (`.cursor/rules/testing.md`).
- Non-trivial shared logic must have tests (happy path plus edge/failure case where it matters).
- If consumers are affected, state the impact in the change description.

## Output

- Say which app(s) benefit and how.
