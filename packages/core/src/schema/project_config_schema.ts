import { type Config, ConfigSchema, DEFAULT_CONFIG } from "./config_schema.js";

/**
 * Project / team config: e.g. `.gitogito.yaml` in the working tree.
 * Same full shape as merged config. In the full stack, order is **defaults → global → project → local** (this is the third layer).
 */
export const ProjectConfigSchema = ConfigSchema.describe("Project (shared) config file in the repository.");

export type ProjectConfig = Config;

export const DEFAULT_PROJECT_CONFIG: ProjectConfig = DEFAULT_CONFIG;
