"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, Search, FileText, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { BuilderLayout } from "./types";

interface PipelineInfo {
  id: string;
  project?: string;
  status: string;
  builder?: boolean;
  prompt?: string;
  created_at?: string;
  phases?: { status?: string; prompt?: string }[];
  planner?: string;
}

interface LoadPipelineProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoad: (layout: BuilderLayout) => void;
}

export function LoadPipelineDialog({ open, onOpenChange, onLoad }: LoadPipelineProps) {
  const [pipelines, setPipelines] = useState<PipelineInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pipelines");
      const data = await res.json();
      // Filter to pipelines with builderLayout that are still pending/submitted
      const builderPipelines = (data.pipelines || []).filter(
        (p: PipelineInfo) => p.builder === true && (p.status === "submitted" || p.status === "pending")
      );
      setPipelines(builderPipelines);
    } catch { setPipelines([]); }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const filtered = search
    ? pipelines.filter((p) => p.id?.toLowerCase().includes(search.toLowerCase()))
    : pipelines;

  const handleSelect = async (id: string) => {
    try {
      const res = await fetch(`/api/pipelines/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (data.builderLayout) {
        onLoad(data.builderLayout);
        onOpenChange(false);
      }
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full max-h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2">
            <Download size={14} />
            Load Pipeline
          </DialogTitle>
          <DialogDescription className="text-xs">
            Select a pending builder pipeline to load back into the Flow Builder
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="flex items-center gap-1 px-2 py-1.5 rounded-md border" style={{ borderColor: "var(--border)" }}>
          <Search size={10} className="opacity-40 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pipelines..."
            className="flex-1 text-xs bg-transparent outline-none"
            style={{ color: "var(--foreground)" }}
          />
        </div>

        {/* Pipeline list */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {loading ? (
            <div className="flex items-center justify-center py-8"><Loader2 size={16} className="animate-spin opacity-50" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-xs text-center py-8 opacity-50">
              {pipelines.length === 0 ? "No pending builder pipelines found" : "No matches"}
            </div>
          ) : (
            filtered.map((p) => (
              <div key={p.id}
                className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-all hover:shadow-sm"
                style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}
                onClick={() => handleSelect(p.id)}
              >
                <FileText size={12} className="shrink-0 opacity-60" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {p.id}
                  </div>
                  <div className="text-[9px] truncate" style={{ color: "var(--muted-foreground)" }}>
                    {p.project || "PAOS"} · {p.phases?.length || 0} phases
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-[9px] h-6 px-2 gap-1 shrink-0">
                  <Download size={8} /> Load
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
