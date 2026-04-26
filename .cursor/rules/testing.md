# Testing rules

## TDD (default)

- New behavior: write a **failing test** first, then the **smallest** implementation, then **refactor** (red / green / refactor).
- Bug fixes: add a **failing test** that reproduces, then fix.
- Avoid changes without tests; if you must, add a test right after, or document why in the PR.
- If test-first is impractical (e.g. a short spike), state that in the PR and add tests after the spike.

## Basic policy

- Run tests **closest to the change** first.
- If you add behavior without a test, add at least one repro case in the same change when possible.
- If tests truly cannot be written, state why in the PR.

## Scope

- `apps/tui` changes: prefer `apps/tui` tests
- `apps/vscode` changes: prefer `apps/vscode` tests
- `packages/shared` changes: shared tests, then sanity-check app impact

## Test case design

- Do not stop at a single happy path; add an error or boundary case.
- For bugs, add a regression test that would have failed before the fix.

## Execution notes

- Record commands in a reproducible way.
- Long-running tests only when needed; say why.
