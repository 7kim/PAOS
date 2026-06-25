# PAOS Dashboard API Reference

> **56 REST endpoints** across 22 resource groups.  
> Base URL: `http://localhost:3333`  
> Framework: Next.js 16 App Router (file-system based routing)  
> Storage: All endpoints read/write markdown and JSON files on disk — no database.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Ledger](#2-ledger)
3. [Pipelines](#3-pipelines)
4. [Projects](#4-projects)
5. [Agents](#5-agents)
6. [Templates](#6-templates)
7. [Events](#7-events)
8. [Inbox](#8-inbox)
9. [Handoff](#9-handoff)
10. [Skills](#10-skills)
11. [Send Message](#11-send-message)
12. [Secrets](#12-secrets)
13. [Global Secrets](#13-global-secrets)
14. [Tasks](#14-tasks)
15. [MCP Servers](#15-mcp-servers)
16. [Queue](#16-queue)
17. [Plans](#17-plans)
18. [Vault](#18-vault)
19. [Workspaces](#19-workspaces)
20. [Git View](#20-git-view)
21. [System Doctor](#21-system-doctor)
22. [Admin / Code-SRS](#22-admin--code-srs)

---

## 1. Overview

### `GET /api/overview`

Returns aggregate PAOS system statistics and recent activity.

**Parameters**: None

**Response**:
```json
{
  "stats": {
    "tasks": 4,
    "plans": 8,
    "inboxTotal": 23,
    "ledgerCount": 147,
    "agents": 12,
    "healthyAgents": 10,
    "degradedAgents": 2,
    "systemStatus": "healthy"
  },
  "recent": [
    {
      "timestamp": "2026-06-25T16:46:23Z",
      "agent": "opencode-developer",
      "action": "CREATE",
      "file": "docs/api.md",
      "description": "Created API documentation",
      "task": "#TASK-001"
    }
  ],
  "unhealthyAgents": []
}
```

**Dependencies**: `memory/global_ledger.md`, `memory/tasks/`, `memory/pm-logs/`, `memory/inbox/`, `agents/registry.json`

---

## 2. Ledger

### `GET /api/ledger`

Returns parsed rows from the global audit ledger or a specific project's ledger.

**Query Parameters**:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `project` | string | No | Project name to get its ledger. Omit for global ledger. |
| `all` | "true" | No | Returns ALL project ledgers + global in one response. |

**Response** (single):
```json
{
  "entries": [
    {
      "timestamp": "2026-06-25T16:46:23Z",
      "agent": "opencode-developer",
      "action": "CREATE",
      "file": "docs/api.md",
      "description": "Created comprehensive API documentation",
      "task": "#TASK-001",
      "commit": "abc1234"
    }
  ],
  "raw": "| Timestamp | Task | Agent | Action | Files | Description | Commit |\n|-----------|------|-------|--------|-------|-------------|--------|\n| ..."
}
```

**Response** (all mode):
```json
{
  "all": {
    "__global__": { "entries": [...], "raw": "..." },
    "PAOS": { "entries": [...], "raw": "..." }
  }
}
```

**Dependencies**: `memory/global_ledger.md`, `memory/pipelines/<name>/ledger.md`, `projects/<name>/ledger.md`

---

## 3. Pipelines

### `GET /api/pipelines`

Lists all pipelines across all or a filtered project.

**Query Parameters**:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `project` | string | No | Filter to pipelines within a specific project |

**Response**:
```json
{
  "pipelines": [
    {
      "id": "PIPE-25-06-2026---18-06",
      "project": "PAOS",
      "status": "completed",
      "queue": "done",
      "phases": [
        { "name": "Explore", "completed": 1, "total": 1 },
        { "name": "Document", "completed": 1, "total": 1 }
      ],
      "planner": "opencode-developer",
      "executor": "opencode-developer",
      "prompt": "Write comprehensive documentation",
      "created_at": "2026-06-25T18:06:00Z",
      "completed_at": "2026-06-25T19:00:00Z",
      "completedTasks": 2,
      "totalTasks": 2,
      "hasWalkthrough": true
    }
  ]
}
```

**Dependencies**: `memory/pipelines/*/META.json`, `TASKS.md`, `WALKTHROUGH.md`, `pipeline.json`, `memory/queue/queue.json`

---

### `POST /api/pipelines`

Creates a new pipeline with auto-generated PIPE-ID.

**Body Parameters** (JSON):
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `project` | string | No | `"PAOS"` | Project namespace |
| `prompt` | string | No | `"New pipeline"` | Pipeline description |
| `planMd` | string | No | — | PLAN.md markdown content |
| `tasksMd` | string | No | `"[ ] Task 1"` | TASKS.md markdown content |
| `builderLayout` | object | No | — | Flow Builder DAG JSON (nodes/edges) |

**Response**:
```json
{
  "ok": true,
  "id": "PIPE-25-06-2026---18-06",
  "project": "PAOS",
  "dir": "/home/dev/AI_Workflow/memory/pipelines/PAOS/PIPE-25-06-2026---18-06"
}
```

---

### `GET /api/pipelines/:id`

Returns detailed pipeline info with all artifacts, task list, version history, and stats.

**Path Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Pipeline ID (e.g., `PIPE-25-06-2026---18-06`) |

**Response**:
```json
{
  "id": "PIPE-25-06-2026---18-06",
  "meta": { "status": "completed", "planner": "opencode-developer", ... },
  "pipeline": { "status": "completed", "currentTask": "Done", "progress": "2/2" },
  "phases": [
    {
      "agent": "opencode-developer",
      "role": "executor",
      "label": "Phase 0",
      "status": "completed",
      "artifacts": [
        { "filename": "IMPLEMENTATION.md", "content": "# ...", "lines": 42 }
      ]
    }
  ],
  "versionedArtifacts": {
    "PLAN": [{ "filename": "PLAN.md", "content": "...", "lines": 10, "version": 1 }]
  },
  "taskList": [
    {
      "status": "done",
      "label": "Execute the instructions above",
      "complexity": "S",
      "file": "IMPLEMENTATION.md"
    }
  ],
  "stats": {
    "completedTasks": 2, "totalTasks": 2,
    "completedPhases": 2, "totalPhases": 2,
    "progress": 100,
    "hasWalkthrough": true, "hasPipelineJson": true
  }
}
```

---

### `DELETE /api/pipelines/:id`

Deletes a pipeline directory and all its contents.

| Param | Type | Description |
|-------|------|-------------|
| `id` | string | Pipeline ID to delete |

**Response**: `{ "ok": true, "message": "Pipeline PIPE-... deleted" }`

---

### `POST /api/pipelines/:id/execute`

Launches pipeline execution by spawning `opencode run` in the background.

**Body Parameters**:
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | No | Custom prompt override (defaults to pipeline prompt) |

**Response**:
```json
{
  "ok": true,
  "pipeline": "PIPE-...",
  "status": "executing",
  "message": "Pipeline PIPE-... execution launched"
}
```

**Dependencies**: Executes `opencode run`; uses `OPENCODE_BIN` from environment

---

### `POST /api/pipelines/:id/execute-flow`

Executes a Flow Builder DAG pipeline. Reads `builder-layout.json`, performs topological sort, spawns agents in dependency order with cascading.

**Path Parameters**: `id` (pipeline ID)

**Response**:
```json
{
  "ok": true,
  "id": "PIPE-...",
  "flowStatus": {
    "pipelineId": "...",
    "status": "executing",
    "startedAt": "2026-06-25T18:06:00Z",
    "phases": {
      "node-1": {
        "agentId": "opencode-plan",
        "label": "Plan",
        "status": "completed",
        "pid": null,
        "progress": "1/1",
        "order": 1
      },
      "node-2": {
        "agentId": "opencode-developer",
        "label": "Implement",
        "status": "running",
        "pid": 12345,
        "progress": "2/4",
        "order": 2
      }
    },
    "order": ["node-1", "node-2"]
  },
  "firstNode": { "id": "node-1", "pid": 12345 },
  "message": "Flow execution started with 5 nodes. First node: node-1 (PID 12345)"
}
```

---

### `GET /api/pipelines/:id/flow-status`

Returns real-time status of a running Flow Builder pipeline.

**Response**: Full `flowStatus` object with enriched phase data including artifact files, implementation content, reasoning, output log preview (last 2000 chars), walkthrough presence, and layout metadata (prompts, fileRefs, skills, MCPs).

---

### Pipeline Intervention

#### `GET /api/pipelines/:id/intervene`
Returns current INTERVENE.md content.
```json
{ "content": "# Intervention Note...\n\n...", "pipeline": "PIPE-..." }
```

#### `POST /api/pipelines/:id/intervene`
Creates a new structured intervention note. Pauses pipeline execution.

| Body Param | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `phase` | number | No | 0 | Phase number to intervene on |
| `label` | string | No | `"Phase 0"` | Phase label |

#### `PUT /api/pipelines/:id/intervene`
Writes user-provided content to INTERVENE.md.

| Body Param | Type | Required | Description |
|-----------|------|----------|-------------|
| `content` | string | Yes | Markdown content to write |

#### `DELETE /api/pipelines/:id/intervene`
Deletes INTERVENE.md, resets pipeline status to "submitted", clears error state.

---

### Phase Operations

#### `POST /api/pipelines/:id/phases/:nodeId/retry`
Retries a failed/pending phase node. Increments retry count, spawns new `opencode run`.

| Path Param | Description |
|-----------|-------------|
| `nodeId` | Phase node ID from the flow DAG |

#### `POST /api/pipelines/:id/phases/:nodeId/skip`
Skips a phase node. Cascades to next ready nodes in dependency graph.

| Path Param | Description |
|-----------|-------------|
| `nodeId` | Phase node ID to skip |

**Response**: `{ "ok": true, "message": "node-1 skipped", "nextReady": ["node-2"], "allDone": false }`

---

## 4. Projects

### `GET /api/projects`
Lists all project directories.

**Response**:
```json
{
  "projects": [
    { "name": "PAOS", "pipelineCount": 12, "created_at": "2026-01-01T00:00:00Z" }
  ]
}
```

### `POST /api/projects`
Creates a new project directory.

| Body Param | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Project name (alphanumeric, hyphens, underscores) |

### `DELETE /api/projects/:name`
Deletes a project directory and all its pipelines.

### `GET /api/projects/:name/tree`
Returns a recursive directory tree of the project's source code. Max depth 3, skips `node_modules`, `.git`, `.next`, `__pycache__`, `.hermes`, cache directories, and hidden files.

### `POST /api/projects/:name/integrate`
Integrates a project into PAOS. Analyzes source files (detects languages, frameworks, tests, CI, Docker), creates `.paos/project-brief.md` and `.paos/AGENT.md`, updates `.project-meta.json`.

**Response**:
```json
{
  "ok": true,
  "project": "my-project",
  "sourcePath": "/path/to/source",
  "analysis": {
    "languages": ["TypeScript/JavaScript"],
    "frameworks": ["Next.js"],
    "hasTests": true,
    "hasCI": false,
    "hasDocker": false,
    "entryPoints": ["package.json"],
    "packageManager": "npm"
  },
  "filesCreated": [".paos/project-brief.md", ".paos/AGENT.md"]
}
```

### `POST /api/projects/import`
Imports an existing project directory into PAOS. Validates name and source path.

| Body Param | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Project name |
| `sourcePath` | string | Yes | Absolute path to existing project |

**Response**:
```json
{
  "ok": true,
  "name": "my-project",
  "path": "memory/pipelines/my-project",
  "summary": {
    "topLevelCount": 25,
    "hasPackage": true,
    "hasReadme": true,
    "hasGit": true,
    "topLevel": ["src/", "package.json", "README.md"]
  }
}
```

---

## 5. Agents

### `GET /api/agents`
Returns all registered agents with health status, inbox counts, and last activity.

**Response**:
```json
{
  "agents": [
    {
      "id": "hermes-nous",
      "label": "Hermes Agent",
      "role": "orchestrator",
      "status": "healthy",
      "checks": [
        { "name": "binary", "ok": true, "detail": "/usr/local/bin/hermes" },
        { "name": "config", "ok": true, "detail": "..." }
      ],
      "inbox": 3,
      "lastActivity": "2026-06-25T18:00:00Z",
      "recentLog": "Agent[hermes-nous]: forwarded health-check",
      "color": "#FF6B6B",
      "riskLevel": "low"
    }
  ]
}
```

### `GET /api/agents/scoped`
Lists projects with scoped git identity overrides.

### `POST /api/agents/scoped`
Applies scoped git identity overrides for a project.

| Body Param | Type | Required | Description |
|-----------|------|----------|-------------|
| `project` | string | Yes | Project/workspace name |

### `GET /api/agents/:id/health`
Returns detailed health check for a single agent.

**Response**:
```json
{
  "id": "hermes-nous",
  "label": "Hermes Agent",
  "role": "orchestrator",
  "color": "#FF6B6B",
  "riskLevel": "low",
  "status": "healthy",
  "checks": [...]
}
```

---

## 6. Templates

### `GET /api/templates`
Lists all pipeline templates. Seeds 8 presets if none exist: Quick Dev, Full Delivery, Quality Flow, Design First, Review Pipeline, Documentation, Research Spike, Bug Fix.

### `POST /api/templates`
Creates a new pipeline template.

| Body Param | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Template name |
| `description` | string | No | Description |
| `category` | string | No | `feature`, `bug-fix`, `hotfix`, `documentation`, `research`, `custom` |
| `tags` | string[] | No | Tag labels |
| `nodes` | array | Yes | Flow Builder agent nodes |
| `edges` | array | No | Flow Builder connections |

### `GET /api/templates/:id`
Returns a single template by slugified ID.

### `PUT /api/templates/:id`
Updates an existing template (deep-merge).

### `DELETE /api/templates/:id`
Deletes a template file.

### `GET /api/templates/suggestions`
Returns role/prompt suggestions for Flow Builder agent nodes.

| Query Param | Type | Required | Description |
|------------|------|----------|-------------|
| `agentId` | string | Yes | Agent ID to get suggestions for |

**Response**:
```json
{
  "agentId": "hermes-nous",
  "suggestions": [
    { "role": "Proposer", "label": "Proposal", "prompt": "Analyze the request..." },
    { "role": "Architect", "label": "Architecture", "prompt": "Design the technical architecture..." }
  ]
}
```

---

## 7. Events

### `GET /api/events`
Returns events.md content for a project or ALL projects.

| Query Param | Type | Description |
|------------|------|-------------|
| `project` | string | Project name; omit for all |

### `POST /api/events`
Appends a new event entry.

| Body Param | Type | Required | Description |
|-----------|------|----------|-------------|
| `project` | string | Yes | Project name |
| `entry` | object | Yes | `{ "agent": "...", "action": "...", "description": "..." }` |

---

## 8. Inbox

### `GET /api/inbox`
Reads agent inbox messages. Merges global + project inboxes when project is specified.

| Query Param | Type | Description |
|------------|------|-------------|
| `agent` | string | Filter to a specific agent |
| `project` | string | Merge project-scoped inbox |

**Response**:
```json
{
  "messages": [
    {
      "id": "1719000000000-hermes-nous.md",
      "inbox": "hermes-nous",
      "title": "Health check results",
      "from": "opencode-developer",
      "to": "hermes-nous",
      "timestamp": "2026-06-25T16:46:23Z",
      "body": "Health check complete...",
      "source": "global"
    }
  ],
  "inboxes": ["hermes-nous", "opencode-developer", "claude", "codex", "gemini"],
  "project": "global"
}
```

---

## 9. Handoff

### `GET /api/handoff`
Returns HANDOFF.md content.

| Query Param | Type | Description |
|------------|------|-------------|
| `project` | string | Project name; omit for global handoff |

**Response**:
```json
{
  "content": "# HANDOFF — Current PAOS State\n\n...",
  "updatedAt": "2026-06-25T18:00:00Z",
  "project": "global"
}
```

### `POST /api/handoff`
Writes HANDOFF.md content.

| Body Param | Type | Required | Description |
|-----------|------|----------|-------------|
| `content` | string | Yes | Full markdown content |

---

## 10. Skills

### `GET /api/skills`
Returns available PAOS skills. Tries `hermes skills list` first, falls back to hardcoded defaults.

**Response**:
```json
{
  "skills": [
    { "name": "ponytail", "description": "Lazy senior dev: minimal code, maximum value" },
    { "name": "antigravity-review-loop", "description": "4-phase artifact-driven review workflow" },
    { "name": "system-analysis-and-design", "description": "Technical specification and system design" }
  ]
}
```

---

## 11. Send Message

### `POST /api/send-message`
Sends a message to an agent's inbox. Creates a `.md` file in `memory/inbox/<to>/` and logs to global ledger.

| Body Param | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `to` | string | Yes | — | Target agent inbox name |
| `body` | string | Yes | — | Message body |
| `from` | string | No | `"dashboard"` | Sender name |
| `subject` | string | No | — | Message subject |

**Response**:
```json
{
  "ok": true,
  "path": "memory/inbox/hermes-nous/1719000000000-dashboard.md"
}
```

---

## 12. Secrets

### `GET /api/secrets`
Reads project-specific secrets.

| Query Param | Type | Required | Description |
|------------|------|----------|-------------|
| `project` | string | Yes | Project name |

### `POST /api/secrets`
Writes project-specific secrets.

| Body Param | Type | Required | Description |
|-----------|------|----------|-------------|
| `project` | string | Yes | Project name |
| `secrets` | object | Yes | `{ "KEY": { "value": "...", "note?": "..." } }` |

---

## 13. Global Secrets

### `GET /api/global-secrets`
Reads global secrets from `config/secrets/.env`. Parses `KEY=VALUE` with comment notes.

**Response**:
```json
{
  "secrets": {
    "ANTHROPIC_API_KEY": { "value": "sk-ant-...", "note": "Production key" },
    "OPENAI_API_KEY": { "value": "sk-proj-...", "note": "" }
  },
  "path": "config/secrets/.env"
}
```

### `POST /api/global-secrets`
Writes global secrets to `config/secrets/.env`.

---

## 14. Tasks

### `GET /api/tasks`
Lists task cards from `memory/tasks/` (global) and per-project.

| Query Param | Type | Description |
|------------|------|-------------|
| `project` | string | Filter to project-specific tasks |

**Response**:
```json
{
  "tasks": [
    {
      "id": "TASK-001",
      "title": "Write comprehensive documentation",
      "status": "completed",
      "agent": "opencode-developer",
      "project": "PAOS",
      "raw": "---\nid: TASK-001\nstatus: completed\n..."
    }
  ]
}
```

---

## 15. MCP Servers

### `GET /api/mcp-servers`
Lists configured MCP servers from the unified registry.

**Response**:
```json
{
  "servers": [
    { "name": "shared-memory", "description": "MCP server: shared-memory (14 tools)" },
    { "name": "scaffold", "description": "MCP server: scaffold (2 tools)" },
    { "name": "gitkraken", "description": "MCP server: gitkraken (read-only)" },
    { "name": "context7", "description": "MCP server: context7 (2 tools)" }
  ]
}
```

**Dependencies**: `~/AI_Workflow/mcp/mcp-config.json`

---

## 16. Queue

### `GET /api/queue`
Returns the full pipeline execution queue state.

**Response**:
```json
{
  "pending": [{ "id": "PIPE-...", "project": "PAOS", "enqueuedAt": "..." }],
  "running": { "id": "PIPE-...", "startedAt": "..." },
  "done": [{ "id": "PIPE-...", "completedAt": "...", "status": "completed" }],
  "maxDone": 20
}
```

### `POST /api/queue`
Queue operations: enqueue, dequeue, mark done, remove.

| Body Param | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string | Yes | `enqueue`, `dequeue`, `done`, `remove` |
| `id` | string | Depends | Pipeline ID (required for enqueue, remove) |
| `project` | string | No | Project name (for enqueue) |
| `status` | string | No | `completed` or `failed` (for done) |

---

## 17. Plans

### `GET /api/plans`
Returns all plans from pipeline directories and legacy `pm-logs/`.

| Query Param | Type | Description |
|------------|------|-------------|
| `project` | string | Filter to a specific project |

**Response**:
```json
{
  "plans": [
    {
      "id": "PIPE-25-06-2026---18-06",
      "title": "Write comprehensive documentation",
      "preview": "# Agent: Document (opencode-developer)...",
      "plan": "# Full PLAN.md content...",
      "tasks": "# Full TASKS.md content...",
      "walkthrough": "# Full WALKTHROUGH.md content...",
      "hasWalkthrough": true,
      "source": "pipeline",
      "project": "PAOS",
      "path": "memory/pipelines/PAOS/PIPE-..."
    }
  ]
}
```

---

## 18. Vault

### `GET /api/vault`
Access PAOS vault — daily notes or chat transcripts.

| Query Param | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `project` | string | No | — | Scope vault to a project |
| `type` | string | No | `"daily"` | `daily` or `chats` |
| `date` | string | No | — | For daily: `YYYY-MM-DD` filename |
| `slug` | string | No | — | For chats: specific slug |

**Response** (list mode):
```json
{
  "notes": [
    { "date": "2026-06-25", "preview": "## Tasks...", "path": "vault/daily/2026-06-25.md" }
  ],
  "project": "global"
}
```

**Response** (content mode):
```json
{
  "date": "2026-06-25",
  "content": "# Daily Note — 2026-06-25\n\n## Tasks\n...",
  "project": "global"
}
```

---

## 19. Workspaces

### `GET /api/workspaces`
Lists all VS Code `.code-workspace` files with metadata.

**Response**:
```json
{
  "workspaces": [
    {
      "name": "PAOS",
      "displayName": "PAOS",
      "sourcePath": "/home/dev/AI_Workflow",
      "pipelineCount": 12,
      "pipelinePath": "memory/pipelines/PAOS",
      "createdAt": "2026-01-01T00:00:00Z",
      "integratedAt": "2026-06-20T00:00:00Z",
      "folders": [{ "path": "/home/dev/AI_Workflow" }]
    }
  ]
}
```

### `POST /api/workspaces`
Creates a new workspace. Supports local import or GitHub clone. Auto-creates project infrastructure (events.md, shared-context.md, handoff.md, ledger.md, inbox/).

| Body Param | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Workspace/project name |
| `sourcePath` | string | No | Local source directory |
| `source` | string | No | `"github"` for GitHub imports |
| `gitUrl` | string | No | Git clone URL (required if source=github) |

### `GET /api/workspaces/:name`
Returns a single workspace JSON.

### `DELETE /api/workspaces/:name`
Deletes a workspace, its pipelines directory, and projects directory.

---

## 20. Git View

### `GET /api/gitview`
Git repository browser. Supports four modes.

| Query Param | Type | Description |
|------------|------|-------------|
| `agent` | string | Filter commits by agent identity |
| `commit` | string | Full commit hash for single-commit detail |
| `max` | number | Max commits (default 50) |
| `q` | string | Grep filter for commit messages |
| `visualize` | "true" | Returns directory tree map instead of commits |

**Response** (log mode):
```json
{
  "commits": [
    {
      "hash": "abc1234def5678",
      "author_name": "OpenCode Developer",
      "author_email": "developer@paos.nodealgo.com",
      "date": "2026-06-25T18:00:00Z",
      "message": "Agent[opencode-developer]: created API documentation",
      "graph": "*"
    }
  ],
  "agents": [
    { "id": "opencode-developer", "name": "OpenCode Developer", "email": "developer@paos.nodealgo.com" }
  ],
  "total": 50,
  "meta": { "powered_by": "gitkraken-mcp" }
}
```

**Response** (detail mode with `?commit=<hash>`):
```json
{
  "hash": "abc1234",
  "author": "OpenCode Developer",
  "email": "developer@paos.nodealgo.com",
  "date": "2026-06-25T18:00:00Z",
  "message": "Full commit message",
  "messageShort": "Agent[opencode-developer]: created API docs",
  "diff": "+# API Docs\n\n...",
  "files": [
    { "status": "A", "path": "docs/api.md" },
    { "status": "M", "path": "dashboard/README.md" }
  ],
  "tree": [{ "path": "docs/api.md", "type": "file" }]
}
```

---

## 21. System Doctor

### `GET /api/system/doctor`
Full system health check. Runs all agent checks in parallel. Cached for 30 seconds.

**Response**:
```json
{
  "registryVersion": "2.0.0",
  "status": "healthy",
  "agents": [
    {
      "id": "hermes-nous",
      "label": "Hermes Agent",
      "role": "orchestrator",
      "color": "#FF6B6B",
      "riskLevel": "low",
      "status": "healthy",
      "checks": [
        { "name": "binary", "ok": true, "detail": "/usr/local/bin/hermes" },
        { "name": "config", "ok": true, "detail": "Config file exists" },
        { "name": "inbox", "ok": true, "detail": "Inbox directory exists" },
        { "name": "logfile", "ok": true, "detail": "Events file exists" },
        { "name": "gitidentity", "ok": true, "detail": "hermes-nous@paos.nodealgo.com" },
        { "name": "mcp", "ok": true, "detail": "MCP config referenced" }
      ]
    }
  ]
}
```

---

## 22. Admin / Code-SRS

### `GET /api/admin/code-srs`
Reads Code-SRS configuration from `config/code-srs/features.yaml` and `models.yaml`.

**Response**:
```json
{
  "features": { "features": [...] },
  "models": { "models": [...] }
}
```

### `PATCH /api/admin/code-srs`
Updates Code-SRS configuration.

| Query Param | Type | Required | Description |
|------------|------|----------|-------------|
| `type` | string | Yes | `"features"` or `"models"` |

| Body | Type | Description |
|------|------|-------------|
| Full YAML content | object | `{ "features": [...] }` or `{ "models": [...] }` |

---

## Common Patterns

### Error Responses
All endpoints return `{ "error": "message" }` with appropriate HTTP status codes (400, 404, 500).

### Path Resolution
All routes resolve paths relative to `~/AI_Workflow/` using constants from `lib/global-config.ts`:
- `MEMORY_DIR` = `~/AI_Workflow/memory`
- `PROJECTS_DIR` = `~/AI_Workflow/projects`
- `PIPELINES_DIR` = `~/AI_Workflow/memory/pipelines`
- `WORKSPACES_DIR` = `~/AI_Workflow/workspaces`
- `LOGS_DIR` = `~/AI_Workflow/logs`

### Storage Backend
The entire API is file-system based. There is no database. Data is stored as:
- **Markdown tables** — ledger entries, events
- **YAML frontmatter** — task cards, pipeline META
- **JSON files** — pipeline state, queue, templates, agent registry
- **Plain text** — secrets, handoff, context
- **`.code-workspace` files** — project definitions

---

*Part of the [PAOS](../README.md) ecosystem. Dashboard code at `~/AI_Workflow/dashboard/`.*
