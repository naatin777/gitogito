import { z } from "zod";

export const ThemeConfigSchema = z.object({
  mode: z.enum(["AdaptiveDark", "AdaptiveLight", "GenericDark", "GenericLight", "SolidDark", "SolidLight", "Custom"]),
});

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;

export type ColorConfig = {
  backgroundColor?: string;
  border: string;
  text: string;
  primary: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  hover: string;
  focus: string;
  selected: string;
  borderFocus: string;
  inputBackground: string;
  divider: string;
};

export const LIGHT_THEME_COLORS: ColorConfig = {
  backgroundColor: "#ffffff",
  border: "#d0d7de",
  text: "#24292f",
  primary: "#0969da",
  error: "#cf222e",
  success: "#1a7f37",
  warning: "#9a6700",
  info: "#0969da",
  hover: "#f6f8fa",
  focus: "#0969da",
  selected: "#ddf4ff",
  borderFocus: "#0969da",
  inputBackground: "#ffffff",
  divider: "#d8dee4",
};

export const DARK_THEME_COLORS: ColorConfig = {
  backgroundColor: "#0d1117",
  border: "#30363d",
  text: "#e6edf3",
  primary: "#58a6ff",
  error: "#f85149",
  success: "#3fb950",
  warning: "#d29922",
  info: "#58a6ff",
  hover: "#161b22",
  focus: "#1f6feb",
  selected: "#1f6feb",
  borderFocus: "#58a6ff",
  inputBackground: "#0d1117",
  divider: "#30363d",
};

export const SOLID_LIGHT_THEME_COLORS: ColorConfig = {
  ...LIGHT_THEME_COLORS,
  primary: "#0056b3",
};

export const SOLID_DARK_THEME_COLORS: ColorConfig = {
  ...DARK_THEME_COLORS,
  primary: "#4c8dff",
};

export const DEFAULT_COLOR_CONFIG: ColorConfig = SOLID_DARK_THEME_COLORS;
