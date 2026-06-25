"use client";

import { useEffect, useState } from "react";

interface FeatureFlag {
  enabled: boolean;
  description: string;
}

interface Features {
  srs_visibility_toggle: FeatureFlag;
  invite_only: FeatureFlag;
  public_signup: FeatureFlag;
  model_selector: FeatureFlag;
}

interface ModelAlias {
  alias: string;
  provider: string;
  model_id: string;
  tier: string;
  description: string;
}

export default function CodeSRSSettingsPage() {
  const [features, setFeatures] = useState<Features | null>(null);
  const [models, setModels] = useState<{ models: ModelAlias[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/code-srs");
      if (res.ok) {
        const data = await res.json();
        setFeatures(data.features?.features ?? null);
        setModels(data.models);
      }
    } catch {
      setMessage("Failed to load configuration");
    } finally {
      setLoading(false);
    }
  }

  async function toggleFeature(key: keyof Features) {
    if (!features) return;
    const updated = {
      ...features,
      [key]: { ...features[key], enabled: !features[key].enabled },
    };
    setFeatures(updated);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/code-srs?type=features", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: updated }),
      });
      if (res.ok) {
        setMessage("Feature updated successfully");
      } else {
        setMessage("Failed to update feature");
        loadConfig(); // revert
      }
    } catch {
      setMessage("Failed to update feature");
      loadConfig();
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p style={{ color: "var(--foreground)" }}>Loading Code-SRS configuration...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-xl font-semibold mb-1" style={{ color: "var(--foreground)" }}>
        Code-SRS Settings
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted-foreground)" }}>
        Manage Code-SRS platform configuration and model aliases.
      </p>

      {message && (
        <div
          className="px-4 py-3 rounded-md mb-6 text-sm"
          style={{
            background: message.includes("Failed")
              ? "rgba(239,68,68,0.1)"
              : "rgba(34,197,94,0.1)",
            color: message.includes("Failed")
              ? "var(--red)"
              : "var(--green)",
          }}
        >
          {message}
        </div>
      )}

      {/* Feature Flags */}
      <section className="mb-10">
        <h2 className="text-base font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Feature Flags
        </h2>

        <div className="space-y-4">
          {features &&
            Object.entries(features).map(([key, flag]) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 rounded-md"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <div>
                  <p className="font-mono text-sm" style={{ color: "var(--foreground)" }}>
                    {key}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                    {flag.description}
                  </p>
                </div>
                <button
                  onClick={() => toggleFeature(key as keyof Features)}
                  disabled={saving}
                  className="relative w-12 h-6 rounded-full transition-colors disabled:opacity-50"
                  style={{
                    background: flag.enabled
                      ? "var(--green)"
                      : "var(--border)",
                  }}
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                    style={{
                      left: flag.enabled ? "25px" : "3px",
                    }}
                  />
                </button>
              </div>
            ))}
        </div>
      </section>

      {/* Model Aliases Table */}
      <section>
        <h2 className="text-base font-semibold mb-4" style={{ color: "var(--foreground)" }}>
          Model Aliases
        </h2>

        <div
          className="rounded-md overflow-x-auto"
          style={{
            border: "1px solid var(--border)",
          }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--sidebar-bg)" }}>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--muted-foreground)" }}>
                  Alias
                </th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--muted-foreground)" }}>
                  Provider
                </th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--muted-foreground)" }}>
                  Model ID
                </th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--muted-foreground)" }}>
                  Tier
                </th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "var(--muted-foreground)" }}>
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {models?.models?.map((model) => (
                <tr
                  key={model.alias}
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--accent)" }}>
                    {model.alias}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--foreground)" }}>
                    {model.provider}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {model.model_id}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        background:
                          model.tier === "pro"
                            ? "rgba(168,85,247,0.15)"
                            : "rgba(34,197,94,0.15)",
                        color:
                          model.tier === "pro"
                            ? "var(--purple)"
                            : "var(--green)",
                      }}
                    >
                      {model.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--muted-foreground)" }}>
                    {model.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!models?.models || models.models.length === 0) && (
          <p className="text-sm mt-4" style={{ color: "var(--muted-foreground)" }}>
            No models configured. Run the Code-SRS Phase 0 setup first.
          </p>
        )}
      </section>
    </div>
  );
}
