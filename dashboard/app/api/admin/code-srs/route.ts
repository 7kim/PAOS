import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { load, dump } from "js-yaml";

const CONFIG_PATH = "/home/dev/AI_Workflow/config/code-srs";
const FEATURES_PATH = join(CONFIG_PATH, "features.yaml");
const MODELS_PATH = join(CONFIG_PATH, "models.yaml");

function readYaml<T>(filePath: string): T {
  const raw = readFileSync(filePath, "utf-8");
  return load(raw) as T;
}

function writeYaml(filePath: string, data: unknown): void {
  writeFileSync(filePath, dump(data, { lineWidth: 120 }), "utf-8");
}

/**
 * GET /api/admin/code-srs
 * Returns current features.yaml and models.yaml contents.
 */
export async function GET() {
  try {
    if (!existsSync(FEATURES_PATH) || !existsSync(MODELS_PATH)) {
      return NextResponse.json(
        { error: "Code-SRS config not found. Run Phase 0 setup first." },
        { status: 404 },
      );
    }

    const features = readYaml<Record<string, unknown>>(FEATURES_PATH);
    const models = readYaml<Record<string, unknown>>(MODELS_PATH);

    return NextResponse.json({ features, models });
  } catch (error) {
    console.error("Failed to read Code-SRS config:", error);
    return NextResponse.json(
      { error: "Failed to load configuration" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/admin/code-srs?type=features
 * PATCH /api/admin/code-srs?type=models
 *
 * Update features.yaml or models.yaml.
 */
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (!type || !["features", "models"].includes(type)) {
      return NextResponse.json(
        { error: "Query parameter 'type' must be 'features' or 'models'" },
        { status: 400 },
      );
    }

    const body = await request.json();

    if (type === "features") {
      if (!body.features) {
        return NextResponse.json(
          { error: "Body must contain 'features' key" },
          { status: 400 },
        );
      }
      writeYaml(FEATURES_PATH, { features: body.features });
      return NextResponse.json({
        success: true,
        message: "Features updated",
      });
    }

    if (type === "models") {
      if (!body.models) {
        return NextResponse.json(
          { error: "Body must contain 'models' key" },
          { status: 400 },
        );
      }
      writeYaml(MODELS_PATH, { models: body.models });
      return NextResponse.json({
        success: true,
        message: "Models updated",
      });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Failed to update Code-SRS config:", error);
    return NextResponse.json(
      { error: "Failed to update configuration" },
      { status: 500 },
    );
  }
}
