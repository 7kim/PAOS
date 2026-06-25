/**
 * Global PAOS configuration — reads from config/secrets/.env at import time.
 *
 * All dashboard API routes should import paths from here instead of
 * hardcoding them. To override a path, set the env var in config/secrets/.env:
 *
 *   MEMORY_DIR=/custom/path/memory
 *   PROJECTS_DIR=/custom/path/projects
 *   KNOWLEDGE_DIR=/custom/path/knowledge
 *   TEMPLATES_DIR=/custom/path/knowledge/templates
 *   LOGS_DIR=/custom/path/logs
 *
 * If the env var is not set, the default is $HOME/AI_Workflow/<subpath>.
 */

import { join } from "path";
import { readFileSync, existsSync } from "fs";

const HOME = process.env.HOME || "/home/dev";

// Load overrides from config/secrets/.env (read once at module init)
const ENV: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  const envPath = join(HOME, "AI_Workflow", "config", "secrets", ".env");
  try {
    if (existsSync(envPath)) {
      for (const line of readFileSync(envPath, "utf-8").split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          if (key && val) map[key] = val;
        }
      }
    }
  } catch { /* use defaults */ }
  return map;
})();

function dir(key: string, subpath: string): string {
  const val = ENV[key];
  if (val && val.startsWith("/")) return val;
  return join(HOME, "AI_Workflow", subpath);
}

export const MEMORY_DIR = dir("MEMORY_DIR", "memory");
export const PROJECTS_DIR = dir("PROJECTS_DIR", "projects");
export const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");
export const KNOWLEDGE_DIR = dir("KNOWLEDGE_DIR", "knowledge");
export const TEMPLATES_DIR = dir("TEMPLATES_DIR", "knowledge/templates");
export const LOGS_DIR = dir("LOGS_DIR", "logs");
export const PM_LOGS_DIR = join(LOGS_DIR, "pm-logs");
export const WORKSPACES_DIR = join(HOME, "AI_Workflow", "workspaces");
export const AGENTS_DIR = join(HOME, "AI_Workflow", "agents");
export const CONFIG_DIR = join(HOME, "AI_Workflow", "config");
export const VAULT_DIR = join(HOME, "AI_Workflow", "vault");
export const HOME_DIR = HOME;
