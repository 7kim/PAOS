import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir, readdir, rename } from "fs/promises";
import { join } from "path";
import { spawn } from "child_process";
import { MEMORY_DIR } from "@/lib/global-config";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");

// ── Atomic file write (prevents partial/corrupt writes from concurrent requests) ──

/** Write JSON to a file atomically: write to .tmp sibling, then rename. */
async function writeJSONAtomic(filePath: string, data: unknown): Promise<void> {
  const tmpPath = filePath + ".tmp." + Date.now();
  await writeFile(tmpPath, JSON.stringify(data, null, 2), "utf-8");
  await rename(tmpPath, filePath);
}

// Walk DAG in topological order using Kahn's algorithm (BFS)
function topoSort(nodes: any[], edges: any[]): string[] {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const n of nodes) {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
  }
  for (const e of edges) {
    adj.get(e.source)?.push(e.target);
    inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  const order: string[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    order.push(id);
    for (const next of adj.get(id) || []) {
      const newDeg = (inDegree.get(next) || 0) - 1;
      inDegree.set(next, newDeg);
      if (newDeg === 0) queue.push(next);
    }
  }
  return order;
}

function findPipelineDir(projects: string[], id: string): string {
  for (const project of projects) {
    if (project.startsWith(".")) continue;
    const candidate = join(PIPELINES_DIR, project, id);
    try {
      require("fs").accessSync(join(candidate, "META.json"));
      return candidate;
    } catch { /* not this project */ }
  }
  return "";
}

// Generate an implementation file for a single node
function generateNodeImplementation(node: any, taskNum: number, totalTasks: number): string {
  const nd = node.data || {};
  const agentId = nd.agentId || "unknown";
  const label = nd.label || agentId;
  const userPrompt = nd.prompt || "";
  const defaultPrompt = nd.defaultPrompt || "";
  const prompt = defaultPrompt ? `${defaultPrompt}\n\n---\n\n${userPrompt}` : userPrompt;
  const skills = nd.selectedSkills || [];
  const mcps = nd.selectedMcps || [];
  const fileRefs = nd.fileRefs || [];

  let impl = `# Agent: ${label} (${agentId})\n`;
  impl += `# Task ${taskNum}/${totalTasks}\n\n`;
  impl += `## Instructions\n${prompt}\n\n`;

  if (skills.length > 0) {
    impl += `## Skills to Load\n${skills.map((s: string) => `- ${s}`).join("\n")}\n\n`;
  }
  if (mcps.length > 0) {
    impl += `## MCPs to Use\n${mcps.map((m: string) => `- ${m}`).join("\n")}\n\n`;
  }
  if (fileRefs.length > 0) {
    impl += `## Reference Files\n${fileRefs.map((f: any) => `- ${f.path} (${f.name})`).join("\n")}\n\n`;
  }

  impl += "## Tasks\n";
  impl += "- [ ] Execute the instructions above\n";
  impl += "- [ ] Create necessary files and modifications\n";
  impl += "- [ ] Verify everything works\n";
  impl += "- [ ] Update this file's task markers\n";
  impl += "- [ ] Write WALKTHROUGH.md with summary\n\n";
  impl += "---\n";
  impl += `When done, mark all tasks [x] and write WALKTHROUGH.md.\n`;

  return impl;
}

// Role-specific REASONING.md templates
const REASONING_TEMPLATES: Record<string, string> = {
  Proposer: `## What problem am I solving?
  
## What approaches did I consider?

## Why this approach over alternatives?

## What assumptions am I making?`,
  Enhancer: `## What gaps or risks did I identify?

## What improvements did I suggest?

## What edge cases did I consider?`,
  Architect: `## What architecture did I choose and why?

## What components / modules are needed?

## What data flows between components?

## What trade-offs did I make?`,
  Planner: `## How did I break down the work?

## What are the dependencies between tasks?

## What's the estimated effort per task?`,
  Implementer: `## What's my implementation strategy?

## What edge cases am I handling?

## What tests cover this?

## What could go wrong?`,
  "Code Reviewer": `## What did I check?

## What issues did I find?

## Severity and risk level?

## Suggestions for improvement?`,
  Tester: `## What test strategy did I use?

## What scenarios are covered?

## What's not covered and why?`,
  Documenter: `## What needs documentation?

## Who is the audience?

## What examples are most helpful?`,
  Deployer: `## What's the deploy strategy?

## What rollback plan exists?

## What monitoring is in place?`,
};

function generateReasoningMd(label: string, role: string): string {
  const template = REASONING_TEMPLATES[role] || `## What I understand about this task

## Key decisions I made

## Trade-offs considered

## Why this approach

## What could go wrong`;
  return `# Reasoning — ${label}

${template}
`;
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const projects = await readdir(PIPELINES_DIR).catch(() => [] as string[]);
    const dir = findPipelineDir(projects, id);
    if (!dir) {
      return NextResponse.json({ error: `Pipeline ${id} not found` }, { status: 404 });
    }

    // Read layout
    const layoutRaw = await readFile(join(dir, "builder-layout.json"), "utf-8").catch(() => "");
    if (!layoutRaw) {
      return NextResponse.json({ error: "Not a builder pipeline — no builder-layout.json" }, { status: 400 });
    }

    const layout = JSON.parse(layoutRaw);
    const nodes = layout.nodes || [];
    const edges = layout.edges || [];
    if (nodes.length === 0) {
      return NextResponse.json({ error: "No nodes in pipeline" }, { status: 400 });
    }

    // Create phases directory
    const phasesDir = join(dir, "phases");
    await mkdir(phasesDir, { recursive: true });

    // Topological order
    const order = topoSort(nodes, edges);
    const nodeMap = new Map(nodes.map((n: any) => [n.id, n]));

    // Create phase directories and implementation files for ALL nodes
    const phases: Record<string, any> = {};
    for (const nodeId of order) {
      const node = nodeMap.get(nodeId);
      if (!node) continue;
      const nd = (node as any).data || {};
      const phaseDir = join(phasesDir, nodeId);
      await mkdir(phaseDir, { recursive: true });

      const taskNum = order.indexOf(nodeId) + 1;
      const implContent = generateNodeImplementation(node, taskNum, order.length);

      // Write IMPLEMENTATION.md
      await writeFile(join(phaseDir, "IMPLEMENTATION.md"), implContent);

      // Write TASKS.md
      const tasks = implContent.split("## Tasks\n")[1] || "";
      await writeFile(join(phaseDir, "TASKS.md"), tasks);

      // Write REASONING.md
      const roleLabel = nd.label || nd.agentId || "Agent";
      const reasoningContent = generateReasoningMd(roleLabel, roleLabel);
      await writeFile(join(phaseDir, "REASONING.md"), reasoningContent);

      phases[nodeId] = {
        agentId: nd.agentId || "unknown",
        label: nd.label || nd.agentId || "Agent",
        status: nodeId === order[0] ? "ready" : "pending",
        prompt: nd.prompt || "",
        pid: null,
        progress: "0/4",
        startedAt: null,
        completedAt: null,
        order: taskNum,
      };
    }

    // Write pipeline-flow.json
    const flowStatus: Record<string, any> = {
      $schema: "../mcp/schemas/pipeline-flow.schema.json",
      pipelineId: id,
      status: "executing",
      startedAt: new Date().toISOString(),
      phases,
      order,
    };
    await writeFile(join(dir, "pipeline-flow.json"), JSON.stringify(flowStatus, null, 2));

    // Update META.json
    const metaRaw = await readFile(join(dir, "META.json"), "utf-8").catch(() => "{}");
    const meta = JSON.parse(metaRaw);
    meta.status = "executing";
    meta.phases = order.map((nodeId: string) => {
      const node = nodeMap.get(nodeId);
      const nd = (node as any)?.data || {};
      return {
        id: nodeId,
        agent: nd.agentId || "unknown",
        role: nd.label || "Agent",
        label: nd.label || nd.agentId || "Agent",
        status: nodeId === order[0] ? "executing" : "pending",
        artifacts: [`phases/${nodeId}/IMPLEMENTATION.md`],
      };
    });
    await writeJSONAtomic(join(dir, "META.json"), meta);

    // Also update pipeline.json
    const pj = { status: "executing", currentTask: order[0] || "", progress: `0/${order.length}`, startedAt: new Date().toISOString() };
    await writeJSONAtomic(join(dir, "pipeline.json"), pj);

    // Enqueue
    try {
      await fetch(`http://localhost:3333/api/queue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enqueue", id, project: "PAOS" }),
      });
    } catch { /* queue not critical */ }

    // ── Spawn a node and set up cascade on completion ──
    async function spawnNode(nodeId: string, currentPhases: Record<string, any>, currentOrder: string[]) {
      const node = nodeMap.get(nodeId);
      if (!node) return;
      const phaseDir = join(phasesDir, nodeId);
      const agentId = (node as any).data?.agentId || "opencode-developer";
      const nodeLabel = (node as any).data?.label || nodeId;

      // Read current flow status
      const flowNow = JSON.parse(await readFile(join(dir, "pipeline-flow.json"), "utf-8").catch(() => "{}"));

      // Spawn the agent process
      const cmd = `cd ${phaseDir} && cat IMPLEMENTATION.md | opencode run 2>&1 & echo $!`;
      const proc = spawn("bash", ["-c", cmd], {
        cwd: phaseDir,
        stdio: ["ignore", "pipe", "pipe"],
        shell: true,
      });

      const pid = proc.pid || 0;

      // Update flow status
      if (flowNow.phases) {
        flowNow.phases[nodeId].status = "running";
        flowNow.phases[nodeId].pid = pid;
        flowNow.phases[nodeId].startedAt = new Date().toISOString();
        await writeFile(join(dir, "pipeline-flow.json"), JSON.stringify(flowNow, null, 2));
      }

      // Update pipeline.json
      const pjLatest = JSON.parse(await readFile(join(dir, "pipeline.json"), "utf-8").catch(() => "{}"));
      pjLatest.currentTask = nodeId;
      const runningCount = Object.values(flowNow.phases || {}).filter((p: any) => p.status === "running" || p.status === "completed").length;
      pjLatest.progress = `${runningCount}/${currentOrder.length}`;
      await writeJSONAtomic(join(dir, "pipeline.json"), pjLatest);

      // Capture output
      let output = "";
      proc.stdout?.on("data", (chunk: Buffer) => { output += chunk.toString(); });
      proc.stderr?.on("data", (chunk: Buffer) => { output += chunk.toString(); });

      proc.on("close", async (code) => {
        // Save output log
        await writeFile(join(phaseDir, "output.log"), output);

        // Reload flow status
        const flowLatest = JSON.parse(await readFile(join(dir, "pipeline-flow.json"), "utf-8").catch(() => "{}"));
        if (flowLatest.phases) {
          flowLatest.phases[nodeId].status = code === 0 ? "completed" : "failed";
          flowLatest.phases[nodeId].completedAt = new Date().toISOString();
          flowLatest.phases[nodeId].pid = null;

          // Always write WALKTHROUGH.md from output
          await writeFile(join(phaseDir, "WALKTHROUGH.md"), `# ${nodeLabel} Walkthrough\n\n## Output Summary\n\`\`\`\n${output.slice(0, 2000)}\n\`\`\`\n\n## Full Output\n\`\`\`\n${output}\n\`\`\`\n`);

          // Write REASONING.md if not yet created
          try {
            await readFile(join(phaseDir, "REASONING.md"), "utf-8");
          } catch {
            // Default reasoning template
            await writeFile(join(phaseDir, "REASONING.md"), `# ${nodeLabel} — Reasoning\n\n## What I understand\n\n## Key decisions\n\n## Trade-offs considered\n\n## Why this approach\n`);
          }

          // Enrich flow status with output, reasoning, tasks, walkthrough
          if (flowLatest.phases) {
            flowLatest.phases[nodeId].outputPreview = output.slice(0, 1000);
            flowLatest.phases[nodeId].walkthroughMd = `# ${nodeLabel} Walkthrough\n\n${output.slice(0, 2000)}`;

            // Read reasoning, tasks, walkthrough from phase files
            const reasoningFile = await readFile(join(phaseDir, "REASONING.md"), "utf-8").catch(() => "");
            const tasksFile = await readFile(join(phaseDir, "TASKS.md"), "utf-8").catch(() => "");
            const walkthroughFile = await readFile(join(phaseDir, "WALKTHROUGH.md"), "utf-8").catch(() => "");
            if (reasoningFile) flowLatest.phases[nodeId].reasoning = reasoningFile;
            if (tasksFile) flowLatest.phases[nodeId].tasksMd = tasksFile;
            if (walkthroughFile) flowLatest.phases[nodeId].walkthroughMd = walkthroughFile;
          }

          await writeFile(join(dir, "pipeline-flow.json"), JSON.stringify(flowLatest, null, 2));
        }

        // Update pipeline.json
        const pjLive = JSON.parse(await readFile(join(dir, "pipeline.json"), "utf-8").catch(() => "{}"));
        const completedCount = Object.values(flowLatest.phases || {}).filter((p: any) => p.status === "completed" || p.status === "failed" || p.status === "skipped").length;
        pjLive.progress = `${completedCount}/${currentOrder.length}`;

        // Cascade to next node(s)
        if (code === 0) {
          // Find next ready nodes: all predecessors must be completed
          const nextReady = currentOrder.filter((nid: string) => {
            const phase = flowLatest.phases?.[nid];
            if (!phase || phase.status !== "pending") return false;
            // All edges targeting this node must have completed sources
            const incoming = edges.filter((e: any) => e.target === nid);
            return incoming.every((e: any) => {
              const srcPhase = flowLatest.phases?.[e.source];
              return srcPhase?.status === "completed";
            });
          });

          if (nextReady.length > 0) {
            // Spawn all ready nodes (branching support)
            for (const readyId of nextReady) {
              await spawnNode(readyId, flowLatest.phases, currentOrder);
            }
          } else {
            // Check if all nodes are done
            const allDone = Object.values(flowLatest.phases || {}).every(
              (p: any) => p.status === "completed" || p.status === "failed" || p.status === "skipped"
            );
            if (allDone) {
              const hasFailures = Object.values(flowLatest.phases || {}).some((p: any) => p.status === "failed");
              pjLive.status = hasFailures ? "completed_with_errors" : "completed";
              pjLive.progress = `${Object.values(flowLatest.phases || {}).length}/${Object.values(flowLatest.phases || {}).length}`;
              pjLive.completedAt = new Date().toISOString();
              pjLive.velocity = (() => {
                const start = new Date(pjLive.startedAt || Date.now()).getTime();
                const end = Date.now();
                const secs = (end - start) / 1000;
                return secs > 0 ? (Object.keys(flowLatest.phases || {}).length / secs).toFixed(3) : "0";
              })();
              pjLive.phases = Object.fromEntries(
                Object.entries(flowLatest.phases || {}).map(([id, ph]: [string, any]) => [id, {
                  status: ph.status || "unknown",
                  agentId: ph.agentId || "",
                  duration: ph.startedAt && ph.completedAt
                    ? Math.round((new Date(ph.completedAt).getTime() - new Date(ph.startedAt).getTime()) / 1000) + "s"
                    : null,
                }])
              );
              await writeJSONAtomic(join(dir, "pipeline.json"), pjLive);

              const metaFinal = JSON.parse(await readFile(join(dir, "META.json"), "utf-8").catch(() => "{}"));
              metaFinal.status = hasFailures ? "completed_with_errors" : "completed";
              metaFinal.completed_at = new Date().toISOString();
              // Sync per-phase statuses from flowLatest into META.json
              if (Array.isArray(metaFinal.phases)) {
                metaFinal.phases = metaFinal.phases.map((p: any) => {
                  const flowPhase = flowLatest.phases?.[p.id];
                  if (flowPhase) {
                    p.status = flowPhase.status;
                    if (flowPhase.completedAt) p.completedAt = flowPhase.completedAt;
                  }
                  return p;
                });
              }
              await writeJSONAtomic(join(dir, "META.json"), metaFinal);

              // Update queue: remove from pending, add to done
              try {
                const qPath = join(MEMORY_DIR, "queue", "queue.json");
                const qRaw = await readFile(qPath, "utf-8").catch(() => "{}");
                const q = JSON.parse(qRaw);
                if (!q.pending) q.pending = [];
                if (!q.done) q.done = [];
                q.pending = q.pending.filter((i: any) => i.id !== id);
                q.done.unshift({ id, project: "PAOS", completedAt: new Date().toISOString(), status: hasFailures ? "completed_with_errors" : "completed" });
                q.done = q.done.slice(0, (q.maxDone || 20));
                await writeFile(qPath, JSON.stringify(q, null, 2));
              } catch {}
            }
          }
        } else {
          // Node failed — update pipeline status but don't cascade (user can retry/skip)
          pjLive.status = "failed";
          await writeJSONAtomic(join(dir, "pipeline.json"), pjLive);
        }
      });
    }

    // ═══ Start execution ═══
    // Kick off the first node
    const firstNodeId = order[0];
    await spawnNode(firstNodeId, flowStatus.phases, order);

    const pid = flowStatus.phases[firstNodeId].pid || 0;

    return NextResponse.json({
      ok: true,
      id,
      flowStatus,
      firstNode: { id: firstNodeId, pid },
      message: `Flow execution started with ${order.length} nodes. First node: ${firstNodeId} (PID ${pid})`,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
