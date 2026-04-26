# TypeScript style rules

## Core policy

- Do not use `any`.
  - Exception: at third-party boundaries where types are unavailable, allowed briefly.
- Do not use double assertion `as unknown as T`. Prefer a type-guard.
- When `satisfies` can express the intent, prefer it over `as`.
- Use `neverthrow` for error handling: `Result` / `ResultAsync`.

## Type design

- `interface` for behavior contracts; `type` for data shapes.
- If you accept `unknown`, narrow at the boundary before use inside the module.

## Naming

- Abstract names for contracts: no implementation vendor in the contract name.

Good:

- `UserRepository`
- `PaymentGateway`
- `Clock`
- `EmailSender`
- `Logger`

Bad (implementation leaks into the name):

- `PrismaUserRepository`
- `StripePaymentGateway`
- `FetchEmailSender`
- `ConsoleLogger`

If you need a concrete class name, keep it separate from the consumer-facing contract.

## File naming

- File names: `snake_case` by default.
- Test files: `*.test.ts`.

- Functions: `camelCase` (lower first).
- `class` / `interface` / `type` names: `PascalCase`.

## Comments

- Prefer self-explanatory code; comments explain **why** (intent, invariants, pitfalls, spec exceptions, external references), not what the next line does. Skip obvious noise.
- **Use English** for comments and JSDoc, consistent with this repo’s `AGENTS` and rules.
- Use `//` for line comments. For **public API** (e.g. `packages/shared` exports, public extension surface), add a short **`/** JSDoc */` block** for consumers. Omit redundant `@param` / `@returns` when types already say enough.
- Do not leave **commented-out code** in the tree; delete it and rely on **git** to recover.
