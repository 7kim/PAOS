import { NextResponse } from "next/server";
import { planResources } from "@/lib/resource-planner";

/**
 * POST /api/planner
 *
 * Analyzes pipeline requirements and returns a resource plan:
 *   - Recommended parallelism
 *   - Estimated token usage & cost
 *   - Suggested agent assignments per phase
 *
 * Body:
 *   { prompt: string, phases: { label: string }[] }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt: string = body.prompt || "";
    const phases: { label: string }[] = body.phases || [];

    if (!prompt && phases.length === 0) {
      return NextResponse.json(
        { error: "Provide a 'prompt' and/or 'phases' array" },
        { status: 400 },
      );
    }

    const phaseLabels = phases.map((p) => p.label || "Untitled phase");
    if (phaseLabels.length === 0) {
      phaseLabels.push(prompt.slice(0, 100) || "Implementation");
    }

    const plan = planResources(prompt, phaseLabels);
    return NextResponse.json(plan);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
