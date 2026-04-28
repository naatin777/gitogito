import { z } from "zod";

const AiModelBlockSchema = z
  .object({
    provider: z.string().default("Ollama").describe("AI provider name."),
    model: z.string().default("llama3.1:8b").describe("Model name."),
  })
  .describe("AI model block.");

/**
 * Merged effective config: **schema defaults → global file → project file → local file**
 * (each step deep-overrides the previous). `mergeConfigLayers` in `../config/config_merge.ts` encodes the same order.
 * Add fields here as the product grows; scope-specific schemas are derived from this.
 */
export const ConfigSchema = z
  .object({
    ai: z
      .object({
        default: AiModelBlockSchema.describe("Default model for tasks that do not override it."),
      })
      .default({ default: { provider: "Ollama", model: "llama3.1:8b" } })
      .describe("AI configuration."),
    language: z
      .object({
        dialogue: z.string().default("en").describe("Language for interactive UI copy."),
        output: z.string().default("en").describe("Language for generated text."),
      })
      .default({ dialogue: "en", output: "en" })
      .describe("Language preferences."),
  })
  .describe("Full merged configuration (single source of truth for the tree).");

export type Config = z.infer<typeof ConfigSchema>;

export const DEFAULT_CONFIG: Config = ConfigSchema.parse({});
