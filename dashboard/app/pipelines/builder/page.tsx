"use client";

import { useCallback, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Settings2, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PipelineCanvas } from "@/components/pipeline-builder/Canvas";
import { BuilderSettingsDialog, loadSettings, saveSettings, type BuilderSettings } from "@/components/pipeline-builder/BuilderSettings";
import { TemplateBrowser } from "@/components/pipeline-builder/TemplateBrowser";
import type { BuilderLayout, PipelineTemplate } from "@/components/pipeline-builder/types";

function BuilderPage() {
  const router = useRouter();
  const [project, setProject] = useState("PAOS");
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [settings, setSettings] = useState<BuilderSettings>(loadSettings);
  const [liveZoom, setLiveZoom] = useState<number | undefined>(undefined);
  const [templateToLoad, setTemplateToLoad] = useState<PipelineTemplate | null>(null);

  const handleSettingsChange = useCallback((next: BuilderSettings) => {
    setSettings(next);
    saveSettings(next);
    if (next.defaultZoom !== settings.defaultZoom) {
      setLiveZoom(next.defaultZoom);
    }
  }, [settings.defaultZoom]);

  const handleLoadTemplate = useCallback((t: PipelineTemplate) => {
    setTemplateToLoad(t);
  }, []);

  const handleSave = useCallback(
    async (layout: BuilderLayout & { meta?: { prompt: string } }) => {
      setSaving(true);
      try {
        const prompt = layout.meta?.prompt || "Pipeline from Flow Builder";
        const res = await fetch("/api/pipelines", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project,
            prompt,
            builderLayout: layout,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          router.push(`/pipelines/${encodeURIComponent(data.id)}/visualize`);
        } else {
          alert("Failed to save pipeline: " + (data.error || "Unknown error"));
        }
      } catch {
        alert("Failed to save pipeline");
      }
      setSaving(false);
    },
    [project, router]
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--background)" }}>
      {/* Top bar */}
      <div
        className="flex items-center gap-3 px-4 py-2 border-b shrink-0 z-10"
        style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/pipelines")}
          className="text-xs gap-1.5"
        >
          <ArrowLeft size={14} />
          Back to Pipelines
        </Button>
        <div className="w-px h-5" style={{ background: "var(--border)" }} />
        <h1 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          Pipeline Flow Builder
        </h1>
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTemplates(true)}
            className="text-xs gap-1.5"
          >
            <LayoutTemplate size={12} />
            Templates
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            className="text-xs gap-1.5"
          >
            <Settings2 size={12} />
            Settings
          </Button>
          <label className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
            Project:
          </label>
          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="text-xs rounded-md px-2 py-1 border"
            style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          >
            <option value="PAOS">PAOS</option>
          </select>
          {saving && (
            <span className="text-xs flex items-center gap-1" style={{ color: "var(--primary)" }}>
              <Loader2 size={12} className="animate-spin" />
              Saving &amp; routing...
            </span>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <PipelineCanvas onSave={handleSave} settings={settings} liveZoom={liveZoom} templateToLoad={templateToLoad} />
      </div>

      {/* Template browser */}
      <TemplateBrowser
        open={showTemplates}
        onOpenChange={setShowTemplates}
        onLoadTemplate={handleLoadTemplate}
        currentNodes={[]}
        currentEdges={[]}
      />

      {/* Settings dialog */}
      <BuilderSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4">Loading builder...</div>}>
      <BuilderPage />
    </Suspense>
  );
}
