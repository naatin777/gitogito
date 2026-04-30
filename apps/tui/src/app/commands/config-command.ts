import { Command } from "@cliffy/command";
import { type ConfigScope, formatConfigSetParseError, parseConfigSetArgs } from "@gitogito/core";
import i18n from "../i18n.js";
import type { AppDeps } from "../make-deps.js";

/** Merged globals from the app root (`--json`, `--dry-run`, etc.). */
type ConfigCommandCliOptions = {
  json?: boolean;
  dryRun?: boolean;
  verbose?: boolean;
};

function configCliOptionsFromActionOptions(value: unknown): ConfigCommandCliOptions {
  if (value === null || typeof value !== "object") {
    return {};
  }
  return value as ConfigCommandCliOptions;
}

interface SetConfigResult {
  scope: "global" | "project" | "local";
  path: string;
  key: string;
  value: string;
  dryRun: boolean;
}

function fail(message: string, json: boolean): never {
  if (json) {
    console.log(JSON.stringify({ ok: false, error: message }));
  } else {
    console.error(message);
  }
  process.exit(1);
}

function printResult(r: SetConfigResult, json: boolean) {
  if (json) {
    console.log(JSON.stringify({ ok: true, ...r }));
  } else if (r.dryRun) {
    console.log(`[dry-run] would set ${r.key}=${JSON.stringify(r.value)} in ${r.path}`);
  } else {
    console.log(`set ${r.key}=${JSON.stringify(r.value)} (${r.scope} → ${r.path})`);
  }
}

function messageFromSetScalarError(error: { code: string; message: string }): string {
  return error.code === "invalid_yaml" ? `Invalid YAML: ${error.message}` : `${error.code}: ${error.message}`;
}

function createSetAction(deps: AppDeps, scope: ConfigScope) {
  return async (opt: unknown, key: string, value: string) => {
    const { configService } = deps;
    const flags = configCliOptionsFromActionOptions(opt);
    const args = parseConfigSetArgs({ key, value });
    const json = Boolean(flags.json);
    if (!args.success) {
      fail(formatConfigSetParseError(args.error), json);
    }
    const { key: keyTrimmed, value: valueParsed } = args.data;
    const dryRun = Boolean(flags.dryRun);
    const writeResult = await configService.setScalar(scope, keyTrimmed, valueParsed, { dryRun });
    if (writeResult.isErr()) {
      fail(messageFromSetScalarError(writeResult.error), json);
    }

    const { path, scope: outScope } = writeResult.value;
    printResult(
      {
        scope: outScope,
        path,
        key: keyTrimmed,
        value: valueParsed,
        dryRun,
      },
      json,
    );
  };
}

const SCOPE_CONFIG = [
  {
    name: "project" as const,
    descriptionKey: "cli.config.projectDescription",
  },
  {
    name: "local" as const,
    descriptionKey: "cli.config.localDescription",
  },
  {
    name: "global" as const,
    descriptionKey: "cli.config.globalDescription",
  },
] as const;

const CONFIG_I18N_KEYS = {
  manage: "cli.config.manageDescription",
  set: "cli.config.setDescription",
} as const;

type ConfigCommandTranslationKey =
  | (typeof SCOPE_CONFIG)[number]["descriptionKey"]
  | (typeof CONFIG_I18N_KEYS)[keyof typeof CONFIG_I18N_KEYS];

export function createConfigCommand(deps: AppDeps) {
  const t = (key: ConfigCommandTranslationKey): string => {
    return i18n.t(key) as string;
  };

  const config = new Command().description(t(CONFIG_I18N_KEYS.manage)).action(function () {
    this.showHelp();
  });

  for (const { name, descriptionKey } of SCOPE_CONFIG) {
    const scope: ConfigScope = name;
    config.command(
      name,
      new Command()
        .description(t(descriptionKey))
        .action(function () {
          this.showHelp();
        })
        .command(
          "set",
          new Command()
            .description(t(CONFIG_I18N_KEYS.set))
            .arguments("<key:string> <value:string>")
            .action(createSetAction(deps, scope)),
        ),
    );
  }
  return config;
}
