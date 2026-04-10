import { Command } from "@cliffy/command";
import { AppRouter } from "../app/router.tsx";
import { runTuiWithRedux } from "../lib/runner.tsx";
import type { Config } from "../services/config/schema/config_schema.ts";

export function createInitCommand(_config?: Config) {
  return new Command()
    .description("Initialize a new project")
    .action(async () => {
      await runTuiWithRedux(<AppRouter initialPath="/init" />);
    });
}
