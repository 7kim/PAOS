"use client";
import { useCallback, useEffect, useState } from "react";
import { Clock, RefreshCw, Monitor, Save, Palette, Globe, Eye, Users, Loader2, Lock, EyeOff, X, FileJson } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { themePresets, applyTheme, getAppliedTheme } from "@/lib/themes";
import { DATE_FORMATS } from "@/lib/settings";

interface Settings {
  timezone: string;
  refreshInterval: number;
  timestampFormat: "relative" | "absolute";
  timeFormat: "12h" | "24h";
  theme: "system" | "dark" | "light";
  viewAll: boolean;
  dateFormat: string;
}

const DEFAULT_SETTINGS: Settings = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  refreshInterval: 5,
  timestampFormat: "relative",
  timeFormat: "24h",
  theme: "system",
  viewAll: true,
  dateFormat: "DD-MM-YYYY--HH-MM",
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

  // Global secrets state
  const [globalSecrets, setGlobalSecrets] = useState<Record<string, { value: string; note: string }>>({});
  const [globalSecretsLoading, setGlobalSecretsLoading] = useState(false);
  const [globalSecretsDirty, setGlobalSecretsDirty] = useState(false);
  const [globalRevealedKeys, setGlobalRevealedKeys] = useState<Set<string>>(new Set());
  const [globalShowTemplates, setGlobalShowTemplates] = useState(false);

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

  async function loadGlobalSecrets() {
    setGlobalSecretsLoading(true);
    try {
      const res = await fetch("/api/global-secrets");
      const data = await res.json();
      const secrets = data.secrets ?? {};
      const normalized: Record<string, { value: string; note: string }> = {};
      for (const [k, v] of Object.entries(secrets)) {
        if (typeof v === "object" && v !== null && "value" in v) {
          normalized[k] = v as { value: string; note: string };
        } else {
          normalized[k] = { value: String(v ?? ""), note: "" };
        }
      }
      setGlobalSecrets(normalized);
    } catch { /* ignore */ }
    setGlobalSecretsLoading(false);
    setGlobalSecretsDirty(false);
  }

  async function saveGlobalSecrets() {
    const cleaned: Record<string, { value: string; note: string }> = {};
    for (const [k, v] of Object.entries(globalSecrets)) {
      if (k.trim() && v.value.trim()) cleaned[k.trim()] = { value: v.value.trim(), note: v.note.trim() };
    }
    await fetch("/api/global-secrets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secrets: cleaned }),
    });
    setGlobalSecretsDirty(false);
  }

  useEffect(() => { loadGlobalSecrets(); }, []);

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

        {/* Date Format */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock size={14} />
              Date Format
            </CardTitle>
            <CardDescription className="text-xs">
              How dates appear in absolute mode. Relative times are shown for entries less than 24h old.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {DATE_FORMATS.map((fmt) => (
                <button
                  key={fmt.value}
                  type="button"
                  onClick={() => update("dateFormat", fmt.value)}
                  className="rounded-lg border p-3 text-left transition-all"
                  style={{
                    borderColor: settings.dateFormat === fmt.value ? "var(--primary)" : "var(--border)",
                    background: settings.dateFormat === fmt.value ? "rgba(240,185,11,0.06)" : "transparent",
                  }}
                >
                  <div className="text-xs font-medium" style={{ color: settings.dateFormat === fmt.value ? "var(--primary)" : "var(--foreground)" }}>
                    {fmt.label}
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    {fmt.desc}
                  </div>
                </button>
              ))}
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

        {/* Global Secrets */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lock size={14} />
              Global Secrets
            </CardTitle>
            <CardDescription className="text-xs">
              Shared environment variables for all projects and agents. Stored at <code className="font-mono">config/secrets/.env</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {globalSecretsLoading ? (
              <div className="flex items-center gap-2 py-4 justify-center text-xs text-muted-foreground">
                <Loader2 size={12} className="animate-spin" />
                Loading secrets...
              </div>
            ) : (
              <div className="space-y-2">
                {Object.keys(globalSecrets).length === 0 && (
                  <p className="text-xs text-muted-foreground py-2 text-center">No global secrets yet.</p>
                )}
                {Object.entries(globalSecrets).map(([key, entry], idx) => {
                  const isRevealed = globalRevealedKeys.has(key);
                  const lastTwo = entry.value.length >= 2 ? entry.value.slice(-2) : entry.value;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input
                          value={key}
                          onChange={(e) => {
                            const newVal = e.target.value;
                            setGlobalSecrets((prev) => {
                              const next = { ...prev };
                              delete next[key];
                              if (newVal) next[newVal] = entry;
                              return next;
                            });
                            setGlobalSecretsDirty(true);
                          }}
                          className="flex-[2.5] text-xs font-mono rounded border px-2 py-1"
                          style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
                          placeholder="KEY"
                        />
                        <span className="text-muted-foreground shrink-0">=</span>
                        <div className="flex-[4] flex items-center gap-1 rounded border px-2 py-1" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
                          <input
                            type={isRevealed ? "text" : "password"}
                            value={entry.value}
                            onChange={(e) => {
                              setGlobalSecrets((prev) => ({ ...prev, [key]: { value: e.target.value, note: entry.note } }));
                              setGlobalSecretsDirty(true);
                            }}
                            className="flex-1 text-xs font-mono bg-transparent border-none outline-none"
                            style={{ color: "var(--foreground)" }}
                            placeholder="value"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setGlobalRevealedKeys((prev) => {
                                const next = new Set(prev);
                                if (next.has(key)) next.delete(key); else next.add(key);
                                return next;
                              });
                            }}
                            className="p-0.5 shrink-0"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            {isRevealed ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setGlobalSecrets((prev) => {
                              const next = { ...prev };
                              delete next[key];
                              return next;
                            });
                            setGlobalSecretsDirty(true);
                          }}
                          className="p-1 rounded hover:bg-white/5 shrink-0"
                          style={{ color: "var(--muted-foreground)" }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                      <input
                        value={entry.note}
                        onChange={(e) => {
                          setGlobalSecrets((prev) => ({ ...prev, [key]: { value: entry.value, note: e.target.value } }));
                          setGlobalSecretsDirty(true);
                        }}
                        className="w-full text-[10px] rounded border px-2 py-1"
                        style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                        placeholder="note — e.g. Supabase, GitHub, OpenAI..."
                      />
                    </div>
                  );
                })}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <Button size="sm" variant="outline" className="text-xs gap-1"
                    onClick={() => setGlobalSecrets({})}>
                    <X size={11} /> Clear All
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs gap-1"
                    onClick={() => setGlobalSecrets((prev) => ({ ...prev, "": { value: "", note: "" } }))}>
                    + Add Secret
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs gap-1"
                    onClick={() => setGlobalShowTemplates(true)}>
                    <FileJson size={11} /> Templates
                  </Button>
                  <div className="ml-auto">
                    <Button size="sm" onClick={saveGlobalSecrets} disabled={!globalSecretsDirty} className="gap-1.5">
                      <Save size={12} /> Save Secrets
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Global Secrets Templates Dialog */}
        <Dialog open={globalShowTemplates} onOpenChange={(open) => { if (!open) setGlobalShowTemplates(false); }}>
          <DialogContent className="max-w-[55vw] sm:max-w-[55vw] w-full max-h-[85vh] flex flex-col overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-sm flex items-center gap-2">
                <FileJson size={13} />
                Secret Templates
              </DialogTitle>
              <DialogDescription className="text-xs">
                Click a template to add standardized environment variables.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {(() => {
                const logos: Record<string, string> = {
                  OpenAI: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l7 4v8l-7 4-7-4V6l7-4z" fill="#10a37f"/><path d="M12 6l3.5 2v4L12 14l-3.5-2V8L12 6z" fill="#fff"/></svg>`,
                  Stripe: `<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="3" fill="#635BFF"/><text x="12" y="16" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7" fill="#fff">ST</text></svg>`,
                  GitHub: `<svg viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.09.68-.217.68-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.635-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="#181717"/></svg>`,
                  Anthropic: `<svg viewBox="0 0 24 24"><text x="2" y="19" font-family="Arial" font-weight="bold" font-size="18" fill="#d97757">C</text></svg>`,
                  Supabase: `<svg viewBox="0 0 24 24"><path d="M6 14l6-12v8h6l-6 12v-8H6z" fill="#3ECF8E"/></svg>`,
                };
                const cats = [
                  { icon: "🤖", name: "AI / LLM APIs", items: [
                    { l: "OpenAI", d: "sk-...", grp: "OpenAI Platform" },
                    { l: "Anthropic", d: "sk-ant-...", grp: "Anthropic" },
                  ]},
                  { icon: "🗄️", name: "Databases", items: [
                    { l: "Supabase", d: "eyJ...", grp: "Supabase" },
                  ]},
                  { icon: "💳", name: "Payments", items: [
                    { l: "Stripe", d: "sk_live_...", grp: "Stripe" },
                  ]},
                  { icon: "🚀", name: "DevOps", items: [
                    { l: "GitHub", d: "ghp_...", grp: "GitHub" },
                  ]},
                  { icon: "⚙️", name: "General", items: [
                    { l: "App Config", d: "development", grp: "App Config" },
                    { l: "JWT Auth", d: "openssl rand...", grp: "JWT" },
                  ]},
                ];
                return cats.map((cat) => (
                  <div key={cat.name}>
                    <h4 className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
                      <span>{cat.icon}</span>{cat.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5">
                      {cat.items.map((item) => (
                        <button key={item.l} type="button"
                          onClick={() => {
                            setGlobalSecrets((prev) => {
                              const next = { ...prev };
                              const key = item.l === "App Config" ? "NODE_ENV" : item.l === "JWT Auth" ? "JWT_SECRET" : `${item.l.replace(/\s+/g, "_").toUpperCase()}_API_KEY`;
                              if (!(key in prev)) next[key] = { value: item.d, note: item.grp };
                              return next;
                            });
                            setGlobalSecretsDirty(true);
                            setGlobalShowTemplates(false);
                          }}
                          className="text-left text-[10px] p-2 rounded border transition-all hover:border-primary/40 flex items-start gap-2"
                          style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
                          <span className="shrink-0 w-6 h-6 rounded flex items-center justify-center overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: logos[item.l] || `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="var(--muted-foreground)"/><text x="12" y="17" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="10" fill="var(--card-bg)">${item.l[0]}</text></svg>` }} />
                          <div className="min-w-0">
                            <div className="font-medium text-xs" style={{ color: "var(--foreground)" }}>{item.l}</div>
                            <div className="mt-0.5 text-[9px] leading-tight" style={{ color: "var(--muted-foreground)" }}>1 variable</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </DialogContent>
        </Dialog>

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
