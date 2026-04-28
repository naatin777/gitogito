import { expect, test } from "vitest";
import { DEFAULT_CONFIG } from "../schema/config_schema.js";
import { mergeConfigLayers } from "./config_merge.js";

test("merge order: local overrides project overrides global over defaults", () => {
  const m = mergeConfigLayers({
    global: { language: { dialogue: "ja", output: "en" } },
    project: { language: { dialogue: "fr" } },
    local: { language: { output: "de" } },
  });
  expect(m.language.dialogue).toBe("fr");
  expect(m.language.output).toBe("de");
  expect(m.ai.default.provider).toBe(DEFAULT_CONFIG.ai.default.provider);
});

test("defaults used when only partial project set", () => {
  const m = mergeConfigLayers({ project: {} });
  expect(m).toEqual(DEFAULT_CONFIG);
});
