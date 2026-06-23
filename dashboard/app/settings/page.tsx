"use client";
import { useCallback, useEffect, useState } from "react";
import { Clock, RefreshCw, Monitor, Save, Palette, Globe, Eye, Users, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { themePresets, applyTheme, getAppliedTheme } from "@/lib/themes";

interface Settings {
  timezone: string;
  refreshInterval: number;
  timestampFormat: "relative" | "absolute";
  timeFormat: "12h" | "24h";
  theme: "system" | "dark" | "light";
  viewAll: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  refreshInterval: 5,
  timestampFormat: "relative",
  timeFormat: "24h",
  theme: "system",
  viewAll: true,
};

const TIMEZONES = [
  { label: "−12 — Baker Island", value: "Etc/GMT+12" },
  { label: "−11 — American Samoa", value: "Pacific/Pago_Pago" },
  { label: "−10 — Hawaii", value: "Pacific/Honolulu" },
  { label: "−9 — Anchorage", value: "America/Anchorage" },
  { label: "−8 — Los Angeles / Vancouver", value: "America/Los_Angeles" },
  { label: "−7 — Denver / Phoenix", value: "America/Denver" },
  { label: "−6 — Chicago / Mexico City", value: "America/Chicago" },
  { label: "−5 — New York / Bogotá", value: "America/New_York" },
  { label: "−4 — Santiago / Manaus", value: "America/Santiago" },
  { label: "−3 — Buenos Aires / São Paulo", value: "America/Sao_Paulo" },
  { label: "−2 — Fernando de Noronha", value: "America/Noronha" },
  { label: "−1 — Azores", value: "Atlantic/Azores" },
  { label: "±0 — London / Dublin / Lisbon", value: "Europe/London" },
  { label: "+1 — Paris / Berlin / Rome / Madrid", value: "Europe/Paris" },
  { label: "+2 — Cairo / Jerusalem / Athens", value: "Europe/Athens" },
  { label: "+3 — Mecca / Riyadh / Moscow", value: "Asia/Riyadh" },
  { label: "+3:30 — Tehran", value: "Asia/Tehran" },
  { label: "+4 — Abu Dhabi / Dubai / Baku", value: "Asia/Dubai" },
  { label: "+4:30 — Kabul", value: "Asia/Kabul" },
  { label: "+5 — Karachi / Tashkent", value: "Asia/Karachi" },
  { label: "+5:30 — India / Sri Lanka", value: "Asia/Kolkata" },
  { label: "+5:45 — Kathmandu", value: "Asia/Kathmandu" },
  { label: "+6 — Dhaka / Almaty", value: "Asia/Dhaka" },
  { label: "+6:30 — Yangon", value: "Asia/Yangon" },
  { label: "+7 — Bangkok / Jakarta / Hanoi", value: "Asia/Bangkok" },
  { label: "+8 — Beijing / Singapore / Perth", value: "Asia/Shanghai" },
  { label: "+9 — Tokyo / Seoul", value: "Asia/Tokyo" },
  { label: "+9:30 — Darwin / Adelaide", value: "Australia/Adelaide" },
  { label: "+10 — Sydney / Melbourne", value: "Australia/Sydney" },
  { label: "+11 — Solomon Islands", value: "Pacific/Guadalcanal" },
  { label: "+12 — Fiji / Auckland", value: "Pacific/Auckland" },
  { label: "+13 — Samoa / Tonga", value: "Pacific/Apia" },
  { label: "+14 — Line Islands", value: "Pacific/Kiritimati" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("paos-settings");
      if (stored) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
    } catch { /* ignore */ }
  }, []);

  const update = useCallback(
    (key: keyof Settings, value: string | number) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
      setSaved(false);
    },
    []
  );

  const save = useCallback(() => {
    localStorage.setItem("paos-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [settings]);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-1">Settings</h1>
      <p className="text-sm mb-6 text-muted-foreground">
        Configure PAOS dashboard preferences. Saved to browser localStorage.
      </p>

      <div className="max-w-xl space-y-4">
        {/* Timezone */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe size={14} />
              Timezone
            </CardTitle>
            <CardDescription className="text-xs">
              All pipeline timestamps and dates will display in this timezone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={settings.timezone} onValueChange={(v, _details) => update("timezone", v ?? settings.timezone)}>
              <SelectTrigger className="w-full font-mono"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TIMEZONES.map(tz => (
                  <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {mounted && (
              <p className="mt-2 text-[10px] font-mono text-muted-foreground">
                Current time: {new Date().toLocaleString("en-US", { timeZone: settings.timezone, timeStyle: "medium", dateStyle: "medium" })}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Refresh Interval */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <RefreshCw size={14} />
              Auto-Refresh Interval
            </CardTitle>
            <CardDescription className="text-xs">
              How often the dashboard polls for live updates. Lower = more responsive but more CPU.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="2"
                max="60"
                step="1"
                value={settings.refreshInterval}
                onChange={(e) => update("refreshInterval", parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs font-mono w-12 text-right">
                {settings.refreshInterval}s
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Timestamp Format */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock size={14} />
              Timestamp Format
            </CardTitle>
            <CardDescription className="text-xs">
              Choose how timestamps appear: relative (&quot;2h ago&quot;) or absolute (&quot;22 Jun 17:08&quot;).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => update("timestampFormat", "relative")}
                variant={settings.timestampFormat === "relative" ? "default" : "outline"}
                size="sm"
                className="flex-1 text-xs"
              >
                Relative (2h ago)
              </Button>
              <Button
                type="button"
                onClick={() => update("timestampFormat", "absolute")}
                variant={settings.timestampFormat === "absolute" ? "default" : "outline"}
                size="sm"
                className="flex-1 text-xs"
              >
                Absolute (22 Jun 17:08)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Time Format */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock size={14} />
              Time Format
            </CardTitle>
            <CardDescription className="text-xs">
              12-hour vs 24-hour clock. Affects all timestamp displays.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => update("timeFormat", "24h")}
                variant={settings.timeFormat === "24h" ? "default" : "outline"}
                size="sm"
                className="flex-1 text-xs"
              >
                24-hour (17:08)
              </Button>
              <Button
                type="button"
                onClick={() => update("timeFormat", "12h")}
                variant={settings.timeFormat === "12h" ? "default" : "outline"}
                size="sm"
                className="flex-1 text-xs"
              >
                12-hour (5:08 PM)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Palette size={14} />
              Theme
            </CardTitle>
            <CardDescription className="text-xs">
              Dashboard appearance. System follows your OS preference.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {(["system", "dark", "light"] as const).map((t) => (
                <Button
                  key={t}
                  type="button"
                  onClick={() => update("theme", t)}
                  variant={settings.theme === t ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-xs capitalize"
                >
                  {t === "system" && <Monitor size={12} className="inline mr-1" />}
                  {t}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Theme Presets */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Palette size={14} />
              Theme Preset
            </CardTitle>
            <CardDescription className="text-xs">
              Color scheme preset for the entire dashboard. Applies instantly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {themePresets.map((preset) => {
                const isActive = getAppliedTheme() === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      applyTheme(preset.name);
                      window.location.reload();
                    }}
                    className="rounded-lg border p-3 text-left transition-all hover:border-primary/50"
                    style={{
                      borderColor: isActive ? "var(--primary)" : "var(--border)",
                      background: isActive ? "rgba(255,255,255,0.03)" : "transparent",
                    }}
                  >
                    <div className="flex gap-1 mb-2">
                      <div className="w-4 h-4 rounded-sm" style={{ background: preset.vars["--primary"] }} />
                      <div className="w-4 h-4 rounded-sm" style={{ background: preset.vars["--background"] }} />
                      <div className="w-4 h-4 rounded-sm" style={{ background: preset.vars["--card"] }} />
                    </div>
                    <div className="text-xs font-medium">{preset.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                      {preset.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Button onClick={save} className="gap-2">
          <Save size={14} /> {saved ? "Saved!" : "Save Settings"}
        </Button>

        {/* Info */}
        <div className="text-[10px] leading-relaxed text-muted-foreground">
          <strong>Settings storage:</strong> Browser localStorage. Persists across sessions. Cleared if you clear browser data.
          <br />
          {typeof window !== "undefined" ? <>
            <strong>Detected timezone:</strong> {Intl.DateTimeFormat().resolvedOptions().timeZone}
            <br />
            <strong>Current UTC:</strong> {new Date().toISOString()}
          </> : ""}
        </div>
      </div>
    </div>
  );
}

function ScopedAgentStatus() {
  const [data, setData] = useState<{ project: string; agents: string[] }[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);
  const [projects, setProjects] = useState<{ name: string }[]>([]);

  useEffect(() => {
    fetch("/api/agents/scoped").then((r) => r.json()).then((d) => setData(d.scopedProjects ?? [])).catch(() => {});
    fetch("/api/workspaces").then((r) => r.json()).then((d) => setProjects(d.workspaces ?? [])).catch(() => {});
  }, []);

  async function generateFor(project: string) {
    setGenerating(project);
    await fetch("/api/agents/scoped", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project }),
    });
    const res = await fetch("/api/agents/scoped");
    const d = await res.json();
    setData(d.scopedProjects ?? []);
    setGenerating(null);
  }

  const scopedProjectNames = new Set(data.map((d) => d.project));
  const unscoped = projects.filter((p) => !scopedProjectNames.has(p.name));

  return (
    <>
      {data.length === 0 && (
        <p className="text-xs text-muted-foreground">No scoped agent identities created yet.</p>
      )}
      {data.map((s) => (
        <div key={s.project} className="rounded-lg border p-3" style={{ borderColor: "var(--border)" }}>
          <div className="text-xs font-medium mb-1 flex items-center gap-2">
            {s.project}
            <span className="text-[10px] text-muted-foreground font-normal">git identities</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {s.agents.map((a) => (
              <span key={a} className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(240,185,11,0.1)", color: "var(--primary)" }}>
                {a}@paos.com
              </span>
            ))}
          </div>
        </div>
      ))}
      {unscoped.length > 0 && (
        <div className="pt-2">
          <div className="text-xs text-muted-foreground mb-2">Generate git identities for:</div>
          <div className="flex flex-wrap gap-2">
            {unscoped.map((p) => (
              <Button
                key={p.name}
                size="sm"
                variant="outline"
                disabled={generating === p.name}
                onClick={() => generateFor(p.name)}
                className="text-[10px] gap-1"
              >
                {generating === p.name ? <Loader2 size={10} className="animate-spin" /> : <Users size={10} />}
                {p.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
