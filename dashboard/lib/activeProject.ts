// Shared utility for the active project state
// Only one project can be active at a time across all dashboard pages

const STORAGE_KEY = "paos-active-project";

export function getActiveProject(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function setActiveProject(name: string): void {
  try {
    if (name) {
      localStorage.setItem(STORAGE_KEY, name);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch { /* ignore */ }
}

export function clearActiveProject(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

// Resolves the effective project filter for a page:
// - If ?project= URL param is set, use that (hands-on override)
// - Else if viewAll is false and there's an active project, use that
// - Else return "" (show all)
export function resolveProjectFilter(urlProject: string, viewAll: boolean): string {
  if (urlProject) return urlProject;
  if (!viewAll) {
    const active = getActiveProject();
    return active || "__none__";
  }
  return "";
}
