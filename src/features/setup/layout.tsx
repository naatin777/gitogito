import { TextAttributes } from "@opentui/core";
import { Outlet, useLocation } from "react-router";
import { Box, Text } from "../../components/ThemedComponents.tsx";

const STEP_LABELS: Record<string, string> = {
  "/setup": "AI Provider",
  "/setup/model": "AI Model",
  "/setup/open-router-key": "OpenRouter API Key",
  "/setup/gemini-key": "Gemini API Key",
  "/setup/github-token": "GitHub Token",
  "/setup/language": "Language",
  "/setup/theme": "Theme",
  "/setup/review": "Review",
  "/setup/done": "Done",
};

export function SetupLayout() {
  const location = useLocation();
  const label = STEP_LABELS[location.pathname] ?? "Setup";

  return (
    <Box flexDirection="column" paddingLeft={1} paddingRight={1}>
      <Text color="primary" attributes={TextAttributes.BOLD}>
        Setup › {label}
      </Text>
      <Outlet />
    </Box>
  );
}
