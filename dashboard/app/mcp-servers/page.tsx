"use client";
import { useCallback, useEffect, useState, Suspense } from "react";
import { RefreshCw, Server, Wifi, WifiOff, Loader2, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getViewAll } from "@/lib/viewAll";

interface McpServer {
  name: string;
  description: string;
  command?: string;
  status?: "online" | "offline" | "unknown";
}

export default function McpServersPageWrapper() {
  return (
    <Suspense fallback={<div className="text-xs text-center py-12 text-muted-foreground">Loading...</div>}>
      <McpServersPage />
    </Suspense>
  );
}

function McpServersPage() {
  const [servers, setServers] = useState<McpServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const viewAll = getViewAll();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/mcp-servers");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setServers(data.servers || []);
    } catch (e) {
      setError(String(e));
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            MCP Servers
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
            Model Context Protocol servers available to PAOS agents
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      {error && (
        <div className="text-xs p-3 rounded-lg border" style={{ borderColor: "var(--destructive)", color: "var(--destructive)" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={20} className="animate-spin opacity-50" />
        </div>
      ) : servers.length === 0 ? (
        <div className="text-xs text-center py-16 opacity-50">No MCP servers configured</div>
      ) : (
        <div className="grid gap-3">
          {servers.map((server) => (
            <Card key={server.name}>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Server size={16} style={{ color: "var(--primary)" }} />
                    <div>
                      <CardTitle className="text-sm font-medium">{server.name}</CardTitle>
                      <CardDescription className="text-[10px] mt-0.5">
                        {server.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] gap-1">
                    <CheckCircle2 size={10} style={{ color: "var(--success)" }} />
                    Active
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {!loading && servers.length > 0 && (
        <div className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
          {servers.length} server{servers.length !== 1 ? "s" : ""} configured
          {!viewAll && " · Enable View All in settings to see full details"}
        </div>
      )}
    </div>
  );
}
