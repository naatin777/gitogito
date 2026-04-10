import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useEffect, useState } from "react";
import { Box, Text } from "../../../components/ThemedComponents.tsx";
import { useThemeColors } from "../../config/use_theme_colors.ts";
import { isCtrlC, isEnter, keyEventToInput } from "../../../helpers/opentui/key.ts";

/* v8 ignore start */
export function WizardInput({
  label,
  hint,
  defaultValue = "",
  onSubmit,
  onBack,
}: {
  label: string;
  hint?: string;
  defaultValue?: string;
  onSubmit: (val: string) => void;
  onBack: () => void;
}) {
  const themeColors = useThemeColors();
  const [value, setValue] = useState(defaultValue);
  const [cursor, setCursor] = useState(defaultValue.length);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setShowCursor((p) => !p), 500);
    return () => clearInterval(timer);
  }, []);

  useKeyboard((event) => {
    const input = keyEventToInput(event);
    setShowCursor(true);

    if (isCtrlC(event)) {
      onBack();
      return;
    }

    if (event.name === "escape") {
      onBack();
      return;
    }

    if (isEnter(event)) {
      onSubmit(value);
      return;
    }

    if (event.name === "left") {
      setCursor((p) => Math.max(0, p - 1));
      return;
    }

    if (event.name === "right") {
      setCursor((p) => Math.min(value.length, p + 1));
      return;
    }

    if (event.name === "backspace" || event.name === "delete" || event.name === "forwarddelete") {
      if (cursor > 0) {
        setValue((v) => v.slice(0, cursor - 1) + v.slice(cursor));
        setCursor((p) => p - 1);
      }
      return;
    }

    if (event.ctrl && input === "a") {
      setCursor(0);
      return;
    }

    if (event.ctrl && input === "e") {
      setCursor(value.length);
      return;
    }

    if (!event.ctrl && !event.meta && input.length > 0) {
      setValue((v) => v.slice(0, cursor) + input + v.slice(cursor));
      setCursor((p) => p + input.length);
    }
  });

  const before = value.slice(0, cursor);
  const charAtCursor = value[cursor] || " ";
  const after = value.slice(cursor + 1);

  return (
    <Box flexDirection="column">
      <Text attributes={TextAttributes.BOLD}>{label}</Text>
      {hint && <Text attributes={TextAttributes.DIM}>{hint}</Text>}
      <Box flexDirection="row" marginTop={1}>
        <text fg={themeColors.primary}>{before}</text>
        <text fg={themeColors.primary} attributes={showCursor ? TextAttributes.INVERSE : 0}>
          {charAtCursor}
        </text>
        <text fg={themeColors.primary}>{after}</text>
      </Box>
      <Text attributes={TextAttributes.DIM} marginTop={1}>
        Enter to confirm · Escape to go back
      </Text>
    </Box>
  );
}
/* v8 ignore stop */
