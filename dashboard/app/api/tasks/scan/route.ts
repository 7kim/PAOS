import { NextResponse } from "next/server";
import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { PROJECTS_DIR, MEMORY_DIR } from "@/lib/global-config";
import { spawn } from "child_process";

// POST /api/tasks/scan — Find approved tasks and execute them
export async function POST() {
  try {
    const approvedTasks: { id: string; project: string; title: string; file: string }[] = [];
    
    // Check global memory/tasks/
    try {
      const globalFiles = await readdir(join(MEMORY_DIR, "tasks"));
      for (const f of globalFiles) {
        if (!f.endsWith(".md")) continue;
        const file = join(MEMORY_DIR, "tasks", f);
        const raw = await readFile(file, "utf-8");
        if (raw.toLowerCase().includes("status: approved")) {
          approvedTasks.push({
            id: f.replace(".md", ""),
            project: "",
            title: raw.split("\n").find((l: string) => l.startsWith("# "))?.replace("# ", "").trim() ?? f,
            file,
          });
        }
      }
    } catch { /* ignore */ }

    // Check all projects/{name}/tasks/
    try {
      const projects = await readdir(PROJECTS_DIR);
      for (const proj of projects) {
        if (proj.startsWith(".")) continue;
        const projTasksDir = join(PROJECTS_DIR, proj, "tasks");
        try {
          const files = await readdir(projTasksDir);
          for (const f of files) {
            if (!f.endsWith(".md")) continue;
            const file = join(projTasksDir, f);
            const raw = await readFile(file, "utf-8");
            if (raw.toLowerCase().includes("status: approved")) {
              approvedTasks.push({
                id: f.replace(".md", ""),
                project: proj,
                title: raw.split("\n").find((l: string) => l.startsWith("# "))?.replace("# ", "").trim() ?? f,
                file,
              });
            }
          }
        } catch { /* ignore */ }
      }
    } catch { /* ignore */ }

    if (approvedTasks.length === 0) {
      return NextResponse.json({
        ok: true,
        message: "No approved tasks found.",
        tasks: [],
      });
    }

    // Check which tasks need AI vs shell
    const shellTasks: typeof approvedTasks = [];
    const aiTasks: typeof approvedTasks = [];
    
    for (const task of approvedTasks) {
      if (await canExecuteWithShell(task.file)) {
        shellTasks.push(task);
      } else {
        aiTasks.push(task);
      }
    }

    // Execute shell tasks immediately
    const results: { id: string; status: string; output: string }[] = [];
    for (const task of shellTasks) {
      try {
        const output = await executeTask(task.id, task.file);
        let content = await readFile(task.file, "utf-8");
        content = content.replace(/^Status:\s*approved/m, "Status: done");
        const progressText = output.split("\n")[0].substring(0, 80);
        if (/^Progress:/m.test(content)) {
          content = content.replace(/^Progress:.*/m, `Progress: ${progressText}`);
        } else {
          content += `\nProgress: ${progressText}`;
        }
        content += `\n\n<!-- executed: ${new Date().toISOString()} -->`;
        await writeFile(task.file, content, "utf-8");
        results.push({ id: task.id, status: "done", output });
      } catch (e) {
        let content = await readFile(task.file, "utf-8");
        content = content.replace(/^Status:\s*approved/m, "Status: failed");
        content += `\n\n<!-- error: ${String(e)} -->`;
        await writeFile(task.file, content, "utf-8");
        results.push({ id: task.id, status: "failed", output: String(e) });
      }
    }

    // For AI tasks: trigger cron job immediately
    let cronTriggered = false;
    let cronError = "";
    if (aiTasks.length > 0) {
      try {
        await triggerCronJob();
        cronTriggered = true;
        for (const task of aiTasks) {
          let content = await readFile(task.file, "utf-8");
          content = content.replace(/^Status:\s*approved/m, "Status: in_progress");
          content += `\n\n<!-- cron-triggered: ${new Date().toISOString()} -->`;
          await writeFile(task.file, content, "utf-8");
          results.push({ id: task.id, status: "in_progress", output: "Cron job triggered" });
        }
      } catch (e) {
        cronError = String(e);
        for (const task of aiTasks) {
          let content = await readFile(task.file, "utf-8");
          content += `\n\n<!-- cron-error: ${cronError} -->`;
          await writeFile(task.file, content, "utf-8");
          results.push({ id: task.id, status: "cron-error", output: cronError });
        }
      }
    }

    const executed = results.filter(r => r.status === "done").length;
    const failed = results.filter(r => r.status === "failed").length;
    const cronJobs = results.filter(r => r.status === "in_progress").length;

    let message = `${executed} shell task(s) executed`;
    if (cronJobs > 0) message += `, ${cronJobs} AI task(s) sent to cron`;
    if (failed > 0) message += `, ${failed} failed`;
    if (cronError) message += ` (cron error: ${cronError})`;

    return NextResponse.json({
      ok: true,
      message,
      tasks: approvedTasks,
      results,
      cronTriggered,
      cronError: cronError || null,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

// Trigger the Hermes cron job for task-watcher
function triggerCronJob(): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("hermes", ["cron", "run", "6ef21d9e95f3"], {
      cwd: process.env.HOME || "/home/dev",
      shell: false,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => { stdout += d.toString(); });
    child.stderr.on("data", (d) => { stderr += d.toString(); });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Exit ${code}: ${stderr || stdout}`));
    });
    child.on("error", reject);
  });
}

// Check if a task can be executed with simple shell commands
async function canExecuteWithShell(file: string): Promise<boolean> {
  try {
    const raw = await readFile(file, "utf-8");
    const lower = raw.toLowerCase();
    if (lower.includes("git") && lower.includes("commit")) return true;
    if (lower.includes("date") && lower.includes("time")) return true;
    if (lower.includes("list files") || lower.includes("directory")) return true;
    return false;
  } catch {
    return false;
  }
}

async function executeTask(taskId: string, file: string): Promise<string> {
  const raw = await readFile(file, "utf-8");
  const title = raw.split("\n").find((l: string) => l.startsWith("# "))?.replace("# ", "").trim() ?? taskId;
  const lower = raw.toLowerCase();

  if (lower.includes("git") && lower.includes("commit")) {
    const output = await runCommand("git", ["log", "--format=%h %s (%cr) - %an", "-5"], join(MEMORY_DIR, ".."));
    return `📋 Last 5 Git Commits:\n\n${output.split("\n").map(l => `\`${l.split(" ")[0]}\` ${l.substring(l.indexOf(" ") + 1)}`).join("\n")}`;
  }

  if (lower.includes("date") && lower.includes("time")) {
    const now = new Date().toLocaleString("en-GB", { timeZone: "Asia/Dubai" });
    return `🟢 System Test Complete\n\n- Date: ${now}\n- Task: ${title}`;
  }

  if (lower.includes("list files") || lower.includes("directory")) {
    const output = await runCommand("ls", ["-la"], join(MEMORY_DIR, ".."));
    return `📁 Files:\n\n${output}`;
  }

  return `Task "${title}" executed.`;
}

function runCommand(cmd: string, args: string[], cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, shell: false });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => { stdout += d.toString(); });
    child.stderr.on("data", (d) => { stderr += d.toString(); });
    child.on("close", (code) => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(`Exit ${code}: ${stderr || stdout}`));
    });
    child.on("error", reject);
  });
}
