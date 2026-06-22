# PAOS Shared MCP Servers

> The unified MCP registry at `mcp/mcp-config.json` is the single source of truth for all PAOS agents.
> When the operator says "install an MCP server", this is where it goes.

## Available Servers

| Server | Tools | Purpose | Status |
|--------|-------|---------|--------|
| **shared-memory** | 14 | PAOS memory operations: ledger, inbox, context, tasks, pipelines, handoff, agent commit, process_notes, process_questions, submit_pipeline | active |
| **scaffold** | 2 | Project scaffolding from templates: scaffold_project, list_templates | active |
| **gitkraken** | read-only | Git context via `gk mcp --readonly`: PRs, issues, repos, commits | active |
| **context7** | 2 | Library documentation: `resolve-library-id`, `query-docs` — fetch current docs for React, Next.js, Prisma, etc. | active |
| **hostinger-domains** | 18 | Domains + domain verification (DNS auth): check, purchase, WHOIS, forwarding, lock, privacy, nameservers | active |
| **hostinger-dns** | 9 | DNS zone management: records, snapshots, validation | active |
| **agent-browser** | 20+ | Browser automation: open, snapshot, click, fill, screenshot, JavaScript eval, tabs, navigation | active |

## How It Works

Each PAOS agent's MCP config is a **symlink** to the unified file:

```
mcp/mcp-config.json                    ← canonical source
├── config/claude/mcp.json             → ../../mcp/mcp-config.json
├── config/gemini/config/mcp_config.json → ../../mcp/mcp-config.json
├── config/codex/mcp_config.json       → ../../mcp/mcp-config.json
├── config/openclaw/mcp_config.json    → ../../mcp/mcp-config.json
├── config/antigravity2/mcp_config.json → ../../mcp/mcp-config.json
├── config/hermes-nous/mcp_config.json → ../../mcp/mcp-config.json
├── config/signal/mcp_config.json      → /home/dev/AI_Workflow/mcp/mcp-config.json
└── (OpenCode uses opencode.json directly — mirrors the same servers)
```

## Adding a New MCP Server

1. Write the server implementation in `~/AI_Workflow/mcp/<server-name>/`
2. Add its `package.json` with `@modelcontextprotocol/sdk` dependency
3. Add the server definition to `~/AI_Workflow/mcp/mcp-config.json`
4. Run `npm install` in the server directory
5. Verify all agents can discover the new tools

## Server Implementation Guidelines

- Use Node.js with the `@modelcontextprotocol/sdk` (stdio transport)
- Use `MEMORY_DIR`, `KNOWLEDGE_DIR`, `REPO_ROOT` env vars for path resolution
- Keep the server focused — one server = one domain
- Add tests in `<server-name>/tests/`
