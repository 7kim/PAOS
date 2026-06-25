"use client";

import { useCallback, useState } from "react";
import { Bot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AVAILABLE_AGENTS } from "./types";

const DEFAULT_PROMPT_TEMPLATES: Record<string, string> = {
  "hermes-nous": "Plan and orchestrate the work. Read context, define tasks, and delegate to executors.",
  "opencode-developer": "Implement the solution. Use your tools and skills to build, test, and deliver.",
  "opencode-plan": "Analyze requirements and create a detailed implementation plan with tasks.",
  antigravity: "Review the implementation for quality, edge cases, and potential issues.",
  claude: "Implement using Claude Code's capabilities. Focus on code quality and thorough testing.",
  openclaw: "Execute using OpenClaw. Focus on efficient, clean implementation.",
  ollama: "Run local inference tasks. Process and analyze data with local models.",
};

interface NodePaletteProps {
  onAddNode: (agentId: string) => void;
}

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? AVAILABLE_AGENTS.filter((a) =>
        a.label.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase())
      )
    : AVAILABLE_AGENTS;

  return (
    <div className="w-56 shrink-0 border-r border-white/10 flex flex-col h-full" style={{ background: "var(--card-bg)" }}>
      {/* Header */}
      <div className="px-3 py-3 border-b border-white/10">
        <h3 className="text-xs font-semibold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
          <Bot size={13} />
          Agent Nodes
        </h3>
        <p className="text-[10px] mt-1" style={{ color: "var(--muted-foreground)" }}>
          Click to add or drag to canvas
        </p>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter agents..."
          className="w-full text-xs rounded-md px-2 py-1.5 border"
          style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
        />
      </div>

      {/* Agent list */}
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
        {filtered.map((agent) => (
          <button
            key={agent.id}
            type="button"
            onClick={() => onAddNode(agent.id)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 hover:bg-white/5 group"
          >
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: agent.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs truncate" style={{ color: "var(--foreground)" }}>
                {agent.label}
              </div>
              <div className="text-[9px] font-mono truncate opacity-60" style={{ color: "var(--muted-foreground)" }}>
                {agent.id}
              </div>
            </div>
            <Plus
              size={12}
              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              style={{ color: agent.color }}
            />
          </button>
        ))}
      </div>

      {/* Instructions */}
      <div className="px-3 py-2 border-t border-white/10">
        <p className="text-[9px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Connect nodes by dragging from the bottom handle to another node's top handle.
        </p>
      </div>
    </div>
  );
}
