"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  LayoutDashboard,
  ScrollText,
  Bot,
  ListTodo,
  FileText,
  Inbox,
  HandMetal,
  Code,
  Settings,
  Zap,
  GitBranch,
} from "lucide-react";

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/handoff", label: "Handoff", icon: HandMetal },
  { href: "/ledger", label: "Audit Ledger", icon: ScrollText },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/pipelines", label: "Pipelines", icon: GitBranch },
  { href: "/plans", label: "Plans", icon: FileText },
  { href: "/inbox", label: "Inbox", icon: Inbox },
];

const codeSrsNav = [
  { href: "/settings/code-srs", label: "Code-SRS Settings", icon: Code },
];

const agentColorMap: Record<string, string> = {
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
  signal: "#2dbdb6",
  copilot: "#64748b",
};

function resolveColor(id: string) {
  for (const [key, color] of Object.entries(agentColorMap)) {
    if (id.toLowerCase().includes(key)) return color;
  }
  return "#707a8a";
}

interface Agent {
  id: string;
  label: string;
  color: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [agents, setAgents] = useState<Agent[]>([]);

  const loadAgents = useCallback(async () => {
    const res = await fetch("/api/agents");
    const data = await res.json();
    setAgents((data.agents ?? []) as Agent[]);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void loadAgents());
  }, [loadAgents]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside
      className="w-56 flex flex-col border-r shrink-0"
      style={{ background: "var(--sidebar-bg)", borderColor: "var(--border)" }}
    >
      {/* Logo */}
      <div
        className="px-4 py-5 border-b flex items-center gap-2.5"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-7 h-7 rounded flex items-center justify-center shrink-0"
          style={{ background: "var(--accent)" }}
        >
          <Zap size={14} style={{ color: "var(--accent-on)" }} />
        </div>
        <div>
          <div className="font-bold text-sm tracking-tight" style={{ color: "var(--foreground)" }}>
            AI Workflow
          </div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>PAOS Hub</div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-semibold px-3 py-2 uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          Dashboard
        </p>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors"
              style={{
                background: active ? "rgba(252,213,53,0.1)" : "transparent",
                color: active ? "var(--accent)" : "var(--foreground)",
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon size={14} style={{ color: active ? "var(--accent)" : "var(--muted)" }} />
              {label}
            </Link>
          );
        })}

        <div className="pt-3 pb-1">
          <p className="text-xs font-semibold px-3 py-2 uppercase tracking-wider" style={{ color: "var(--muted)" }}>
            Code-SRS
          </p>
        </div>
        {codeSrsNav.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors"
              style={{
                background: active ? "rgba(252,213,53,0.1)" : "transparent",
                color: active ? "var(--accent)" : "var(--foreground)",
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon size={14} style={{ color: active ? "var(--accent)" : "var(--muted)" }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Agent status strip */}
      <div
        className="px-4 py-4 border-t"
        style={{ borderColor: "var(--border)", background: "var(--elevated)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--muted)" }}>
          Agents
        </p>
        <div className="space-y-2">
          {agents.map((a) => (
            <div key={a.id} className="flex items-center gap-2 text-xs">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: resolveColor(a.id) }}
              />
              <span className="truncate" style={{ color: "var(--foreground)", opacity: 0.8 }}>
                {a.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
