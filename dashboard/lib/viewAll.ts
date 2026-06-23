// Shared utility to read the View All setting from localStorage
// Returns true by default (show all projects)

export function getViewAll(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem("paos-settings");
    if (stored) {
      const s = JSON.parse(stored);
      return s.viewAll !== false; // default true
    }
  } catch { /* ignore */ }
  return true;
}
