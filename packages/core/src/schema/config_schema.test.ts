import { expect, test } from "vitest";
import { ConfigSchema, DEFAULT_CONFIG } from "./config_schema.js";
import { DEFAULT_GLOBAL_CONFIG, GlobalConfigSchema } from "./global_config_schema.js";
import { DEFAULT_LOCAL_CONFIG, LocalConfigSchema } from "./local_config_schema.js";
import { DEFAULT_PROJECT_CONFIG, ProjectConfigSchema } from "./project_config_schema.js";

test("merged ConfigSchema fills defaults for empty object", () => {
  const c = ConfigSchema.parse({});
  expect(c.ai.default.provider).toBe("Ollama");
  expect(c.language.output).toBe("en");
  expect(c).toEqual(DEFAULT_CONFIG);
});

test("GlobalConfigSchema omits ai; still has language defaults", () => {
  const g = GlobalConfigSchema.parse({});
  expect("ai" in g).toBe(false);
  expect(g.language.dialogue).toBe("en");
  expect(g).toEqual(DEFAULT_GLOBAL_CONFIG);
});

test("Project and local schemas are full Config shape", () => {
  const p = ProjectConfigSchema.parse({});
  const l = LocalConfigSchema.parse({});
  expect(p).toEqual(DEFAULT_PROJECT_CONFIG);
  expect(l).toEqual(DEFAULT_LOCAL_CONFIG);
  expect("ai" in p).toBe(true);
  expect("ai" in l).toBe(true);
});

test("ConfigSchema allows partial language override", () => {
  const c = ConfigSchema.parse({ language: { dialogue: "ja" } });
  expect(c.language.dialogue).toBe("ja");
  expect(c.language.output).toBe("en");
});
