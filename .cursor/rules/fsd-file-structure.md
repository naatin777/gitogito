# FSD File Structure Rules

## Slice-root file restriction
- Under `src/entities/`, `src/features/`, `src/widgets/`, and `src/pages/` within each slice folder:
  - Do not create any file directly in the slice root folder except `index.ts`.

## Segment enforcement
- Place all logic, UI, API, and utilities in one of the following segment subfolders:
  - `model/` (types, logic, state)
  - `ui/` (components)
  - `api/` (data fetching, repository implementations)
  - `lib/` (utilities, helpers)

## Example
- `entities/config/config-service.ts` is forbidden.
- Put it at `entities/config/model/config-service.ts`.
- Re-export it from `entities/config/index.ts`.

