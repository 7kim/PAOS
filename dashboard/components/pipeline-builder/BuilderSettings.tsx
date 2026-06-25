"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Settings2, ZoomIn, ZoomOut, Grid3X3, Minimize2,
  Rabbit, MousePointer2, Type, Monitor,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { AVAILABLE_AGENTS } from "./types";

export type BuilderSettings = {
  defaultZoom: number;
  snapToGrid: boolean;
  animatedEdges: boolean;
  showGrid: boolean;
  showMinimap: boolean;
  autoConnect: boolean;
  defaultAgent: string;
  nodeLabelPrefix: string;
};

const STORAGE_KEY = "paos-builder-settings";

const defaultSettings: BuilderSettings = {
  defaultZoom: 0.75,
  snapToGrid: false,
  animatedEdges: true,
  showGrid: true,
  showMinimap: true,
  autoConnect: false,
  defaultAgent: "opencode-developer",
  nodeLabelPrefix: "Layer",
};

export function loadSettings(): BuilderSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaultSettings;
}

export function saveSettings(settings: BuilderSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch { /* ignore */ }
}

interface BuilderSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: BuilderSettings;
  onSettingsChange: (settings: BuilderSettings) => void;
}

export function BuilderSettingsDialog({
  open, onOpenChange, settings, onSettingsChange,
}: BuilderSettingsDialogProps) {
  const update = useCallback(
    (partial: Partial<BuilderSettings>) => {
      const next = { ...settings, ...partial };
      onSettingsChange(next);
      saveSettings(next);
    },
    [settings, onSettingsChange]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-sm flex items-center gap-2">
            <Settings2 size={14} />
            Builder Settings
          </DialogTitle>
          <DialogDescription className="text-xs">
            Preferences persist across sessions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Default Zoom slider */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-2" style={{ color: "var(--foreground)" }}>
              <ZoomIn size={12} />
              Default Zoom
              <span className="ml-auto font-mono text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                {settings.defaultZoom.toFixed(2)}x
              </span>
            </label>
            <div className="flex items-center gap-2">
              <ZoomOut size={12} className="opacity-50 shrink-0" />
              <input
                type="range"
                min="0.2"
                max="1.5"
                step="0.01"
                value={settings.defaultZoom}
                onChange={(e) => update({ defaultZoom: parseFloat(e.target.value) })}
                onWheel={(e) => {
                  e.preventDefault();
                  const delta = e.deltaY > 0 ? -0.01 : 0.01;
                  const next = Math.max(0.2, Math.min(1.5, settings.defaultZoom + delta));
                  update({ defaultZoom: Math.round(next * 100) / 100 });
                }}
                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(90deg, var(--primary) ${((settings.defaultZoom - 0.2) / 1.3) * 100}%, rgba(255,255,255,0.1) ${((settings.defaultZoom - 0.2) / 1.3) * 100}%)`,
                  accentColor: "var(--primary)",
                }}
              />
              <ZoomIn size={12} className="opacity-50 shrink-0" />
            </div>
            <div className="flex justify-between text-[8px] mt-1" style={{ color: "var(--muted-foreground)" }}>
              <span>Zoomed out</span>
              <span>Zoomed in</span>
            </div>
          </div>

          <div className="h-px" style={{ background: "var(--border)" }} />

          {/* Toggles */}
          <div className="space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <Switch checked={settings.snapToGrid} onCheckedChange={(v) => update({ snapToGrid: v })} className="scale-75 origin-left" />
              <Grid3X3 size={12} className="opacity-60 shrink-0" />
              <span className="text-xs flex-1" style={{ color: "var(--foreground)" }}>Snap to Grid</span>
              <span className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>{settings.snapToGrid ? "On" : "Off"}</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <Switch checked={settings.animatedEdges} onCheckedChange={(v) => update({ animatedEdges: v })} className="scale-75 origin-left" />
              <Rabbit size={12} className="opacity-60 shrink-0" />
              <span className="text-xs flex-1" style={{ color: "var(--foreground)" }}>Animated Edges</span>
              <span className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>{settings.animatedEdges ? "On" : "Off"}</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <Switch checked={settings.showGrid} onCheckedChange={(v) => update({ showGrid: v })} className="scale-75 origin-left" />
              <Monitor size={12} className="opacity-60 shrink-0" />
              <span className="text-xs flex-1" style={{ color: "var(--foreground)" }}>Show Grid</span>
              <span className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>{settings.showGrid ? "On" : "Off"}</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <Switch checked={settings.showMinimap} onCheckedChange={(v) => update({ showMinimap: v })} className="scale-75 origin-left" />
              <Minimize2 size={12} className="opacity-60 shrink-0" />
              <span className="text-xs flex-1" style={{ color: "var(--foreground)" }}>Show Minimap</span>
              <span className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>{settings.showMinimap ? "On" : "Off"}</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <Switch checked={settings.autoConnect} onCheckedChange={(v) => update({ autoConnect: v })} className="scale-75 origin-left" />
              <MousePointer2 size={12} className="opacity-60 shrink-0" />
              <span className="text-xs flex-1" style={{ color: "var(--foreground)" }}>Auto-Connect New Nodes</span>
              <span className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>{settings.autoConnect ? "On" : "Off"}</span>
            </label>
          </div>

          <div className="h-px" style={{ background: "var(--border)" }} />

          {/* Default Agent */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
              Default Agent
            </label>
            <select
              value={settings.defaultAgent}
              onChange={(e) => update({ defaultAgent: e.target.value })}
              className="w-full text-xs rounded-md px-2 py-1.5 border"
              style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              {AVAILABLE_AGENTS.map((a) => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </div>

          {/* Node Label Prefix */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-1.5" style={{ color: "var(--foreground)" }}>
              <Type size={12} />
              Node Label Prefix
            </label>
            <Input
              value={settings.nodeLabelPrefix}
              onChange={(e) => update({ nodeLabelPrefix: e.target.value })}
              placeholder="Layer"
              className="text-xs h-7"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
