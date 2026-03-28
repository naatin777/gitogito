import { YAML } from "bun";
import _ from "lodash";
import type { NestedKeys, PathValue } from "../../type.ts";
import {
  configFile,
  type ConfigScope,
  type CredentialsScope,
} from "../config/file.ts";
import { type EnvService, envService } from "./env.ts";
import type { ConfigFile } from "./file.ts";
import type { AppContext } from "./schema/app_context.ts";
import { type Config, ConfigSchema } from "./schema/config.ts";
import type { Credentials } from "./schema/credentials.ts";

export interface ConfigService {
  getGlobalConfig(): Promise<{
    config: Partial<Config> | undefined;
    credentials: Partial<Credentials> | undefined;
  }>;

  getProjectConfig(): Promise<Partial<Config> | undefined>;

  getLocalConfig(): Promise<{
    config: Partial<Config> | undefined;
    credentials: Partial<Credentials> | undefined;
  }>;

  getMergedCredentials(): Promise<Partial<Credentials>>;
  getMergedConfig(): Promise<Config>;

  saveConfig<K extends NestedKeys<Config>>(
    configScope: ConfigScope,
    key: K,
    value: PathValue<Config, K>,
  ): Promise<void>;

  saveCredentials<K extends NestedKeys<Credentials>>(
    credentialsScope: CredentialsScope,
    key: K,
    value: PathValue<Credentials, K>,
  ): Promise<void>;
}

export class ConfigServiceImpl implements ConfigService {
  private envService: EnvService;
  private configFile: ConfigFile;

  constructor(
    _envService: EnvService = envService,
    _configFile: ConfigFile = configFile,
  ) {
    this.envService = _envService;
    this.configFile = _configFile;
  }

  async getGlobalConfig(): Promise<{
    config: Partial<Config> | undefined;
    credentials: Partial<Credentials> | undefined;
  }> {
    const globalConfigText = await this.configFile.load("global");
    const context = parseAppContext(globalConfigText);
    return {
      config: stripCredentialsFromContext(context),
      credentials: extractCredentials(context),
    };
  }

  async getProjectConfig(): Promise<Partial<Config> | undefined> {
    const projectConfigText = await this.configFile.load("project");
    const projectConfig = (YAML.parse(
      projectConfigText,
    ) ?? {}) as Partial<Config>;
    return projectConfig;
  }

  async getLocalConfig(): Promise<{
    config: Partial<Config> | undefined;
    credentials: Partial<Credentials> | undefined;
  }> {
    const localConfigText = await this.configFile.load("local");
    const context = parseAppContext(localConfigText);
    return {
      config: stripCredentialsFromContext(context),
      credentials: extractCredentials(context),
    };
  }

  async getMergedConfig(): Promise<Config> {
    const defaultConfig = ConfigSchema.parse({});
    const { config: globalConfig } = await this.getGlobalConfig();
    const projectConfig = await this.getProjectConfig();
    const { config: localConfig } = await this.getLocalConfig();
    return _.merge(
      {},
      defaultConfig,
      globalConfig ?? {},
      projectConfig ?? {},
      localConfig ?? {},
    );
  }

  async getMergedCredentials(): Promise<Partial<Credentials>> {
    const { credentials: globalCredentials } = await this.getGlobalConfig();
    const { credentials: localCredentials } = await this.getLocalConfig();
    const aiApiKey = this.envService.getAiApiKey();
    const githubToken = this.envService.getGitHubToken();
    const envCredentials: Partial<Credentials> = {
      aiApiKey: aiApiKey,
      githubToken: githubToken,
    };
    return {
      ...globalCredentials,
      ...localCredentials,
      ...envCredentials,
    };
  }

  async saveConfig<K extends NestedKeys<Config>>(
    configScope: ConfigScope,
    key: K,
    value: PathValue<Config, K>,
  ) {
    const configText = await this.configFile.load(configScope);
    const config = (YAML.parse(configText) ?? {}) as Partial<Config>;
    _.set(config, key, value);
    await this.configFile.save(configScope, YAML.stringify(config, null, 2));
  }

  async saveCredentials<K extends NestedKeys<Credentials>>(
    credentialsScope: CredentialsScope,
    key: K,
    value: PathValue<Credentials, K>,
  ) {
    const credentialsText = await this.configFile.load(credentialsScope);
    const context = normalizeCredentialContext(parseAppContext(credentialsText));
    _.set(context, `credentials.${key}`, value);
    await this.configFile.save(
      credentialsScope,
      YAML.stringify(context, null, 2),
    );
  }
}

export const configService = new ConfigServiceImpl();

type ParsedAppContext = Partial<AppContext> & Partial<Credentials>;

function parseAppContext(text: string): ParsedAppContext {
  return (YAML.parse(text) ?? {}) as ParsedAppContext;
}

function stripCredentialsFromContext(
  context: ParsedAppContext,
): Partial<Config> {
  const {
    credentials: _credentials,
    aiApiKey: _legacyAiApiKey,
    githubToken: _legacyGithubToken,
    ...config
  } = context;
  return config as Partial<Config>;
}

function extractCredentials(
  context: ParsedAppContext,
): Partial<Credentials> | undefined {
  const credentials: Partial<Credentials> = {
    ...context.credentials,
  };

  if (typeof context.aiApiKey === "string") {
    credentials.aiApiKey = context.aiApiKey;
  }

  if (typeof context.githubToken === "string") {
    credentials.githubToken = context.githubToken;
  }

  return Object.keys(credentials).length > 0 ? credentials : undefined;
}

function normalizeCredentialContext(
  context: ParsedAppContext,
): Partial<AppContext> {
  const normalizedContext = {
    ...stripCredentialsFromContext(context),
  } as Partial<AppContext>;
  const credentials = extractCredentials(context);

  if (credentials) {
    normalizedContext.credentials = credentials;
  }

  return normalizedContext;
}
