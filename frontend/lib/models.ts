import { readFileSync } from "fs";
import { join } from "path";
import { load } from "js-yaml";

export interface ModelAlias {
  alias: string;
  provider: string;
  model_id: string;
  tier: "free" | "pro";
  description: string;
}

export interface PublicModelAlias {
  alias: string;
  provider: string;
  tier: "free" | "pro";
  description: string;
}

const CONFIG_PATH =
  process.env.CODE_SRS_CONFIG_PATH || "/home/dev/AI_Workflow/config/code-srs";

let cachedModels: ModelAlias[] | null = null;

export function loadModels(): ModelAlias[] {
  if (cachedModels) return cachedModels;
  const filePath = join(CONFIG_PATH, "models.yaml");
  const raw = readFileSync(filePath, "utf-8");
  const parsed = load(raw) as { models: ModelAlias[] };
  cachedModels = parsed.models as ModelAlias[];
  return cachedModels;
}

/**
 * Returns model aliases without the real model_id.
 * This ensures real model IDs never leave the server.
 */
export function getPublicModels(): PublicModelAlias[] {
  const models = loadModels();
  return models.map(({ alias, provider, tier, description }) => ({
    alias,
    provider,
    tier,
    description,
  }));
}

/**
 * Resolve an alias to its real model_id server-side only.
 * Returns null if alias not found.
 */
export function resolveModelAlias(alias: string): string | null {
  const models = loadModels();
  const model = models.find((m) => m.alias === alias);
  return model?.model_id ?? null;
}

/**
 * Validate that an alias exists in the config.
 */
export function isValidAlias(alias: string): boolean {
  const models = loadModels();
  return models.some((m) => m.alias === alias);
}
