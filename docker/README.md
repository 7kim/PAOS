# PAOS Hub — Docker Deployment

## What this runs

| Service | Port | Description |
|---------|------|-------------|
| Dashboard | 3333 | Next.js orchestration UI — ledger, agents, tasks, inbox, plans |
| MCP Server | stdio | Shared-memory MCP server (stdio transport, used by all agents) |

Memory, vault, logs, and knowledge are **mounted from the host** — agents running on the host (Claude Code, Codex, OpenCode) write to the same directories, keeping everything in sync.

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/abdullaabdulhakeem25/AI_Workflow
cd AI_Workflow

# 2. Configure secrets
cp docker/secrets.env.template docker/secrets.env
nano docker/secrets.env    # fill in OPENAI_API_KEY etc.

# 3. Start
docker compose -f docker/docker-compose.yaml up -d

# 4. Open dashboard
open http://localhost:3333
```

---

## Stop / Restart

```bash
docker compose -f docker/docker-compose.yaml down
docker compose -f docker/docker-compose.yaml restart
```

## Logs

```bash
docker compose -f docker/docker-compose.yaml logs -f
```

## Rebuild after code changes

```bash
docker compose -f docker/docker-compose.yaml build --no-cache
docker compose -f docker/docker-compose.yaml up -d
```

---

## Architecture

```
Host machine
├── Claude Code CLI    ─── reads/writes ──→ AI_Workflow/memory/
├── Codex CLI          ─── reads/writes ──→ AI_Workflow/memory/
├── OpenCode           ─── reads/writes ──→ AI_Workflow/memory/
└── Docker container (paos-hub)
    ├── Dashboard :3333  ←── volume mount: AI_Workflow/memory/
    └── MCP server       ←── volume mount: AI_Workflow/memory/
```

All agents share the same `/memory/` directory on the host via volume mounts — no network sync needed.

---

## Environment Variables

See `docker/secrets.env.template` for all required variables.
