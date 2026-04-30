import { expectTypeOf, test } from "vitest";
import type { NestedKeys, PathValue } from "./path-types.js";

type Sample = {
  language: {
    dialogue: "en" | "ja";
    output: string;
  };
  retries: number;
  tags: string[];
};

test("NestedKeys builds dot-notation keys for plain objects", () => {
  expectTypeOf<NestedKeys<Sample>>().toEqualTypeOf<
    "language" | "language.dialogue" | "language.output" | "retries" | "tags"
  >();
});

test("PathValue resolves value type from nested path", () => {
  expectTypeOf<PathValue<Sample, "language.dialogue">>().toEqualTypeOf<"en" | "ja">();
  expectTypeOf<PathValue<Sample, "retries">>().toEqualTypeOf<number>();
  expectTypeOf<PathValue<Sample, "unknown.path">>().toEqualTypeOf<never>();
});
