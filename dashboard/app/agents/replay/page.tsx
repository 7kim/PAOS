"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Loader2,
  RefreshCw,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  History,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

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
  hermes: "#eab308",
  gitkraken: "#289473",
  signal: "#2dbdb6",
  dashboard: "#64748b",
};

function agentColor(agent: string): string {
  for (const [key, color] of Object.entries(agentColors)) {
    if (agent.toLowerCase().includes(key)) return color;
  }
  return "#64748b";
}

function actionIcon(action: string): string {
  const a = action.toUpperCase();
  if (a === "CREATE" || a === "C") return "＋";
  if (a === "UPDATE" || a === "U") return "✎";
  if (a === "DELETE" || a === "D") return "✕";
  if (a === "READ" || a === "R") return "○";
  if (a === "EXEC" || a === "X") return "▶";
  if (a === "COMMIT" || a === "CM") return "↻";
  if (a === "MSG" || a === "M") return "💬";
  return "•";
}

const TIME_RANGES = [
  { label: "Last 24h", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "All time", value: "all" },
] as const;

function parseTimestamp(raw: string): number {
  let d = new Date(raw.replace("Z", "").replace(" ", "T"));
  if (!isNaN(d.getTime())) return d.getTime();
  d = new Date(raw.replace(" ", "T"));
  if (!isNaN(d.getTime())) return d.getTime();
  d = new Date(raw);
  if (!isNaN(d.getTime())) return d.getTime();
  return 0;
}

function filterByTimeRange(entries: LedgerEntry[], range: string): LedgerEntry[] {
  if (range === "all") return entries;
  const now = Date.now();
  const ms = range === "24h" ? 86400000 : range === "7d" ? 604800000 : 2592000000;
  const cutoff = now - ms;
  return entries.filter((e) => parseTimestamp(e.timestamp) >= cutoff);
}

function formatTime(ts: string): string {
  const d = new Date(parseTimestamp(ts));
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(ts: string): string {
  const d = new Date(parseTimestamp(ts));
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function groupByDate(entries: LedgerEntry[]): Map<string, LedgerEntry[]> {
  const groups = new Map<string, LedgerEntry[]>();
  for (const e of entries) {
    const dateKey = formatDate(e.timestamp);
    const list = groups.get(dateKey) || [];
    list.push(e);
    groups.set(dateKey, list);
  }
  return groups;
}

function TimelineEntry({
  entry,
  isExpanded,
  onToggle,
}: {
  entry: LedgerEntry;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const color = agentColor(entry.agent);

  return (
    <div className="relative group">
      {/* Timeline connector dot */}
      <div className="absolute left-0 top-2.5 flex items-center justify-center">
        <div
          className="w-3 h-3 rounded-full border-2 z-10 transition-transform duration-150 group-hover:scale-125"
          style={{
            background: isExpanded ? color : "var(--card-bg)",
            borderColor: color,
          }}
        />
      </div>

      {/* Content card */}
      <div className="ml-7 pb-4">
        <Card
          className="cursor-pointer transition-all duration-150 border-l-2 overflow-hidden"
          style={{
            borderLeftColor: isExpanded ? color : "transparent",
          }}
          onClick={onToggle}
        >
          <CardContent className="p-3">
            {/* Header row */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="secondary"
                className="font-mono text-[10px] leading-none px-1.5 py-0.5"
                style={{
                  background: `${color}22`,
                  color: color,
                }}
              >
                {entry.agent}
              </Badge>

              <span
                className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider"
                style={{
                  background: `${color}11`,
                  color: color,
                  opacity: 0.85,
                }}
              >
                {actionIcon(entry.action)} {entry.action || "—"}
              </span>

              <span className="text-[10px] font-mono text-muted-foreground ml-auto flex items-center gap-1 shrink-0">
                <Clock size={10} />
                {formatTime(entry.timestamp)}
              </span>

              {isExpanded ? (
                <ChevronUp size={12} className="text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown size={12} className="text-muted-foreground shrink-0" />
              )}
            </div>

            {/* Description (truncated when collapsed) */}
            <div
              className="mt-1.5 text-xs leading-relaxed"
              style={{
                color: "var(--foreground)",
                opacity: isExpanded ? 1 : 0.75,
              }}
            >
              {isExpanded
                ? entry.description
                : entry.description.length > 120
                  ? entry.description.slice(0, 120) + "…"
                  : entry.description}
            </div>

            {/* Expanded details */}
            {isExpanded && (
              <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: "var(--border)" }}>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                  <div>
                    <span className="text-muted-foreground">Task</span>
                    <div className="font-mono mt-0.5">{entry.task || "—"}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Action</span>
                    <div className="font-mono mt-0.5">{entry.action || "—"}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">File(s)</span>
                    <div className="font-mono mt-0.5 break-all text-[10px]">
                      {entry.file || "—"}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Commit</span>
                    <div className="font-mono mt-0.5">{entry.commit || "—"}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Timestamp</span>
                    <div className="font-mono mt-0.5">
                      {entry.timestamp.replace("T", " ").replace("Z", "").slice(0, 19)}
                    </div>
                  </div>
                </div>

                {/* Full description */}
                <div className="pt-1">
                  <span className="text-muted-foreground text-[11px]">Full Description</span>
                  <div className="text-xs mt-0.5 leading-relaxed whitespace-pre-wrap break-words">
                    {entry.description}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AgentReplayPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [allEntries, setAllEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentFilter, setAgentFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("7d");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [agents, setAgents] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/ledger");
      const data = await res.json();
      const raw: LedgerEntry[] = data.entries ?? [];

      // Extract unique agent names
      const uniqueAgents = Array.from(new Set(raw.map((e) => e.agent))).sort();
      setAgents(uniqueAgents);

      // Track if new entries arrived (for auto-scroll hint)
      prevCountRef.current = allEntries.length;

      setAllEntries(raw);
    } catch {
      // silent
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(() => void load(), 15000);
    return () => clearInterval(id);
  }, [load]);

  // Apply filters
  useEffect(() => {
    let filtered = filterByTimeRange(allEntries, timeRange);
    if (agentFilter !== "all") {
      filtered = filtered.filter((e) => e.agent === agentFilter);
    }
    // Sort newest first
    filtered.sort((a, b) => parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp));
    setEntries(filtered);
    setExpandedIndex(null);
  }, [allEntries, agentFilter, timeRange]);

  // Group by date for the timeline
  const grouped = groupByDate(entries);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <History size={16} />
            Agent Conversation Replay
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {entries.length} event{entries.length !== 1 ? "s" : ""} · scrollable timeline
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Agent filter */}
          <div className="flex items-center gap-1.5">
            <Filter size={12} className="text-muted-foreground shrink-0" />
            <Select value={agentFilter} onValueChange={(v) => { if (v !== null) setAgentFilter(v); }}>
              <SelectTrigger className="h-7 text-[11px] w-[130px]" aria-label="Filter by agent">
                <SelectValue placeholder="All agents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All agents</SelectItem>
                {agents.map((a) => (
                  <SelectItem key={a} value={a}>
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: agentColor(a) }}
                      />
                      {a}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time range filter */}
          <Select value={timeRange} onValueChange={(v) => { if (v !== null) setTimeRange(v); }}>
            <SelectTrigger className="h-7 text-[11px] w-[110px]" aria-label="Time range">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => load()} className="h-7 gap-1 text-[11px]">
            <RefreshCw size={11} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={22} className="animate-spin opacity-50" />
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <History size={28} className="opacity-30" />
          <div className="text-xs opacity-50">
            {allEntries.length === 0
              ? "No ledger activity found"
              : "No events match the current filters"}
          </div>
          {allEntries.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-[10px]"
              onClick={() => {
                setAgentFilter("all");
                setTimeRange("all");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1">
          {Array.from(grouped.entries()).map(([date, dayEntries]) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center gap-2 mb-2 mt-4 first:mt-0">
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider px-2"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {date}
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>

              {/* Timeline column */}
              <div className="relative pl-0">
                {/* Vertical timeline line */}
                <div
                  className="absolute left-[5.5px] top-3 bottom-3 w-px"
                  style={{ background: "var(--border)", opacity: 0.5 }}
                />
                {dayEntries.map((entry, idx) => {
                  const globalIdx = entries.indexOf(entry);
                  const isExpanded = expandedIndex === globalIdx;
                  return (
                    <TimelineEntry
                      key={`${entry.timestamp}-${idx}`}
                      entry={entry}
                      isExpanded={isExpanded}
                      onToggle={() =>
                        setExpandedIndex(isExpanded ? null : globalIdx)
                      }
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {/* Bottom anchor */}
          <div ref={bottomRef} className="h-2" />
        </div>
      )}
    </div>
  );
}
