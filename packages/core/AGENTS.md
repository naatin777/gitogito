# packages/core — Agent guide

## Tech stack

Source of truth: `packages/core/package.json`. When dependencies change, update this section.

- **Language**: TypeScript (`main`: `src/index.ts` — library code imported by apps)
- **Tests**: [Vitest](https://vitest.dev) + `@vitest/coverage-v8` (`test` / `test:coverage`)
- **Data / types**: [Zod](https://zod.dev), [YAML](https://github.com/eemeli/yaml), [neverthrow](https://github.com/supermacro/neverthrow), [es-toolkit `merge`](https://es-toolkit.dev/reference/object/merge.html)
- **Lint / format**: Biome (`lint` / `format` in `package.json`)

## Layout

- `src/index.ts` — re-exports the public API (consumers import via `@gitogito/core`).
- `src/config/` — product-specific configuration logic and ports (`config-file`, `config-service`, `runtime-env`, `config-set`, `config-scope`, `config-merge`).
- `src/schema/` — gitogito-specific Zod schemas (`ConfigSchema`, `Global` / `Project` / `Local` configs and defaults).

## Scope

- Product-specific business logic for gitogito.
- Code in this package can be shared across gitogito apps (`apps/tui`, `apps/vscode`), but is not designed as a general-purpose utility library.
- If a module contains gitogito domain terms or behavior (config scope, defaults, set semantics), it belongs in `core`.

## Module boundaries

- `packages/core` may depend on `packages/shared`.
- `packages/core` must not depend on app internals from `apps/*`.
- Keep app runtime adapters (process env, filesystem wiring, extension host specifics) inside each app's composition root.

## Implementation rules

- Keep domain policy and business rules in this package; keep framework glue in apps.
- Prefer explicit, typed boundaries (`interface`/ports) where apps provide concrete implementations.
- Re-export stable APIs from `src/index.ts`; avoid deep import requirements for consumers.

## Testing

- Follow TDD by default (`.cursor/rules/testing.md`).
- Add tests for non-trivial behavior changes (happy path + at least one edge/failure case).
- If app behavior changes via `core`, mention impact in the change description.
