"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface SRSPhase {
  id: number;
  label: string;
  status: "pending" | "active" | "completed";
}

const DEFAULT_PHASES: SRSPhase[] = [
  { id: 1, label: "Executive Summary", status: "pending" },
  { id: 2, label: "System Overview", status: "pending" },
  { id: 3, label: "Functional Requirements", status: "pending" },
  { id: 4, label: "Non-Functional Requirements", status: "pending" },
  { id: 5, label: "User Stories", status: "pending" },
  { id: 6, label: "Data Model", status: "pending" },
  { id: 7, label: "API Design", status: "pending" },
  { id: 8, label: "UI/UX Specifications", status: "pending" },
  { id: 9, label: "Security Requirements", status: "pending" },
  { id: 10, label: "Testing Strategy", status: "pending" },
  { id: 11, label: "Deployment Plan", status: "pending" },
  { id: 12, label: "Monitoring & Observability", status: "pending" },
  { id: 13, label: "Maintenance & Support", status: "pending" },
  { id: 14, label: "Appendices", status: "pending" },
];

interface SRSPhaseTrackerProps {
  phases?: SRSPhase[];
  currentPhaseId?: number;
}

export function SRSPhaseTracker({
  phases = DEFAULT_PHASES,
  currentPhaseId,
}: SRSPhaseTrackerProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-body mb-3">
        SRS Phases
      </p>
      <div className="space-y-0.5">
        {phases.map((phase) => {
          const isActive = phase.id === currentPhaseId;
          const isCompleted = phase.status === "completed";
          return (
            <div
              key={phase.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-[4px] transition-colors",
                isActive && "bg-neutral-800",
                isCompleted && "opacity-70",
              )}
            >
              {/* Status indicator */}
              <div
                className={cn(
                  "w-6 h-6 rounded-[4px] flex items-center justify-center shrink-0",
                  isCompleted && "bg-brand-mint text-ink",
                  isActive && "border-2 border-brand-periwinkle",
                  !isActive && !isCompleted && "border border-neutral-600",
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span
                    className={cn(
                      "font-mono text-[10px]",
                      isActive ? "text-brand-periwinkle" : "text-on-dark/40",
                    )}
                  >
                    {phase.id}
                  </span>
                )}
              </div>

              <span
                className={cn(
                  "font-sans text-[14px]",
                  isActive && "text-on-dark font-medium",
                  isCompleted && "text-on-dark/60 line-through",
                  !isActive && !isCompleted && "text-on-dark/40",
                )}
              >
                {phase.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
