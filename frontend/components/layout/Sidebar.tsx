"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText, FolderOpen, Settings, Plus } from "lucide-react";

const navItems = [
  {
    label: "New Project",
    href: "/app/new",
    icon: Plus,
  },
  {
    label: "My Projects",
    href: "/app",
    icon: FolderOpen,
  },
  {
    label: "Settings",
    href: "/app/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-neutral-900 border-r border-neutral-700 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-neutral-700">
        <Link
          href="/app"
          className="font-mono text-[16px] font-medium tracking-[0.08px] uppercase text-on-dark"
        >
          Code-SRS
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-[4px] font-sans text-[16px] transition-colors",
                isActive
                  ? "bg-neutral-700 text-on-dark"
                  : "text-on-dark/60 hover:text-on-dark hover:bg-neutral-800",
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-neutral-700">
        <p className="font-mono text-[10px] uppercase tracking-[0.05px] text-on-dark/40">
          PAOS v2.0
        </p>
      </div>
    </aside>
  );
}
