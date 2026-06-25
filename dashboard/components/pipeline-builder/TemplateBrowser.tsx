"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LayoutTemplate, Search, Download, Upload, Trash2,
  Plus, FileText, Edit3, X, Check,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PipelineTemplate } from "./types";

interface TemplateBrowserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadTemplate: (template: PipelineTemplate) => void;
  currentNodes: any[];
  currentEdges: any[];
}

export function TemplateBrowser({ open, onOpenChange, onLoadTemplate, currentNodes, currentEdges }: TemplateBrowserProps) {
  const [templates, setTemplates] = useState<PipelineTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveDesc, setSaveDesc] = useState("");
  const [saveCategory, setSaveCategory] = useState("custom");
  const [showDelete, setShowDelete] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/templates");
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch { setTemplates([]); }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const categories = ["all", ...new Set(templates.map((t) => t.category))];

  const filtered = templates.filter((t) => {
    if (activeCategory !== "all" && t.category !== activeCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q));
    }
    return true;
  });

  const handleSave = async () => {
    if (!saveName.trim()) return;
    try {
      await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: saveName,
          description: saveDesc,
          category: saveCategory,
          nodes: currentNodes,
          edges: currentEdges,
        }),
      });
      setShowSaveDialog(false);
      setSaveName("");
      setSaveDesc("");
      load();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/templates/${id}`, { method: "DELETE" });
      setShowDelete(null);
      load();
    } catch {}
  };

  const handleExport = (t: PipelineTemplate) => {
    const blob = new Blob([JSON.stringify(t, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${t.name}.template.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const t = JSON.parse(text);
        if (t.nodes && t.name) {
          await fetch("/api/templates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: t.name,
              description: t.description || "",
              category: t.category || "imported",
              tags: t.tags || [],
              nodes: t.nodes,
              edges: t.edges || [],
            }),
          });
          load();
        }
      } catch { alert("Invalid template file"); }
    };
    input.click();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl w-full max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              <LayoutTemplate size={14} />
              Pipeline Templates
            </DialogTitle>
            <DialogDescription className="text-xs">
              Load a template to start building, or save your current DAG as a template
            </DialogDescription>
          </DialogHeader>

          {/* Search + actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 flex-1 px-2 py-1.5 rounded-md border" style={{ borderColor: "var(--border)" }}>
              <Search size={10} className="opacity-40 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates..."
                className="flex-1 text-xs bg-transparent outline-none"
                style={{ color: "var(--foreground)" }}
              />
            </div>
            <Button size="sm" variant="outline" onClick={handleImport} className="text-xs gap-1">
              <Upload size={10} /> Import
            </Button>
            <Button
              size="sm"
              onClick={() => setShowSaveDialog(true)}
              className="text-xs gap-1"
              disabled={currentNodes.length === 0}
            >
              <Plus size={10} /> Save Current
            </Button>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className="text-[10px] px-2 py-1 rounded-md transition-colors capitalize"
                style={{
                  background: activeCategory === cat ? "var(--primary)" : "rgba(255,255,255,0.05)",
                  color: activeCategory === cat ? "var(--primary-foreground)" : "var(--muted-foreground)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Template grid */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-xs text-center py-8 opacity-50">Loading templates...</div>
            ) : filtered.length === 0 ? (
              <div className="text-xs text-center py-8 opacity-50">No templates found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-lg border p-3 transition-all hover:shadow-md"
                    style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <FileText size={10} className="shrink-0 opacity-60" />
                          <span className="text-xs font-semibold truncate" style={{ color: "var(--foreground)" }}>
                            {t.name}
                          </span>
                        </div>
                        <p className="text-[9px] mt-1 line-clamp-2" style={{ color: "var(--muted-foreground)" }}>
                          {t.description}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-[8px] px-1.5 py-0.5 rounded capitalize" style={{ background: "rgba(240,185,11,0.12)", color: "var(--primary)" }}>
                            {t.category}
                          </span>
                          <span className="text-[8px] opacity-50" style={{ color: "var(--muted-foreground)" }}>
                            {t.nodes.length} nodes
                          </span>
                          {t.tags.map((tag) => (
                            <span key={tag} className="text-[8px] px-1 rounded opacity-40" style={{ color: "var(--muted-foreground)" }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                      <Button size="sm" variant="default" className="text-[9px] h-6 px-2 gap-1 flex-1"
                        onClick={() => { onLoadTemplate(t); onOpenChange(false); }}
                      >
                        <Download size={8} /> Load
                      </Button>
                      <Button size="sm" variant="ghost" className="text-[9px] h-6 w-6 p-0"
                        onClick={() => handleExport(t)}
                      >
                        <Download size={8} />
                      </Button>
                      {showDelete === t.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-300 text-[9px]"><Check size={10} /></button>
                          <button onClick={() => setShowDelete(null)} className="text-[9px]"><X size={10} /></button>
                        </div>
                      ) : (
                        <Button size="sm" variant="ghost" className="text-[9px] h-6 w-6 p-0 text-red-400 hover:text-red-300"
                          onClick={() => setShowDelete(t.id)}
                        >
                          <Trash2 size={8} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Save as template dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-sm w-full">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              <Plus size={14} />
              Save as Template
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-medium block mb-1" style={{ color: "var(--muted-foreground)" }}>Name</label>
              <Input value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="My Template" className="text-xs h-8" />
            </div>
            <div>
              <label className="text-[10px] font-medium block mb-1" style={{ color: "var(--muted-foreground)" }}>Description</label>
              <Input value={saveDesc} onChange={(e) => setSaveDesc(e.target.value)} placeholder="What does this template do?" className="text-xs h-8" />
            </div>
            <div>
              <label className="text-[10px] font-medium block mb-1" style={{ color: "var(--muted-foreground)" }}>Category</label>
              <select value={saveCategory} onChange={(e) => setSaveCategory(e.target.value)}
                className="w-full text-xs rounded-md px-2 py-1.5 border"
                style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                <option value="custom">Custom</option>
                <option value="feature">Feature</option>
                <option value="bug-fix">Bug Fix</option>
                <option value="hotfix">Hotfix</option>
                <option value="documentation">Documentation</option>
                <option value="research">Research</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={!saveName.trim()}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
