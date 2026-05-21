"use client";

import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface ModelOption {
  alias: string;
  provider: string;
  tier: string;
}

export function Topbar() {
  const router = useRouter();
  const [models, setModels] = useState<ModelOption[]>([]);
  const [selectedModel, setSelectedModel] = useState("Nova");

  useEffect(() => {
    async function loadModels() {
      try {
        const res = await fetch("/api/models");
        if (res.ok) {
          const data = await res.json();
          setModels(data);
        }
      } catch {
        // API not available yet, use defaults
        setModels([
          { alias: "Nova", provider: "together", tier: "free" },
          { alias: "Atlas", provider: "together", tier: "pro" },
        ]);
      }
    }
    loadModels();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/auth/login");
  }

  return (
    <header className="h-14 border-b border-neutral-700 bg-canvas-dark flex items-center justify-between px-6 shrink-0">
      {/* Left: page title area (empty for now) */}
      <div />

      {/* Right: model selector + user menu */}
      <div className="flex items-center gap-4">
        {/* Model Selector */}
        {models.length > 0 && (
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-neutral-800 text-on-dark border border-neutral-600 rounded-[4px] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.055px] focus:outline-none focus:ring-2 focus:ring-brand-periwinkle/40"
          >
            {models.map((m) => (
              <option key={m.alias} value={m.alias}>
                {m.alias} ({m.tier})
              </option>
            ))}
          </select>
        )}

        {/* User menu */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-on-dark/60 hover:text-on-dark transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
