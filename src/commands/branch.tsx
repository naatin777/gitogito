import { Command } from "@cliffy/command";
import { createAppDependencies } from "../app/app_extra.ts";
import { AppRouter } from "../app/router.tsx";
import type { AppDependencies } from "../app/store.ts";
import { runFullScreenTui } from "../lib/runner.tsx";

export function createBranchCommand(dependencies: AppDependencies = createAppDependencies()) {
  return new Command().description("Create a new branch").action(async () => {
    await runFullScreenTui(<AppRouter initialPath="/branch" />, dependencies);
  });
}
