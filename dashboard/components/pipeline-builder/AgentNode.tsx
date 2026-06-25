"use client";

import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Bot, GripVertical, Loader2, CheckCircle2, AlertCircle, Clock, ChevronDown, ChevronRight, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentNodeData } from "./types";
import { AVAILABLE_AGENTS } from "./types";

function AgentNodeComponent(props: Record<string, unknown>) {
  const data = props.data as AgentNodeData;
  const selected = props.selected as boolean;
  const agent = AVAILABLE_AGENTS.find((a) => a.id === data.agentId);
  const color = data.nodeColor || agent?.color || "#64748b";
  const [showOutput, setShowOutput] = useState(false);

  const isRunning = data.flowStatus === "running";
  const progressValue = data.flowProgress ? parseInt(data.flowProgress.split("/")[0]) / Math.max(1, parseInt(data.flowProgress.split("/")[1] || "1")) : 0;

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

      {/* Flow status badge + progress */}
      {data.flowStatus && (
        <div className="px-3 pb-1.5 space-y-1">
          <div className="flex items-center gap-1.5 text-[9px]">
            {data.flowStatus === "running" && (
              <>
                <Loader2 size={9} className="animate-spin" style={{ color: "#3b82f6" }} />
                <span style={{ color: "#3b82f6" }}>
                  {data.flowPid ? `Running (PID ${data.flowPid})` : "Running"}
                </span>
              </>
            )}
            {data.flowStatus === "ready" && (
              <><Clock size={9} style={{ color: "var(--orange)" }} /><span style={{ color: "var(--orange)" }}>Ready</span></>
            )}
            {data.flowStatus === "pending" && (
              <><Clock size={9} className="opacity-50" /><span className="opacity-50">Pending</span></>
            )}
            {data.flowStatus === "completed" && (
              <><CheckCircle2 size={9} style={{ color: "#22c55e" }} /><span style={{ color: "#22c55e" }}>Completed</span></>
            )}
            {data.flowStatus === "failed" && (
              <><AlertCircle size={9} style={{ color: "#ef4444" }} /><span style={{ color: "#ef4444" }}>Failed</span></>
            )}
            {data.flowProgress && (
              <span className="ml-auto text-[8px] opacity-60">{data.flowProgress}</span>
            )}
          </div>

          {/* Progress bar for running tasks */}
          {isRunning && progressValue > 0 && (
            <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, progressValue * 100)}%`,
                  background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                }}
              />
            </div>
          )}

          {/* Output preview toggle */}
          {data.flowOutput && (
            <div>
              <button
                type="button"
                onClick={() => setShowOutput(!showOutput)}
                className="flex items-center gap-1 text-[8px] opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: "var(--muted-foreground)" }}
              >
                <Terminal size={8} />
                {showOutput ? <ChevronDown size={8} /> : <ChevronRight size={8} />}
                Output
              </button>
              {showOutput && (
                <pre className="text-[7px] mt-1 p-1.5 rounded max-h-16 overflow-y-auto font-mono leading-tight"
                  style={{ background: "rgba(0,0,0,0.2)", color: "var(--muted-foreground)" }}
                >
                  {data.flowOutput}
                </pre>
              )}
            </div>
          )}
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
