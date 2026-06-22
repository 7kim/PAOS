import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");

interface TaskDetail {
  status: string;
  label: string;
  complexity: string;
  file?: string;
  details: string[];
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dir = join(PIPELINES_DIR, id);

  try {
    const [metaRaw, planMd, tasksMd, walkthroughMd, pipelineJsonRaw] = await Promise.all([
      readFile(join(dir, "META.json"), "utf-8").catch(() => "{}"),
      readFile(join(dir, "PLAN.md"), "utf-8").catch(() => ""),
      readFile(join(dir, "TASKS.md"), "utf-8").catch(() => ""),
      readFile(join(dir, "WALKTHROUGH.md"), "utf-8").catch(() => ""),
      readFile(join(dir, "pipeline.json"), "utf-8").catch(() => "{}"),
    ]);

    const meta = JSON.parse(metaRaw);
    const pipelineJson = JSON.parse(pipelineJsonRaw);

    const completedTasks = tasksMd ? (tasksMd.match(/\[x\]/gi) || []).length : 0;
    const pendingTasks = tasksMd ? (tasksMd.match(/\[ \]/g) || []).length : 0;
    const inProgressTasks = tasksMd ? (tasksMd.match(/\[~\]/g) || []).length : 0;
    const totalTasks = completedTasks + pendingTasks + inProgressTasks;

    // Parse tasks with rich details
    const taskList: TaskDetail[] = [];
    if (tasksMd) {
      const lines = tasksMd.split("\n");
      let current: TaskDetail | null = null;

      for (const line of lines) {
        const taskMatch = line.match(/^(\[[ x~]\])\s*(.+)/i);
        if (taskMatch) {
          if (current) taskList.push(current);
          const marker = taskMatch[1];
          const status = marker.includes("[x]") ? "done" : marker.includes("[~]") ? "doing" : "pending";
          const raw = taskMatch[2].trim();
          const complexityMatch = raw.match(/\[([SML])\]\s*/);
          const complexity = complexityMatch ? complexityMatch[1] : "M";
          const label = raw.replace(/\[[SML]\]\s*/, "").trim();
          current = { status, label, complexity, details: [], file: undefined };
        } else if (current) {
          const fileMatch = line.match(/File:\s*`([^`]+)`/);
          if (fileMatch) {
            current.file = fileMatch[1];
          } else if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
            current.details.push(line.replace(/^[\s\-*]*/, "").trim());
          }
        }
      }
      if (current) taskList.push(current);
    }

    return NextResponse.json({
      id,
      meta,
      pipeline: pipelineJson,
      plan: planMd,
      tasks: tasksMd,
      taskList,
      walkthrough: walkthroughMd,
      stats: {
        completedTasks,
        inProgressTasks,
        pendingTasks,
        totalTasks,
        progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        hasWalkthrough: !!walkthroughMd,
        hasPipelineJson: Object.keys(pipelineJson).length > 1,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: `Pipeline ${id} not found: ${String(e)}` }, { status: 404 });
  }
}
