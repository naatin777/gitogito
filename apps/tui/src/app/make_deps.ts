import { type ConfigService, ConfigServiceImpl } from "@gitogito/core";
import packageJson from "../../package.json" with { type: "json" };
import { GitogitoConfigPathResolver } from "../entities/config/api/config_paths.js";
import { FsConfigFile } from "../entities/config/api/fs_config_file.js";
import { ProcessRuntimeEnv } from "../shared/api/env/process_runtime_env.js";

export interface AppDeps {
  configService: ConfigService;
}

export function makeDeps(): AppDeps {
  const env = new ProcessRuntimeEnv();
  const paths = new GitogitoConfigPathResolver(env, packageJson.displayName);
  const configFile = new FsConfigFile(paths);
  const configService = new ConfigServiceImpl(configFile);
  return { configService };
}
