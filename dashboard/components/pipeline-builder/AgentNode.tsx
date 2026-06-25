"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Bot, GripVertical, Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentNodeData } from "./types";
import { AVAILABLE_AGENTS } from "./types";

function AgentNodeComponent(props: Record<string, unknown>) {
  const data = props.data as AgentNodeData;
  const selected = props.selected as boolean;
  const agent = AVAILABLE_AGENTS.find((a) => a.id === data.agentId);
  const color = data.nodeColor || agent?.color || "#64748b";

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 transition-all duration-200 min-w-[220px] max-w-[320px]",
        "shadow-lg backdrop-blur-sm",
        selected
          ? "border-[var(--primary)] shadow-[0_0_20px_rgba(240,185,11,0.15)]"
          : "border-white/10 hover:border-white/20"
      )}
      style={{ background: "var(--card-bg)" }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !border-2 !bg-[var(--background)]"
        style={{ borderColor: color }}
      />

      <div
        className="flex items-center gap-2 px-3 py-2 rounded-t-xl cursor-grab active:cursor-grabbing"
        style={{ background: `${color}18`, borderBottom: `1px solid ${color}22` }}
      >
        <GripVertical size={12} className="opacity-40 shrink-0" />
        <Bot size={14} style={{ color }} />
        <span className="text-xs font-semibold truncate flex-1" style={{ color: "var(--foreground)" }}>
          {data.label || agent?.label || "Agent"}
        </span>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: `${color}22`, color }}>
          {agent?.id || data.agentId || "unset"}
        </span>
      </div>
      {/* Prompt preview */}
      <div className="px-3 py-2.5">
        <p className="text-[11px] leading-relaxed line-clamp-3" style={{ color: "var(--muted-foreground)" }}>
          {data.prompt || (
            <span className="italic opacity-50">Click to configure prompt...</span>
          )}
        </p>
      </div>

      {/* Flow status badge */}
      {data.flowStatus && (
        <div className="px-3 pb-1.5">
          <div className="flex items-center gap-1.5 text-[9px]">
            {data.flowStatus === "running" && (
              <>
                <Loader2 size={9} className="animate-spin" style={{ color: "#3b82f6" }} />
                <span style={{ color: "#3b82f6" }}>
                  Running{data.flowPid ? ` (PID ${data.flowPid})` : ""}
                </span>
              </>
            )}
            {data.flowStatus === "ready" && (
              <>
                <Clock size={9} style={{ color: "var(--orange)" }} />
                <span style={{ color: "var(--orange)" }}>Ready</span>
              </>
            )}
            {data.flowStatus === "pending" && (
              <>
                <Clock size={9} className="opacity-50" />
                <span className="opacity-50">Pending</span>
              </>
            )}
            {data.flowStatus === "completed" && (
              <>
                <CheckCircle2 size={9} style={{ color: "#22c55e" }} />
                <span style={{ color: "#22c55e" }}>Completed</span>
              </>
            )}
            {data.flowStatus === "failed" && (
              <>
                <AlertCircle size={9} style={{ color: "#ef4444" }} />
                <span style={{ color: "#ef4444" }}>Failed</span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="px-3 pb-2 flex flex-wrap gap-1">
        {(data.selectedSkills || []).slice(0, 2).map((s: string) => (
          <span
            key={s}
            className="text-[8px] px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(240,185,11,0.12)", color: "var(--primary)" }}
          >
            {s}
          </span>
        ))}
        {(data.selectedSkills || []).length > 2 && (
          <span className="text-[8px] px-1.5 py-0.5 rounded-full opacity-60" style={{ color: "var(--muted-foreground)" }}>
            +{(data.selectedSkills || []).length - 2}
          </span>
        )}
        {(data.fileRefs || []).length > 0 && (
          <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>
            {(data.fileRefs || []).length} file{(data.fileRefs || []).length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !border-2 !bg-[var(--background)]"
        style={{ borderColor: color }}
      />
    </div>
  );
}

export const AgentNode = memo(AgentNodeComponent);
