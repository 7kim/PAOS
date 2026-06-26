import type { Node, Edge } from "@xyflow/react";

export type AgentOption = {
  id: string;
  label: string;
  color: string;
};

export type SkillOption = {
  name: string;
  description: string;
};

export type McpOption = {
  name: string;
  description: string;
};

export type FileRef = {
  path: string;
  type: "file" | "folder";
  name: string;
  mode?: "read" | "edit";
};

export type AgentNodeData = {
  label: string;
  agentId: string;
  prompt: string;
  defaultPrompt?: string;
  role?: string;
  selectedSkills: string[];
  selectedMcps: string[];
  fileRefs: FileRef[];
  nodeColor?: string;
  flowStatus?: string;
  flowPid?: number;
  flowProgress?: string;
  flowOutput?: string;
};

export type AgentNodeType = Node;

export type BuilderLayout = {
  nodes: AgentNodeType[];
  edges: Edge[];
  viewport?: { x: number; y: number; zoom: number };
};

export type PipelineTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  nodes: AgentNodeType[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
};

export const AVAILABLE_AGENTS: AgentOption[] = [
  { id: "hermes-nous", label: "Hermes (Nous)", color: "#f0b90b" },
  { id: "opencode-developer", label: "OpenCode Developer", color: "#3b82f6" },
  { id: "opencode-plan", label: "OpenCode Plan", color: "#60a5fa" },
  { id: "antigravity", label: "Antigravity", color: "#ec4899" },
  { id: "claude", label: "Claude Code", color: "#f97316" },
  { id: "openclaw", label: "OpenClaw", color: "#8b5cf6" },
  { id: "ollama", label: "Ollama", color: "#22c55e" },
];
