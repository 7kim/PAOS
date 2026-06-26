import { NextResponse } from "next/server";
import { getInstallableAgents } from "@/lib/agent-lifecycle";

export async function GET() {
  try {
    const agents = await getInstallableAgents();
    return NextResponse.json({ agents });
  } catch (e) {
    return NextResponse.json({ agents: [], error: String(e) });
  }
}
