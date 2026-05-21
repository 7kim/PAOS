import { NextResponse } from "next/server";
import { getPublicModels } from "@/lib/models";

/**
 * GET /api/models
 * Returns the list of available model aliases.
 * Real model IDs are NEVER included in the response.
 */
export async function GET() {
  try {
    const models = getPublicModels();
    return NextResponse.json(models);
  } catch (error) {
    console.error("Failed to load models:", error);
    return NextResponse.json(
      { error: "Failed to load models" },
      { status: 500 },
    );
  }
}
