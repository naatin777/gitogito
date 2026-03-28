## 1. Project Overview

**Gitogito** is an AI-powered CLI tool for generating intelligent commit
messages and GitHub issues.

- **Stack**: Bun, TypeScript, React + OpenTUI, Redux Toolkit, Vercel AI SDK,
  Cliffy.
- **Goal**: Provide an interactive TUI for Git/GitHub workflows using AI
  agents.

## 2. Quick Commands

Use these commands to operate the project.

```bash
# Development
bun install                               # Install dependencies
bun run src/main.ts [command]             # Run CLI directly
bun run dev [command]                     # Run via package script
bun test                                  # Run all tests
bun run check                             # Type check

# User-facing Commands (Examples)
bun run src/main.ts init                  # Initialize config
bun run src/main.ts commit                # Generate commit message
bun run src/main.ts issue                 # Generate issue
bun run src/main.ts config                # Open config TUI
```

## 3. Directory Structure

Gitogito follows a layered architecture with clear separation of concerns.

### Core Directories

- **`src/lib/`** - Framework & Infrastructure
  - OpenTUI renderer/runtime (`opentui_render.tsx`, `runner.tsx`), error
    classes, editor engine
  - Rule: No business logic, only framework wrappers/runtime utilities

- **`src/services/`** - External Integrations
  - AI, Git, GitHub API, Config, Editor integration
  - Rule: Encapsulate external dependencies, use repository pattern

- **`src/app/`** - Application Foundation
  - `store.ts` - Redux store configuration
  - `hooks.ts` - Typed Redux hooks (`useAppDispatch`, `useAppSelector`)
  - Rule: Only store setup and app-wide typed hooks, no feature slices

- **`src/features/`** - Feature Slices
  - Each feature has: `xxx_slice.ts` (state), `ui.tsx` (view), `hook.ts`
    (logic), `domain/` (business logic), `components/` (complex UIs)
  - Examples: `commit/`, `issue/`, `config/`
  - Rule: Keep related code together, including Redux slices

- **`src/views/`** - Complex UI Flows
  - Multi-component UI features with advanced state management
  - Rule: Use only for exceptionally complex UIs; prefer `features/` for most
    cases

- **`src/helpers/`** - Pure Utilities
  - `text/` - Text processing (word-wrap, line splitting)
  - `collections/` - Data structure helpers
  - `opentui/` - OpenTUI key/input helpers
  - Rule: Pure functions only, no side effects

- **`src/commands/`** - CLI entry points (Cliffy)
- **`src/components/`** - Shared UI components
- **`src/constants/`** - Configuration & constants

### Where to Put New Code

- New feature -> `features/[feature_name]/` with `xxx_slice.ts`, `ui.tsx`,
  `hook.ts`, `domain/`
- Complex UI flow -> `views/[view_name]/` (only for exceptionally complex UIs)
- Redux slice -> colocate in `features/[feature_name]/` or `views/[view_name]/`
- Pure utility function -> `helpers/text/`, `helpers/collections/`, or
  `helpers/opentui/`
- External API integration -> `services/`
- Runtime/framework wrapper -> `lib/`
- Shared component -> `components/` (if used by 2+ features)
- Store configuration -> `app/store.ts` (register feature reducers)

## 4. Naming Conventions

This project uses underscore-based TypeScript file naming conventions.

### File Naming Rules

1. **TypeScript Files (.ts) - Use snake_case**:
   - All TypeScript files must use **snake_case** (lowercase with underscores)
   - Examples: `commit_message.ts`, `auth_middleware.ts`,
     `text_field_reducers.ts`
   - Prohibition: Never use hyphens (`-`) in file names

2. **Component Files (.tsx)**:
   - Shared/reusable component files use **PascalCase**
   - Examples: `UserCard.tsx`, `Select.tsx`, `TextInput.tsx`
   - Feature entry files may keep conventional names like `ui.tsx`

3. **Test Files - Use snake_case with `_test.ts` suffix**:
   - Test files follow: `[original_file_name]_test.ts` or
     `[original_file_name]_test.tsx`
   - Examples: `commit_message_test.ts`, `word_wrap_test.ts`
   - Prohibition: Do not use `-test.ts` or `.test.ts` patterns

### Enforcement

- When creating new files, follow these naming conventions
- When reviewing code, suggest renaming for any violations
- Use `git mv` for renaming to preserve file history

## 5. Configuration File Specification

Gitogito uses three YAML files with separate responsibilities:

```text
~/.config/gitogito/
└── config.yml              # Global settings + optional global credentials

project/
├── .gitogito.yml           # Shared project settings (git-managed)
└── .gitogito.local.yml     # Personal overrides + optional local credentials
```

### Loading Priority (Low -> High)

1. Hardcoded defaults from `ConfigSchema`
2. `~/.config/gitogito/config.yml`
3. `project/.gitogito.yml`
4. `project/.gitogito.local.yml`
5. Environment variables: `GITOGITO_AI_API_KEY`, `GITOGITO_GITHUB_TOKEN`

### File Roles

| File | Contents | Git Managed |
| --- | --- | --- |
| `~/.config/gitogito/config.yml` | Global config and optional shared credentials | No |
| `./.gitogito.yml` | Project-level config safe to share with team | Yes |
| `./.gitogito.local.yml` | Personal overrides and optional local credentials | No |

### Security Requirements

Files that may contain credentials must be created with strict permissions:

```text
~/.config/gitogito/              # 700 (drwx------)
~/.config/gitogito/config.yml    # 600 (-rw-------)
project/.gitogito.local.yml      # 600 (-rw-------)
```

---

## 6. Feature Specification Template

When writing a new feature spec, use the following structure:

```markdown
## 1. Overview

- **Objective**:
- **Goal**:

## 2. Files to Modify/Create

- `src/commands/[command].ts`: Command definition
- `src/features/[feature]/`:
  - `ui.tsx`: UI Component
  - `hook.ts`: Business Logic (Custom Hook)

## 3. Data Structures & State Machine (Redux)

- **State Definition**:
  type State =
    | { step: "init" }
    | { step: "processing"; data: string }
    | { step: "done" };

## 4. Process Flow

1. User executes command...
2. ...

## 5. Constraints

- Must use the existing `AIService`.
- Follow the directory structure rules in AGENTS.md.
```

---

## 7. Known Issues & Technical Debt

The following are known issues that should be addressed:

### Priority 1 (Fix Immediately)

1. **AI provider config/runtime mismatch** (`src/services/ai.ts`): `AIService.create()` returns hardcoded dummy values. Implement real provider resolution from `ConfigService`.
2. **Credential save/load structure mismatch** (`src/services/config/config_service.ts`): `saveCredentials()` writes to root but read path expects `{ credentials: { ... } }`. Fix to write under nested `credentials.<key>`.
3. **Shallow config merge** (`src/services/config/config_service.ts:85`): `getMergedConfig()` uses spread merge only; nested objects are overwritten as a whole. Replace with deep merge.

### Priority 2 (High Impact)

4. **`Select` / `Carousel` unsafe for empty choices** (`src/components/Select.tsx`, `Carousel.tsx`): No zero-length guard on `choices.length`. Add early return for empty choices.
5. **Non-uniform error handling in async thunks** (`src/features/issue/issue_slice.ts`): Standardize on `rejectWithValue(stringMessage)` and extend error state to include `message`.

### Priority 3 (Code Health)

6. **Large commented-out code blocks**: `src/features/commit/commit_selectors.ts`, various test files. Decide to restore or delete.
7. **Hook dependency arrays** (`src/components/Spinner.tsx`, `src/features/config/ui.tsx`): Include real dependencies or memoize callbacks.

---

## 8. UI Feature Specifications

### Commit Message UX

The commit editor follows Conventional Commits format with two autocompletion modes:

- **Inline completion** (Copilot-style): Single suggestion in dimmed text after cursor. `Tab` accepts, `Esc` dismisses.
- **List completion** (Dropdown-style): Multiple suggestions below input. `Tab`/`Shift+Tab` navigate, `Enter` accepts.

Context-aware suggestions by phase:
- **Type phase** (before `:`): suggest `fix`, `feat`, `docs`, etc., filtered by current input
- **After type**: suggest `:`, `!:`, `(`
- **Scope phase** (inside `()`): suggest project-defined scopes
- **Description phase** (after `:`): no autocomplete

### Dropdown UI

- Shows up to 5 suggestions at a time with scrolling
- Selected item highlighted with green `→` arrow and inverse colors
- `Tab` (next) / `Shift+Tab` (previous), wraps around
- Scroll keeps selected item near top/middle of visible window

### Commit Message Decorators (Planned)

Decorators add non-editable prefixes/suffixes to commit messages (displayed dimmed):

- **WIP prefix** (`-w` flag): prepends `WIP: `
- **Type emoji**: auto-adds emoji based on commit type (`feat` → `✨`, `fix` → `🐛`, etc.)
- **Breaking change**: prepends `💥 ` when `!` is detected

Implementation uses a **registry pattern**:

```typescript
type CommitDecorator = {
  id: string;
  position: "prefix" | "inline" | "suffix";
  matcher: (context: CommitContext) => boolean;
  generator: (context: CommitContext) => string;
  priority: number;
};
```

Character count includes decorations since they appear in the final commit message.

---

## 9. Other

- Do not introduce Deno-specific runtime patterns or comments.
- Use Bun/Node-compatible APIs (`node:fs`, `node:path`, `process`) over Deno APIs.
- Prefer `Bun.YAML` over `@std/yaml`, `Bun.stringWidth` over Deno unicode width.
