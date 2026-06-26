import { NextResponse } from "next/server";
import { getAgentStats } from "@/lib/agent-stats";

export async function GET() {
  try {
    const stats = await getAgentStats();
    return NextResponse.json(stats);
  } catch (e) {
    return NextResponse.json({ agents: {}, totalActions: 0, error: String(e) });
  }
}
