import { Command } from "@cliffy/command";
import { createAppDependencies } from "../app/app_extra";
import { AppRouter } from "../app/router";
import type { AppDependencies } from "../app/store";
import { runFullScreenTui } from "../lib/runner";

export function createPrCommand(dependencies: AppDependencies = createAppDependencies()) {
  return new Command().description("Create a new pull request").action(async () => {
    await runFullScreenTui(<AppRouter initialPath="/pr" />, dependencies);
  });
}
