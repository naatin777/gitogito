# Linter config safety

## Default rule
- **Do not modify** repository linter configuration files unless the user explicitly requests it.

## Examples (non-exhaustive)
- `.dependency-cruiser.js`
- `biome.json`
- Any `.eslintrc*`
- Any `prettier*` / formatting config at the repo root

## Exception / when needed
- If lint rules must change to unblock a real issue, ask for approval first and keep the change minimal.
