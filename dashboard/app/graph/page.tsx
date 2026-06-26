"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw, Loader2, AlertTriangle, FileText, Link2, Unlink } from "lucide-react";

interface GraphNode {
  id: string;
  title: string;
  tags: string[];
  file: string;
  links: string[];
}

interface HealthSummary {
  totalDocs: number;
  brokenLinks: number;
  orphans: number;
  missingFrontmatter: number;
}

export default function GraphPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthSummary | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch knowledge health check
      const healthRes = await fetch("/api/knowledge/health");
      if (healthRes.ok) {
        setHealth(await healthRes.json());
      }
      // Fetch all knowledge docs from vault API
      const res = await fetch("/api/vault?type=daily&limit=50");
      await res.json();
      // Fallback: load docs via search API to discover all docs
      const searchRes = await fetch("/api/search?q=knowledge&topK=20");
      const searchData = await searchRes.json();
      
      // Build nodes from search results (they have title and path)
      const seen = new Set<string>();
      const graphNodes: GraphNode[] = [];
      
      // Add docs from search results
      for (const r of searchData.results || []) {
        const key = r.path || r.title;
        if (seen.has(key)) continue;
        seen.add(key);
        graphNodes.push({
          id: key,
          title: r.title,
          tags: ["paos"],
          file: r.path || "",
          links: [],
        });
      }
      
      // Infer links: docs that share words in title may be related
      for (let i = 0; i < graphNodes.length; i++) {
        for (let j = i + 1; j < graphNodes.length; j++) {
          const wordsA = new Set(graphNodes[i].title.toLowerCase().split(/\W+/));
          const wordsB = new Set(graphNodes[j].title.toLowerCase().split(/\W+/));
          let shared = 0;
          for (const w of wordsA) if (wordsB.has(w) && w.length > 3) shared++;
          if (shared > 0) {
            graphNodes[i].links.push(graphNodes[j].id);
            graphNodes[j].links.push(graphNodes[i].id);
          }
        }
      }
      
      setNodes(graphNodes);
    } catch { /* empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Simple force-directed layout
  const layout = useCallback(() => {
    if (nodes.length === 0) return [];
    const positions = nodes.map((_, i) => ({
      x: 200 + Math.cos((i / nodes.length) * Math.PI * 2) * 150,
      y: 200 + Math.sin((i / nodes.length) * Math.PI * 2) * 150,
    }));
    // Simple iterations
    for (let iter = 0; iter < 50; iter++) {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = positions[j].x - positions[i].x;
          const dy = positions[j].y - positions[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const repulsion = 5000 / (dist * dist);
          const hasEdge = nodes[i].links.includes(nodes[j].id);
          const attraction = hasEdge ? dist * 0.01 : 0;
          const fx = (repulsion - attraction) * (dx / dist);
          const fy = (repulsion - attraction) * (dy / dist);
          positions[i].x -= fx;
          positions[i].y -= fy;
          positions[j].x += fx;
          positions[j].y += fy;
        }
      }
    }
    return positions;
  }, [nodes]);

  const positions = layout();
  const centerX = 300, centerY = 250;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>Knowledge Graph</h1>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
            {nodes.length} documents · connected by shared keywords
          </p>
        </div>
        <button onClick={load} className="text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1"
          style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Health Summary Card */}
      {health && (
        <div
          className="mb-4 rounded-lg border p-3 grid grid-cols-4 gap-3 text-xs"
          style={{ borderColor: "var(--border)", background: "var(--card-bg)" }}
        >
          <div className="flex items-center gap-2">
            <FileText size={14} style={{ color: "var(--primary)" }} />
            <div>
              <div style={{ color: "var(--muted-foreground)" }}>Total Docs</div>
              <div className="font-semibold" style={{ color: "var(--foreground)" }}>{health.totalDocs}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link2 size={14} className={health.brokenLinks > 0 ? "" : ""}
              style={{ color: health.brokenLinks > 0 ? "#f59e0b" : "var(--muted-foreground)" }} />
            <div>
              <div style={{ color: "var(--muted-foreground)" }}>Broken Links</div>
              <div className="font-semibold"
                style={{ color: health.brokenLinks > 0 ? "#f59e0b" : "var(--foreground)" }}>
                {health.brokenLinks}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Unlink size={14} className={health.orphans > 0 ? "" : ""}
              style={{ color: health.orphans > 0 ? "#f59e0b" : "var(--muted-foreground)" }} />
            <div>
              <div style={{ color: "var(--muted-foreground)" }}>Orphans</div>
              <div className="font-semibold"
                style={{ color: health.orphans > 0 ? "#f59e0b" : "var(--foreground)" }}>
                {health.orphans}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className={health.missingFrontmatter > 0 ? "" : ""}
              style={{ color: health.missingFrontmatter > 0 ? "#ef4444" : "var(--muted-foreground)" }} />
            <div>
              <div style={{ color: "var(--muted-foreground)" }}>Missing FM</div>
              <div className="font-semibold"
                style={{ color: health.missingFrontmatter > 0 ? "#ef4444" : "var(--foreground)" }}>
                {health.missingFrontmatter}
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={20} className="animate-spin opacity-50" />
        </div>
      ) : nodes.length === 0 ? (
        <div className="text-center py-16 opacity-50 text-xs">No documents found</div>
      ) : (
        <div className="relative rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)", height: "500px" }}>
          <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 600 500" style={{ background: "var(--card-bg)" }}>
            {/* Links */}
            {nodes.map((node, i) =>
              node.links.map((targetId) => {
                const j = nodes.findIndex((n) => n.id === targetId);
                if (j === -1) return null;
                return (
                  <line
                    key={`${i}-${j}`}
                    x1={centerX + positions[i]?.x || 0}
                    y1={centerY + positions[i]?.y || 0}
                    x2={centerX + positions[j]?.x || 0}
                    y2={centerY + positions[j]?.y || 0}
                    stroke="var(--border)"
                    strokeWidth={0.5}
                    opacity={0.4}
                  />
                );
              })
            )}
            {/* Nodes */}
            {nodes.map((node, i) => {
              const x = centerX + (positions[i]?.x || 0);
              const y = centerY + (positions[i]?.y || 0);
              const isSelected = selected === node.id;
              return (
                <g key={node.id} onClick={() => setSelected(isSelected ? null : node.id)} style={{ cursor: "pointer" }}>
                  <circle
                    cx={x} cy={y} r={isSelected ? 10 : 7}
                    fill={isSelected ? "var(--primary)" : "color-mix(in srgb, var(--primary) 60%, transparent)"}
                    stroke={isSelected ? "var(--primary)" : "var(--border)"}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  <text x={x} y={y + 18} textAnchor="middle" fontSize={9}
                    fill={isSelected ? "var(--foreground)" : "var(--muted-foreground)"}
                    fontWeight={isSelected ? 600 : 400}>
                    {node.title.length > 20 ? node.title.slice(0, 18) + "..." : node.title}
                  </text>
                </g>
              );
            })}
          </svg>
          {selected && (
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg border text-xs"
              style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
              <strong>{nodes.find((n) => n.id === selected)?.title}</strong>
              <div style={{ color: "var(--muted-foreground)" }} className="mt-1">
                {nodes.find((n) => n.id === selected)?.file}
              </div>
              <div className="mt-1 flex gap-1 flex-wrap">
                {nodes.find((n) => n.id === selected)?.links.slice(0, 5).map((l) => (
                  <span key={l} className="text-[9px] px-1.5 py-0.5 rounded"
                    style={{ background: "color-mix(in srgb, var(--primary) 15%, transparent)", color: "var(--primary)" }}>
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
