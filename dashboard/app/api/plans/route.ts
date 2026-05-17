import { NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";

export async function GET() {
  try {
    const pmLogsDir = join(MEMORY_DIR, "pm-logs");
    const files = await readdir(pmLogsDir).catch(() => []);
    const planFiles = files.filter((f) => f.endsWith("IMPLEMENTATION_PLAN.md"));

    const plans = await Promise.all(
      planFiles.map(async (f) => {
        const raw = await readFile(join(pmLogsDir, f), "utf-8");
        const lines = raw.split("\n");
        const title = lines.find((l) => l.startsWith("# "))?.replace("# ", "").trim() ?? f;
        const taskId = f.replace("-IMPLEMENTATION_PLAN.md", "");
        const preview = lines.slice(1, 8).join("\n").trim();

        // Find matching TASKS.md
        const tasksFile = `${taskId}-TASKS.md`;
        let tasksRaw = "";
        try {
          tasksRaw = await readFile(join(pmLogsDir, tasksFile), "utf-8");
        } catch { /* no tasks file */ }

        // Find matching WALKTHROUGH.md
        const walkthroughFile = `${taskId}-WALKTHROUGH.md`;
        let walkthroughRaw = "";
        try {
          walkthroughRaw = await readFile(join(pmLogsDir, walkthroughFile), "utf-8");
        } catch { /* no walkthrough yet */ }

        return {
          id: taskId,
          title,
          preview,
          plan: raw,
          tasks: tasksRaw,
          walkthrough: walkthroughRaw,
          hasWalkthrough: !!walkthroughRaw,
        };
      })
    );

    return NextResponse.json({ plans: plans.reverse() });
  } catch {
    return NextResponse.json({ plans: [] });
  }
}
