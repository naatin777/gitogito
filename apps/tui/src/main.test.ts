import { expect, spyOn, test } from "bun:test";
import { Command } from "@cliffy/command";
import { createAppCommand } from "./main";

test("createAppCommand showHelp if args is empty", async () => {
  const showHelpSpy = spyOn(Command.prototype, "showHelp").mockImplementation(() => {});
  const command = await createAppCommand();
  await command.parse([]);
  expect(showHelpSpy).toHaveBeenCalled();
  showHelpSpy.mockRestore();
});

test("createAppCommand showHelp if args is completions", async () => {
  const showHelpSpy = spyOn(Command.prototype, "showHelp").mockImplementation(() => {});
  const command = await createAppCommand();
  const { cmd } = await command.parse(["completions"]);
  const name = cmd.getName();
  expect(name).toContain("completions");
  expect(showHelpSpy).toHaveBeenCalled();
  showHelpSpy.mockRestore();
});
