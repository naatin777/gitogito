import { Command } from "@cliffy/command";
import { createAppDependencies } from "../app/app_extra.ts";
import { AppRouter } from "../app/router.tsx";
import type { AppDependencies } from "../app/store.ts";
import { runTuiWithRedux } from "../lib/runner.tsx";

export function createIssueCommand(dependencies: AppDependencies = createAppDependencies()) {
  return new Command().description("Manage issues in the repository").action(async () => {
    await runTuiWithRedux(<AppRouter initialPath="/issue" />, { dependencies });
  });
}
