"use client";
import { useCallback, useEffect, useState } from "react";
import { Search, Loader2, RefreshCw, Bot, CheckCircle2, XCircle, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AgentCapability {
  id: string; label: string; role: string;
  capabilities: string[]; tools: string[]; enabled: boolean;
}

export default function AgentExplorerPage() {
  const [agents, setAgents] = useState<AgentCapability[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents/explorer");
      const data = await res.json();
      setAgents(data.agents || []);
    } catch { /* empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const q = search.toLowerCase();
  const filtered = q
    ? agents.filter((a) =>
        a.label.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.capabilities.some((c) => c.toLowerCase().includes(q)) ||
        a.tools.some((t) => t.includes(q))
      )
    : agents;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>Agent Explorer</h1>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
            {agents.length} agents · {agents.filter((a) => a.enabled).length} active
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search agents by name, capability, or tool..."
          className="w-full text-xs rounded-lg border pl-8 pr-3 py-2"
          style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={20} className="animate-spin opacity-50" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 opacity-50 text-xs">No agents match your search</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((agent) => (
            <Card key={agent.id} style={agent.enabled ? {} : { opacity: 0.6 }}>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bot size={16} style={{ color: agent.enabled ? "var(--primary)" : "var(--muted-foreground)" }} />
                    <div>
                      <CardTitle className="text-sm font-medium">{agent.label}</CardTitle>
                      <CardDescription className="text-[10px] mt-0.5">{agent.role || agent.id}</CardDescription>
                    </div>
                  </div>
                  <Badge className="text-[9px]" style={{
                    background: agent.enabled ? "rgba(34,197,94,0.15)" : "rgba(100,116,139,0.15)",
                    color: agent.enabled ? "#22c55e" : "var(--muted-foreground)",
                  }}>
                    {agent.enabled ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-2">
                {agent.capabilities.length > 0 && (
                  <div>
                    <div className="text-[9px] font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>Capabilities</div>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.map((c, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.5 rounded"
                          style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)" }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {agent.tools.length > 0 && (
                  <div>
                    <div className="text-[9px] font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>Tools</div>
                    <div className="flex flex-wrap gap-1">
                      {agent.tools.map((t, i) => (
                        <code key={i} className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                          style={{ background: "rgba(100,116,139,0.1)", color: "var(--muted-foreground)" }}>
                          {t}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
