import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

interface PipelineEvent {
  phase: string;
  message: string;
  timestamp: string;
}

/**
 * Read the latest pipeline events from the filesystem.
 * Watches memory/pipelines/<id>/ for status changes.
 */
function readPipelineEvents(pipelineId: string): PipelineEvent[] {
  const events: PipelineEvent[] = [];
  const pipelinesDir = path.join(
    process.env.HOME || "/home/dev",
    "AI_Workflow",
    "memory",
    "pipelines",
    pipelineId,
  );

  if (!fs.existsSync(pipelinesDir)) {
    return [];
  }

  // Read META.json for status
  const metaPath = path.join(pipelinesDir, "META.json");
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      const ts = meta.created_at || new Date().toISOString();
      events.push({
        phase: "submitted",
        message: `Pipeline submitted by ${meta.planner || "unknown"}`,
        timestamp: ts,
      });
      if (meta.status === "running") {
        events.push({
          phase: "running",
          message: "Pipeline execution started",
          timestamp: new Date().toISOString(),
        });
      }
      if (meta.completed_at) {
        events.push({
          phase: "complete",
          message: "Pipeline execution complete!",
          timestamp: meta.completed_at,
        });
      }
    } catch {
      // ignore parse errors
    }
  }

  // Read PLAN.md existence as an event
  const planPath = path.join(pipelinesDir, "PLAN.md");
  if (fs.existsSync(planPath)) {
    events.push({
      phase: "planning",
      message: "Implementation plan generated",
      timestamp: new Date(fs.statSync(planPath).mtime).toISOString(),
    });
  }

  // Read TASKS.md for task progress
  const tasksPath = path.join(pipelinesDir, "TASKS.md");
  if (fs.existsSync(tasksPath)) {
    const tasksContent = fs.readFileSync(tasksPath, "utf-8");
    const completedTasks = (tasksContent.match(/\[x\]/g) || []).length;
    const totalTasks = (tasksContent.match(/\[ \]/g) || []).length + completedTasks;
    if (totalTasks > 0) {
      events.push({
        phase: "executing",
        message: `Tasks: ${completedTasks}/${totalTasks} completed`,
        timestamp: new Date(fs.statSync(tasksPath).mtime).toISOString(),
      });
    }
  }

  // Read WALKTHROUGH.md existence as completion event
  const walkthroughPath = path.join(pipelinesDir, "WALKTHROUGH.md");
  if (fs.existsSync(walkthroughPath)) {
    events.push({
      phase: "reviewing",
      message: "Walkthrough document generated",
      timestamp: new Date(fs.statSync(walkthroughPath).mtime).toISOString(),
    });
  }

  return events;
}

/**
 * GET /api/stream/[id]
 * SSE stream for pipeline progress updates.
 * Tails real pipeline events from memory/pipelines/<id>/ with polling.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connected event
      const connected: PipelineEvent = {
        phase: "connecting",
        message: "Connected to pipeline event stream",
        timestamp: new Date().toISOString(),
      };
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(connected)}\n\n`),
      );

      // Check for initial events
      const initialEvents = readPipelineEvents(id);
      if (initialEvents.length > 0) {
        for (const event of initialEvents) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
          );
        }
        // If pipeline is already complete, close immediately
        if (initialEvents.some((e) => e.phase === "complete")) {
          controller.enqueue(encoder.encode(`event: complete\ndata: {}\n\n`));
          controller.close();
          return;
        }
      } else {
        // Pipeline not found yet — it might be queued
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ phase: "queued", message: "Pipeline is queued for execution", timestamp: new Date().toISOString() })}\n\n`,
          ),
        );
      }

      // Poll for changes every 3 seconds (max 2 minutes)
      let pollCount = 0;
      const maxPolls = 40;
      let lastEventCount = initialEvents.length;

      const interval = setInterval(() => {
        pollCount++;
        const currentEvents = readPipelineEvents(id);

        if (currentEvents.length > lastEventCount) {
          // New events found
          for (let i = lastEventCount; i < currentEvents.length; i++) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(currentEvents[i])}\n\n`),
            );
          }
          lastEventCount = currentEvents.length;

          // Check for completion
          if (currentEvents.some((e) => e.phase === "complete")) {
            controller.enqueue(encoder.encode(`event: complete\ndata: {}\n\n`));
            clearInterval(interval);
            controller.close();
            return;
          }
        }

        if (pollCount >= maxPolls) {
          // Timed out — send keepalive close
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ phase: "timeout", message: "Monitoring ended (pipeline may still be running)", timestamp: new Date().toISOString() })}\n\n`,
            ),
          );
          controller.enqueue(encoder.encode(`event: complete\ndata: {}\n\n`));
          clearInterval(interval);
          controller.close();
        }
      }, 3000);

      // Cleanup on client disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
