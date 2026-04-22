import { z } from "zod";

const HexColorSchema = z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);

export const AnsiSchema = z
  .object({
    black: HexColorSchema.default("#000000"),
    red: HexColorSchema.default("#cd3131"),
    green: HexColorSchema.default("#0dbc79"),
    yellow: HexColorSchema.default("#e5e510"),
    blue: HexColorSchema.default("#2472c8"),
    magenta: HexColorSchema.default("#bc3fbc"),
    cyan: HexColorSchema.default("#11a8cd"),
    white: HexColorSchema.default("#e5e5e5"),

    bright_black: HexColorSchema.default("#666666"),
    bright_red: HexColorSchema.default("#f14c4c"),
    bright_green: HexColorSchema.default("#23d18b"),
    bright_yellow: HexColorSchema.default("#f5f543"),
    bright_blue: HexColorSchema.default("#3b8eea"),
    bright_magenta: HexColorSchema.default("#d670d6"),
    bright_cyan: HexColorSchema.default("#29b8db"),
    bright_white: HexColorSchema.default("#ffffff"),
  })
  .describe("ANSI color palette definition with fallback hex values.");

export const ColorSchema = z.union([
  z.object({ hex: HexColorSchema }),
  z.object({ ansi: z.enum(AnsiSchema.keyof().options) }),
]);

type ColorDefault = string | z.input<typeof ColorSchema>;

export type ThemeColorDefaults = {
  surface: ColorDefault;
  inputBackground: ColorDefault;
  border: ColorDefault;
  divider: ColorDefault;
  text: ColorDefault;
  error: ColorDefault;
  success: ColorDefault;
  warning: ColorDefault;
  info: ColorDefault;
  hover: ColorDefault;
  focus: ColorDefault;
  selected: ColorDefault;
  borderFocus: ColorDefault;
};

export const createThemeColorsSchema = (description: string, defaults: ThemeColorDefaults) => {
  const toColorDefault = (value: ColorDefault): z.input<typeof ColorSchema> => {
    if (typeof value === "string") {
      return { hex: value };
    }
    return value;
  };

  return z
    .object({
      // --- 1. Base Structure ---
      surface: ColorSchema.default(toColorDefault(defaults.surface)).describe(
        "Panel background (e.g., ANSI 8: Bright Black)",
      ),
      inputBackground: ColorSchema.default(toColorDefault(defaults.inputBackground)).describe(
        "Input field background (e.g., ANSI 0: Black)",
      ),
      border: ColorSchema.default(toColorDefault(defaults.border)).describe(
        "Default border color (e.g., ANSI 7: White)",
      ),
      divider: ColorSchema.default(toColorDefault(defaults.divider)).describe(
        "Separator/Divider color (e.g., ANSI 8: Bright Black)",
      ),
      text: ColorSchema.default(toColorDefault(defaults.text)).describe("Base text color (e.g., ANSI 7: White)"),

      // --- 2. Semantic & Status---
      error: ColorSchema.default(toColorDefault(defaults.error)).describe("Error/Fail color (e.g., ANSI 1: Red)"),
      success: ColorSchema.default(toColorDefault(defaults.success)).describe(
        "Success/Pass color (e.g., ANSI 2: Green)",
      ),
      warning: ColorSchema.default(toColorDefault(defaults.warning)).describe(
        "Warning/Warn color (e.g., ANSI 3: Yellow)",
      ),
      info: ColorSchema.default(toColorDefault(defaults.info)).describe("Info/Command color (e.g., ANSI 6: Cyan)"),

      // --- 3. Interactive & Accent ---
      hover: ColorSchema.default(toColorDefault(defaults.hover)).describe("Hover background (e.g., ANSI 4: Blue)"),
      focus: ColorSchema.default(toColorDefault(defaults.focus)).describe(
        "Focus background (e.g., ANSI 12: Bright Blue)",
      ),
      selected: ColorSchema.default(toColorDefault(defaults.selected)).describe(
        "Selection background (e.g., ANSI 14: Bright Cyan)",
      ),
      borderFocus: ColorSchema.default(toColorDefault(defaults.borderFocus)).describe(
        "Focused border color (e.g., ANSI 15: Bright White)",
      ),
    })
    .describe(description);
};
