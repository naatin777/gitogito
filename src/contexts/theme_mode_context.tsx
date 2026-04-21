import type { ThemeMode } from "@opentui/core";
import { useRenderer } from "@opentui/react";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

const THEME_MODE_CONTEXT_UNSET = Symbol("ThemeModeContext.unset");

const ThemeModeContext = createContext<ThemeMode | null | typeof THEME_MODE_CONTEXT_UNSET>(
  THEME_MODE_CONTEXT_UNSET,
);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const renderer = useRenderer();
  const [themeMode, setThemeMode] = useState<ThemeMode | null>(renderer.themeMode);

  useEffect(() => {
    setThemeMode(renderer.themeMode);

    const handler = (mode: ThemeMode) => setThemeMode(mode);
    renderer.on("theme_mode", handler);
    return () => {
      renderer.off("theme_mode", handler);
    };
  }, [renderer]);

  return <ThemeModeContext.Provider value={themeMode}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode(): ThemeMode | null {
  const ctx = useContext(ThemeModeContext);
  if (ctx === THEME_MODE_CONTEXT_UNSET) {
    throw new Error("useThemeMode must be used within ThemeModeProvider");
  }
  return ctx;
}
