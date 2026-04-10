import { Command } from "@cliffy/command";
import { CompletionsCommand } from "@cliffy/command/completions";
import packageJson from "../package.json" with { type: "json" };
import { createCommitCommand } from "./commands/commit.tsx";
import { createConfigCommand } from "./commands/config.tsx";
import { createInitCommand } from "./commands/init.tsx";
import { createIssueCommand } from "./commands/issue.tsx";
import { configService } from "./services/config/config_service.ts";
import { ENV_KEYS, envService, type EnvService } from "./services/env_service.ts";
import type { Config } from "./services/config/schema/config_schema.ts";

export function createMainCommand(env: EnvService = envService, config?: Config) {
  return new Command()
    .name(packageJson.name)
    .version(packageJson.version)
    .description(packageJson.description)
    .globalEnv(ENV_KEYS.NO_COLOR.key, ENV_KEYS.NO_COLOR.description)
    .globalEnv(ENV_KEYS.OPEN_ROUTER_API_KEY.key, ENV_KEYS.OPEN_ROUTER_API_KEY.description)
    .globalEnv(ENV_KEYS.GEMINI_API_KEY.key, ENV_KEYS.GEMINI_API_KEY.description)
    .globalEnv(ENV_KEYS.GITHUB_TOKEN.key, ENV_KEYS.GITHUB_TOKEN.description)
    .help({
      colors: !env.getNoColor(),
    })
    .action(function () {
      this.showHelp();
    })
    .command("init", createInitCommand(config))
    .command("config", createConfigCommand(config))
    .command("issue", createIssueCommand(config))
    .command("commit", createCommitCommand(config))
    .command("completions", new CompletionsCommand());
}

if (import.meta.main) {
  const config = await configService.getMergedConfig();
  await createMainCommand(envService, config).parse(Bun.argv.slice(2));
}
