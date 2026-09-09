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
  Zap,
  GitBranch,
  GitCommit,
  TestTube,
  FolderKanban,
  BookOpen,
  Activity,
  BarChart3,
  Coins,
  Terminal,
  PanelLeftClose,
  PanelLeft,
  Server,
  Share2,
  History,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/vault", label: "Vault", icon: BookOpen },
  { href: "/graph", label: "Graph", icon: Share2 },
  { href: "/events", label: "Events", icon: Activity },
  { href: "/handoff", label: "Handoff", icon: HandMetal },
  { href: "/ledger", label: "Audit Ledger", icon: ScrollText },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/agents/replay", label: "Agent Replay", icon: History },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/pipelines", label: "Pipelines", icon: GitBranch },
  { href: "/benchmarks", label: "Benchmarks", icon: BarChart3 },
  { href: "/tokens", label: "Tokens", icon: Coins },
  { href: "/terminals", label: "Terminals", icon: Terminal },
  { href: "/gitview", label: "Git View", icon: GitCommit },
  { href: "/plans", label: "Plans", icon: FileText },
  { href: "/inbox", label: "Inbox", icon: Inbox },
];

const devNav = [
  { href: "/api-playground", label: "API Playground", icon: TestTube },
  { href: "/mcp-servers", label: "MCP Servers", icon: Server },
  { href: "/settings/env", label: "Environment Path", icon: Terminal },
  { href: "/settings", label: "Settings", icon: Code },
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
  gitkraken: "#289473",
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

function NavLink({
  href,
  label,
  icon: Icon,
  collapsed,
  active,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
}) {
  const link = (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors"
      style={{
        background: active ? "rgba(252,213,53,0.1)" : "transparent",
        color: active ? "var(--primary)" : "var(--foreground)",
        fontWeight: active ? 600 : 400,
        justifyContent: collapsed ? "center" : "flex-start",
      }}
    >
      <Icon size={14} style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }} />
      {!collapsed && label}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors"
            style={{
              background: active ? "rgba(252,213,53,0.1)" : "transparent",
              color: active ? "var(--primary)" : "var(--foreground)",
              fontWeight: active ? 600 : 400,
              justifyContent: "center",
            }}
          >
            <Icon size={14} style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }
  return link;
}

function NavSectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return null;
  return (
    <p
      className="text-xs font-semibold px-3 py-2 uppercase tracking-wider"
      style={{ color: "var(--muted-foreground)" }}
    >
      {label}
    </p>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  // Auto-collapse on mobile (< 768px) via media query
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setCollapsed(mq.matches);
    const handler = (e: MediaQueryListEvent) => setCollapsed(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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

  function toggleCollapsed() {
    setCollapsed((c) => !c);
  }

  function expand() {
    setCollapsed(false);
  }

  return (
    <aside
      className="flex flex-col border-r shrink-0 transition-all duration-200 ease-in-out"
      style={{
        width: collapsed ? "56px" : "224px",
        background: "var(--sidebar-bg)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo — click to toggle collapse */}
      <div
        className="px-4 py-5 border-b flex items-center gap-2.5 cursor-pointer"
        style={{ borderColor: "var(--border)" }}
        onClick={toggleCollapsed}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <div
          className="w-7 h-7 rounded flex items-center justify-center shrink-0"
          style={{ background: "var(--primary)" }}
        >
          <Zap size={14} style={{ color: "var(--primary-foreground)" }} />
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm tracking-tight truncate" style={{ color: "var(--foreground)" }}>
                AI Workflow
              </div>
              <div className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>PAOS Hub</div>
            </div>
            <PanelLeftClose size={14} style={{ color: "var(--muted-foreground)", opacity: 0.5 }} />
          </>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <NavSectionLabel label="Dashboard" collapsed={collapsed} />
        {nav.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <NavLink
              key={href}
              href={href}
              label={label}
              icon={Icon}
              collapsed={collapsed}
              active={active}
              onClick={expand}
            />
          );
        })}

        <div className="pt-3 pb-1">
          <NavSectionLabel label="Developer" collapsed={collapsed} />
        </div>
        {devNav.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <NavLink
              key={href}
              href={href}
              label={label}
              icon={Icon}
              collapsed={collapsed}
              active={active}
              onClick={expand}
            />
          );
        })}

        <div className="pt-3 pb-1">
          <NavSectionLabel label="Code-SRS" collapsed={collapsed} />
        </div>
        {codeSrsNav.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <NavLink
              key={href}
              href={href}
              label={label}
              icon={Icon}
              collapsed={collapsed}
              active={active}
              onClick={expand}
            />
          );
        })}
      </nav>

      {/* Agent status strip */}
      <div
        className="px-4 py-4 border-t transition-all"
        style={{ borderColor: "var(--border)", background: "var(--elevated)" }}
      >
        {!collapsed && (
          <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--muted-foreground)" }}>
            Agents
          </p>
        )}
        <div className="space-y-2" style={{ textAlign: collapsed ? "center" : "left" }}>
          {agents.map((a) => (
            <div key={a.id} className="flex items-center gap-2 text-xs" style={{ justifyContent: collapsed ? "center" : "flex-start" }}>
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: resolveColor(a.id) }}
              />
              {!collapsed && (
                <span className="truncate" style={{ color: "var(--foreground)", opacity: 0.8 }}>
                  {a.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
