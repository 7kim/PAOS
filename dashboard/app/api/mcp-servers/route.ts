import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { MEMORY_DIR } from "@/lib/global-config";

export async function GET() {
  try {
    const mcpConfig = await readFile(
      join(MEMORY_DIR, "..", "mcp", "mcp-config.json"),
      "utf-8"
    );
    const config = JSON.parse(mcpConfig);
    const servers: { name: string; description: string }[] = [];

    // Extract MCP server names from config
    if (config.mcpServers) {
      for (const [name, _server] of Object.entries(config.mcpServers)) {
        servers.push({
          name,
          description: `MCP server: ${name}`,
        });
      }
    }

    return NextResponse.json({ servers });
  } catch {
    return NextResponse.json({
      servers: [
        { name: "context7", description: "Library documentation search" },
        { name: "shadcn", description: "shadcn/ui component registry" },
        { name: "21st-dev", description: "21st.dev component inspiration" },
        { name: "browser", description: "Web browser automation" },
        { name: "shared-memory", description: "PAOS shared agent memory" },
      ],
    });
  }
}
