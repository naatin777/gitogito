---
name: opentui-test-utils
description: Testing skill for @opentui/react/test-utils. Use when writing or fixing tests for OpenTUI React components, including keyboard/mouse simulation, renderer events, Redux integration, and output capture.
---

# @opentui/react/test-utils Skill

Use this skill when writing tests for OpenTUI React components in this project.

## Setup

```typescript
import { testRender } from "@opentui/react/test-utils"
import { act } from "react"
import { test, expect } from "bun:test"
```

Test files use **snake_case with `_test.tsx` suffix**: e.g. `my_component_test.tsx`.

---

## Core API

### `testRender(node, options)`

```typescript
const tui = await testRender(<MyComponent />, { width: 80, height: 24 })
```

Returns:

| Property | Type | Description |
|---|---|---|
| `renderer` | `TestRenderer` | Headless renderer. Call `.destroy()` to clean up. |
| `renderOnce()` | `() => Promise<void>` | Trigger one render cycle. Always call before asserting. |
| `captureCharFrame()` | `() => string` | Capture terminal output as plain text. |
| `captureSpans()` | `() => CapturedFrame` | Capture styled frame (colors, etc.). |
| `mockInput` | `MockInput` | Keyboard simulation. |
| `mockMouse` | `MockMouse` | Mouse simulation. |
| `resize(w, h)` | `(number, number) => void` | Resize the virtual terminal. |

---

## Patterns

### Basic render + assert

```typescript
test("shows greeting", async () => {
  const tui = await testRender(<Greeting name="World" />, { width: 40, height: 8 })

  await tui.renderOnce()
  expect(tui.captureCharFrame()).toContain("Hello, World!")

  act(() => { tui.renderer.destroy() })
})
```

### Keyboard interaction

Wrap all input in `act()`, then call `renderOnce()` to flush:

```typescript
act(() => { tui.mockInput.pressArrow("right") })
await tui.renderOnce()
expect(tui.captureCharFrame()).toContain("status:right")

act(() => { tui.mockInput.pressEnter() })
await tui.renderOnce()
```

#### `mockInput` methods

```typescript
tui.mockInput.pressArrow("up" | "down" | "left" | "right", modifiers?)
tui.mockInput.pressEnter(modifiers?)
tui.mockInput.pressEscape(modifiers?)
tui.mockInput.pressTab(modifiers?)
tui.mockInput.pressBackspace(modifiers?)
tui.mockInput.pressKey(key: KeyInput, modifiers?)
await tui.mockInput.typeText("hello", delayMs?)
await tui.mockInput.pressKeys([...], delayMs?)
await tui.mockInput.pasteBracketedText("pasted text")
tui.mockInput.pressCtrlC()
```

### Renderer events (e.g. theme changes)

```typescript
act(() => { tui.renderer.emit("theme_mode", "dark") })
await tui.renderOnce()
expect(tui.captureCharFrame()).toContain("theme:dark")
```

### Redux Provider integration

```typescript
import { Provider } from "react-redux"
import { createAppStore } from "../../app/store.ts"
import { ConfigSchema } from "../../services/config/schema/config.ts"

const store = createAppStore({
  config: {
    mergedConfig: ConfigSchema.parse({ theme: { mode: "SolidLight" } }),
  },
})

const tui = await testRender(
  <Provider store={store}>
    <MyFeature />
  </Provider>,
  { width: 80, height: 24 },
)

await tui.renderOnce()
expect(tui.captureCharFrame()).toContain("expected text")
```

`createAppStore` accepts a partial `config` — only pass what the test needs; other config fields default to schema defaults. No file I/O occurs.

### Cleanup

Always destroy the renderer at the end of each test:

```typescript
act(() => { tui.renderer.destroy() })
```

---

## Key Rules

1. **Always call `renderOnce()` before asserting** — output is not captured until a render cycle runs.
2. **Wrap all state mutations in `act()`** — keyboard input, `renderer.emit()`, `renderer.destroy()`.
3. **Call `renderOnce()` after each `act()` block** — to flush React state updates.
4. **`captureCharFrame()` returns a flat string** — use `.toContain()` for assertions, not equality.
5. **Tests are isolated** — each test should create its own `tui` instance and destroy it.

---

## Mouse Simulation (`mockMouse`)

```typescript
await tui.mockMouse.click(x, y)
await tui.mockMouse.moveTo(x, y)
await tui.mockMouse.drag(x1, y1, x2, y2)
await tui.mockMouse.scroll(x, y, "up" | "down" | "left" | "right")
tui.mockMouse.getCurrentPosition()  // { x, y }
```

---

## Why not `@testing-library/react`?

`@testing-library/react` only works for **static OpenTUI markup rendered into jsdom**. For components that use OpenTUI hooks (e.g. `useRenderer`, `useThemeMode`, keyboard hooks), use `@opentui/react/test-utils` instead — it provides a real headless renderer.
