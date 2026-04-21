import { Command } from "@cliffy/command";
import { createAppDependencies } from "../app/app_extra.ts";
import { AppRouter } from "../app/router.tsx";
import type { AppDependencies } from "../app/store.ts";
import { runTuiWithRedux } from "../lib/runner.tsx";

export function createCommitCommand(dependencies: AppDependencies = createAppDependencies()) {
  return new Command().description("Commit changes to the repository").action(async () => {
    await runTuiWithRedux(<AppRouter initialPath="/commit" />, { dependencies });
  });
}
