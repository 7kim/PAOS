"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Bot, Loader2, CheckCircle2, AlertCircle, Clock, ChevronRight, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { AVAILABLE_AGENTS } from "./types";

function ReadOnlyNodeComponent(props: Record<string, unknown>) {
  const data = props.data as Record<string, unknown>;
  const selected = props.selected as boolean;
  const agentId = String(data?.agentId || "");
  const agent = AVAILABLE_AGENTS.find((a) => a.id === agentId);
  const color = String(data?.nodeColor || agent?.color || "#64748b");
  const flowStatus = data?.flowStatus as string | undefined;
  const flowPid = data?.flowPid as number | undefined;
  const label = String(data?.label || agent?.label || agentId || "Agent");
  const prompt = String(data?.prompt || "");
  const fileRefs = (data?.fileRefs as any[]) || [];

  const statusIcon = () => {
    switch (flowStatus) {
      case "running": return <Loader2 size={10} className="animate-spin" style={{ color: "#3b82f6" }} />;
      case "completed": return <CheckCircle2 size={10} style={{ color: "#22c55e" }} />;
      case "failed": return <AlertCircle size={10} style={{ color: "#ef4444" }} />;
      case "ready": return <Clock size={10} style={{ color: "var(--orange)" }} />;
      default: return null;
    }
  };

  const statusLabel = () => {
    switch (flowStatus) {
      case "running": return `Running${flowPid ? ` (PID ${flowPid})` : ""}`;
      case "completed": return "Completed";
      case "failed": return "Failed";
      case "ready": return "Ready";
      case "pending": return "Pending";
      default: return null;
    }
  };

  const statusColor = () => {
    switch (flowStatus) {
      case "running": return "#3b82f6";
      case "completed": return "#22c55e";
      case "failed": return "#ef4444";
      case "ready": return "var(--orange)";
      default: return "var(--muted-foreground)";
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 transition-all duration-200 min-w-[200px] max-w-[280px]",
        "shadow-lg backdrop-blur-sm cursor-pointer hover:shadow-md",
        selected
          ? "border-[var(--primary)] shadow-[0_0_20px_rgba(240,185,11,0.15)]"
          : "border-white/10 hover:border-white/20"
      )}
      style={{ background: "var(--card-bg)" }}
    >
      {/* Top handle */}
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !border !bg-[var(--background)]" style={{ borderColor: color }} />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-t-xl" style={{ background: `${color}12`, borderBottom: `1px solid ${color}18` }}>
        <Bot size={12} style={{ color }} />
        <span className="text-[11px] font-semibold truncate flex-1" style={{ color: "var(--foreground)" }}>
          {label}
        </span>
        {flowStatus && (
          <span className="flex items-center gap-1 text-[8px]" style={{ color: statusColor() }}>
            {statusIcon()}
            <span className="hidden group-hover:inline">{statusLabel()}</span>
          </span>
        )}
        <ChevronRight size={10} className="opacity-40 shrink-0" />
      </div>

      {/* Agent + prompt */}
      <div className="px-3 py-2 space-y-1">
        <div className="text-[9px] font-mono truncate" style={{ color }}>
          {agentId || agent?.id}
        </div>
        {prompt && (
          <p className="text-[9px] leading-relaxed line-clamp-2" style={{ color: "var(--muted-foreground)" }}>
            {prompt.slice(0, 100)}{prompt.length > 100 ? "..." : ""}
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="px-3 pb-2 flex flex-wrap gap-1">
        {fileRefs.length > 0 && (
          <span className="text-[7px] px-1 py-0.5 rounded" style={{ background: "rgba(59,130,246,0.12)", color: "#60a5fa" }}>
            {fileRefs.length} file{fileRefs.length > 1 ? "s" : ""}
          </span>
        )}
        {(data?.hasReasoning as boolean) && (
          <span className="text-[7px] px-1 py-0.5 rounded flex items-center gap-0.5" style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa" }}>
            <Brain size={6} /> Reasoning
          </span>
        )}
        {!flowStatus && (
          <span className="text-[7px] px-1 py-0.5 rounded opacity-40" style={{ color: "var(--muted-foreground)" }}>
            Configuring...
          </span>
        )}
      </div>

      {/* Bottom handle */}
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !border !bg-[var(--background)]" style={{ borderColor: color }} />
    </div>
  );
}

export const ReadOnlyNode = memo(ReadOnlyNodeComponent);
