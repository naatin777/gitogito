# Input / Textarea Styling with Extmarks

How to apply character-level styles and ghost text (completions) to `<input>` and `<textarea>` components.

## What are Extmarks?

Extmarks are analogous to Neovim's extmarks — they attach styles to character offset ranges in the input buffer without modifying the buffer content.

Access via `ref.current.extmarks` which returns an `ExtmarksController`.

---

## 1. Coloring Text Ranges

### Define styles at module scope

Create `SyntaxStyle` once outside the component so it isn't recreated on every render:

```tsx
import { SyntaxStyle, RGBA } from "@opentui/core";

const style = SyntaxStyle.fromStyles({
  error:   { fg: RGBA.fromHex("#ff5555") },
  warning: { fg: RGBA.fromHex("#ffaa00") },
  dim:     { fg: RGBA.fromHex("#666666"), italic: true },
});
```

### Create an extmark

```tsx
import { useEffect, useRef } from "react";

function MyInput() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const em = ref.current.extmarks;

    // Color characters at offsets 0–3 red
    const id = em.create({
      start: 0,
      end: 3,
      styleId: style.getStyleId("error")!,
    });

    // Remove when no longer needed:
    // em.delete(id);
  }, []);

  return <textarea ref={ref} focused />;
}
```

`start` / `end` are **character offsets** (0-based). Newlines count as one character.

### Real-time validation

Delete the previous mark and recreate it on each `onChange`:

```tsx
function ValidatedInput() {
  const ref = useRef(null);
  const markIdRef = useRef<number | null>(null);

  return (
    <input
      ref={ref}
      focused
      onChange={(value) => {
        const em = ref.current?.extmarks;
        if (!em) return;

        if (markIdRef.current !== null) {
          em.delete(markIdRef.current);
          markIdRef.current = null;
        }

        if (!value.startsWith("fix:")) {
          markIdRef.current = em.create({
            start: 0,
            end: value.length,
            styleId: style.getStyleId("error")!,
          });
        }
      }}
    />
  );
}
```

---

## 2. Ghost Text (Inline Completions)

`virtual: true` renders text at a position without inserting it into the buffer — ideal for Copilot-style completions where Tab accepts and Esc dismisses.

> ⚠️ `virtual: true` is experimental and may be replaced by a native implementation in the future.

```tsx
function InputWithCompletion() {
  const ref = useRef(null);
  const ghostIdRef = useRef<number | null>(null);

  const clearGhost = () => {
    if (ghostIdRef.current !== null) {
      ref.current?.extmarks?.delete(ghostIdRef.current);
      ghostIdRef.current = null;
    }
  };

  const showGhost = (offset: number, text: string) => {
    clearGhost();
    ghostIdRef.current = ref.current?.extmarks?.create({
      start: offset,
      end: offset,      // start === end for pure virtual text
      virtual: true,
      data: text,
      styleId: style.getStyleId("dim")!,
    }) ?? null;
  };

  return (
    <input
      ref={ref}
      focused
      onChange={(value) => {
        if (value.startsWith("fi")) {
          showGhost(value.length, "x: description"); // suggest "fix: description"
        } else {
          clearGhost();
        }
      }}
    />
  );
}
```

---

## 3. Styled Placeholder

`placeholder` accepts a `StyledText` for richer hints:

```tsx
import { StyledText, red, dim } from "@opentui/core";

const placeholder = new StyledText([
  red("type"),
  dim(": description"),
]);

function MyInput() {
  return <input placeholder={placeholder} />;
}
```

---

## API Reference

### ExtmarksController

```ts
em.create(options: ExtmarkOptions): number   // Returns the extmark id
em.delete(id: number): boolean
em.get(id: number): Extmark | null
em.getAll(): Extmark[]
em.getVirtual(): Extmark[]                  // virtual=true extmarks only
em.getAtOffset(offset: number): Extmark[]
em.clear()
```

### ExtmarkOptions

```ts
interface ExtmarkOptions {
  start: number;      // Start character offset (inclusive)
  end: number;        // End character offset (exclusive)
  virtual?: boolean;  // Display-only; does not modify the buffer
  styleId?: number;   // From SyntaxStyle.getStyleId()
  priority?: number;  // Higher wins when extmarks overlap
  data?: any;         // Payload for virtual text content
  typeId?: number;    // Group ID from registerType() for bulk management
}
```

### SyntaxStyle

```ts
const style = SyntaxStyle.fromStyles({
  name: { fg?, bg?, bold?, italic?, underline?, dim? },
});

style.getStyleId("name")                              // number | null
style.registerStyle("name", { fg: RGBA.fromHex("#ff0000") })  // number
```

---

## Type Definitions

- `@opentui/core` → `renderables/Textarea.d.ts`
- `@opentui/core` → `lib/extmarks.d.ts`
- `@opentui/core` → `syntax-style.d.ts`
