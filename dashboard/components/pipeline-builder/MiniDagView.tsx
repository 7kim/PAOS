"use client";

import { useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ReadOnlyNode } from "./ReadOnlyNode";
import type { VisualSettings } from "./VisualSettings";

const nodeTypes = { readOnlyNode: ReadOnlyNode };

// Convert hex color to rgba string
function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function MiniDagCanvas({
  nodes: inputNodes,
  edges: inputEdges,
  flowStatus,
  onNodeClick,
  expandedNode,
  visualSettings,
}: {
  nodes: any[];
  edges: any[];
  flowStatus: Record<string, any> | null;
  onNodeClick: (nodeId: string) => void;
  expandedNode: string | null;
  visualSettings?: VisualSettings;
}) {
  const vs = visualSettings;

  // Override edge styles with visual settings and smart animation
  const overriddenEdges: Edge[] = useMemo(() => {
    return (inputEdges || []).map((e: any) => {
      const srcPhase = flowStatus?.phases?.[e.source];
      const tgtPhase = flowStatus?.phases?.[e.target];
      // Animate only if source is complete and target is not yet complete (active flow)
      const shouldAnimate = vs?.edgeAnimation !== false && (
        (srcPhase?.status === "completed" && tgtPhase?.status !== "completed") ||
        (srcPhase?.status === "running" && tgtPhase?.status !== "completed")
      );
      return {
        ...e,
        type: vs?.connectorShape || e.type || "smoothstep",
        animated: shouldAnimate,
        style: {
          ...(e.style || {}),
          stroke: vs?.connectorColor || e.style?.stroke || "var(--border)",
          strokeWidth: vs?.connectorThickness || e.style?.strokeWidth || 1.5,
        },
      };
    });
  }, [inputEdges, vs?.connectorShape, vs?.connectorColor, vs?.connectorThickness, vs?.edgeAnimation, flowStatus]);

  // Enrich nodes with flow status
  const enrichedNodes: Node[] = useMemo(() => {
    return inputNodes.map((n: any) => {
      const phase = flowStatus?.phases?.[n.id];
      return {
        id: n.id,
        type: "readOnlyNode",
        position: n.position || { x: 250, y: 100 },
        data: {
          ...(n.data || {}),
          flowStatus: phase?.status,
          flowPid: phase?.pid,
          hasReasoning: !!(phase?.reasoning),
        },
        selected: expandedNode === n.id,
      };
    });
  }, [inputNodes, flowStatus, expandedNode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(enrichedNodes);
  const [edges, _setEdges, onEdgesChange] = useEdgesState(overriddenEdges);

  useEffect(() => { setNodes(enrichedNodes); }, [enrichedNodes, setNodes]);
  useEffect(() => { _setEdges(overriddenEdges); }, [overriddenEdges, _setEdges]);

  // Background with transparency
  const bgColor = vs?.backgroundColor || "var(--background)";
  const bgAlpha = vs?.backgroundOpacity !== undefined ? 1 - vs.backgroundOpacity : 1;
  const computedBg = bgColor.startsWith("#") ? hexToRgba(bgColor, bgAlpha) : bgColor;

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.2}
      maxZoom={1.5}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag={true}
      zoomOnScroll={true}
      style={{ background: computedBg }}
      onNodeClick={(_: React.MouseEvent, node: Node) => onNodeClick(node.id)}
    >
      {vs?.showGrid !== false && (
        <Background
          variant={(vs?.backgroundType as any) || BackgroundVariant.Dots}
          gap={20}
          size={1}
          style={{ color: `rgba(255,255,255,${Math.max(0.01, vs?.backgroundOpacity ?? 0.03)})` }}
        />
      )}
      <Controls
        className="!bg-[var(--card-bg)] !border-white/10 scale-75 origin-bottom-left"
        style={{ color: "var(--foreground)" }}
      />
      {vs?.showMinimap !== false && (
        <MiniMap
          nodeColor="#f0b90b"
          maskColor="rgba(0,0,0,0.3)"
          className="!bg-[var(--card-bg)] !border-white/10 scale-75 origin-bottom-right"
        />
      )}
    </ReactFlow>
  );
}

export default function MiniDagView(props: {
  nodes: any[];
  edges: any[];
  flowStatus: Record<string, any> | null;
  onNodeClick: (nodeId: string) => void;
  expandedNode: string | null;
  id: string;
  visualSettings?: VisualSettings;
}) {
  return (
    <ReactFlowProvider>
      <MiniDagCanvas {...props} />
    </ReactFlowProvider>
  );
}
