# apps/vscode — Agent guide

## Tech stack

Source of truth: `apps/vscode/package.json`. When dependencies change, update this section.

- **Extension host / API**: [Visual Studio Code extension](https://code.visualstudio.com/api) (match `engines.vscode`; currently `^1.110.0` range)
- **Build / dev / types**: **TypeScript compiler** (`tsc` — `build`, `dev`, `check`)
- **Tests**: [@vscode/test-cli](https://github.com/microsoft/vscode-test-cli) + [@vscode/test-electron](https://github.com/microsoft/vscode-test) (`vscode-test`)
- **Types**: `@types/vscode`, `@types/node`, `@types/mocha` (Mocha-oriented test flow)
- **Data / types**: [Zod](https://zod.dev), [YAML](https://github.com/eemeli/yaml) package, [neverthrow](https://github.com/supermacro/neverthrow) (`catalog`)
- **Workspace**: `@gitogito/shared` (`workspace:*`)
- **Lint / format (`src/`)**: Biome (`lint` / `format` in `package.json`)

## Scope

- This package is the VS Code extension: commands, messages, and activation behavior.

## Implementation rules

- Handle failures from VS Code API calls; never assume success.
- Centralize command IDs and configuration keys in constants.
- Avoid breaking UX; roll out breaking changes in steps when possible.
- Treat the extension’s `activate` (or a dedicated wiring module) as the **composition root** for service `new`; handlers and use-cases should accept injection (see `.cursor/rules/dependency-injection.md`).

## Testing

- TDD by default: follow the repo `AGENTS.md` and `.cursor/rules/testing.md`.
- Split testable pure logic into functions for easy unit tests.
- For changes that need manual checks, add a short bullet list of steps.

## Output

- Describe how **user flows** in the editor change.
