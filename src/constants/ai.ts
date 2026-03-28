export const AI_PROVIDER = [
  "Ollama",
  "OpenRouter",
] as const;

export type AI_PROVIDER_KEY = typeof AI_PROVIDER[number];
