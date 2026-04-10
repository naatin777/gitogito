import { Command } from "@cliffy/command";
import { AppRouter } from "../app/router.tsx";
import { runTuiWithRedux } from "../lib/runner.tsx";
import type { Config } from "../services/config/schema/config_schema.ts";

export function createCommitCommand(_config?: Config) {
  return new Command()
    .description("Commit changes to the repository")
    .action(async () => {
      await runTuiWithRedux(<AppRouter initialPath="/commit" />);
    });
}
