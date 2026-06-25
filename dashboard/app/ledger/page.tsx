"use client";
import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { X, ArrowUpDown, FolderKanban, RefreshCw, Eye, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getViewAll } from "@/lib/viewAll";
import { getActiveProject } from "@/lib/activeProject";

interface LedgerEntry {
  timestamp: string;
  agent: string;
  action: string;
  file: string;
  description: string;
  task: string;
  commit: string;
}

const agentColors: Record<string, string> = {
  claude: "#f97316",
  "opencode-developer": "#3b82f6",
  "opencode-plan": "#60a5fa",
  "opencode-architect": "#818cf8",
  "opencode-coordinator": "#2563eb",
  opencode: "#3b82f6",
  codex: "#10b981",
  openclaw: "#8b5cf6",
  ollama: "#22c55e",
  antigravity: "#ec4899",
  "antigravity-ide": "#f472b6",
  gemini: "#4285f4",
  gitkraken: "#289473",
  hermes: "#eab308",
  dashboard: "#64748b",
};

function agentColor(agent: string) {
  for (const [key, color] of Object.entries(agentColors)) {
    if (agent.toLowerCase().includes(key)) return color;
  }
  return "#64748b";
}

function LedgerTable({ entries, emptyMsg = "No entries" }: { entries: LedgerEntry[]; emptyMsg?: string }) {
  const [selected, setSelected] = useState<LedgerEntry | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...entries].sort((a, b) => {
    const cmp = a.timestamp.localeCompare(b.timestamp);
    return sortAsc ? cmp : -cmp;
  });

  function toggle(entry: LedgerEntry) {
    setSelected((prev) =>
      prev?.timestamp === entry.timestamp && prev?.description === entry.description ? null : entry
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="cursor-pointer select-none" onClick={() => setSortAsc((p) => !p)}>
            <span className="flex items-center gap-1">
              <ArrowUpDown size={11} />
              Timestamp {sortAsc ? "↑" : "↓"}
            </span>
          </TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Task</TableHead>
          <TableHead>File</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">{emptyMsg}</TableCell>
          </TableRow>
        )}
        {sorted.map((e, i) => {
          const isSelected = selected?.timestamp === e.timestamp && selected?.description === e.description;
          return (
            <>
              <TableRow
                key={i}
                onClick={() => toggle(e)}
                className="cursor-pointer"
                style={{
                  background: isSelected ? "rgba(252,213,53,0.06)" : undefined,
                  borderLeft: isSelected ? "2px solid var(--accent)" : "2px solid transparent",
                }}
              >
                <TableCell className="text-xs font-mono whitespace-nowrap text-muted-foreground">
                  {e.timestamp.replace("T", " ").replace("Z", "").slice(0, 19)}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono text-xs"
                    style={{ background: `${agentColor(e.agent)}22`, color: agentColor(e.agent) }}
                  >{e.agent}</Badge>
                </TableCell>
                <TableCell><span className="text-xs font-mono text-muted-foreground">{e.action}</span></TableCell>
                <TableCell className="text-sm max-w-xs truncate">{e.description}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{e.task}</TableCell>
                <TableCell className="text-xs font-mono truncate max-w-[12rem] text-muted-foreground">{e.file}</TableCell>
              </TableRow>
              {isSelected && (
                <TableRow key={`${i}-detail`}>
                  <TableCell colSpan={6} className="p-0">
                    <div className="px-5 py-4" style={{ background: "rgba(252,213,53,0.04)", borderColor: "var(--border)" }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold" style={{ color: "var(--primary)" }}>Entry Detail</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(null)} className="h-6 w-6 p-0">
                          <X size={13} />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                        <div><div className="mb-0.5 text-muted-foreground">Timestamp</div><div className="font-mono">{e.timestamp}</div></div>
                        <div><div className="mb-0.5 text-muted-foreground">Agent</div><div className="font-medium" style={{ color: agentColor(e.agent) }}>{e.agent}</div></div>
                        <div><div className="mb-0.5 text-muted-foreground">Action</div><div className="font-mono">{e.action || "—"}</div></div>
                        <div><div className="mb-0.5 text-muted-foreground">Task</div><div className="font-mono">{e.task || "—"}</div></div>
                        <div><div className="mb-0.5 text-muted-foreground">Commit</div><div className="font-mono">{e.commit || "—"}</div></div>
                      </div>
                      {e.file && (<div className="mb-2"><div className="text-xs mb-0.5 text-muted-foreground">File(s)</div><div className="text-xs font-mono break-all">{e.file}</div></div>)}
                      <div><div className="text-xs mb-0.5 text-muted-foreground">Description</div><div className="text-sm leading-relaxed break-words">{e.description}</div></div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          );
        })}
      </TableBody>
    </Table>
    </div>
  );
}

export default function LedgerPageWrapper() {
  return (
    <Suspense fallback={<div className="text-xs text-center py-12 text-muted-foreground">Loading...</div>}>
      <LedgerPage />
    </Suspense>
  );
}

function LedgerPage() {
  const searchParams = useSearchParams();
  const urlProject = searchParams?.get("project") || "";
  const viewAll = getViewAll();
  const [allLedgers, setAllLedgers] = useState<Record<string, { entries: LedgerEntry[] }> | null>(null);
  const [singleEntries, setSingleEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const activeProject = getActiveProject();

    if (viewAll && !urlProject) {
      // View All mode — fetch all project ledgers + global
      const res = await fetch("/api/ledger?all=true");
      const data = await res.json();
      setAllLedgers(data.all ?? null);
      setSingleEntries([]);
    } else if (urlProject || (!viewAll && activeProject)) {
      // Specific project — URL param wins, then active project
      const project = urlProject || activeProject || "";
      const res = await fetch(`/api/ledger?project=${encodeURIComponent(project)}`);
      const data = await res.json();
      setSingleEntries(data.entries ?? []);
      setAllLedgers(null);
    } else {
      // Fallback: global ledger
      const res = await fetch("/api/ledger");
      const data = await res.json();
      setSingleEntries(data.entries ?? []);
      setAllLedgers(null);
    }
    setLoading(false);
  }, [viewAll, urlProject]);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 15000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => load()} className="ml-auto gap-1.5 text-xs">
          <RefreshCw size={12} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      ) : viewAll && allLedgers ? (
        <div className="grid grid-cols-1 gap-4">
          {/* Global ledger card */}
          {allLedgers["__global__"] && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe size={14} />
                  Global Ledger
                  <span className="text-xs font-normal text-muted-foreground ml-auto">
                    {allLedgers["__global__"].entries.length} entries
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-auto max-h-[50vh]">
                <LedgerTable entries={allLedgers["__global__"].entries} emptyMsg="No global ledger entries" />
              </CardContent>
            </Card>
          )}
          {/* Project ledger cards */}
          {Object.entries(allLedgers)
            .filter(([key]) => key !== "__global__")
            .sort()
            .map(([proj, data]) => (
              <Card key={proj}>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FolderKanban size={14} />
                    {proj} Ledger
                    <span className="text-xs font-normal text-muted-foreground ml-auto">
                      {data.entries.length} entries
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-auto max-h-[50vh]">
                  <LedgerTable entries={data.entries} emptyMsg={`No entries for ${proj}`} />
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              {urlProject ? <><FolderKanban size={14} /> {urlProject} Ledger</> : !viewAll && getActiveProject() ? <><FolderKanban size={14} /> {getActiveProject()} Ledger</> : <><Globe size={14} /> Global Ledger</>}
              <span className="text-xs font-normal text-muted-foreground ml-auto">{singleEntries.length} entries</span>
            </CardTitle>
            <CardDescription className="text-xs">All agent actions — click any row to expand</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-auto max-h-[70vh]">
            <LedgerTable entries={singleEntries} emptyMsg="No ledger entries yet" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
