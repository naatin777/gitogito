import { Command } from "@cliffy/command";
import { AppRouter } from "../app/router.tsx";
import { flatSchema, fullPath, urlPath } from "../helpers/flat_schema.ts";
import { runTuiWithRedux } from "../lib/runner.tsx";
import type { ConfigScope } from "../services/config/config_file.ts";
import { ConfigServiceImpl, type ConfigService } from "../services/config/config_service.ts";
import { ConfigSchema, type Config } from "../services/config/schema/config_schema.ts";
import type { NestedKeys } from "../type.ts";

export type ConfigCommandOptions = {
  project?: true | undefined;
  local?: true | undefined;
  global?: true | undefined;
};

export type ConfigSetCommandOptions = ConfigCommandOptions & {
  set?: string;
};

function resolveScope(options: ConfigCommandOptions): ConfigScope {
  if (options.local) return "local";
  if (options.global) return "global";
  return "project";
}

export function buildSubcommands(
  root: Command<void, void, void, [], ConfigCommandOptions>,
  items: ReturnType<typeof flatSchema>,
  configService: ConfigService,
  depth = 0,
) {
  for (const item of items) {
    if (item.parents.length !== depth) continue;

    const itemFullPath = fullPath(item);
    const itemUrlPath = urlPath(item);
    const cmd = new Command<ConfigCommandOptions>()
      .description(`Configure ${itemFullPath}`);

    if (item.isLeaf) {
      cmd.option("--set <value:string>", "Set value for this config key.")
        .action(async (options: ConfigSetCommandOptions) => {
          const scope = resolveScope(options);
          if (options.set) {
            await configService.saveConfig(scope, itemFullPath as NestedKeys<Config>, options.set);
          } else {
            const scope = resolveScope(options);
            await runTuiWithRedux(<AppRouter initialPath={`/config/${itemUrlPath}`} params={{ scope }} />);
          }
        });
    } else {
      cmd.action(async (options: ConfigCommandOptions) => {
        const scope = resolveScope(options);
        await runTuiWithRedux(<AppRouter initialPath={`/config/${itemUrlPath}`} params={{ scope }} />);
      });
    }

    if (!item.isLeaf) {
      const children = items.filter(
        (child) =>
          // Whether it is at a deeper level than the current one
          child.parents.length > depth &&
          // Whether it is under the current item at that specific level
          child.parents[depth] === item.key &&
          // Whether the ancestor path matches the current item.parents
          child.parents.slice(0, depth).every((p, i) => p === item.parents[i]),
      );
      buildSubcommands(cmd, children, configService, depth + 1);
    }

    root.command(item.key, cmd);
  }
}

export function createConfigCommand(_config?: Config) {
  const command = new Command()
    .description("Configure the repository")
    .globalOption("--project", "Set project settings.", {
      conflicts: ["local", "global"],
    })
    .globalOption("--local", "Set local settings.", {
      conflicts: ["project", "global"],
    })
    .globalOption("--global", "Set global settings.", {
      conflicts: ["project", "local"],
    })
    .action(async (options: ConfigCommandOptions) => {
      const scope = resolveScope(options);
      await runTuiWithRedux(<AppRouter initialPath="/config" params={{ scope }} />);
    });

  buildSubcommands(command, flatSchema(ConfigSchema), new ConfigServiceImpl());

  return command;
}
