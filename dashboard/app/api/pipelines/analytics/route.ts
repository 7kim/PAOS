import { NextResponse } from "next/server";
import { getPipelineAnalytics } from "@/lib/pipeline-analytics";

export async function GET() {
  try {
    const analytics = await getPipelineAnalytics();
    return NextResponse.json(analytics);
  } catch (e) {
    return NextResponse.json({ error: String(e), totalPipelines: 0 }, { status: 500 });
  }
}
