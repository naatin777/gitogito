# Dependency injection & composition root

## Policy

- **Composition root only** for wiring concrete `new` and container setup.
- Treat each app’s entry (e.g. TUI/CLI `make_deps`, VS Code `activate`, binary `main`) as the composition root and build the graph there.
- In domain, use-case, and most UI code, do **not** `new` concrete services inline.

## Implementation

- Express dependencies with `interface` and inject via **constructors** or a **small factory** at the edge.
- Put implementation types (`PrismaUserRepository`, etc.) next to the root or in `infrastructure`-style modules; consumers depend on **abstractions** at the type level.
- `new` for value objects or small pure DTOs inside a module is fine; restrict the rule to **services, I/O, and framework boundaries**.

## Tests

- Swap **fakes / stubs** for the same `interface`; do not depend on the production `new` graph in unit tests.
- For integration tests, a **test-only composition root** (e.g. `test_app.ts`) is fine.

## Exceptions

- Small pure functions or `Result` pipelines may skip DI if it is noise, but **external I/O and non-determinism** stay injectable.
