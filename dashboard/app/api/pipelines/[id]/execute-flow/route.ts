import { NextResponse } from "next/server";
import { readFile, writeFile, mkdir, readdir } from "fs/promises";
import { join } from "path";
import { spawn } from "child_process";

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const PIPELINES_DIR = join(MEMORY_DIR, "pipelines");

// Walk DAG in topological order
function topoSort(nodes: any[], edges: any[]): string[] {
  const hasIncoming = new Set(edges.map((e: any) => e.target));
  const roots = nodes.filter((n: any) => !hasIncoming.has(n.id));
  const visited = new Set<string>();
  const order: string[] = [];

  function visit(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    const deps = edges.filter((e: any) => e.source === nodeId);
    for (const dep of deps) visit(dep.target);
    order.push(nodeId);
  }

  for (const root of roots) visit(root.id);
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
  const prompt = nd.prompt || "";
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
        agent: nd.agentId || "unknown",
        role: "agent",
        label: nd.label || nd.agentId || "Agent",
        status: nodeId === order[0] ? "executing" : "pending",
        artifacts: [`phases/${nodeId}/IMPLEMENTATION.md`],
      };
    });
    await writeFile(join(dir, "META.json"), JSON.stringify(meta, null, 2));

    // Also update pipeline.json
    const pj = { status: "executing", currentTask: order[0] || "", progress: `0/${order.length}`, startedAt: new Date().toISOString() };
    await writeFile(join(dir, "pipeline.json"), JSON.stringify(pj, null, 2));

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
      await writeFile(join(dir, "pipeline.json"), JSON.stringify(pjLatest, null, 2));

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
            flowLatest.phases[nodeId].reasoning = flowLatest.phases[nodeId].reasoning || "";
            flowLatest.phases[nodeId].tasksMd = flowLatest.phases[nodeId].tasksMd || "";
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
              await writeFile(join(dir, "pipeline.json"), JSON.stringify(pjLive, null, 2));

              const metaFinal = JSON.parse(await readFile(join(dir, "META.json"), "utf-8").catch(() => "{}"));
              metaFinal.status = hasFailures ? "completed_with_errors" : "completed";
              metaFinal.completed_at = new Date().toISOString();
              await writeFile(join(dir, "META.json"), JSON.stringify(metaFinal, null, 2));
            }
          }
        } else {
          // Node failed — update pipeline status but don't cascade (user can retry/skip)
          pjLive.status = "failed";
          await writeFile(join(dir, "pipeline.json"), JSON.stringify(pjLive, null, 2));
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
