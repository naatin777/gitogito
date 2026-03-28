import { expect, test } from "bun:test";
import { createInitCommand } from "./init.tsx";

test("init initializes project config by default", async () => {
  const saves: { scope: string; data: string }[] = [];
  const logs: string[] = [];
  const command = createInitCommand({
    configFile: {
      exists: async () => false,
      save: async (scope, data) => {
        saves.push({ scope, data });
      },
    },
    writeInfo: (message) => logs.push(message),
    writeError: () => {},
  });

  await command.parse([]);

  expect(saves).toEqual([{ scope: "project", data: "{}\n" }]);
  expect(logs).toEqual(["Initialized project config."]);
});

test("init respects the global scope option", async () => {
  const saves: { scope: string; data: string }[] = [];
  const command = createInitCommand({
    configFile: {
      exists: async () => false,
      save: async (scope, data) => {
        saves.push({ scope, data });
      },
    },
    writeInfo: () => {},
    writeError: () => {},
  });

  await command.parse(["--global"]);

  expect(saves).toEqual([{ scope: "global", data: "{}\n" }]);
});

test("init respects the local scope option", async () => {
  const saves: { scope: string; data: string }[] = [];
  const command = createInitCommand({
    configFile: {
      exists: async () => false,
      save: async (scope, data) => {
        saves.push({ scope, data });
      },
    },
    writeInfo: () => {},
    writeError: () => {},
  });

  await command.parse(["--local"]);

  expect(saves).toEqual([{ scope: "local", data: "{}\n" }]);
});

test("init does not overwrite an existing config", async () => {
  const errors: string[] = [];
  const originalExitCode = process.exitCode;
  process.exitCode = 0;
  const command = createInitCommand({
    configFile: {
      exists: async () => true,
      save: async () => {
        throw new Error("should not save");
      },
    },
    writeInfo: () => {},
    writeError: (message) => errors.push(message),
  });
  await command.parse([]);

  expect(errors).toEqual(["project config already exists."]);
  expect(process.exitCode).toBe(1);
  process.exitCode = originalExitCode ?? 0;
});

test("init reports the global exists error", async () => {
  const errors: string[] = [];
  const originalExitCode = process.exitCode;
  process.exitCode = 0;
  const command = createInitCommand({
    configFile: {
      exists: async () => true,
      save: async () => {
        throw new Error("should not save");
      },
    },
    writeInfo: () => {},
    writeError: (message) => errors.push(message),
  });

  await command.parse(["--global"]);

  expect(errors).toEqual(["global config already exists."]);
  expect(process.exitCode).toBe(1);
  process.exitCode = originalExitCode ?? 0;
});
