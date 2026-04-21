import { Command } from "@cliffy/command";
import { createAppDependencies } from "../app/app_extra.ts";
import { AppRouter } from "../app/router.tsx";
import type { AppDependencies } from "../app/store.ts";
import { runTuiWithRedux } from "../lib/runner.tsx";

export function createInitCommand(dependencies: AppDependencies = createAppDependencies()) {
  return new Command().description("Initialize a new project").action(async () => {
    await runTuiWithRedux(<AppRouter initialPath="/init" />, { dependencies });
  });
}
