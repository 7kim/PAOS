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
  Zap,
  HandMetal,
} from "lucide-react";

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/handoff", label: "Handoff", icon: HandMetal },
  { href: "/ledger", label: "Audit Ledger", icon: ScrollText },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/plans", label: "Plans", icon: FileText },
  { href: "/inbox", label: "Inbox", icon: Inbox },
];

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
    setAgents(data.agents ?? []);
  }, []);

  useEffect(() => {
    queueMicrotask(() => void loadAgents());
  }, [loadAgents]);

  return (
    <aside
      className="w-56 flex flex-col border-r shrink-0"
      style={{ background: "var(--sidebar-bg)", borderColor: "var(--border)" }}
    >
      <div className="px-4 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <Zap size={18} style={{ color: "var(--accent)" }} />
          <span className="font-semibold text-sm tracking-wide">AI Workflow Hub</span>
        </div>
        <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Orchestration Dashboard</p>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors"
              style={{
                background: active ? "rgba(59,130,246,0.12)" : "transparent",
                color: active ? "var(--accent)" : "var(--foreground)",
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>AGENTS</p>
        <div className="space-y-1.5">
          {agents.map((a) => (
            <div key={a.id} className="flex items-center gap-2 text-xs">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: a.color }}
              />
              <span style={{ color: "var(--foreground)", opacity: 0.8 }}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
