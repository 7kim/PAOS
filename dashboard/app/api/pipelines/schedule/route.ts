import { NextResponse } from "next/server";
import { join } from "path";
import { readFile, writeFile, mkdir, readdir } from "fs/promises";

const PIPELINES_DIR = join(process.env.HOME || "/home/dev", "AI_Workflow", "memory", "pipelines");

// GET /api/pipelines/schedule — list all scheduled pipelines
export async function GET() {
  try {
    const projects = await readdir(PIPELINES_DIR).catch(() => []);
    const schedules: any[] = [];

    for (const project of projects) {
      if (project.startsWith(".")) continue;
      const projectDir = join(PIPELINES_DIR, project);
      const entries = await readdir(projectDir).catch(() => []);
      for (const entry of entries) {
        if (!entry.endsWith(".schedule")) continue;
        try {
          const manifest = JSON.parse(
            await readFile(join(projectDir, entry, "schedule.json"), "utf-8")
          );
          schedules.push({ ...manifest, project });
        } catch { /* skip unreadable */ }
      }
    }

    schedules.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    return NextResponse.json({ schedules });
  } catch (e) {
    return NextResponse.json({ schedules: [], error: String(e) });
  }
}

function toCron(expr: string): string | null {
  const map: Record<string, string> = {
    "every-30m": "*/30 * * * *",
    "every-1h": "0 * * * *",
    "every-6h": "0 */6 * * *",
    "daily": "0 9 * * *",
    "weekly": "0 9 * * 1",
  };
  return map[expr] || (expr.includes("*") || expr.includes("/") ? expr : null);
}

const TASKS_TEMPLATE = "- [ ] Execute scheduled pipeline\n- [ ] Verify results\n- [ ] Report completion";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt: string = body.prompt || "";
    const planMd: string = body.planMd || "";
    const tasksMd: string = body.tasksMd || "";
    const project: string = body.project || "PAOS";
    const scheduleInput: string = body.schedule || "";

    if (!prompt) return NextResponse.json({ error: "Provide a prompt" }, { status: 400 });

    const cron = toCron(scheduleInput);
    if (!cron) {
      return NextResponse.json({
        error: `Invalid schedule: "${scheduleInput}". Use cron expression or alias (every-30m, every-1h, daily, weekly)`,
      }, { status: 400 });
    }

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const id = `PIPE-SCHED-${pad(now.getDate())}${pad(now.getMonth() + 1)}${now.getFullYear()}-${pad(now.getHours())}${pad(now.getMinutes())}`;

    const scheduleDir = join(PIPELINES_DIR, project, `${id}.schedule`);
    await mkdir(scheduleDir, { recursive: true });

    const manifest = {
      id,
      prompt,
      planMd,
      tasksMd: tasksMd || TASKS_TEMPLATE,
      project,
      schedule: cron,
      scheduleInput,
      createdAt: now.toISOString(),
    };
    await writeFile(join(scheduleDir, "schedule.json"), JSON.stringify(manifest, null, 2));
    await writeFile(join(scheduleDir, "PLAN.md"), planMd || `# Scheduled Pipeline\n\n${prompt}`);
    await writeFile(join(scheduleDir, "TASKS.md"), tasksMd || TASKS_TEMPLATE);
    await writeFile(join(scheduleDir, "cron.txt"), `${cron} ${manifest.id}\n`);

    return NextResponse.json({
      ok: true,
      jobId: id,
      pipelineId: id,
      schedule: cron,
      dir: scheduleDir,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
