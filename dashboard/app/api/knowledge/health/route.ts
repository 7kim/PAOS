import { NextResponse } from "next/server";
import { scanKnowledgeHealth } from "@/lib/knowledge-health";

export async function GET() {
  try {
    const summary = await scanKnowledgeHealth();
    // Return the full summary
    return NextResponse.json(summary);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
