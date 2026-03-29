import { expect, test } from "bun:test";
import type { ConfigService } from "./config/config_service.ts";
import { ConfigSchema } from "./config/schema/config.ts";
import type { Credentials } from "./config/schema/credentials.ts";
import { AIService } from "./ai.ts";

class TestAIService extends AIService {
  resolveModel() {
    return this.getModel();
  }
}

test("AIService.create - uses the default Ollama model", async () => {
  const service = await AIService.create({
    async getMergedConfig() {
      return ConfigSchema.parse({});
    },
    async getMergedCredentials() {
      return {};
    },
  } satisfies Pick<ConfigService, "getMergedConfig" | "getMergedCredentials">);

  expect(service.getModelId()).toBe("qwen3.5:9b");
});

test("AIService.create - loads an OpenRouter model and credentials", async () => {
  const service = await AIService.create({
    async getMergedConfig() {
      return ConfigSchema.parse({
        ai: {
          provider: "OpenRouter",
          model: "openai/gpt-4o",
        },
      });
    },
    async getMergedCredentials() {
      return { aiApiKey: "test-key" } satisfies Partial<Credentials>;
    },
  } satisfies Pick<ConfigService, "getMergedConfig" | "getMergedCredentials">);

  expect(service.getModelId()).toBe("openai/gpt-4o");
});

test("AIService.create - rejects OpenRouter when the AI API key is missing", async () => {
  await expect(
    AIService.create({
      async getMergedConfig() {
        return ConfigSchema.parse({
          ai: {
            provider: "OpenRouter",
            model: "openai/gpt-4o",
          },
        });
      },
      async getMergedCredentials() {
        return {};
      },
    } satisfies Pick<ConfigService, "getMergedConfig" | "getMergedCredentials">),
  ).rejects.toThrow(
    "Missing AI API key. Set credentials.aiApiKey or GITOGITO_AI_API_KEY.",
  );
});

test("AIService resolves an Ollama model once and caches it", () => {
  const service = new TestAIService("Ollama", "qwen3.5:9b", "");

  const model = service.resolveModel();

  expect(model).toBeTruthy();
  expect(service.resolveModel()).toBe(model);
});
