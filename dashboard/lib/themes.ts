import type { PaosSettings } from "./settings";

export interface ThemePreset {
  name: string;
  label: string;
  description: string;
  vars: Record<string, string>;
  darkVars?: Record<string, string>;
}

export const themePresets: ThemePreset[] = [
  {
    name: "binance",
    label: "Binance",
    description: "Dark canvas, gold primary — dark trading dashboard",
    vars: {
      // Light mode
      "--background":         "#ffffff",
      "--foreground":         "#1e2329",
      "--sidebar-bg":         "#f5f5f5",
      "--card":               "#ffffff",
      "--card-foreground":    "#1e2329",
      "--popover":            "#ffffff",
      "--popover-foreground": "#1e2329",
      "--primary":            "#f0b90b",
      "--primary-foreground": "#181a20",
      "--secondary":          "#f0f2f5",
      "--secondary-foreground": "#1e2329",
      "--muted":              "#f0f2f5",
      "--muted-foreground":   "#5a6476",
      "--accent":             "#f0f2f5",
      "--accent-foreground":  "#1e2329",
      "--destructive":        "#ef4444",
      "--destructive-foreground": "#ffffff",
      "--border":             "#d0d5dd",
      "--input":              "#d0d5dd",
      "--ring":               "#f0b90b",
      "--success":            "#0ecb81",
      "--warning":            "#f97316",
      "--error":              "#f6465d",
      "--info":               "#3b82f6",
      "--sidebar":            "#f5f5f5",
      "--sidebar-foreground": "#1e2329",
      "--sidebar-primary":    "#f0b90b",
      "--sidebar-primary-foreground": "#181a20",
      "--sidebar-accent":     "#e8eaed",
      "--sidebar-accent-foreground": "#1e2329",
      "--sidebar-border":     "#d0d5dd",
      "--sidebar-ring":       "#f0b90b",
      "--muted-strong":       "#929aa5",
    },
    darkVars: {
      // Dark mode
      "--background":         "#0b0d10",
      "--foreground":         "#edf0f4",
      "--sidebar-bg":         "#090b0d",
      "--card":               "#14171c",
      "--card-foreground":    "#edf0f4",
      "--popover":            "#14171c",
      "--popover-foreground": "#edf0f4",
      "--primary":            "#f0b90b",
      "--primary-foreground": "#181a20",
      "--secondary":          "#1c2026",
      "--secondary-foreground": "#edf0f4",
      "--muted":              "#1c2026",
      "--muted-foreground":   "#929aa5",
      "--accent":             "#1c2026",
      "--accent-foreground":  "#edf0f4",
      "--destructive":        "#f6465d",
      "--destructive-foreground": "#edf0f4",
      "--border":             "rgba(255 255 255 / 8%)",
      "--input":              "rgba(255 255 255 / 10%)",
      "--ring":               "#f0b90b",
      "--success":            "#0ecb81",
      "--warning":            "#f97316",
      "--error":              "#f6465d",
      "--info":               "#3b82f6",
      "--sidebar":            "#090b0d",
      "--sidebar-foreground": "#edf0f4",
      "--sidebar-primary":    "#f0b90b",
      "--sidebar-primary-foreground": "#181a20",
      "--sidebar-accent":     "#1c2026",
      "--sidebar-accent-foreground": "#edf0f4",
      "--sidebar-border":     "rgba(255 255 255 / 8%)",
      "--sidebar-ring":       "#f0b90b",
      "--muted-strong":       "#929aa5",
    },
  },
];

export function applyTheme(name: string) {
  const theme = themePresets.find((t) => t.name === name);
  if (!theme) return;
  const root = document.documentElement;
  const isDark = root.classList.contains("dark");
  const vars = isDark && theme.darkVars ? theme.darkVars : theme.vars;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
  try {
    const stored = JSON.parse(localStorage.getItem("paos-settings") || "{}");
    stored.themePreset = name;
    localStorage.setItem("paos-settings", JSON.stringify(stored));
  } catch { /* ignore */ }
}

export function getAppliedTheme(): string {
  try {
    const stored = JSON.parse(localStorage.getItem("paos-settings") || "{}");
    return stored.themePreset || "binance";
  } catch {
    return "binance";
  }
}
