"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  ReactFlowProvider,
  Panel,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Save, Download, Upload, Trash2, Play, X, Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentNode } from "./AgentNode";
import { NodePalette } from "./NodePalette";
import { ConfigPanel } from "./ConfigPanel";
import type { AgentNodeData, AgentNodeType, SkillOption, McpOption, BuilderLayout, PipelineTemplate } from "./types";
import type { BuilderSettings } from "./BuilderSettings";
import type { VisualSettings } from "./VisualSettings";

const nodeTypes = { agentNode: AgentNode };

const defaultEdgeOptions = {
  style: { stroke: "var(--border)", strokeWidth: 2 },
  type: "smoothstep",
  animated: true,
};

interface FlowBuilderProps {
  initialLayout?: BuilderLayout;
  onSave: (layout: BuilderLayout) => void;
  settings?: BuilderSettings;
  liveZoom?: number;
  templateToLoad?: PipelineTemplate | null;
  visualSettings?: VisualSettings;
  projectPath?: string;
}

function FlowCanvas({ initialLayout, onSave, settings, liveZoom, templateToLoad, visualSettings, projectPath }: FlowBuilderProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nodes, setNodes, onNodesChange] = useNodesState(initialLayout?.nodes as any || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialLayout?.edges || []);
  const [selectedNode, setSelectedNode] = useState<AgentNodeType | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [edgeActionsPos, setEdgeActionsPos] = useState<{ x: number; y: number } | null>(null);
  const [availableSkills, setAvailableSkills] = useState<SkillOption[]>([]);
  const [availableMcps, setAvailableMcps] = useState<McpOption[]>([]);
  const [flowStatus, setFlowStatus] = useState<Record<string, any> | null>(null);
  const [savedPipelineId, setSavedPipelineId] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const reactFlowInstance = useReactFlow();
  const nodeCounter = useRef(0);

  // Load available skills and MCPs
  useEffect(() => {
    fetch("/api/skills")
      .then((r) => r.json())
      .then((data) => setAvailableSkills(data.skills || []))
      .catch(() => setAvailableSkills([]));

    fetch("/api/mcp-servers")
      .then((r) => r.json())
      .then((data) => setAvailableMcps(data.servers || []))
      .catch(() => setAvailableMcps([]));
  }, []);

  // Apply live zoom changes from the settings slider
  useEffect(() => {
    if (liveZoom !== undefined && liveZoom > 0) {
      reactFlowInstance.zoomTo(liveZoom, { duration: 150 });
    }
  }, [liveZoom, reactFlowInstance]);

  // Set savedPipelineId from loaded template
  useEffect(() => {
    if (initialLayout && (templateToLoad as any)?.id?.startsWith("PIPE-")) {
      setSavedPipelineId((templateToLoad as any).id);
    }
  }, [initialLayout, templateToLoad]);

  // Load template onto canvas
  useEffect(() => {
    if (templateToLoad && templateToLoad.nodes) {
      setNodes(templateToLoad.nodes);
      setEdges(templateToLoad.edges || []);
    }
  }, [templateToLoad, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node as AgentNodeType);
      setSelectedEdge(null);
      setEdgeActionsPos(null);
    },
    []
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      setSelectedEdge(edge.id);
      setEdgeActionsPos({ x: _.clientX, y: _.clientY });
      setSelectedNode(null);
    },
    []
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
    setEdgeActionsPos(null);
  }, []);

  const deleteSelectedEdge = useCallback(() => {
    if (!selectedEdge) return;
    setEdges((eds) => eds.filter((e) => e.id !== selectedEdge));
    setSelectedEdge(null);
    setEdgeActionsPos(null);
  }, [selectedEdge, setEdges]);

  const updateNodeData = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, ...data } }
            : n
        )
      );
      setSelectedNode((prev) =>
        prev?.id === nodeId
          ? { ...prev, data: { ...prev.data, ...data } }
          : prev
      );
    },
    [setNodes]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNode(null);
    },
    [setNodes, setEdges]
  );

  const addAgentNode = useCallback(
    (agentId?: string) => {
      nodeCounter.current += 1;
      const id = `agent-${Date.now()}-${nodeCounter.current}`;
      const targetAgent = agentId || settings?.defaultAgent || "opencode-developer";
      const position = reactFlowInstance.screenToFlowPosition({
        x: window.innerWidth / 2 + Math.random() * 100 - 50,
        y: 200 + nodeCounter.current * 120,
      });

      const newNode: AgentNodeType = {
        id,
        type: "agentNode",
        position,
        data: {
          label: `${settings?.nodeLabelPrefix || "Layer"} ${nodeCounter.current}`,
          agentId: targetAgent,
          prompt: "",
          selectedSkills: [],
          selectedMcps: [],
          fileRefs: [],
        },
      };

      setNodes((nds) => {
        const next = [...nds, newNode];

        // Auto-connect from last node if enabled
        if (settings?.autoConnect && nds.length > 0) {
          const lastNode = nds[nds.length - 1];
          setEdges((eds) => [
            ...eds,
            {
              id: `e-${lastNode.id}-${newNode.id}`,
              source: lastNode.id,
              target: newNode.id,
              type: "smoothstep",
              animated: true,
              style: { stroke: "var(--border)", strokeWidth: 2 },
            },
          ]);
        }

        return next;
      });
    },
    [reactFlowInstance, setNodes, setEdges, settings]
  );

  const handleExecuteFlow = useCallback(async () => {
    if (nodes.length === 0) return;
    setExecuting(true);

    // First save the pipeline
    const viewport = reactFlowInstance.getViewport();
    const layout: BuilderLayout = { nodes: nodes as any, edges: edges as any, viewport: { x: viewport.x, y: viewport.y, zoom: viewport.zoom } };

    try {
      const saveRes = await fetch("/api/pipelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: "PAOS",
          prompt: "Pipeline from Flow Builder",
          builderLayout: layout,
        }),
      });
      const saveData = await saveRes.json();
      if (!saveData.ok && !saveData.id) {
        alert("Failed to save pipeline: " + (saveData.error || "Unknown"));
        setExecuting(false);
        return;
      }

      const pipelineId = saveData.id;
      setSavedPipelineId(pipelineId);

      // Now execute the flow
      const execRes = await fetch(`/api/pipelines/${pipelineId}/execute-flow`, {
        method: "POST",
      });
      const execData = await execRes.json();
      if (!execData.ok) {
        alert("Execute failed: " + (execData.error || "Unknown"));
        setExecuting(false);
        return;
      }

      // Start polling for status
      const interval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/pipelines/${pipelineId}/flow-status`);
          const statusData = await statusRes.json();
          const phases = statusData.phases || {};
          setFlowStatus(phases);
          // Update node data with status, pid, output preview
          setNodes((nds) =>
            nds.map((n) => {
              const phase = phases[n.id];
              if (phase) {
                return {
                  ...n,
                  data: {
                    ...n.data,
                    flowStatus: phase.status,
                    flowPid: phase.pid,
                    flowProgress: phase.progress,
                    flowOutput: phase.outputPreview || "",
                  },
                };
              }
              return n;
            })
          );

          // Check if all done
          const allDone = Object.values(phases).every((p: any) =>
            p.status === "completed" || p.status === "failed" || p.status === "skipped"
          );
          if (allDone) {
            clearInterval(interval);
            setExecuting(false);
          }
        } catch { /* poll failed, retry */ }
      }, 2000);

    } catch (e) {
      alert("Failed to execute flow: " + String(e));
      setExecuting(false);
    }
  }, [nodes, edges, reactFlowInstance]);

  const handleSave = useCallback(() => {
    const viewport = reactFlowInstance.getViewport();
    const layout: BuilderLayout = {
      nodes: nodes as AgentNodeType[],
      edges,
      viewport: { x: viewport.x, y: viewport.y, zoom: viewport.zoom },
    };
    onSave(layout);
  }, [nodes, edges, reactFlowInstance, onSave]);

  const handleExport = useCallback(() => {
    const layout: BuilderLayout = {
      nodes: nodes as AgentNodeType[],
      edges,
      viewport: reactFlowInstance.getViewport(),
    };
    const blob = new Blob([JSON.stringify(layout, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pipeline-layout.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges, reactFlowInstance]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const layout: BuilderLayout = JSON.parse(text);
        setNodes(layout.nodes || []);
        setEdges(layout.edges || []);
      } catch {
        alert("Invalid pipeline layout file");
      }
    };
    input.click();
  }, [setNodes, setEdges]);

  return (
    <div className="flex h-full">
      {/* Left palette */}
      <NodePalette onAddNode={addAgentNode} />

      {/* Canvas area */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{
            style: {
              stroke: visualSettings?.connectorColor || "var(--border)",
              strokeWidth: visualSettings?.connectorThickness || 2,
            },
            type: visualSettings?.connectorShape || "smoothstep",
            animated: visualSettings?.edgeAnimation ?? true,
          }}
          fitView
          fitViewOptions={{ padding: 0.3, maxZoom: visualSettings?.defaultZoom ?? settings?.defaultZoom ?? 0.75 }}
          minZoom={0.1}
          snapToGrid={settings?.snapToGrid ?? false}
          snapGrid={[20, 20]}
          deleteKeyCode="Delete"
          selectionKeyCode="Shift"
          multiSelectionKeyCode="Control"
          style={{ background: "var(--background)" }}
        >
          {visualSettings?.showGrid ?? settings?.showGrid !== false ? (
            <Background
              variant={(visualSettings?.backgroundType as any) || BackgroundVariant.Dots}
              gap={20}
              size={1}
              style={{ color: `rgba(255,255,255,${visualSettings?.backgroundOpacity ?? 0.03})` }}
            />
          ) : null}
          <Controls
            className="!bg-[var(--card-bg)] !border-white/10"
            style={{ color: "var(--foreground)" }}
          />
          {settings?.showMinimap !== false && (
            <MiniMap
              nodeColor="#f0b90b"
              maskColor="rgba(0,0,0,0.3)"
              className="!bg-[var(--card-bg)] !border-white/10"
            />
          )}
          <Panel position="top-right">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleSave}
                className="text-xs gap-1.5"
              >
                <Save size={12} />
                Save
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={handleExecuteFlow}
                className="text-xs gap-1.5"
                disabled={nodes.length === 0 || executing}
                style={{ background: executing ? "#3b82f6" : nodes.length > 0 ? "var(--green, #22c55e)" : undefined }}
              >
                {executing ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                {executing ? "Executing..." : "Execute Flow"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExport}
                className="text-xs gap-1.5"
              >
                <Download size={12} />
                Export
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleImport}
                className="text-xs gap-1.5"
              >
                <Upload size={12} />
                Import
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { setNodes([]); setEdges([]); nodeCounter.current = 0; }}
                className="text-xs text-red-400 hover:text-red-300 gap-1.5"
              >
                <Trash2 size={12} />
                Clear
              </Button>
            </div>
          </Panel>
        </ReactFlow>

        {/* Edge action popup */}
        {selectedEdge && edgeActionsPos && (
          <div
            className="absolute z-20 flex items-center gap-1.5 px-2 py-1.5 rounded-lg shadow-lg border"
            style={{
              left: edgeActionsPos.x - 60,
              top: edgeActionsPos.y - 40,
              background: "var(--card-bg)",
              borderColor: "var(--border)",
            }}
          >
            <span className="text-[9px] font-mono truncate max-w-[100px]" style={{ color: "var(--muted-foreground)" }}>
              {selectedEdge.slice(0, 20)}
            </span>
            <button
              type="button"
              onClick={deleteSelectedEdge}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-colors hover:bg-red-500/20"
              style={{ color: "#ef4444" }}
            >
              <X size={10} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Right config panel */}
      <ConfigPanel
        node={selectedNode}
        onUpdate={updateNodeData}
        onDelete={deleteNode}
        availableSkills={availableSkills}
        availableMcps={availableMcps}
        pipelineId={savedPipelineId || undefined}
        projectPath={projectPath}
      />
    </div>
  );
}

export function PipelineCanvas(props: FlowBuilderProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvas {...props} />
    </ReactFlowProvider>
  );
}