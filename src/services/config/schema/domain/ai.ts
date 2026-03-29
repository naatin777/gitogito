import { z } from "zod";
import { AI_PROVIDER } from "../../../../constants/ai.ts";

export const AiConfigSchema = z.object({
  provider: z.enum(AI_PROVIDER).describe("AI provider used for generation."),
  model: z.string().describe("Model name used by the selected AI provider."),
}).describe("AI configuration.");

export type AiConfig = z.infer<typeof AiConfigSchema>;

export const DEFAULT_AI_CONFIG: AiConfig = {
  provider: "Ollama",
  model: "qwen3.5:9b",
} as const;
