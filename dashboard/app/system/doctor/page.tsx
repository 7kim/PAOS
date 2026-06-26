"use client";
import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Loader2, CheckCircle2, XCircle, AlertCircle, Cpu, HardDrive, Activity, Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AgentCheck {
  name: string;
  ok: boolean;
  detail: any;
}

interface AgentHealth {
  id: string;
  label: string;
  role: string;
  color: string;
  riskLevel: string;
  status: string;
  checks: AgentCheck[];
}

interface DoctorData {
  registryVersion: string;
  status: string;
  agents: AgentHealth[];
}

export default function DoctorPage() {
  const [data, setData] = useState<DoctorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/system/doctor");
      setData(await res.json());
    } catch { /* empty */ }
    setLoading(false);
  }, []);

  const loadServices = useCallback(async () => {
    try {
      const res = await fetch("/api/system/services");
      if (res.ok) setServices((await res.json()).services || []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { load(); loadServices(); }, [load, loadServices]);

  const healthy = data?.agents.filter((a) => a.status === "healthy").length ?? 0;
  const total = data?.agents.length ?? 0;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>System Health</h1>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
            {loading ? "" : `${healthy}/${total} agents healthy · Status: ${data?.status ?? "?"}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="text-[10px]" style={{
            background: data?.status === "healthy" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
            color: data?.status === "healthy" ? "#22c55e" : "#ef4444",
          }}>
            {data?.status === "healthy" ? "● Healthy" : "● Degraded"}
          </Badge>
          <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={20} className="animate-spin opacity-50" />
        </div>
      ) : !data ? (
        <div className="text-center py-16 opacity-50 text-xs">Could not load system health</div>
      ) : (
        <div className="grid gap-3">
          {data.agents.map((agent) => {
            const isHealthy = agent.status === "healthy";
            const failedChecks = agent.checks.filter((c) => !c.ok);
            return (
              <Card key={agent.id} style={isHealthy ? {} : { borderColor: "rgba(239,68,68,0.3)" }}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isHealthy ? (
                        <CheckCircle2 size={16} style={{ color: "#22c55e" }} />
                      ) : (
                        <XCircle size={16} style={{ color: "#ef4444" }} />
                      )}
                      <div>
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          {agent.label || agent.id}
                          <Badge variant="secondary" className="text-[9px] px-1 py-0">
                            {agent.riskLevel}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-[10px] mt-0.5">
                          {agent.role}
                          <span className="ml-2 font-mono">{agent.id}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="text-[10px]" style={{
                      background: isHealthy ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                      color: isHealthy ? "#22c55e" : "#ef4444",
                    }}>
                      {agent.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {agent.checks.map((check) => (
                      <div key={check.name}
                        className="flex items-center gap-2 p-2 rounded-lg border text-xs"
                        style={{
                          borderColor: check.ok ? "var(--border)" : "rgba(239,68,68,0.3)",
                          background: check.ok ? "transparent" : "rgba(239,68,68,0.05)",
                        }}
                      >
                        {check.ok ? (
                          <CheckCircle2 size={10} style={{ color: "#22c55e" }} />
                        ) : (
                          <XCircle size={10} style={{ color: "#ef4444" }} />
                        )}
                        <div className="min-w-0">
                          <div className="text-[10px] font-medium">{check.name}</div>
                          <div className="text-[9px]" style={{ color: "var(--muted-foreground)" }}>
                            {check.ok ? "OK" : String(check.detail || "failed").slice(0, 60)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── System Services ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity size={14} style={{ color: "var(--primary)" }} />
            System Services
          </CardTitle>
          <CardDescription className="text-[10px]">
            systemd user services for PAOS — status, PID, uptime, memory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {services.map((svc) => (
            <div key={svc.name} className="flex items-center justify-between p-3 rounded-lg border"
              style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3 min-w-0">
                {svc.status === "active" ? (
                  <CheckCircle2 size={14} style={{ color: "#22c55e" }} />
                ) : svc.status === "inactive" ? (
                  <XCircle size={14} style={{ color: "var(--muted-foreground)" }} />
                ) : (
                  <AlertCircle size={14} style={{ color: "#ef4444" }} />
                )}
                <div className="min-w-0">
                  <div className="text-xs font-medium">{svc.description || svc.name}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    <code className="font-mono">{svc.name}</code>
                    {svc.pid && <span className="ml-2">PID {svc.pid}</span>}
                    {svc.memory && <span className="ml-2">{svc.memory}</span>}
                    {svc.uptime && <span className="ml-2">up {svc.uptime}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className="text-[9px]" style={{
                  background: svc.status === "active" ? "rgba(34,197,94,0.15)" : "rgba(100,116,139,0.15)",
                  color: svc.status === "active" ? "#22c55e" : "var(--muted-foreground)",
                }}>
                  {svc.subStatus || svc.status}
                </Badge>
                <Button variant="ghost" size="sm" className="h-6 text-[10px]"
                  onClick={async () => {
                    await fetch("/api/system/services", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name: svc.name, action: "restart" }),
                    });
                    setTimeout(() => loadServices(), 2000);
                  }}
                >
                  Restart
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
