"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import {
  Palette, Eye, EyeOff, Minus, Plus, Paintbrush,
  MousePointer2, LayoutTemplate, Maximize2, Minimize2,
  Zap, Grid3x3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { VisualSettings } from "./VisualSettings";
import { defaultVisualSettings, saveVisualSettings, COLOR_PRESETS } from "./VisualSettings";

interface VisualToolbarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: VisualSettings;
  onSettingsChange: (settings: VisualSettings) => void;
  showDagHeight?: boolean;
}

function SliderWithScroll({
  value, min, max, step, onChange, label, format,
}: {
  value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
  label?: string; format?: (v: number) => string;
}) {
  const sliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? -step : step;
      const next = Math.max(min, Math.min(max, value + delta));
      // Round to nearest step to avoid floating-point lock
      const rounded = Math.round(next / step) * step;
      onChange(parseFloat(rounded.toFixed(6)));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [value, min, max, step, onChange]);

  return (
    <div className="flex items-center gap-2">
      <Minus size={8} className="opacity-40 shrink-0" />
      <input
        ref={sliderRef}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(90deg, var(--primary) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%)`,
          accentColor: "var(--primary)",
        }}
      />
      <Plus size={8} className="opacity-40 shrink-0" />
      {label && <span className="text-[9px] font-mono w-10 text-right" style={{ color: "var(--muted-foreground)" }}>{format ? format(value) : value.toFixed(2)}</span>}
    </div>
  );
}

export function VisualToolbar({ open, onOpenChange, settings, onSettingsChange, showDagHeight = true }: VisualToolbarProps) {
  const update = useCallback((partial: Partial<VisualSettings>) => {
    const next = { ...settings, ...partial };
    onSettingsChange(next);
    saveVisualSettings(next);
  }, [settings, onSettingsChange]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="fixed bottom-4 right-4 z-30 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        title="Visual Settings"
      >
        <Palette size={14} />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-30 w-72 rounded-xl border shadow-xl backdrop-blur-xl overflow-hidden"
      style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-[10px] font-semibold flex items-center gap-1.5" style={{ color: "var(--foreground)" }}>
          <Palette size={10} />
          Visual Settings
        </span>
        <button type="button" onClick={() => onOpenChange(false)} className="opacity-50 hover:opacity-100">
          <EyeOff size={10} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="max-h-[60vh] overflow-y-auto p-3 space-y-3 text-[10px]">
        {/* Background section */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5 font-medium" style={{ color: "var(--muted-foreground)" }}>
            <Paintbrush size={9} /> Background
          </div>
          <div className="space-y-2 pl-2">
            <div>
              <label className="text-[9px] block mb-0.5" style={{ color: "var(--muted-foreground)" }}>Type</label>
              <select value={settings.backgroundType} onChange={(e) => update({ backgroundType: e.target.value })}
                className="w-full text-[10px] rounded px-1.5 py-1 border"
                style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                <option value="dots">Dots</option>
                <option value="cross">Cross</option>
                <option value="lines">Lines</option>
                <option value="gradient">Gradient</option>
                <option value="solid">Solid</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] block mb-0.5" style={{ color: "var(--muted-foreground)" }}>Transparency</label>
              <SliderWithScroll value={settings.backgroundOpacity} min={0} max={0.2} step={0.005}
                onChange={(v) => update({ backgroundOpacity: v })} format={(v) => (v * 100).toFixed(0) + "%"}
              />
            </div>
            <div>
              <label className="text-[9px] block mb-0.5" style={{ color: "var(--muted-foreground)" }}>Color</label>
              <div className="flex flex-wrap gap-1">
                {COLOR_PRESETS.backgrounds.map((c) => (
                  <button key={c.value} type="button" title={c.label}
                    onClick={() => update({ backgroundColor: c.value })}
                    className="w-5 h-5 rounded-full border transition-transform hover:scale-110"
                    style={{ background: c.value, borderColor: settings.backgroundColor === c.value ? "var(--primary)" : "rgba(255,255,255,0.1)" }}
                  />
                ))}
                <input type="color" value={settings.backgroundColor}
                  onChange={(e) => update({ backgroundColor: e.target.value })}
                  className="w-5 h-5 rounded-full border-0 cursor-pointer p-0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-px" style={{ background: "var(--border)" }} />

        {/* Connectors section */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5 font-medium" style={{ color: "var(--muted-foreground)" }}>
            <MousePointer2 size={9} /> Connectors
          </div>
          <div className="space-y-2 pl-2">
            <div>
              <label className="text-[9px] block mb-0.5" style={{ color: "var(--muted-foreground)" }}>Shape</label>
              <select value={settings.connectorShape} onChange={(e) => update({ connectorShape: e.target.value })}
                className="w-full text-[10px] rounded px-1.5 py-1 border"
                style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
              >
                <option value="bezier">Bezier</option>
                <option value="smoothstep">Smoothstep</option>
                <option value="step">Step</option>
                <option value="straight">Straight</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] block mb-0.5" style={{ color: "var(--muted-foreground)" }}>Thickness</label>
              <SliderWithScroll value={settings.connectorThickness} min={1} max={5} step={0.5}
                onChange={(v) => update({ connectorThickness: v })} format={(v) => v.toFixed(1) + "px"}
              />
            </div>
            <div>
              <label className="text-[9px] block mb-0.5" style={{ color: "var(--muted-foreground)" }}>Color</label>
              <div className="flex flex-wrap gap-1">
                {COLOR_PRESETS.connectors.map((c) => (
                  <button key={c.value} type="button" title={c.label}
                    onClick={() => update({ connectorColor: c.value })}
                    className="w-5 h-5 rounded-full border transition-transform hover:scale-110"
                    style={{ background: c.value, borderColor: settings.connectorColor === c.value ? "var(--primary)" : "rgba(255,255,255,0.1)" }}
                  />
                ))}
                <input type="color" value={settings.connectorColor}
                  onChange={(e) => update({ connectorColor: e.target.value })}
                  className="w-5 h-5 rounded-full border-0 cursor-pointer p-0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-px" style={{ background: "var(--border)" }} />

        {/* Toggles */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch checked={settings.edgeAnimation} onCheckedChange={(v) => update({ edgeAnimation: v })}
              className="scale-75 origin-left"
            />
            <Zap size={9} className="opacity-60" />
            <span className="text-[10px]" style={{ color: "var(--foreground)" }}>Animate Edges</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch checked={settings.showGrid} onCheckedChange={(v) => update({ showGrid: v })}
              className="scale-75 origin-left"
            />
            <Grid3x3 size={9} className="opacity-60" />
            <span className="text-[10px]" style={{ color: "var(--foreground)" }}>Show Grid</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch checked={settings.showMinimap} onCheckedChange={(v) => update({ showMinimap: v })}
              className="scale-75 origin-left"
            />
            <Maximize2 size={9} className="opacity-60" />
            <span className="text-[10px]" style={{ color: "var(--foreground)" }}>Show Minimap</span>
          </label>
        </div>

        <div className="h-px" style={{ background: "var(--border)" }} />

        {/* DAG Height & Zoom */}
        <div className="space-y-2">
          <div>
            <label className="text-[9px] flex items-center gap-1 mb-0.5" style={{ color: "var(--muted-foreground)" }}>
              <LayoutTemplate size={8} /> Default Zoom
            </label>
            <SliderWithScroll value={settings.defaultZoom} min={0.2} max={1.5} step={0.01}
              onChange={(v) => update({ defaultZoom: v })}
            />
          </div>
          {showDagHeight && (
            <div>
              <label className="text-[9px] flex items-center gap-1 mb-0.5" style={{ color: "var(--muted-foreground)" }}>
                <Maximize2 size={8} /> DAG Height
              </label>
              <SliderWithScroll value={settings.dagHeight} min={200} max={800} step={10}
                onChange={(v) => update({ dagHeight: v })} format={(v) => v + "px"}
              />
            </div>
          )}
        </div>

        <div className="h-px" style={{ background: "var(--border)" }} />

        {/* Phase Card Size */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-1.5 font-medium" style={{ color: "var(--muted-foreground)" }}>
            <LayoutTemplate size={9} /> Phase Cards
          </div>
          <div>
            <label className="text-[9px] flex items-center gap-1 mb-0.5" style={{ color: "var(--muted-foreground)" }}>
              <Minus size={8} /> Width (%)
            </label>
            <SliderWithScroll value={settings.phaseCardWidth} min={50} max={100} step={5}
              onChange={(v) => update({ phaseCardWidth: v })} format={(v) => v + "%"}
            />
          </div>
          <div>
            <label className="text-[9px] flex items-center gap-1 mb-0.5" style={{ color: "var(--muted-foreground)" }}>
              <Minus size={8} /> Max Height
            </label>
            <SliderWithScroll value={settings.phaseCardHeight} min={0} max={2000} step={50}
              onChange={(v) => update({ phaseCardHeight: v })} format={(v) => v === 0 ? "Auto" : v + "px"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
