"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface StreamEvent {
  phase: string;
  message: string;
  timestamp: string;
}

interface StreamConsoleProps {
  pipelineId: string;
  onComplete?: () => void;
}

export function StreamConsole({ pipelineId, onComplete }: StreamConsoleProps) {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [status, setStatus] = useState<"connecting" | "active" | "done">(
    "connecting",
  );
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pipelineId) return;

    const source = new EventSource(`/api/stream/${pipelineId}`);

    source.onopen = () => setStatus("active");

    source.addEventListener("message", (e) => {
      try {
        const data = JSON.parse(e.data) as StreamEvent;
        setEvents((prev) => [...prev, data]);
      } catch {
        // plain text message
        setEvents((prev) => [
          ...prev,
          {
            phase: "info",
            message: e.data,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    });

    source.addEventListener("complete", () => {
      setStatus("done");
      source.close();
      onComplete?.();
    });

    source.addEventListener("error", () => {
      setStatus("done");
      source.close();
    });

    return () => source.close();
  }, [pipelineId, onComplete]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="flex flex-col gap-3">
      {/* Status bar */}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            status === "connecting" && "bg-yellow-400 animate-pulse",
            status === "active" && "bg-green-400 animate-pulse",
            status === "done" && "bg-brand-periwinkle",
          )}
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.055px] text-body">
          {status === "connecting" && "Connecting to pipeline..."}
          {status === "active" && "Pipeline running"}
          {status === "done" && "Pipeline complete"}
        </span>
      </div>

      {/* Console window */}
      <div
        ref={consoleRef}
        className="bg-neutral-900 border border-neutral-700 rounded-[4px] p-4 h-80 overflow-y-auto font-mono text-[12px] leading-[18px] space-y-1"
      >
        {events.length === 0 && (
          <p className="text-on-dark/30 italic">
            Waiting for pipeline events...
          </p>
        )}
        {events.map((event, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2",
              event.phase === "error" && "text-red-400",
              event.phase === "complete" && "text-brand-mint",
              event.phase !== "error" &&
                event.phase !== "complete" &&
                "text-on-dark/80",
            )}
          >
            <span className="text-on-dark/40 shrink-0">
              [{event.phase}]
            </span>
            <span>{event.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
