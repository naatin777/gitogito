import { err, ok, type Result } from "neverthrow";
import { type Document, isMap, parse, parseDocument, type YAMLMap } from "yaml";
import type {
  Config,
  ConfigFile,
  ConfigScope,
  ConfigService,
  GetMergedConfigError,
  SetScalarError,
  SetScalarResult,
} from "../../../entities/config/index.js";
import { mergeConfigLayers } from "../../../entities/config/index.js";

function setScalarInDocument(
  doc: Document,
  dottedKey: string,
  value: string,
): Result<void, { code: "invalid_yaml"; message: string }> {
  const invalidPath = () => err({ code: "invalid_yaml" as const, message: "Invalid key path." });
  const path = dottedKey.split(".").filter((p) => p.length > 0);
  if (path.length === 0) {
    return err({ code: "invalid_yaml", message: "Key must not be empty." });
  }
  if (doc.contents === null || doc.contents === undefined) {
    doc.contents = doc.createNode({});
  }
  if (!isMap(doc.contents)) {
    return err({ code: "invalid_yaml", message: "Config root must be a mapping (object)." });
  }
  let cursor = doc.contents as YAMLMap;
  for (const k of path.slice(0, -1)) {
    if (!k) {
      return invalidPath();
    }
    const existing = cursor.get(k, true);
    if (isMap(existing)) {
      cursor = existing as YAMLMap;
      continue;
    }
    if (existing !== undefined) {
      return err({ code: "invalid_yaml", message: `Cannot set nested key under non-map at "${k}".` });
    }
    const next = doc.createNode({}) as YAMLMap;
    cursor.set(k, next);
    cursor = next;
  }
  const last = path[path.length - 1];
  if (!last) {
    return invalidPath();
  }
  cursor.set(last, doc.createNode(value));
  return ok(undefined);
}

export class ConfigServiceImpl implements ConfigService {
  constructor(private readonly file: ConfigFile) {}

  async getMergedConfig(): Promise<Result<Config, GetMergedConfigError>> {
    let globalText: string;
    let projectText: string;
    let localText: string;
    try {
      [globalText, projectText, localText] = await Promise.all([
        this.file.load("global"),
        this.file.load("project"),
        this.file.load("local"),
      ]);
    } catch (e) {
      return err({ code: "read_failed", message: e instanceof Error ? e.message : String(e) });
    }

    try {
      const merged = mergeConfigLayers({
        global: (parse(globalText) ?? {}) as Record<string, unknown>,
        project: (parse(projectText) ?? {}) as Record<string, unknown>,
        local: (parse(localText) ?? {}) as Record<string, unknown>,
      });
      return ok(merged);
    } catch (e) {
      return err({ code: "invalid_yaml", message: e instanceof Error ? e.message : String(e) });
    }
  }

  async setScalar(
    scope: ConfigScope,
    dottedKey: string,
    value: string,
    options: { dryRun: boolean },
  ): Promise<Result<SetScalarResult, SetScalarError>> {
    const path = this.file.pathFor(scope);
    let text: string;
    try {
      text = await this.file.load(scope);
    } catch (e) {
      return err({ code: "read_failed", message: e instanceof Error ? e.message : String(e) });
    }

    let doc: Document;
    try {
      doc = parseDocument(text);
    } catch (e) {
      return err({ code: "invalid_yaml", message: e instanceof Error ? e.message : String(e) });
    }

    const applied = setScalarInDocument(doc, dottedKey, value);
    if (applied.isErr()) {
      return err(applied.error);
    }

    if (options.dryRun) {
      return ok({ path, scope });
    }

    try {
      await this.file.save(scope, doc.toString());
    } catch (e) {
      return err({ code: "write_failed", message: e instanceof Error ? e.message : String(e) });
    }
    return ok({ path, scope });
  }
}
