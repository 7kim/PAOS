import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { resolveModelAlias, isValidAlias } from "@/lib/models";
import { loadFeatures } from "@/lib/features";
import { appendLedger } from "@/lib/audit";

const pipelineSchema = z.object({
  prompt: z
    .string()
    .min(10, "Prompt must be at least 10 characters")
    .max(2000, "Prompt must not exceed 2000 characters")
    .transform((val) => val.replace(/<[^>]*>/g, "").trim()),
  model_alias: z.string().min(1, "Model alias is required"),
  projectId: z.string().optional(),
});

/**
 * POST /api/pipeline
 * Submit a new project idea for SRS generation.
 * Resolves model alias server-side — real model IDs never leave the server.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = pipelineSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const { prompt, model_alias, projectId: existingId } = parsed.data;

    // Validate model alias
    if (!isValidAlias(model_alias)) {
      return NextResponse.json(
        { error: `Unknown model alias: ${model_alias}` },
        { status: 400 },
      );
    }

    // Load feature flags
    const features = loadFeatures();

    // Generate project ID
    const projectId = existingId || crypto.randomUUID();

    // Resolve alias to real model ID (server-side only)
    const modelId = resolveModelAlias(model_alias);

    // TODO: Submit to PAOS pipeline (write to inbox/developer/ + pipelines/)
    // This will be wired to the /h-pipeline system in production
    const pipelineId = `PIPE-${Date.now().toString(36)}-${crypto.randomBytes(4).toString("hex")}`;

    // Audit log
    await appendLedger({
      action: "PIPELINE_SUBMIT",
      task: projectId,
      agent: "frontend-user",
      description: `Pipeline submitted: model=${model_alias}, prompt length=${prompt.length}`,
    });

    return NextResponse.json({
      projectId,
      pipelineId,
      modelAlias: model_alias,
    });
  } catch (error) {
    console.error("Pipeline submission failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
