import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { cp, readdir, mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const TEMPLATES_DIR = process.env.TEMPLATES_DIR || "/home/dev/AI_Workflow/knowledge/templates";

const server = new Server(
  { name: "scaffold-server", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const templates = await readdir(TEMPLATES_DIR, { withFileTypes: true });
  const templateNames = templates.filter((d) => d.isDirectory()).map((d) => d.name);

  return {
    tools: [
      {
        name: "scaffold_project",
        description: "Scaffold a new project from a template",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Project name (directory name)" },
            template: {
              type: "string",
              description: `Template to use. Available: ${templateNames.join(", ")}`,
              enum: templateNames,
            },
            target_dir: {
              type: "string",
              description: "Parent directory to create the project in (default: current dir)",
            },
          },
          required: ["name", "template"],
        },
      },
      {
        name: "list_templates",
        description: "List available scaffold templates",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "list_templates") {
    const templates = await readdir(TEMPLATES_DIR, { withFileTypes: true });
    const names = templates.filter((d) => d.isDirectory()).map((d) => d.name);
    return {
      content: [{ type: "text", text: `Available templates:\n${names.map((n) => `  - ${n}`).join("\n")}` }],
    };
  }

  if (request.params.name === "scaffold_project") {
    const args = request.params.arguments;
    const templatePath = join(TEMPLATES_DIR, args.template);
    const targetPath = resolve(join(args.target_dir || process.cwd(), args.name));

    await mkdir(targetPath, { recursive: true });
    await cp(templatePath, targetPath, { recursive: true });

    return {
      content: [{ type: "text", text: `Project '${args.name}' scaffolded at ${targetPath} from template '${args.template}'.` }],
    };
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
