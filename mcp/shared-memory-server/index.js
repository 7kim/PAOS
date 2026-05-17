import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFile, writeFile, appendFile, readdir, mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

const MEMORY_DIR = process.env.MEMORY_DIR || "/home/dev/AI_Workflow/memory";
const KNOWLEDGE_DIR = process.env.KNOWLEDGE_DIR || "/home/dev/AI_Workflow/knowledge";
const REPO_ROOT = process.env.REPO_ROOT || "/home/dev/AI_Workflow";
const INBOX_DIR = join(MEMORY_DIR, "inbox");
const CONTEXT_FILE = join(MEMORY_DIR, "shared", "context.md");
const HANDOFF_FILE = join(MEMORY_DIR, "shared", "HANDOFF.md");
const LEDGER_FILE = join(MEMORY_DIR, "global_ledger.md");
const TASKS_DIR = join(MEMORY_DIR, "tasks");

// ── Known agents ──────────────────────────────────────────────────────────────
const KNOWN_AGENTS = [
  { id: "claude",               label: "Claude Code",          email: "claude@paos.nodealgo.com" },
  { id: "codex",                label: "Codex",                email: "codex@paos.nodealgo.com" },
  { id: "opencode-developer",   label: "OpenCode Developer",   email: "developer@paos.nodealgo.com" },
  { id: "opencode-architect",   label: "OpenCode Architect",   email: "architect@paos.nodealgo.com" },
  { id: "opencode-coordinator", label: "OpenCode Coordinator", email: "coordinator@paos.nodealgo.com" },
  { id: "opencode-plan",        label: "OpenCode Plan",        email: "plan@paos.nodealgo.com" },
  { id: "antigravity",          label: "Antigravity",          email: "antigravity@paos.nodealgo.com" },
  { id: "openclaw",             label: "OpenClaw",             email: "openclaw@paos.nodealgo.com" },
  { id: "ollama",               label: "Ollama",               email: "ollama@paos.nodealgo.com" },
  { id: "gemini",               label: "Gemini",               email: "gemini@paos.nodealgo.com" },
];

const server = new Server(
  { name: "shared-memory-server", version: "1.1.0" },
  { capabilities: { resources: {}, tools: {} } }
);

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCES
// ─────────────────────────────────────────────────────────────────────────────
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const memoryFiles = await readdir(MEMORY_DIR, { withFileTypes: true });
  const knowledgeFiles = await readdir(KNOWLEDGE_DIR, { withFileTypes: true });
  const resources = [];

  for (const dirent of memoryFiles) {
    if (dirent.isFile()) {
      resources.push({ uri: `memory://${dirent.name}`, name: dirent.name, mimeType: "text/markdown" });
    }
  }

  for (const dirent of knowledgeFiles) {
    if (dirent.isDirectory()) {
      const subFiles = await readdir(join(KNOWLEDGE_DIR, dirent.name), { withFileTypes: true }).catch(() => []);
      for (const sub of subFiles) {
        if (sub.isFile()) {
          resources.push({
            uri: `knowledge://${dirent.name}/${sub.name}`,
            name: `${dirent.name}/${sub.name}`,
            mimeType: "text/markdown",
          });
        }
      }
    }
  }

  return { resources };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri.startsWith("memory://")) {
    const filename = uri.slice("memory://".length);
    const content = await readFile(join(MEMORY_DIR, filename), "utf-8");
    return { contents: [{ uri, mimeType: "text/markdown", text: content }] };
  }

  if (uri.startsWith("knowledge://")) {
    const relPath = uri.slice("knowledge://".length);
    const content = await readFile(join(KNOWLEDGE_DIR, relPath), "utf-8");
    return { contents: [{ uri, mimeType: "text/markdown", text: content }] };
  }

  throw new Error(`Resource not found: ${uri}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// TOOLS — definitions
// ─────────────────────────────────────────────────────────────────────────────
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // ── Original 3 ──────────────────────────────────────────────────────────
    {
      name: "append_ledger",
      description: "Append an audit row to memory/global_ledger.md. Every agent action must be logged here.",
      inputSchema: {
        type: "object",
        properties: {
          timestamp:      { type: "string", description: "ISO 8601 UTC timestamp" },
          task_id:        { type: "string", description: "Task identifier (e.g. #TASK-002) or '-'" },
          agent_name:     { type: "string", description: "Agent ID (claude, codex, opencode-developer, ...)" },
          action_type:    { type: "string", description: "CREATE | READ | UPDATE | DELETE | EXEC | COMMIT | MSG" },
          files_modified: { type: "string", description: "Comma-separated file paths or '-'" },
          description:    { type: "string", description: "What was done and why" },
          commit_hash:    { type: "string", description: "Git commit hash or trace ID, or '-'" },
        },
        required: ["timestamp", "task_id", "agent_name", "action_type", "description"],
      },
    },
    {
      name: "send_message",
      description: "Send a message to another agent's inbox at memory/inbox/<target_agent>/. Used for agent-to-agent task delegation.",
      inputSchema: {
        type: "object",
        properties: {
          target_agent: { type: "string", description: "Recipient agent ID" },
          sender:       { type: "string", description: "Your agent ID" },
          subject:      { type: "string", description: "Message subject" },
          body:         { type: "string", description: "Message body (markdown)" },
          priority:     { type: "string", description: "low | normal | high (default: normal)" },
        },
        required: ["target_agent", "sender", "subject", "body"],
      },
    },
    {
      name: "read_inbox",
      description: "Read messages from your agent's inbox at memory/inbox/<agent>/",
      inputSchema: {
        type: "object",
        properties: {
          agent: { type: "string", description: "Your agent ID" },
          limit: { type: "number", description: "Max messages (default 10)" },
        },
        required: ["agent"],
      },
    },
    // ── New 7 ───────────────────────────────────────────────────────────────
    {
      name: "read_context",
      description: "Read the shared thinking context at memory/shared/context.md. Always read this at session start.",
      inputSchema: {
        type: "object",
        properties: {
          tail_lines: { type: "number", description: "Return only the last N lines (default: full file)" },
        },
        required: [],
      },
    },
    {
      name: "write_context",
      description: "Append a structured thinking entry to memory/shared/context.md. Use this during and after work to share state with other agents.",
      inputSchema: {
        type: "object",
        properties: {
          agent:     { type: "string", description: "Your agent ID" },
          task_id:   { type: "string", description: "Task or session identifier" },
          thinking:  { type: "string", description: "Key ideas, reasoning, decisions" },
          decisions: { type: "string", description: "Bullet list of decisions made" },
          handoff:   { type: "string", description: "Notes for the next agent in the pipeline" },
        },
        required: ["agent", "task_id", "thinking"],
      },
    },
    {
      name: "list_agents",
      description: "List all known PAOS agents with their inbox message counts and last activity time.",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "create_task",
      description: "Create a new task card at memory/tasks/<task_id>.md. Used to hand off work between agents.",
      inputSchema: {
        type: "object",
        properties: {
          task_id:      { type: "string", description: "Unique task ID (e.g. TASK-003)" },
          title:        { type: "string", description: "One-line task title" },
          description:  { type: "string", description: "Full task description (markdown)" },
          assigned_to:  { type: "string", description: "Agent ID to assign this task to" },
          created_by:   { type: "string", description: "Your agent ID" },
          priority:     { type: "string", description: "low | normal | high | critical (default: normal)" },
          depends_on:   { type: "string", description: "Comma-separated task IDs this depends on, or '-'" },
        },
        required: ["task_id", "title", "description", "assigned_to", "created_by"],
      },
    },
    {
      name: "read_task",
      description: "Read a task card from memory/tasks/<task_id>.md",
      inputSchema: {
        type: "object",
        properties: {
          task_id: { type: "string", description: "Task ID to read (e.g. TASK-003)" },
        },
        required: ["task_id"],
      },
    },
    {
      name: "read_ledger",
      description: "Read the global audit ledger (memory/global_ledger.md). Use at session start to see what other agents have done.",
      inputSchema: {
        type: "object",
        properties: {
          tail_lines: { type: "number", description: "Return only last N lines (default: last 50)" },
        },
        required: [],
      },
    },
    {
      name: "agent_commit",
      description: "Make a git commit to AI_Workflow with proper agent identity. The commit will appear in gitgraph under the agent's name/email.",
      inputSchema: {
        type: "object",
        properties: {
          agent_id: { type: "string", description: "Agent ID (claude, codex, opencode-developer, ...)" },
          message:  { type: "string", description: "Commit message — should follow: Agent[<id>]: <description>" },
          stage_all: { type: "boolean", description: "Stage all changes before committing (default: true)" },
        },
        required: ["agent_id", "message"],
      },
    },
    {
      name: "write_handoff",
      description: "Rewrite memory/shared/HANDOFF.md with the current session state. Call this whenever the active task changes and always at session end. Preserves the Active Projects and Key Decisions sections from the existing file.",
      inputSchema: {
        type: "object",
        properties: {
          agent:        { type: "string", description: "Your agent ID (claude, codex, opencode-developer, ...)" },
          active_task:  { type: "string", description: "One-line description of what is currently being worked on" },
          what_done:    { type: "string", description: "Bullet lines (starting with -) of what was completed this session" },
          what_pending: { type: "string", description: "Bullet lines (starting with -) of what is NOT done yet" },
          session_note: { type: "string", description: "Optional one-line session label (e.g. 'MCP write_handoff implementation')" },
        },
        required: ["agent", "active_task", "what_done", "what_pending"],
      },
    },
  ],
}));

// ─────────────────────────────────────────────────────────────────────────────
// TOOLS — handlers
// ─────────────────────────────────────────────────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  // ── append_ledger ──────────────────────────────────────────────────────────
  if (name === "append_ledger") {
    const row = `| ${args.timestamp} | ${args.agent_name} | ${args.action_type} | ${args.files_modified || "-"} | ${args.description} | ${args.task_id} | ${args.commit_hash || "-"} |\n`;
    await appendFile(LEDGER_FILE, row);
    return { content: [{ type: "text", text: "Ledger entry appended." }] };
  }

  // ── send_message ───────────────────────────────────────────────────────────
  if (name === "send_message") {
    const { target_agent, sender, subject, body, priority = "normal" } = args;
    const ts = Date.now();
    const filename = `${ts}-${sender}.md`;
    const filePath = join(INBOX_DIR, target_agent, filename);
    await mkdir(join(INBOX_DIR, target_agent), { recursive: true });
    const content = `---\nfrom: ${sender}\nto: ${target_agent}\nsubject: ${subject}\npriority: ${priority}\ntimestamp: ${new Date(ts).toISOString()}\n---\n\n# ${subject}\n\n**From**: ${sender}  \n**Priority**: ${priority}  \n**Sent**: ${new Date(ts).toISOString()}\n\n${body}\n`;
    await writeFile(filePath, content);
    return { content: [{ type: "text", text: JSON.stringify({ ok: true, path: filePath, timestamp: new Date(ts).toISOString() }) }] };
  }

  // ── read_inbox ─────────────────────────────────────────────────────────────
  if (name === "read_inbox") {
    const { agent, limit = 10 } = args;
    const dir = join(INBOX_DIR, agent);
    let files;
    try {
      files = await readdir(dir);
    } catch {
      return { content: [{ type: "text", text: JSON.stringify([]) }] };
    }
    const recent = files.filter(f => f.endsWith(".md")).sort().slice(-limit);
    const messages = [];
    for (const f of recent) {
      const content = await readFile(join(dir, f), "utf-8");
      messages.push({ filename: f, content });
    }
    return { content: [{ type: "text", text: JSON.stringify(messages, null, 2) }] };
  }

  // ── read_context ───────────────────────────────────────────────────────────
  if (name === "read_context") {
    const { tail_lines } = args;
    let content = await readFile(CONTEXT_FILE, "utf-8").catch(() => "# Shared Context\n\n(empty)\n");
    if (tail_lines) {
      const lines = content.split("\n");
      content = lines.slice(-tail_lines).join("\n");
    }
    return { content: [{ type: "text", text: content }] };
  }

  // ── write_context ──────────────────────────────────────────────────────────
  if (name === "write_context") {
    const { agent, task_id, thinking, decisions = "", handoff = "" } = args;
    const ts = new Date().toISOString().slice(0, 16).replace("T", " ");
    const entry = `\n---\n\n## ${ts} @${agent} — Task: ${task_id}\n\n**Thinking**: ${thinking}\n${decisions ? `\n**Decisions**:\n${decisions}\n` : ""}${handoff ? `\n**Handoff Notes**: ${handoff}\n` : ""}`;
    await appendFile(CONTEXT_FILE, entry);
    return { content: [{ type: "text", text: "Context entry appended." }] };
  }

  // ── list_agents ────────────────────────────────────────────────────────────
  if (name === "list_agents") {
    const results = [];
    for (const agent of KNOWN_AGENTS) {
      const inboxDir = join(INBOX_DIR, agent.id);
      let inboxCount = 0;
      let lastActivity = null;
      try {
        const files = await readdir(inboxDir);
        inboxCount = files.filter(f => f.endsWith(".md")).length;
      } catch { /* no inbox */ }
      try {
        const eventsFile = join(MEMORY_DIR, agent.id, "events.md");
        const s = await stat(eventsFile);
        lastActivity = s.mtime.toISOString();
      } catch { /* no events */ }
      results.push({ ...agent, inbox: inboxCount, lastActivity });
    }
    return { content: [{ type: "text", text: JSON.stringify(results, null, 2) }] };
  }

  // ── create_task ────────────────────────────────────────────────────────────
  if (name === "create_task") {
    const { task_id, title, description, assigned_to, created_by, priority = "normal", depends_on = "-" } = args;
    const ts = new Date().toISOString();
    const card = `---\ntask_id: ${task_id}\ntitle: "${title}"\nstatus: pending\nassigned_to: ${assigned_to}\ncreated_by: ${created_by}\npriority: ${priority}\ndepends_on: ${depends_on}\ncreated_at: ${ts}\n---\n\n# ${task_id} — ${title}\n\n**Status**: pending  \n**Assigned**: ${assigned_to}  \n**Created by**: ${created_by}  \n**Priority**: ${priority}  \n**Depends on**: ${depends_on}  \n**Created**: ${ts}\n\n## Description\n\n${description}\n\n## Progress\n\n<!-- Agent updates this section during execution -->\n`;
    await mkdir(TASKS_DIR, { recursive: true });
    const filePath = join(TASKS_DIR, `${task_id}.md`);
    await writeFile(filePath, card);
    return { content: [{ type: "text", text: JSON.stringify({ ok: true, path: filePath, task_id }) }] };
  }

  // ── read_task ──────────────────────────────────────────────────────────────
  if (name === "read_task") {
    const { task_id } = args;
    const filePath = join(TASKS_DIR, `${task_id}.md`);
    const content = await readFile(filePath, "utf-8");
    return { content: [{ type: "text", text: content }] };
  }

  // ── read_ledger ────────────────────────────────────────────────────────────
  if (name === "read_ledger") {
    const { tail_lines = 50 } = args;
    const content = await readFile(LEDGER_FILE, "utf-8").catch(() => "# Global Ledger\n\n(empty)\n");
    const lines = content.split("\n");
    const tail = lines.slice(-tail_lines).join("\n");
    return { content: [{ type: "text", text: tail }] };
  }

  // ── agent_commit ───────────────────────────────────────────────────────────
  if (name === "agent_commit") {
    const { agent_id, message, stage_all = true } = args;
    const commitScript = join(REPO_ROOT, "bin", "agent-commit.sh");
    const stageFlag = stage_all ? "" : "--no-stage";
    try {
      const { stdout, stderr } = await execAsync(
        `bash "${commitScript}" "${agent_id}" "${message.replace(/"/g, '\\"')}" ${stageFlag}`,
        { cwd: REPO_ROOT }
      );
      return { content: [{ type: "text", text: stdout + (stderr ? `\nSTDERR: ${stderr}` : "") }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Commit failed: ${err.message}` }], isError: true };
    }
  }

  // ── write_handoff ──────────────────────────────────────────────────────────
  if (name === "write_handoff") {
    const { agent, active_task, what_done, what_pending, session_note = "" } = args;
    const ts = new Date().toISOString();
    const tool = KNOWN_AGENTS.find(a => a.id === agent)?.label ?? agent;

    // Preserve stable sections from the existing file if present
    let projectsSection = "";
    let decisionsSection = "";
    try {
      const existing = await readFile(HANDOFF_FILE, "utf-8");
      const projectsMatch = existing.match(/## Active Projects[\s\S]*?(?=\n## |\n---|\s*$)/);
      const decisionsMatch = existing.match(/## Key Decisions[\s\S]*?(?=\n## |\n---|\s*$)/);
      if (projectsMatch) projectsSection = projectsMatch[0].trim();
      if (decisionsMatch) decisionsSection = decisionsMatch[0].trim();
    } catch { /* first write — no existing file */ }

    const content = [
      "# HANDOFF — Current PAOS State",
      "",
      "> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.",
      "> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.",
      "",
      "---",
      "",
      "## Last Agent",
      `- **Agent**: ${agent}`,
      `- **Tool**: ${tool}`,
      `- **Timestamp**: ${ts}`,
      ...(session_note ? [`- **Session**: ${session_note}`] : []),
      "",
      "## Active Task",
      active_task,
      "",
      "## What Was Just Done",
      what_done,
      "",
      "## What Is NOT Done Yet",
      what_pending,
      "",
      ...(projectsSection ? [projectsSection, ""] : []),
      ...(decisionsSection ? [decisionsSection, ""] : []),
      "## How to Pick Up",
      "1. Read this file (done)",
      "2. Call `shared-memory: read_ledger` — last 20 rows",
      "3. Read `vault/chats/` — most recent chat summary",
      "4. Ask the operator: \"Continuing from HANDOFF — what's next?\"",
      "",
    ].join("\n");

    await mkdir(join(MEMORY_DIR, "shared"), { recursive: true });
    await writeFile(HANDOFF_FILE, content);
    return { content: [{ type: "text", text: content }] };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// START
// ─────────────────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
