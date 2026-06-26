"use client";

import { useCallback, useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Settings2, LayoutTemplate, Download, BarChart3, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { PipelineCanvas } from "@/components/pipeline-builder/Canvas";
import { BuilderSettingsDialog, loadSettings, saveSettings, type BuilderSettings } from "@/components/pipeline-builder/BuilderSettings";
import { TemplateBrowser } from "@/components/pipeline-builder/TemplateBrowser";
import { LoadPipelineDialog } from "@/components/pipeline-builder/LoadPipelineDialog";
import { BenchmarkBrowser } from "@/components/pipeline-builder/BenchmarkBrowser";
import type { BuilderLayout, PipelineTemplate } from "@/components/pipeline-builder/types";

function BuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [project, setProject] = useState("PAOS");
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showLoadPipeline, setShowLoadPipeline] = useState(false);
  const [showBenchmarks, setShowBenchmarks] = useState(false);
  const [settings, setSettings] = useState<BuilderSettings>(loadSettings);
  const [liveZoom, setLiveZoom] = useState<number | undefined>(undefined);
  const [templateToLoad, setTemplateToLoad] = useState<PipelineTemplate | null>(null);
  const [pipelineName, setPipelineName] = useState<string | null>(null);

  // Generate default pipeline name on mount
  useEffect(() => {
    fetch(`/api/pipelines/generate-name?project=${encodeURIComponent(project)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.name) setPipelineName(data.name);
      })
      .catch(() => setPipelineName(`New Pipeline ${new Date().toLocaleString()}`));
  }, [project]);

  // Load pipeline from ?load= query param
  useEffect(() => {
    const loadId = searchParams.get("load");
    if (!loadId) return;
    fetch(`/api/pipelines/${encodeURIComponent(loadId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.builderLayout) {
          setTemplateToLoad({
            id: loadId,
            name: loadId,
            description: "Loaded from pipeline",
            category: "",
            tags: [],
            nodes: data.builderLayout.nodes || [],
            edges: data.builderLayout.edges || [],
            createdAt: "",
            updatedAt: "",
          } as PipelineTemplate);
          // Set the pipeline name from the prompt or ID
          const prompt = String(data.meta?.prompt || "");
          setPipelineName(prompt ? prompt.slice(0, 60) : loadId);
        }
      })
      .catch(() => {});
  }, [searchParams]);

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

  const handleLoadFromPipeline = useCallback((layout: any) => {
    // Convert the builder layout into a template-like object for the canvas
    setTemplateToLoad({ id: "pipeline", name: "Pipeline", description: "", category: "", tags: [], nodes: layout.nodes || [], edges: layout.edges || [], createdAt: "", updatedAt: "" } as PipelineTemplate);
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
        <div className="flex items-center gap-2 ml-2">
          <input
            value={pipelineName || ""}
            onChange={(e) => setPipelineName(e.target.value)}
            placeholder={pipelineName === null ? "Generating name..." : "Pipeline name..."}
            className="text-xs rounded-md px-2 py-1 border w-48"
            style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>
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
            onClick={() => setShowBenchmarks(true)}
            className="text-xs gap-1.5"
          >
            <BarChart3 size={12} />
            Benchmarks
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLoadPipeline(true)}
            className="text-xs gap-1.5"
          >
            <Download size={12} />
            Load Pipeline
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
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              const name = prompt("Template name:", "My Template");
              if (!name) return;
              const desc = prompt("Description (optional):", "");
              const category = prompt("Category (e.g. feature, pipeline, custom):", "custom");
              try {
                const res = await fetch("/api/templates", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name,
                    description: desc || "",
                    category: category || "custom",
                    tags: [category || "custom"],
                    nodes: [],
                    edges: [],
                  }),
                });
                if (res.ok) alert("Template saved!");
                else alert("Save failed");
              } catch (e) {
                alert("Save failed: " + String(e));
              }
            }}
            className="text-xs gap-1.5"
          >
            <LayoutTemplate size={12} />
            Save Template
          </Button>
          <Button variant="ghost" size="sm" className="text-xs gap-1.5"
            onClick={() => document.getElementById("import-json-input")?.click()}>
            <Upload size={12} />
            Import
          </Button>
          <input id="import-json-input" type="file" accept=".json" className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const text = await file.text();
                const data = JSON.parse(text);
                if (data.nodes || data.name) {
                  setTemplateToLoad({
                    id: data.id || "imported",
                    name: data.name || file.name.replace(".json", ""),
                    description: data.description || "",
                    category: "imported",
                    tags: [],
                    nodes: data.nodes || [],
                    edges: data.edges || [],
                    createdAt: "",
                    updatedAt: "",
                  } as any);
                  alert(`Loaded template: ${data.name || file.name}`);
                }
              } catch (e) {
                alert("Invalid template file: " + String(e));
              }
              e.target.value = "";
            }}
          />
          <Button variant="ghost" size="sm" className="text-xs gap-1.5"
            onClick={() => {
              const template = {
                name: document.querySelector<HTMLInputElement>('[placeholder="Pipeline Name"]')?.value || "Pipeline",
                nodes: [],
                edges: [],
                exportedAt: new Date().toISOString(),
              };
              const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${template.name.replace(/\s+/g, "-").toLowerCase()}.pipeline.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}>
            <Download size={12} />
            Export
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
        <PipelineCanvas onSave={handleSave} settings={settings} liveZoom={liveZoom} templateToLoad={templateToLoad} projectPath={project} />
      </div>

      {/* Template browser */}
      <TemplateBrowser
        open={showTemplates}
        onOpenChange={setShowTemplates}
        onLoadTemplate={handleLoadTemplate}
        currentNodes={[]}
        currentEdges={[]}
      />

      {/* Load Pipeline dialog */}
      <LoadPipelineDialog
        open={showLoadPipeline}
        onOpenChange={setShowLoadPipeline}
        onLoad={handleLoadFromPipeline}
      />

      {/* Benchmarks browser */}
      <Dialog open={showBenchmarks} onOpenChange={setShowBenchmarks}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              <BarChart3 size={14} /> Benchmarks
            </DialogTitle>
            <DialogDescription className="text-[10px]">
              Select a benchmark to view its gaps. Click a gap to create a pipeline.
            </DialogDescription>
          </DialogHeader>
          <BenchmarkBrowser
            onSelect={(benchmarkId, gapNumber) => {
              setShowBenchmarks(false);
              if (gapNumber) {
                // Trigger create pipeline for this gap
                fetch(`/api/benchmarks/${encodeURIComponent(benchmarkId)}/gaps/${gapNumber}/create-pipeline`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ project }),
                })
                  .then((r) => r.json())
                  .then((data) => {
                    if (data.layout) {
                      setTemplateToLoad({
                        id: `benchmark-gap-${benchmarkId}-${gapNumber}`,
                        name: `Gap ${gapNumber} Fix Pipeline`,
                        description: `Fix for gap ${gapNumber} from ${benchmarkId}`,
                        category: "benchmark",
                        tags: ["benchmark", `gap-${gapNumber}`],
                        nodes: data.layout.nodes,
                        edges: data.layout.edges,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      });
                    } else if (data.small) {
                      alert(data.message);
                    }
                  })
                  .catch(() => {});
              }
            }}
          />
        </DialogContent>
      </Dialog>

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
