"use client";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
}

export default function Tabs({ tabs, activeId, onChange }: TabsProps) {
  return (
    <div className="flex border-b" style={{ borderColor: "var(--border)" }}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors relative"
            style={{
              color: isActive ? "var(--accent)" : "var(--muted-foreground)",
              borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  background: isActive ? "rgba(252,213,53,0.15)" : "rgba(255,255,255,0.06)",
                  color: isActive ? "var(--accent)" : "var(--muted-foreground)",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
