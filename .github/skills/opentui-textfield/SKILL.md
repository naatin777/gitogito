---
name: opentui-textfield-helper
description: >
  Provide concise implementation guidance and code snippets for OpenTUI input/textarea features.
  Trigger when the user asks about input behavior, deletion shortcuts, wrap control, extmarks/ghost text,
  cursor coordinates, or protecting specific words from wrapping.
---

# Overview

This skill returns short implementation notes and ready-to-use TypeScript/React snippets for common OpenTUI textfield tasks:
- Deletion operations (word/line/selection)
- Extmarks and virtual ghost text (inline completion)
- Mapping offsets to logical and visual coordinates
- Controlling wrapMode at runtime
- Protecting specific words/phrases from wrapping using NBSP or WORD JOINER
- Temporarily locking (disabling) input via focus/key interception

# Triggers
- "opentui textarea", "textfield", "delete word", "wrap control", "extmarks", "ghost text", "protect word"

# Output
Return:
- Short implementation guidance (English)
- Copy-pasteable TypeScript/React snippets
- 2 automated test prompts (for local eval)

# Notes
Keep answers concise. When examples are requested, include minimal surrounding imports and explain side-effects (offset changes, selection impacts).