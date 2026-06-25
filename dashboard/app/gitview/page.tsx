"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronRight, ExternalLink, FileCode, GitCommit, GitGraph,
  Search, Terminal, Layout, FolderTree, Eye, Layers
} from "lucide-react";
import { formatTime } from "@/lib/settings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface Agent {
  id: string;
  name: string;
  email: string;
}

interface Commit {
  hash: string;
  author_name: string;
  author_email: string;
  date: string;
  message: string;
  graph: string | null;
}

interface CommitDetail {
  hash: string;
  author: string;
  email: string;
  date: string;
  message: string;
  messageShort: string;
  diff: string;
  files: { status: string; path: string }[];
  tree: { path: string; type: string }[];
}

const GK_COLOR = "#289473";

const agentColors: Record<string, string> = {
  claude: "#f97316",
  "opencode-developer": "#3b82f6",
  "opencode-plan": "#60a5fa",
  openclaw: "#8b5cf6",
  ollama: "#22c55e",
  antigravity: "#ec4899",
  dashboard: "#64748b",
};

function agentColor(agent: string) {
  for (const [key, color] of Object.entries(agentColors)) {
    if (agent.toLowerCase().includes(key)) return color;
  }
  return "#64748b";
}

const statusColors: Record<string, string> = {
  A: "var(--green)",
  M: GK_COLOR,
  D: "var(--red)",
  R: "#a855f7",
  C: "#3b82f6",
};

function parseDiff(diff: string) {
  const chunks: { file: string; oldLines: string[]; newLines: string[] }[] = [];
  let currentFile = "";
  let oldLines: string[] = [];
  let newLines: string[] = [];

  const lines = diff.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("diff --git")) {
      if (currentFile) {
        chunks.push({ file: currentFile, oldLines, newLines });
        oldLines = [];
        newLines = [];
      }
      currentFile = line.match(/ a(.*) b(.*)/)?.[1] || "unknown";
      continue;
    }
    if (line.startsWith("+++ b")) {
      currentFile = line.match(/\+\+\+ b(.*)/)?.[1] || currentFile;
      continue;
    }
    if (line.startsWith("@@")) {
      continue;
    }
    if (line.startsWith("-")) {
      oldLines.push(line.slice(1));
    } else if (line.startsWith("+")) {
      newLines.push(line.slice(1));
    } else {
      oldLines.push(line);
      newLines.push(line);
    }
  }
  if (currentFile) {
    chunks.push({ file: currentFile, oldLines, newLines });
  }
  return chunks;
}

function GitViewPage({
  selectedAgent,
  setSelectedAgent,
  query,
  setQuery
}: {
  selectedAgent: string;
  setSelectedAgent: (a: string) => void;
  query: string;
  setQuery: (q: string) => void;
}) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedHash, setSelectedHash] = useState<string | null>(null);
  const [detail, setDetail] = useState<CommitDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailTab, setDetailTab] = useState<"diff" | "files" | "details">("diff");
  const [selectedTreeFile, setSelectedTreeFile] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ max: "50" });
    if (selectedAgent && selectedAgent !== "all") params.set("agent", selectedAgent);
    if (query) params.set("q", query);
    const res = await fetch(`/api/gitview?${params}`);
    const data = await res.json();
    setCommits(data.commits ?? []);
    if (data.agents) setAgents(data.agents);
    setLoading(false);
  }, [selectedAgent, query]);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 60000);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => {
    if (!selectedHash) { setDetail(null); return; }
    fetch(`/api/gitview?commit=${selectedHash}`)
      .then((r) => r.json())
      .then((d) => setDetail(d))
      .catch(() => setDetail(null));
  }, [selectedHash]);

  // Scroll diff to selected tree file
  useEffect(() => {
    if (!selectedTreeFile || detailTab !== "diff") return;
    const id = `diff-${selectedTreeFile.replace(/[^a-zA-Z0-9]/g, "-")}`;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedTreeFile, detailTab]);

  function shortHash(h: string) {
    return h?.substring(0, 8) ?? "";
  }

  function timeAgo(iso: string) {
    return formatTime(iso);
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full overflow-hidden">
      <div className="w-full md:w-96 shrink-0 flex flex-col gap-3">
        {/* Agent selector + repo info header */}
        <div className="flex items-center gap-2">
          <Select
            value={selectedAgent}
            onValueChange={(v: string | null) => { if (v !== null) { setSelectedAgent(v); setSelectedHash(null); } }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All agents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All agents</SelectItem>
              {agents.filter((a, i, arr) => arr.findIndex((x) => x.email === a.email) === i).map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-[10px] shrink-0">
            GitKraken MCP
          </Badge>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commits..."
            className="w-full rounded-md border border-input bg-card py-1.5 pl-8 pr-3 text-xs text-foreground"
          />
        </div>

        {/* Commit list card */}
        <Card className="flex-1 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm">Commits</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {loading && commits.length === 0 && (
                <div className="p-4 space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  ))}
                </div>
              )}
              {!loading && commits.length === 0 && (
                <div className="p-4 text-xs text-center text-muted-foreground">No commits found</div>
              )}
              {commits.map((c) => (
                <button
                  key={c.hash}
                  onClick={() => setSelectedHash(c.hash)}
                  className="w-full text-left p-2 border-b hover:bg-muted/50 transition-colors"
                  style={{
                    borderLeft: selectedHash === c.hash ? `2px solid ${GK_COLOR}` : "2px solid transparent",
                    background: selectedHash === c.hash ? `${GK_COLOR}0d` : undefined,
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] shrink-0">{shortHash(c.hash)}</span>
                    <Badge variant="outline" className="text-[9px] px-1 py-0">{timeAgo(c.date)}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] shrink-0" style={{ color: agentColor(c.author_name) }}>{c.author_name}</span>
                    <p className="text-xs truncate text-foreground/70">{c.message}</p>
                  </div>
                </button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-3 overflow-hidden">
        {!detail ? (
          <div className="rounded-lg border h-full flex flex-col items-center justify-center text-sm gap-3 bg-card text-muted-foreground">
            <GitGraph size={40} className="opacity-20" style={{ color: GK_COLOR }} />
            <div className="text-center">
              <p>Select a commit to view diff</p>
              <p className="text-xs mt-1">Powered by GitKraken MCP — 29 tools for AI agents</p>
            </div>
          </div>
        ) : (
          <Card className="h-full flex flex-col overflow-hidden">
            <CardHeader>
              <CardTitle className="font-mono text-sm">{shortHash(selectedHash!)}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col gap-3 p-4">
              {/* Commit summary */}
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs" style={{ color: GK_COLOR }}>{detail.hash}</span>
                  <span className="text-xs text-muted-foreground">by</span>
                  <span className="text-xs font-medium">{detail.author}</span>
                  <span className="text-xs ml-auto text-muted-foreground">{detail.date}</span>
                </div>
                <div className="text-sm font-medium">{detail.messageShort}</div>
              </div>

              {/* Tree view + tabbed content */}
              <div className="flex-1 overflow-hidden flex gap-3">
                {/* Tree view sidebar */}
                <div className="w-64 shrink-0 rounded-lg border bg-card overflow-hidden flex flex-col">
                  <div className="px-3 py-2 border-b text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
                    <FolderTree size={12} />
                    Tree View
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {detail.tree.map((f) => (
                      <div
                        key={f.path}
                        className="text-[10px] font-mono truncate px-2 py-0.5 rounded hover:bg-muted cursor-pointer text-muted-foreground"
                        onClick={() => {
                          setSelectedTreeFile(f.path);
                          setDetailTab("diff");
                        }}
                      >
                        {f.path}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tabbed content area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="rounded-lg border bg-card overflow-hidden flex flex-col h-full">
                    <div className="border-b flex">
                      {(["diff", "files", "details"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setDetailTab(t)}
                          className="px-4 py-2 text-xs capitalize transition-colors"
                          style={{
                            color: detailTab === t ? "var(--primary)" : undefined,
                            borderBottom: detailTab === t ? "2px solid var(--accent)" : "2px solid transparent",
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="flex-1 overflow-auto p-0">
                      {detailTab === "diff" && (
                        <div className="font-mono text-[11px] leading-tight">
                          {parseDiff(detail.diff).map((chunk, i) => (
                            <div key={i} className="mb-4">
                              <div id={`diff-${chunk.file.replace(/[^a-zA-Z0-9]/g, "-")}`} className="px-3 py-1 bg-black/30 border-b text-[10px] font-bold flex items-center gap-2">
                                <FileCode size={10} />
                                {chunk.file}
                              </div>
                              <div className="grid grid-cols-2 gap-0 border-b">
                                <div className="border-r">
                                  {chunk.oldLines.map((line, li) => (
                                    <div key={li} className="flex px-2 py-0.5 whitespace-pre" style={{ background: line.startsWith("-") ? "rgba(239, 68, 68, 0.1)" : "transparent", color: line.startsWith("-") ? "#ef4444" : undefined }}>
                                      <span className="w-6 shrink-0 text-right opacity-30 mr-2">{li + 1}</span>
                                      {line}
                                    </div>
                                  ))}
                                </div>
                                <div className="bg-black/10">
                                  {chunk.newLines.map((line, li) => (
                                    <div key={li} className="flex px-2 py-0.5 whitespace-pre" style={{ background: line.startsWith("+") ? "rgba(34, 197, 94, 0.1)" : "transparent", color: line.startsWith("+") ? "#22c55e" : undefined }}>
                                      <span className="w-6 shrink-0 text-right opacity-30 mr-2">{li + 1}</span>
                                      {line}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {detailTab === "files" && (
                        <div className="p-4 space-y-2">
                          {detail.files.map((f) => (
                            <div key={f.path} className="flex items-center gap-2 p-2 rounded-md border bg-card">
                              <span className="font-mono text-[10px] w-5 text-center" style={{ color: statusColors[f.status] || undefined }}>
                                {f.status}
                              </span>
                              <span className="text-xs font-mono truncate">{f.path}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {detailTab === "details" && (
                        <div className="p-4 space-y-4">
                          <div>
                            <div className="text-xs mb-1 text-muted-foreground">Full Message</div>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">{detail.message}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs mb-1 text-muted-foreground">Author</div>
                              <div className="text-sm font-medium">{detail.author}</div>
                            </div>
                            <div>
                              <div className="text-xs mb-1 text-muted-foreground">Email</div>
                              <div className="text-xs font-mono">{detail.email}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function CodebaseVisualizer() {
  const [data, setData] = useState<Record<string, { size: number; files: number }> | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDir, setSelectedDir] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/gitview?visualize=true`);
    const d = await res.json();
    setData(d.map ?? null);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Analyzing codebase...</div>;
  if (!data) return <div className="p-8 text-center text-sm text-muted-foreground">No data available</div>;

  const sortedDirs = Object.entries(data)
    .filter(([path]) => path.split("/").length <= 3)
    .sort((a, b) => b[1].files - a[1].files)
    .slice(0, 20);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Layout size={20} style={{ color: GK_COLOR }} />
        <h2 className="text-xl font-semibold">Codebase Map</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedDirs.map(([path, stats]) => (
          <div
            key={path}
            onClick={() => setSelectedDir(path)}
            className="rounded-lg border p-4 cursor-pointer transition-all hover:border-accent bg-card"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono truncate text-muted-foreground">{path}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${GK_COLOR}18`, color: GK_COLOR }}>
                {stats.files} files
              </span>
            </div>
            <div className="text-lg font-bold">
              {stats.files} <span className="text-xs font-normal opacity-50">entities</span>
            </div>
            <div className="w-full h-1 bg-black/20 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full transition-all"
                style={{ width: `${Math.min(100, (stats.files / 100) * 100)}%`, background: GK_COLOR }}
              />
            </div>
          </div>
        ))}
      </div>
      {selectedDir && (
        <div className="rounded-lg border p-4 mt-6 bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Details: {selectedDir}</h3>
            <button onClick={() => setSelectedDir(null)} className="text-xs text-muted-foreground">Close</button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-black/20">
              <div className="text-xs text-muted-foreground">Total Files</div>
              <div className="text-xl font-bold">{data[selectedDir].files}</div>
            </div>
            <div className="p-3 rounded-lg bg-black/20">
              <div className="text-xs text-muted-foreground">Complexity</div>
              <div className="text-xl font-bold">Medium</div>
            </div>
            <div className="p-3 rounded-lg bg-black/20">
              <div className="text-xs text-muted-foreground">Depth</div>
              <div className="text-xl font-bold">{selectedDir.split("/").length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GitViewWrapper() {
  const [activeTab, setActiveTab] = useState<"commits" | "visualize">("commits");
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <GitGraph size={20} style={{ color: GK_COLOR }} />
            <h1 className="text-xl font-semibold">Git View</h1>
          </div>
          <div className="flex bg-muted rounded-lg p-1 border">
            {(["commits", "visualize"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className="px-3 py-1 text-xs rounded-md transition-all"
                style={{
                  background: activeTab === t ? GK_COLOR : "transparent",
                  color: activeTab === t ? "white" : undefined,
                  fontWeight: activeTab === t ? 600 : 400,
                }}
              >
                {t === "commits" ? "Commit History" : "Codebase Map"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">
            Powered by GitKraken MCP
          </Badge>
        </div>
      </div>

      {activeTab === "commits" ? (
        <GitViewPage
          selectedAgent={selectedAgent}
          setSelectedAgent={setSelectedAgent}
          query={query}
          setQuery={setQuery}
        />
      ) : (
        <CodebaseVisualizer />
      )}
    </div>
  );
}
