import type { ThemeMode } from "@opentui/core";
import { useMemo } from "react";
import type { z } from "zod";
import { useAppSelector } from "../../app/hooks.ts";
import type { RootState } from "../../app/store.ts";
import { useThemeMode } from "../../contexts/theme_mode_context.tsx";
import type { ConfigSchema } from "../../services/config/schema/config_schema.ts";
import { AnsiSchema, type ColorSchema } from "../../services/config/schema/fields/color_schema.ts";
import type { ColorConfig, ThemeConfig } from "../../services/config/schema/fields/theme_schema.ts";
import {
  DARK_THEME_COLORS,
  DEFAULT_COLOR_CONFIG,
  LIGHT_THEME_COLORS,
  SOLID_DARK_THEME_COLORS,
  SOLID_LIGHT_THEME_COLORS,
} from "../../services/config/schema/fields/theme_schema.ts";

export function resolveThemeColors(
  mode: ThemeConfig["mode"],
  themeMode: ThemeMode | null,
  customColors: ColorConfig = DEFAULT_COLOR_CONFIG,
): ColorConfig {
  switch (mode) {
    case "AdaptiveDark":
      return themeMode === "light" ? LIGHT_THEME_COLORS : DARK_THEME_COLORS;
    case "AdaptiveLight":
      return themeMode === "dark" ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;
    case "GenericDark":
      return DARK_THEME_COLORS;
    case "GenericLight":
      return LIGHT_THEME_COLORS;
    case "SolidDark":
      return SOLID_DARK_THEME_COLORS;
    case "SolidLight":
      return SOLID_LIGHT_THEME_COLORS;
    case "Custom":
      return customColors;
  }
}

type ParsedConfig = z.infer<typeof ConfigSchema>;
type ParsedColor = z.infer<typeof ColorSchema>;
type ParsedAnsi = z.infer<typeof AnsiSchema>;

function resolveColorValue(color: ParsedColor, ansiPalette: ParsedAnsi): string {
  if ("hex" in color) {
    return color.hex;
  }
  return ansiPalette[color.ansi];
}

function resolveAppearanceThemeColors(config: ParsedConfig, themeMode: ThemeMode | null): ColorConfig {
  const mode = config.appearance.themeMode;
  const colors =
    mode === "light" || (mode === "system_or_light" && themeMode !== "dark")
      ? config.appearance.lightModeColor
      : config.appearance.darkModeColor;

  const ansi = AnsiSchema.parse({});
  return {
    backgroundColor: resolveColorValue(colors.surface, ansi),
    border: resolveColorValue(colors.border, ansi),
    text: resolveColorValue(colors.text, ansi),
    primary: resolveColorValue(colors.info, ansi),
    error: resolveColorValue(colors.error, ansi),
    success: resolveColorValue(colors.success, ansi),
    warning: resolveColorValue(colors.warning, ansi),
    info: resolveColorValue(colors.info, ansi),
    hover: resolveColorValue(colors.hover, ansi),
    focus: resolveColorValue(colors.focus, ansi),
    selected: resolveColorValue(colors.selected, ansi),
    borderFocus: resolveColorValue(colors.borderFocus, ansi),
    inputBackground: resolveColorValue(colors.inputBackground, ansi),
    divider: resolveColorValue(colors.divider, ansi),
  };
}

export function useThemeColors(): ColorConfig {
  const config = useAppSelector((state: RootState) => state.config.mergedConfig);
  const themeMode = useThemeMode();

  if (!config) {
    throw new Error("Merged config must be preloaded before using useThemeColors.");
  }

  return useMemo(() => {
    if (config.theme?.mode) {
      return resolveThemeColors(config.theme.mode, themeMode);
    }
    return resolveAppearanceThemeColors(config, themeMode);
  }, [config, themeMode]);
}
