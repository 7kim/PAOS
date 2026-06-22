"use client";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock, Inbox, Search, TriangleAlert, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Check {
  name: string;
  ok: boolean;
  detail: unknown;
}

interface Agent {
  id: string;
  label: string;
  role: string;
  color: string;
  inbox: number;
  lastActivity: string | null;
  recentLog: string;
  status: string;
  riskLevel: string;
  binary: string;
  mcpServers: string[];
  checks: Check[];
}

import { formatTime } from "@/lib/settings";

function timeAgo(iso: string | null) {
  return formatTime(iso ?? "");
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/agents");
    const data = await res.json();
    setAgents(data.agents ?? []);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void load());
    const id = setInterval(() => void load(), 30000);
    return () => clearInterval(id);
  }, [load]);

  const filtered = agents.filter((agent) => {
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    const haystack = `${agent.id} ${agent.label} ${agent.role} ${agent.binary}`.toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  });
  const selected = agents.find((agent) => agent.id === selectedId) ?? filtered[0] ?? null;
  const healthyCount = agents.filter((agent) => agent.status === "healthy").length;

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold mb-1">Agents</h1>
          <p className="text-sm text-muted-foreground">
            Registry-backed health, identity, MCP, inbox, and runtime checks
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "healthy", "configured", "mcp_missing", "binary_missing"].map((status) => (
            <Button
              key={status}
              onClick={() => setStatusFilter(status)}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              className="text-xs"
            >
              {status.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 mb-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-normal">Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{agents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-normal">Healthy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">{healthyCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-normal">Degraded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-semibold font-mono ${agents.length === healthyCount ? "text-green-600" : "text-red-600"}`}>
              {agents.length - healthyCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search agents, roles, binaries..."
          className="w-full pl-9"
        />
      </div>

      {agents.length === 0 ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((agent) => (
              <Card
                key={agent.id}
                className={`cursor-pointer transition-colors ${selected?.id === agent.id ? "border-yellow-500" : "hover:border-primary/50"}`}
                onClick={() => setSelectedId(agent.id)}
              >
                <CardHeader className="flex flex-row items-center gap-3 pb-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: agent.color }} />
                  <div className="min-w-0">
                    <CardTitle className="text-sm font-medium">{agent.label}</CardTitle>
                    <CardDescription className="text-xs font-mono">{agent.id}</CardDescription>
                  </div>
                  {agent.status === "healthy" ? (
                    <CheckCircle2 size={15} className="ml-auto text-green-600" />
                  ) : (
                    <TriangleAlert size={15} className="ml-auto text-yellow-500" />
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs line-clamp-2 text-muted-foreground">{agent.role}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Inbox size={12} />
                      <span>{agent.inbox} inbox {agent.inbox === 1 ? "message" : "messages"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>Last active: {timeAgo(agent.lastActivity)}</span>
                    </div>
                    <div className={`text-xs ${agent.status === "healthy" ? "text-green-600" : "text-red-600"}`}>
                      {agent.status} · {agent.riskLevel} risk
                    </div>
                  </div>

                  {agent.recentLog && (
                    <div className="pt-3 border-t text-xs truncate text-muted-foreground border-border">
                      {agent.recentLog}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit">
            <CardContent className="p-4">
              {!selected ? (
                <div className="text-sm text-muted-foreground">No agent selected</div>
              ) : (
                <>
                  <div className="flex items-start gap-3 mb-4">
                    <span className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ background: selected.color }} />
                    <div>
                      <h2 className="font-semibold">{selected.label}</h2>
                      <p className="text-xs mt-1 text-muted-foreground">{selected.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div>
                      <div className="text-muted-foreground">Binary</div>
                      <div className="font-mono mt-1">{selected.binary}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">MCP</div>
                      <div className="font-mono mt-1">{selected.mcpServers.join(", ") || "none"}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {selected.checks.map((check) => (
                      <div
                        key={check.name}
                        className="flex items-center gap-2 rounded-md border px-3 py-2 border-border"
                      >
                        {check.ok ? (
                          <CheckCircle2 size={14} className="text-green-600" />
                        ) : (
                          <XCircle size={14} className="text-red-600" />
                        )}
                        <span className="text-sm">{check.name}</span>
                        <span className={`text-xs ml-auto ${check.ok ? "text-green-600" : "text-red-600"}`}>
                          {check.ok ? "pass" : "fail"}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
