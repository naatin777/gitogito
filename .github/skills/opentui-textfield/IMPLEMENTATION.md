OpenTUI Textfield Implementation Notes (TypeScript / React)

1) Deletion operations

- Built-in instance methods (available on input/textarea):
  - deleteWordBackward(), deleteWordForward(), deleteToLineStart(), deleteToLineEnd(), deleteSelectedText(), deleteChar(), deleteCharBackward()
  - Standard keybindings already map to these (Ctrl+Backspace, Meta+Backspace, Ctrl+K, Ctrl+U, etc.)

Example (React):

```tsx
import { useRef } from "react";
import type { InputRenderable } from "@opentui/core";

function DeleteButtons() {
  const ref = useRef<InputRenderable | null>(null);
  return (
    <box>
      <input ref={ref} focused />
      <button onPress={() => ref.current?.deleteWordBackward()}>Delete-word-back</button>
      <button onPress={() => ref.current?.deleteToLineEnd()}>Delete-to-line-end</button>
    </box>
  );
}
```

2) Protecting words/phrases from wrap (NBSP / WORD JOINER)

- Approach: temporarily replace target words or inter-word spaces with non-breaking characters and restore after editing.
- Tradeoffs: modifies buffer offsets (affects selection/search/undo). Keep original text to restore.

Snippet:

```ts
const WORD_JOINER = "\u2060"; // zero-width non-breaking
const NBSP = "\u00A0"; // visible non-breaking space

function protectWords(ref: any, words: string[]) {
  const inst = ref.current;
  if (!inst) return null;
  const original = inst.plainText;
  const esc = words.map(w => w.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")).join("|");
  const rx = new RegExp(`\\b(${esc})\\b`, "g");
  const protectedText = original.replace(rx, m => m.split("").join(WORD_JOINER));
  inst.replaceText(protectedText);
  return original;
}

function restoreOriginal(ref: any, original: string | null) {
  if (!ref.current || original == null) return;
  ref.current.replaceText(original);
}
```

3) Coordinates / mapping offsets

- Use editBuffer.offsetToPosition(offset) to get logical row/col.
- Use editorView.getVisualCursor() to get visualRow/visualCol.
- To avoid moving the real cursor, create a temporary EditorView with the same viewport and query it.

4) Wrap control

- Runtime: ref.current.wrapMode = "none" | "char" | "word" or ref.current.editorView.setWrapMode(mode)
- Recommend toggling on resize or content-change with debounce.

5) Locking input (making non-editable)

- No guaranteed `readOnly` prop in types. Recommended:
  - Remove focus (ref.current.blur())
  - Or override keyBindings to no-op while locked

6) Extmarks and ghost text

- Use ref.current.extmarks.create({start,end,virtual:true,data,styleId}) for inline suggestions without mutating buffer.
- Always clear extmarks when dismissed.

7) Testing hints

- For behavioral tests, use editBuffer.getText() or getTextRange() to assert buffer contents after operations.
- For keybinding tests, inject KeyEvent into renderer.keyInput or simulate via test utils.
