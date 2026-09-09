"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, CheckCircle, XCircle, Loader2, Trash2, ArrowDown } from "lucide-react";

interface QueueItem {
  id: string;
  title: string;
  project: string;
  status: string;
  progress: string;
  pid?: number;
  output?: string;
  enqueuedAt: string;
  startedAt?: string;
  completedAt?: string;
}

interface Queue {
  pending: QueueItem[];
  running: QueueItem | null;
  done: QueueItem[];
  maxDone: number;
}

export default function TaskQueue() {
  const [queue, setQueue] = useState<Queue>({ pending: [], running: null, done: [], maxDone: 20 });
  const [loading, setLoading] = useState(true);

  const loadQueue = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks/queue");
      const data = await res.json();
      setQueue(data);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadQueue();
    const id = setInterval(loadQueue, 5000);
    return () => clearInterval(id);
  }, [loadQueue]);

  const queueAction = useCallback(async (action: string, task: QueueItem) => {
    await fetch("/api/tasks/queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, task }),
    });
    loadQueue();
  }, [loadQueue]);

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return iso;
    }
  };

  if (loading) {
    return (
      <div className="w-[320px] shrink-0 rounded-lg border p-4" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 text-xs font-semibold mb-3">
          <Clock size={13} />
          Task Queue
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 size={16} className="animate-spin opacity-50" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-[320px] shrink-0 rounded-lg border flex flex-col" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
      <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
        <Clock size={13} />
        <span className="text-xs font-semibold">Task Queue</span>
        <span className="ml-auto text-[10px] text-muted-foreground">
          FIFO · {queue.pending.length + (queue.running ? 1 : 0) + queue.done.length} total
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {/* Running */}
        <div className={`rounded-lg border transition-all ${queue.running ? "ring-2 ring-[#3b82f6]/20" : ""}`} style={{ borderColor: "var(--border)" }}>
          <div className="px-2 py-1.5 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
            <span className="text-[10px] font-semibold" style={{ color: "#3b82f6" }}>Running</span>
            <span className="ml-auto text-[9px] text-muted-foreground">
              {queue.running ? "1" : "0"}
            </span>
          </div>
          <div className="p-2 min-h-[2rem]">
            {queue.running ? (
              <div className="space-y-1">
                <div className="text-[10px] font-medium truncate">{queue.running.title}</div>
                <div className="text-[9px] text-muted-foreground font-mono">{queue.running.id}</div>
                {queue.running.progress && (
                  <div className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>
                    {queue.running.progress}
                  </div>
                )}
                {queue.running.pid && (
                  <div className="text-[9px] text-muted-foreground">PID: {queue.running.pid}</div>
                )}
              </div>
            ) : (
              <div className="text-[9px] py-2 text-center text-muted-foreground">Idle</div>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowDown size={12} style={{ color: "var(--muted-foreground)" }} />
        </div>

        {/* Pending */}
        <div className={`rounded-lg border transition-all ${queue.pending.length > 0 ? "ring-2 ring-[var(--orange)]/20" : ""}`} style={{ borderColor: "var(--border)" }}>
          <div className="px-2 py-1.5 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--orange)" }} />
            <span className="text-[10px] font-semibold" style={{ color: "var(--orange)" }}>Pending</span>
            <span className="ml-auto text-[9px] text-muted-foreground">{queue.pending.length}</span>
          </div>
          <div className="p-2 min-h-[2rem] space-y-1">
            {queue.pending.length > 0 ? (
              queue.pending.map((item) => (
                <div key={item.id} className="flex items-center gap-1">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-medium truncate">{item.title}</div>
                    <div className="text-[9px] text-muted-foreground font-mono">{item.id}</div>
                  </div>
                  <button
                    onClick={() => queueAction("dequeue", item)}
                    className="p-0.5 rounded hover:bg-red-500/10"
                    style={{ color: "#ef4444" }}
                  >
                    <XCircle size={10} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-[9px] py-2 text-center text-muted-foreground">Queue empty</div>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowDown size={12} style={{ color: "var(--muted-foreground)" }} />
        </div>

        {/* Done */}
        <div className="rounded-lg border" style={{ borderColor: "var(--border)" }}>
          <div className="px-2 py-1.5 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
            <CheckCircle size={10} style={{ color: "var(--green)" }} />
            <span className="text-[10px] font-semibold" style={{ color: "var(--green)" }}>Done</span>
            <span className="ml-auto text-[9px] text-muted-foreground">{queue.done.length}</span>
          </div>
          <div className="p-2 space-y-1 max-h-[120px] overflow-y-auto">
            {queue.done.length > 0 ? (
              queue.done.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center gap-1">
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-medium truncate">{item.title}</div>
                    <div className="text-[9px] text-muted-foreground">
                      {item.completedAt ? formatTime(item.completedAt) : ""}
                      {item.status === "failed" && " · failed"}
                    </div>
                  </div>
                  <button
                    onClick={() => queueAction("remove", item)}
                    className="p-0.5 rounded hover:bg-red-500/10"
                    style={{ color: "#ef4444" }}
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-[9px] py-2 text-center text-muted-foreground">No completed tasks</div>
            )}
            {queue.done.length > 5 && (
              <div className="text-[9px] text-center text-muted-foreground">
                +{queue.done.length - 5} more
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
