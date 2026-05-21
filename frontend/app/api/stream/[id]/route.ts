import { NextRequest } from "next/server";

/**
 * GET /api/stream/[id]
 * SSE stream for pipeline progress updates.
 *
 * Watches the pipeline directory for status changes and emits events.
 * Falls back to simulated progress for MVP when no real pipeline is running.
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
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ phase: "connecting", message: "Connected to pipeline stream", timestamp: new Date().toISOString() })}\n\n`,
        ),
      );

      // Simulated pipeline phases for MVP
      const phases = [
        { phase: "analyzing", message: "Analyzing your app idea..." },
        { phase: "analyzing", message: "Extracting functional requirements..." },
        { phase: "analyzing", message: "Identifying user roles and permissions..." },
        { phase: "generating", message: "Generating system overview..." },
        { phase: "generating", message: "Building data model..." },
        { phase: "generating", message: "Drafting API specifications..." },
        { phase: "generating", message: "Creating UI/UX specifications..." },
        { phase: "reviewing", message: "Reviewing SRS for completeness..." },
        { phase: "reviewing", message: "Validating requirements consistency..." },
        { phase: "reviewing", message: "Checking security requirements..." },
        { phase: "building", message: "Generating IMPLEMENTATION_PLAN.md..." },
        { phase: "building", message: "Creating TASKS.md..." },
        { phase: "building", message: "Finalizing WALKTHROUGH.md..." },
        { phase: "complete", message: "SRS generation complete!" },
      ];

      // Emit phases with delays to simulate real processing
      for (let i = 0; i < phases.length; i++) {
        await new Promise((resolve) =>
          setTimeout(resolve, 800 + Math.random() * 1200),
        );

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ ...phases[i], timestamp: new Date().toISOString() })}\n\n`,
          ),
        );
      }

      // Signal completion
      controller.enqueue(
        encoder.encode(`event: complete\ndata: {}\n\n`),
      );

      controller.close();
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
