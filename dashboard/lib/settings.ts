"use client";

export interface PaosSettings {
  timezone: string;
  refreshInterval: number;
  timestampFormat: "relative" | "absolute";
  timeFormat: "12h" | "24h";
  theme: "system" | "dark" | "light";
}

const DEFAULT: PaosSettings = {
  timezone: "UTC",
  refreshInterval: 5,
  timestampFormat: "relative",
  timeFormat: "24h",
  theme: "dark",
};

export function getSettings(): PaosSettings {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const stored = localStorage.getItem("paos-settings");
    if (stored) return { ...DEFAULT, ...JSON.parse(stored) };
  } catch { /* ignore */ }
  return DEFAULT;
}

export function formatTime(iso: string | undefined | null): string {
  if (!iso) return "";
  const s = getSettings();
  const date = new Date(iso);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  // Relative
  if (s.timestampFormat === "relative") {
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD}d ago`;
    return `${Math.floor(diffD / 7)}w ago`;
  }

  // Absolute
  const timeStyle: Intl.DateTimeFormatOptions["timeStyle"] = s.timeFormat === "12h" ? "short" : "medium";
  try {
    return date.toLocaleString("en-US", {
      timeZone: s.timezone,
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: s.timeFormat === "12h",
    });
  } catch {
    return date.toISOString().substring(0, 16).replace("T", " ");
  }
}

export function formatTimeAbsolute(iso: string | undefined | null): string {
  if (!iso) return "";
  const s = getSettings();
  const date = new Date(iso);
  try {
    return date.toLocaleString("en-US", {
      timeZone: s.timezone,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: s.timeFormat === "12h",
    });
  } catch {
    return date.toISOString();
  }
}
