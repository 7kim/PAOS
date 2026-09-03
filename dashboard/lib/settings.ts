"use client";

export interface PaosSettings {
  timezone: string;
  refreshInterval: number;
  timestampFormat: "relative" | "absolute";
  timeFormat: "12h" | "24h";
  theme: "system" | "dark" | "light";
  dateFormat: string;
}

const DEFAULT: PaosSettings = {
  timezone: "UTC",
  refreshInterval: 5,
  timestampFormat: "relative",
  timeFormat: "24h",
  theme: "dark",
  dateFormat: "DD-MM-YYYY--HH-MM",
};

export const DATE_FORMATS = [
  { value: "DD-MM-YYYY--HH-MM", label: "24-06-2026--13:27", desc: "Day-Month-Year" },
  { value: "MM-DD-YYYY--HH-MM", label: "06-24-2026--13:27", desc: "Month-Day-Year" },
  { value: "YYYY-MM-DD--HH-MM", label: "2026-06-24--13:27", desc: "ISO (Year-Month-Day)" },
  { value: "DD Mon YYYY HH:MM", label: "24 Jun 2026 13:27", desc: "Readable" },
];

export function getSettings(): PaosSettings {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const stored = localStorage.getItem("paos-settings");
    if (stored) return { ...DEFAULT, ...JSON.parse(stored) };
  } catch { /* ignore */ }
  return DEFAULT;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDateAbs(iso: string | undefined | null, dateFormat: string, timeFormat: "12h" | "24h", tz: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);

  try {
    const opts: Intl.DateTimeFormatOptions = {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: timeFormat === "12h",
    };

    const parts = new Intl.DateTimeFormat("en-US", opts).formatToParts(d);
    const values: Record<string, string> = {};
    for (const p of parts) values[p.type] = p.value;

    const DD = pad(parseInt(values.day || "0"));
    const MM = pad(parseInt(values.month || "0"));
    const YYYY = values.year || "2026";
    const HH = pad(parseInt(values.hour || "0"));
    const min = pad(parseInt(values.minute || "0"));
    const ampm = values.dayPeriod?.toLowerCase() || "";

    let timeStr: string;
    if (timeFormat === "12h") {
      timeStr = `${HH}:${min} ${ampm}`;
    } else {
      timeStr = `${HH}:${min}`;
    }

    switch (dateFormat) {
      case "DD-MM-YYYY--HH-MM":
        return `${DD}-${MM}-${YYYY}--${timeStr}`;
      case "MM-DD-YYYY--HH-MM":
        return `${MM}-${DD}-${YYYY}--${timeStr}`;
      case "YYYY-MM-DD--HH-MM":
        return `${YYYY}-${MM}-${DD}--${timeStr}`;
      case "DD Mon YYYY HH:MM": {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const mon = monthNames[parseInt(values.month || "1") - 1] || values.month || "Jun";
        return `${DD} ${mon} ${YYYY} ${timeStr}`;
      }
      default:
        return `${DD}-${MM}-${YYYY}--${timeStr}`;
    }
  } catch {
    return String(iso);
  }
}

/**
 * Smart format: < 24h → relative, >= 24h → absolute with chosen dateFormat.
 * Respects timeFormat for the time portion.
 */
export function formatTime(iso: string | undefined | null): string {
  if (!iso) return "";
  const s = getSettings();
  const date = new Date(iso);
  if (isNaN(date.getTime())) return String(iso);

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  // If absolute mode, or >= 24h → absolute with dateFormat
  if (s.timestampFormat === "absolute" || diffMin >= 1440) {
    return formatDateAbs(iso, s.dateFormat, s.timeFormat, s.timezone);
  }

  // Relative: < 24h
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d ago`;
  return `${Math.floor(diffD / 7)}w ago`;
}

/**
 * Always absolute with chosen dateFormat (for expanded views, tooltips).
 */
export function formatTimeAbsolute(iso: string | undefined | null): string {
  if (!iso) return "";
  const s = getSettings();
  return formatDateAbs(iso, s.dateFormat, s.timeFormat, s.timezone);
}
