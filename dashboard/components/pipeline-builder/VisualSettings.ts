"use client";

export type VisualSettings = {
  backgroundType: string;
  backgroundOpacity: number;
  backgroundColor: string;
  connectorShape: string;
  connectorThickness: number;
  connectorColor: string;
  edgeAnimation: boolean;
  showGrid: boolean;
  showMinimap: boolean;
  dagHeight: number;
  defaultZoom: number;
};

const STORAGE_KEY = "paos-visual-settings";

export const defaultVisualSettings: VisualSettings = {
  backgroundType: "dots",
  backgroundOpacity: 0.03,
  backgroundColor: "#0a0a0a",
  connectorShape: "smoothstep",
  connectorThickness: 2,
  connectorColor: "var(--border)",
  edgeAnimation: true,
  showGrid: true,
  showMinimap: true,
  dagHeight: 300,
  defaultZoom: 0.75,
};

export function loadVisualSettings(): VisualSettings {
  if (typeof window === "undefined") return defaultVisualSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultVisualSettings, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaultVisualSettings;
}

export function saveVisualSettings(settings: VisualSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch { /* ignore */ }
}

// Color presets for backgrounds and connectors
export const COLOR_PRESETS = {
  backgrounds: [
    { label: "Deep Black", value: "#0a0a0a" },
    { label: "Dark", value: "#111111" },
    { label: "Midnight", value: "#1a1a2e" },
    { label: "Slate", value: "#0f172a" },
    { label: "Charcoal", value: "#1c1917" },
    { label: "Navy", value: "#0a1628" },
  ],
  connectors: [
    { label: "Gold", value: "#f0b90b" },
    { label: "Blue", value: "#3b82f6" },
    { label: "Green", value: "#22c55e" },
    { label: "White", value: "#ffffff" },
    { label: "Purple", value: "#8b5cf6" },
    { label: "Red", value: "#ef4444" },
  ],
};
