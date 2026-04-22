import { z } from "zod";
import { createThemeColorsSchema } from "./fields/color_schema";

export const AiModelSchema = z
  .object({
    provider: z
      .enum(["Ollama", "OpenRouter", "Gemini", "CodexCLI", "ClaudeCode", "CodexCLIWithOllama", "ClaudeCodeWithOllama"])
      .default("Ollama")
      .describe("AI provider used for generation."),
    model: z.string().default("llama3.1:8b").describe("Model name used by the selected AI provider."),
  })
  .describe("AI model configuration.");

export const ConfigSchema = z
  .object({
    ai: z
      .object({
        default: AiModelSchema.optional().describe("Default model used when no task-specific model is configured."),
        commit: AiModelSchema.optional().describe("Model used for commit message generation."),
        issue: AiModelSchema.optional().describe("Model used for issue generation."),
        branch: AiModelSchema.optional().describe("Model used for branch name generation."),
        pr: AiModelSchema.optional().describe("Model used for pull request title generation."),
      })
      .default({})
      .describe("AI configuration."),
    language: z
      .object({
        dialogue: z.string().default("English").describe("Language used for interactive dialogue."),
        output: z.string().default("English").describe("Language used for generated output."),
      })
      .default({
        dialogue: "English",
        output: "English",
      })
      .describe("Language configuration."),

    appearance: z
      .object({
        useNerdFont: z.boolean().default(false).describe("Whether to use nerd font."),
        themeMode: z
          .enum(["light", "dark", "system_or_light", "system_or_dark"])
          .default("system_or_dark")
          .describe("Theme mode."),
        lightModeColor: createThemeColorsSchema("Light mode color configuration.", {
          surface: "#ffffff",
          inputBackground: "#ffffff",
          border: "#ffffff",
          divider: "#ffffff",
          text: "#ffffff",
          error: "#ffffff",
          success: "#ffffff",
          warning: "#ffffff",
          info: "#ffffff",
          hover: "#ffffff",
          focus: "#ffffff",
          selected: "#ffffff",
          borderFocus: "#ffffff",
        }),
        darkModeColor: createThemeColorsSchema("Dark mode color configuration.", {
          surface: "#000000",
          inputBackground: "#000000",
          border: "#000000",
          divider: "#000000",
          text: "#000000",
          error: "#000000",
          success: "#000000",
          warning: "#000000",
          info: "#000000",
          hover: "#000000",
          focus: "#000000",
          selected: "#000000",
          borderFocus: "#000000",
        }),
      })
      .default({
        useNerdFont: false,
        themeMode: "system_or_dark",
        lightModeColor: {
          surface: { hex: "#ffffff" },
          inputBackground: { hex: "#ffffff" },
          border: { hex: "#ffffff" },
          divider: { hex: "#ffffff" },
          text: { hex: "#ffffff" },
          error: { hex: "#ffffff" },
          success: { hex: "#ffffff" },
          warning: { hex: "#ffffff" },
          info: { hex: "#ffffff" },
          hover: { hex: "#ffffff" },
          focus: { hex: "#ffffff" },
          selected: { hex: "#ffffff" },
          borderFocus: { hex: "#ffffff" },
        },
        darkModeColor: {
          surface: { hex: "#000000" },
          inputBackground: { hex: "#000000" },
          border: { hex: "#000000" },
          divider: { hex: "#000000" },
          text: { hex: "#000000" },
          error: { hex: "#000000" },
          success: { hex: "#000000" },
          warning: { hex: "#000000" },
          info: { hex: "#000000" },
          hover: { hex: "#000000" },
          focus: { hex: "#000000" },
          selected: { hex: "#000000" },
          borderFocus: { hex: "#000000" },
        },
      })
      .describe("Theme settings."),
    // Legacy theme field kept for compatibility with older tests/consumers.
    theme: z
      .object({
        mode: z
          .enum(["AdaptiveDark", "AdaptiveLight", "GenericDark", "GenericLight", "SolidDark", "SolidLight", "Custom"])
          .optional(),
      })
      .optional(),
  })
  .describe("Root configuration schema. Represents the fully merged config.");

export type Config = z.infer<typeof ConfigSchema>;

export const DEFAULT_CONFIG: Config = ConfigSchema.parse({});
