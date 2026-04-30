import type { Result } from "neverthrow";
import type { Config } from "../schema/config-schema.js";
import type { ConfigScope } from "./config-scope.js";

export type GetMergedConfigError = { code: "invalid_yaml"; message: string } | { code: "read_failed"; message: string };

export type SetScalarError =
  | { code: "invalid_yaml"; message: string }
  | { code: "read_failed"; message: string }
  | { code: "write_failed"; message: string };

export type SetScalarResult = { path: string; scope: ConfigScope };

/** Port: set a single scalar in structured config, scoped by file policy. Implementations live in apps. */
export interface ConfigService {
  getMergedConfig(): Promise<Result<Config, GetMergedConfigError>>;

  setScalar(
    scope: ConfigScope,
    dottedKey: string,
    value: string,
    options: { dryRun: boolean },
  ): Promise<Result<SetScalarResult, SetScalarError>>;
}
