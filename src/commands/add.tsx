import { Command } from "@cliffy/command";
import { createAppDependencies } from "../app/app_extra.ts";
import { AppRouter } from "../app/router.tsx";
import type { AppDependencies } from "../app/store.ts";
import { runFullScreenTui } from "../lib/runner.tsx";

export function createAddCommand(dependencies: AppDependencies = createAppDependencies()) {
  return new Command().description("Add a new file to the repository").action(async () => {
    await runFullScreenTui(<AppRouter initialPath="/add" />, dependencies);
  });
}
