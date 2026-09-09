import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { MEMORY_DIR } from "@/lib/global-config";

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

async function loadQueue(): Promise<Queue> {
  try {
    const raw = await readFile(join(MEMORY_DIR, "queue", "tasks-queue.json"), "utf-8");
    return JSON.parse(raw);
  } catch {
    return { pending: [], running: null, done: [], maxDone: 20 };
  }
}

async function saveQueue(q: Queue) {
  await mkdir(join(MEMORY_DIR, "queue"), { recursive: true });
  await writeFile(join(MEMORY_DIR, "queue", "tasks-queue.json"), JSON.stringify(q, null, 2), "utf-8");
}

// GET /api/tasks/queue — Get queue state
export async function GET() {
  try {
    const q = await loadQueue();
    return NextResponse.json(q);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// POST /api/tasks/queue — Enqueue/dequeue/done/remove
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, task } = body;
    const q = await loadQueue();

    switch (action) {
      case "enqueue": {
        if (!q.pending.find((i) => i.id === task.id)) {
          q.pending.push({
            id: task.id,
            title: task.title,
            project: task.project || "",
            status: "pending",
            progress: "",
            enqueuedAt: new Date().toISOString(),
          });
        }
        break;
      }
      case "dequeue": {
        q.pending = q.pending.filter((i) => i.id !== task.id);
        break;
      }
      case "start": {
        const item = q.pending.find((i) => i.id === task.id);
        if (item) {
          q.pending = q.pending.filter((i) => i.id !== task.id);
          item.status = "running";
          item.startedAt = new Date().toISOString();
          q.running = item;
        }
        break;
      }
      case "done": {
        if (q.running && q.running.id === task.id) {
          q.running.status = "done";
          q.running.completedAt = new Date().toISOString();
          q.done.unshift(q.running);
          q.done = q.done.slice(0, q.maxDone);
          q.running = null;
        }
        break;
      }
      case "fail": {
        if (q.running && q.running.id === task.id) {
          q.running.status = "failed";
          q.running.completedAt = new Date().toISOString();
          q.done.unshift(q.running);
          q.done = q.done.slice(0, q.maxDone);
          q.running = null;
        }
        break;
      }
      case "update": {
        if (q.running && q.running.id === task.id) {
          if (task.progress) q.running.progress = task.progress;
          if (task.output) q.running.output = task.output;
          if (task.pid) q.running.pid = task.pid;
        }
        break;
      }
      case "remove": {
        q.done = q.done.filter((i) => i.id !== task.id);
        break;
      }
      case "clear": {
        q.done = [];
        break;
      }
    }

    await saveQueue(q);
    return NextResponse.json({ ok: true, queue: q });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
