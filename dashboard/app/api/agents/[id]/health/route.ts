import { NextResponse } from "next/server";
import { agentHealth, readRegistry } from "@/lib/paos";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const registry = await readRegistry();
  const agent = registry.agents.find((item) => item.id === id);
  if (!agent) {
    return NextResponse.json({ error: `Unknown agent: ${id}` }, { status: 404 });
  }
  return NextResponse.json(await agentHealth(agent, registry));
}
