"use client";

import { useCallback, useState, useEffect } from "react";
import {
  Settings2, Bot, FileText, Puzzle, Blocks, Trash2, Folder, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "./FileUpload";
import { FileTreeExplorer } from "./FileTreeExplorer";
import { AnimatedPrompt } from "./AnimatedPrompt";
import type { AgentNodeData, AgentNodeType, SkillOption, McpOption, FileRef } from "./types";
import { AVAILABLE_AGENTS } from "./types";

interface ConfigPanelProps {
  node: AgentNodeType | null;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
  onDelete: (nodeId: string) => void;
  availableSkills: SkillOption[];
  availableMcps: McpOption[];
  pipelineId?: string;
  projectPath?: string;
  benchmarkId?: string;
}

export function ConfigPanel({ node, onUpdate, onDelete, availableSkills, availableMcps, pipelineId, projectPath, benchmarkId }: ConfigPanelProps) {
  const [activeTab, setActiveTab] = useState<"prompt" | "skills" | "mcps" | "files">("prompt");
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<{ role: string; label: string; prompt: string; defaultPrompt?: string }[]>([]);
  const [showFullPrompt, setShowFullPrompt] = useState(false);

  // Cast node data safely
  const nodeData: AgentNodeData | null = node
    ? (node.data as unknown as AgentNodeData)
    : null;

  useEffect(() => {
    if (nodeData) {
      setPrompt(nodeData.prompt || "");
    }
  }, [node?.id]);

  // Fetch suggestions when agent changes
  useEffect(() => {
    if (nodeData?.agentId) {
      fetch(`/api/templates/suggestions?agentId=${encodeURIComponent(nodeData.agentId)}`)
        .then((r) => r.json())
        .then((data) => setSuggestions(data.suggestions || []))
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  }, [nodeData?.agentId]);

  const handlePromptChange = useCallback((val: string) => {
    setPrompt(val);
    if (node) {
      onUpdate(node.id, { prompt: val });
    }
  }, [node, onUpdate]);

  const handleFilesUploaded = useCallback(
    (uploadedFiles: { name: string; path: string; size: number }[]) => {
      if (!node) return;
      const refs: FileRef[] = uploadedFiles.map((f) => ({
        path: f.path,
        type: "file" as const,
        name: f.name,
      }));
      const current = nodeData?.fileRefs || [];
      onUpdate(node.id, { fileRefs: [...current, ...refs] });
    },
    [node, nodeData, onUpdate]
  );

  const handleFileToggle = useCallback(
    (file: FileRef) => {
      if (!node) return;
      const current = nodeData?.fileRefs || [];
      const exists = current.some((f) => f.path === file.path);
      const next = exists
        ? current.filter((f) => f.path !== file.path)
        : [...current, file];
      onUpdate(node.id, { fileRefs: next });
    },
    [node, nodeData, onUpdate]
  );

  if (!node || !nodeData) {
    return (
      <div className="w-72 shrink-0 border-l border-white/10 flex flex-col items-center justify-center h-full p-4"
        style={{ background: "var(--card-bg)" }}
      >
        <Settings2 size={24} className="opacity-20 mb-3" style={{ color: "var(--muted-foreground)" }} />
        <p className="text-xs text-center" style={{ color: "var(--muted-foreground)" }}>
          Select a node on the canvas to configure it
        </p>
      </div>
    );
  }

  const agent = AVAILABLE_AGENTS.find((a) => a.id === nodeData.agentId);
  const tabs = [
    { id: "prompt" as const, icon: FileText, label: "Prompt" },
    { id: "skills" as const, icon: Puzzle, label: "Skills" },
    { id: "mcps" as const, icon: Blocks, label: "MCPs" },
    { id: "files" as const, icon: Bot, label: "Files" },
  ];

  return (
    <div className="w-72 shrink-0 border-l border-white/10 flex flex-col h-full" style={{ background: "var(--card-bg)" }}>
      {/* Header */}
      <div className="px-3 py-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: agent?.color || "#64748b" }} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate" style={{ color: "var(--foreground)" }}>
              {nodeData.label || agent?.label || "Agent Node"}
            </div>
            <div className="text-[9px] font-mono truncate opacity-60" style={{ color: "var(--muted-foreground)" }}>
              {node.id}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 h-7 w-7 p-0"
            onClick={() => onDelete(node.id)}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      {/* Agent selector */}
      <div className="px-3 py-2 border-b border-white/10">
        <label className="text-[10px] font-medium block mb-1.5" style={{ color: "var(--muted-foreground)" }}>
          Agent
        </label>
        <select
          value={nodeData.agentId}
          onChange={(e) => onUpdate(node.id, { agentId: e.target.value })}
          className="w-full text-xs rounded-md px-2 py-1.5 border"
          style={{ background: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)" }}
        >
          {AVAILABLE_AGENTS.map((a) => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>
      </div>

      {/* Label */}
      <div className="px-3 py-2 border-b border-white/10">
        <label className="text-[10px] font-medium block mb-1.5" style={{ color: "var(--muted-foreground)" }}>
          Node Label
        </label>
        <Input
          value={nodeData.label}
          onChange={(e) => onUpdate(node.id, { label: e.target.value })}
          placeholder="Phase name..."
          className="text-xs h-7"
        />
      </div>

      {/* Role suggestions */}
      {suggestions.length > 0 && (
        <div className="px-3 py-2 border-b border-white/10">
          <label className="text-[9px] font-medium flex items-center gap-1 mb-1.5" style={{ color: "var(--muted-foreground)" }}>
            <Sparkles size={9} />
            Suggested Roles
          </label>
          <div className="flex flex-wrap gap-1">
            {suggestions.map((s) => (
              <button
                key={s.role}
                type="button"
                onClick={() => {
                  onUpdate(node.id, {
                    label: s.label,
                    role: s.role,
                    prompt: s.prompt,
                    defaultPrompt: s.defaultPrompt || "",
                  });
                  setPrompt(s.prompt || "");
                }}
                className="text-[9px] px-2 py-1 rounded-md border transition-all hover:opacity-80"
                style={{
                  borderColor: activeTab === "prompt" ? "var(--primary)" : "var(--border)",
                  color: activeTab === "prompt" ? "var(--primary)" : "var(--muted-foreground)",
                  background: activeTab === "prompt" ? "rgba(240,185,11,0.08)" : "transparent",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-[10px] transition-colors"
              style={{
                color: activeTab === tab.id ? "var(--primary)" : "var(--muted-foreground)",
                borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
              }}
            >
              <Icon size={10} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === "prompt" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-medium flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                <FileText size={10} /> Your Custom Prompt
              </label>
              {nodeData?.defaultPrompt && (
                <button
                  onClick={() => setShowFullPrompt(!showFullPrompt)}
                  className="text-[8px] px-1.5 py-0.5 rounded border"
                  style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                >
                  {showFullPrompt ? "Hide Default" : "Show Full Template"}
                </button>
              )}
            </div>
            {nodeData?.defaultPrompt && (
              <div className="text-[8px] flex items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
                <span className="opacity-60">This role has a hidden default prompt.</span>
                {showFullPrompt && (
                  <pre className="text-[8px] p-2 rounded mt-1 w-full whitespace-pre-wrap font-mono" style={{ background: "rgba(255,255,255,0.03)" }}>
                    [Default Prompt]: {nodeData.defaultPrompt}
                  </pre>
                )}
              </div>
            )}
            <p className="text-[9px] leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              This prompt tells the agent what to build. It will use its tools, skills, and MCPs to generate its own implementation file.
            </p>
            <AnimatedPrompt
              value={prompt}
              onChange={handlePromptChange}
              placeholder={`e.g. "Build a REST API for user management..."`}
              minHeight={120}
              maxHeight={280}
              agentName={agent?.label}
              agentColor={agent?.color}
            />
          </div>
        )}

        {activeTab === "skills" && (
          <div className="space-y-2">
            <p className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>
              Toggle skills this agent should use
            </p>
            {availableSkills.length === 0 ? (
              <p className="text-[10px] italic opacity-50" style={{ color: "var(--muted-foreground)" }}>
                Loading skills...
              </p>
            ) : (
              <div className="space-y-1">
                {availableSkills.map((skill) => {
                  const enabled = (nodeData.selectedSkills || []).includes(skill.name);
                  return (
                    <label
                      key={skill.name}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-white/5 text-xs"
                    >
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => {
                          const current = nodeData.selectedSkills || [];
                          const next = checked
                            ? [...current, skill.name]
                            : current.filter((s) => s !== skill.name);
                          onUpdate(node.id, { selectedSkills: next });
                        }}
                        className="scale-75 origin-left"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="truncate" style={{ color: "var(--foreground)" }}>{skill.name}</div>
                        <div className="truncate text-[9px] opacity-60" style={{ color: "var(--muted-foreground)" }}>{skill.description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "mcps" && (
          <div className="space-y-2">
            <p className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>
              Toggle MCP servers this agent should use
            </p>
            {availableMcps.length === 0 ? (
              <p className="text-[10px] italic opacity-50" style={{ color: "var(--muted-foreground)" }}>
                Loading MCPs...
              </p>
            ) : (
              <div className="space-y-1">
                {availableMcps.map((mcp) => {
                  const enabled = (nodeData.selectedMcps || []).includes(mcp.name);
                  return (
                    <label
                      key={mcp.name}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-white/5 text-xs"
                    >
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => {
                          const current = nodeData.selectedMcps || [];
                          const next = checked
                            ? [...current, mcp.name]
                            : current.filter((m) => m !== mcp.name);
                          onUpdate(node.id, { selectedMcps: next });
                        }}
                        className="scale-75 origin-left"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="truncate" style={{ color: "var(--foreground)" }}>{mcp.name}</div>
                        <div className="truncate text-[9px] opacity-60" style={{ color: "var(--muted-foreground)" }}>{mcp.description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "files" && (
          <div className="space-y-2 flex flex-col h-full">
            {/* File tree — always visible */}
            <div className="flex-1 border rounded-md overflow-hidden" style={{ borderColor: "var(--border)" }}>
              <FileTreeExplorer
                projectPath={projectPath || "AI_Workflow"}
                selectedFiles={nodeData.fileRefs || []}
                onToggleFile={handleFileToggle}
                onClose={() => {}}
                pipelineId={pipelineId}
                benchmarkId={benchmarkId}
              />
            </div>
            {/* Dropzone below tree */}
            <FileUpload onFilesSelected={handleFilesUploaded} />
            {(nodeData.fileRefs || []).length > 0 && (
              <div className="space-y-1">
                <label className="text-[9px] font-medium" style={{ color: "var(--muted-foreground)" }}>
                  Referenced files ({nodeData.fileRefs.length})
                </label>
                {(nodeData.fileRefs || []).map((ref, i) => (
                  <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/5">
                    {ref.type === "folder" ? <Folder size={10} /> : <FileText size={10} />}
                    <span className="text-[10px] truncate flex-1">{ref.path}</span>
                    <button
                      onClick={() => {
                        const current = nodeData.fileRefs || [];
                        onUpdate(node.id, { fileRefs: current.filter((_, j) => j !== i) });
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
