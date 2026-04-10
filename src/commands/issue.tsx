import { Command } from "@cliffy/command";
import { AppRouter } from "../app/router.tsx";
import { runTuiWithRedux } from "../lib/runner.tsx";
import type { Config } from "../services/config/schema/config_schema.ts";

export function createIssueCommand(_config?: Config) {
  return new Command()
    .description("Manage issues in the repository")
    .action(async () => {
      await runTuiWithRedux(<AppRouter initialPath="/issue" />);
    });
}
