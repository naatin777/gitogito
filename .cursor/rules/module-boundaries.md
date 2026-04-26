# Module boundaries (monorepo)

## `packages/shared` → `apps/*`

- **`packages/shared` must not depend on `apps`.**
- For example, do not: `import` from `../../../../apps/tui/...`, reference `apps/` in relative paths, or add an `apps/...` dependency in shared’s `package.json`.
- App-specific concerns (VS Code APIs, TUI framework types) live in **`apps/...`**. If both apps need a behavior, define an **`interface` in `shared`** and implement in each app, injected at the app’s composition root.

## `apps/*` → `packages/shared`

- Apps may depend on `shared`. This is the normal direction.

## Why

- Avoid cycles and keep shared code genuinely reusable.
