import { readFileSync } from "fs";
import { join } from "path";
import { load } from "js-yaml";

export interface FeatureFlag {
  enabled: boolean;
  description: string;
}

export interface FeatureFlags {
  srs_visibility_toggle: FeatureFlag;
  invite_only: FeatureFlag;
  public_signup: FeatureFlag;
  model_selector: FeatureFlag;
}

const CONFIG_PATH =
  process.env.CODE_SRS_CONFIG_PATH || "/home/dev/AI_Workflow/config/code-srs";

let cachedFlags: FeatureFlags | null = null;

export function loadFeatures(): FeatureFlags {
  if (cachedFlags) return cachedFlags;
  const filePath = join(CONFIG_PATH, "features.yaml");
  const raw = readFileSync(filePath, "utf-8");
  const parsed = load(raw) as { features: FeatureFlags };
  cachedFlags = parsed.features as FeatureFlags;
  return cachedFlags;
}

/**
 * Check if SRS files should be visible to users.
 * Controlled by admin toggle in dashboard.
 */
export function srsFilesVisible(): boolean {
  const flags = loadFeatures();
  return flags.srs_visibility_toggle.enabled;
}

/**
 * Check if signup requires an invite code.
 */
export function isInviteOnly(): boolean {
  const flags = loadFeatures();
  return flags.invite_only.enabled;
}

/**
 * Check if public signup is allowed.
 */
export function isPublicSignup(): boolean {
  const flags = loadFeatures();
  return flags.public_signup.enabled;
}

/**
 * Check if the model selector feature is enabled.
 */
export function isModelSelectorEnabled(): boolean {
  const flags = loadFeatures();
  return flags.model_selector.enabled;
}
