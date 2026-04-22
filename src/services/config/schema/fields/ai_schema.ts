import { z } from "zod";

export const AiModelSchema = z.object({
  provider: z.enum([
    "Ollama",
    "OpenRouter",
    "Gemini",
    "CodexCLI",
    "ClaudeCode",
    "CodexCLIWithOllama",
    "ClaudeCodeWithOllama",
  ]),
  model: z.string(),
});

export const AiConfigSchema = z.object({
  default: AiModelSchema,
  commit: AiModelSchema.optional(),
  issue: AiModelSchema.optional(),
  branch: AiModelSchema.optional(),
  pr: AiModelSchema.optional(),
});

export type AiModel = z.infer<typeof AiModelSchema>;
export type AiConfig = z.infer<typeof AiConfigSchema>;
