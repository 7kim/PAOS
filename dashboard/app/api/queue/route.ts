import { NextResponse } from "next/server";
import { readFile, writeFile, stat } from "fs/promises";
import { join } from "path";
import { MEMORY_DIR } from "@/lib/global-config";

interface QueueItem {
  id: string;
  project?: string;
  enqueuedAt?: string;
  startedAt?: string;
  completedAt?: string;
  status?: string;
}

interface QueueData {
  pending: QueueItem[];
  running: QueueItem | null;
  done: QueueItem[];
  maxDone: number;
}

const QUEUE_PATH = join(MEMORY_DIR, "queue", "queue.json");

async function loadQueue(): Promise<QueueData> {
  const raw = await readFile(QUEUE_PATH, "utf-8").catch(() => "{}");
  const data = JSON.parse(raw) as Partial<QueueData>;
  return {
    pending: Array.isArray(data.pending) ? data.pending : [],
    running: data.running ?? null,
    done: Array.isArray(data.done) ? data.done : [],
    maxDone: data.maxDone ?? 20,
  };
}

async function saveQueue(q: QueueData): Promise<void> {
  await writeFile(QUEUE_PATH, JSON.stringify(q, null, 2), "utf-8");
}

// GET /api/queue — returns full queue state, auto-cleans stale pending/running items
export async function GET() {
  const q = await loadQueue();

  // Auto-remove pending items whose pipeline directory doesn't exist or is already completed
  const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");
  async function pipelineExists(item: QueueItem): Promise<boolean> {
    const project = item.project || "PAOS";
    // Check project subdir first, then flat root, then scan sibling projects for id
    const candidates = [
      join(PIPELINES_DIR, project, item.id, "META.json"),
      join(PIPELINES_DIR, item.id, "META.json"),
    ];
    for (const metaPath of candidates) {
      try {
        await stat(metaPath);
        const metaRaw = await readFile(metaPath, "utf-8").catch(() => "{}");
        const meta = JSON.parse(metaRaw);
        if (meta.status === "completed" || meta.status === "failed") return false;
        return true;
      } catch { /* try next */ }
    }
    // Fallback: search all project dirs for this id
    try {
      const { readdir } = await import("fs/promises");
      const projects = await readdir(PIPELINES_DIR).catch(() => [] as string[]);
      for (const proj of projects) {
        if (proj.startsWith(".")) continue;
        try {
          const mp = join(PIPELINES_DIR, proj, item.id, "META.json");
          await stat(mp);
          const metaRaw = await readFile(mp, "utf-8").catch(() => "{}");
          const meta = JSON.parse(metaRaw);
          if (meta.status === "completed" || meta.status === "failed") return false;
          return true;
        } catch { /* not this project */ }
      }
    } catch { /* ignore */ }
    return false;
  }

  const validPending: QueueItem[] = [];
  for (const item of q.pending) {
    if (await pipelineExists(item)) validPending.push(item);
  }
  q.pending = validPending;

  // Clean running if stale (no dir or already completed)
  if (q.running && !(await pipelineExists(q.running))) {
    q.running = null;
  }

  // Also clean done list — remove pipelines that no longer exist on disk
  const validDone: QueueItem[] = [];
  for (const item of q.done) {
    const project = item.project || "PAOS";
    const candidates = [
      join(PIPELINES_DIR, project, item.id, "META.json"),
      join(PIPELINES_DIR, item.id, "META.json"),
    ];
    let exists = false;
    for (const mp of candidates) {
      try { await stat(mp); exists = true; break; } catch { /* miss */ }
    }
    if (exists) {
      validDone.push(item);
    } else {
      // Fallback scan
      try {
        const { readdir } = await import("fs/promises");
        const projects = await readdir(PIPELINES_DIR).catch(() => [] as string[]);
        for (const proj of projects) {
          try { await stat(join(PIPELINES_DIR, proj, item.id, "META.json")); exists = true; break; } catch { /* continue */ }
        }
        if (exists) validDone.push(item);
      } catch { /* stale */ }
    }
  }
  q.done = validDone;

  // Persist cleaned queue if changed
  try {
    await saveQueue(q);
  } catch { /* save non-critical */ }

  return NextResponse.json(q);
}

// POST /api/queue — operations via ?action= param or body.action
// Body: { action: "enqueue", id: "...", project: "..." }
//       { action: "dequeue" }
//       { action: "done", status: "completed"|"failed" }
//       { action: "remove", id: "..." }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body.action || "enqueue";
    const q = await loadQueue();

    switch (action) {
      case "enqueue": {
        const id = body.id;
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
        // Don't enqueue if already in queue
        const inPending = q.pending.some(i => i.id === id);
        const inDone = q.done.some(i => i.id === id);
        const isRunning = q.running?.id === id;
        if (inPending || isRunning || inDone) {
          return NextResponse.json({ ok: true, message: "Already in queue", queue: q });
        }
        q.pending.push({ id, project: body.project || "", enqueuedAt: new Date().toISOString() });
        await saveQueue(q);
        return NextResponse.json({ ok: true, action: "enqueued", queue: q });
      }

      case "dequeue": {
        if (q.pending.length === 0) {
          return NextResponse.json({ error: "No pending items" }, { status: 409 });
        }
        if (q.running) {
          return NextResponse.json({ error: "Already running" }, { status: 409 });
        }
        const item = q.pending.shift()!;
        item.startedAt = new Date().toISOString();
        delete item.enqueuedAt;
        q.running = item;
        await saveQueue(q);
        return NextResponse.json({ ok: true, action: "dequeued", item, queue: q });
      }

      case "done": {
        if (!q.running) {
          return NextResponse.json({ error: "Nothing running" }, { status: 409 });
        }
        q.running.completedAt = new Date().toISOString();
        q.running.status = body.status || "completed";
        q.done.unshift(q.running);
        q.done = q.done.slice(0, q.maxDone);
        // Keep sorted by completedAt descending (newest first)
        q.done.sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime());
        q.running = null;
        await saveQueue(q);
        return NextResponse.json({ ok: true, action: "completed", queue: q });
      }

      case "remove": {
        const id = body.id;
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
        q.pending = q.pending.filter(i => i.id !== id);
        q.done = q.done.filter(i => i.id !== id);
        if (q.running?.id === id) q.running = null;
        await saveQueue(q);
        return NextResponse.json({ ok: true, action: "removed", queue: q });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
