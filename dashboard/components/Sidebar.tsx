"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScrollText,
  Bot,
  ListTodo,
  FileText,
  Inbox,
  Zap,
} from "lucide-react";

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/ledger", label: "Audit Ledger", icon: ScrollText },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/plans", label: "Plans", icon: FileText },
  { href: "/inbox", label: "Inbox", icon: Inbox },
];

const agents = [
  { id: "claude", label: "Claude Code", color: "#f97316" },
  { id: "opencode-developer", label: "OpenCode", color: "#3b82f6" },
  { id: "openclaw", label: "OpenClaw", color: "#8b5cf6" },
  { id: "ollama", label: "Ollama", color: "#22c55e" },
  { id: "antigravity", label: "Antigravity", color: "#ec4899" },
];

export default function Sidebar() {
  const pathname = usePathname();

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
