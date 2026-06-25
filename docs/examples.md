# PAOS Usage Examples

> Common workflows and patterns for using the Personal Agent Operating System.

---

## Table of Contents

1. [Starting a Session](#1-starting-a-session)
2. [Cross-Agent Pipeline](#2-cross-agent-pipeline)
3. [Agent-to-Agent Messaging](#3-agent-to-agent-messaging)
4. [Dashboard API Usage](#4-dashboard-api-usage)
5. [H-Command CLI Reference](#5-h-command-cli-reference)
6. [MCP Tool Usage](#6-mcp-tool-usage)
7. [Project Integration](#7-project-integration)
8. [Health Checks & Auditing](#8-health-checks--auditing)
9. [Git & Commits](#9-git--commits)

---

## 1. Starting a Session

### Picking up where another agent left off

Every PAOS agent reads `memory/shared/HANDOFF.md` at session start. This file tells you:

- Who was the last agent
- What task was active
- What was completed
- What's pending
- Key decisions made

```bash
# Step 1: Read the handoff
cat ~/AI_Workflow/memory/shared/HANDOFF.md

# Step 2: Read recent ledger activity
tail -20 ~/AI_Workflow/memory/global_ledger.md

# Step 3: Read shared thinking context
tail -50 ~/AI_Workflow/memory/shared/context.md
```

### End-of-session ritual

Before ending a session, always run:

```bash
# Sync chat transcript
python3 ~/AI_Workflow/bin/sync-chat.py

# Write handoff for the next agent
~/AI_Workflow/bin/h-write-handoff \
  "Implemented auth module" \
  "- Added JWT middleware\n- Created user model" \
  "- Need to add refresh tokens\n- Tests not written yet" \
  "Session 2026-06-25"

# OR use the all-in-one sync command:
~/AI_Workflow/bin/h-sync \
  "Implement auth module" \
  "- Added JWT middleware\n- Created user model" \
  "- Need to add refresh tokens" \
  "Session 2026-06-25" \
  "Agent[developer]: implemented auth module"

# Commit via PAOS protocol
~/AI_Workflow/bin/agent-commit.sh opencode-developer \
  "Agent[opencode-developer]: implemented JWT auth"
```

---

## 2. Cross-Agent Pipeline

### Creating a pipeline from the CLI

```bash
# 1. Create the plan artifacts
cat > /tmp/plan.md << 'EOF'
# Implement User Authentication

## Objective
Add JWT-based authentication to the API.

## Scope
- Backend: auth routes, JWT middleware, user model
- Frontend: login page, token storage
EOF

cat > /tmp/tasks.md << 'EOF'
- [ ] Create user model and database schema
- [ ] Implement JWT middleware
- [ ] Build auth routes (login, register, refresh)
- [ ] Add login page UI
- [ ] Token storage and auto-refresh
EOF

# 2. Submit the pipeline
~/AI_Workflow/bin/h-pipeline submit \
  --planner gemini \
  --prompt "Implement user authentication with JWT" \
  --plan /tmp/plan.md \
  --tasks /tmp/tasks.md \
  --executor opencode-developer

# 3. Check pipeline status
~/AI_Workflow/bin/h-pipeline list
~/AI_Workflow/bin/h-pipeline status PIPE-25-06-2026---18-06
```

### Creating a pipeline from the dashboard

```bash
# Via API
curl -X POST http://localhost:3333/api/pipelines \
  -H "Content-Type: application/json" \
  -d '{
    "project": "PAOS",
    "prompt": "Implement user authentication",
    "planMd": "# Plan\n\n## Objective\nAdd JWT auth\n\n## Tasks\n- [ ] Create user model\n- [ ] Add auth routes",
    "tasksMd": "- [ ] Create user model\n- [ ] Add auth routes\n- [ ] Write tests"
  }'
```

Response:
```json
{
  "ok": true,
  "id": "PIPE-25-06-2026---18-06",
  "project": "PAOS",
  "dir": "/home/dev/AI_Workflow/memory/pipelines/PAOS/PIPE-25-06-2026---18-06"
}
```

### Executing a pipeline

```bash
# Via API
curl -X POST http://localhost:3333/api/pipelines/PIPE-25-06-2026---18-06/execute

# Via CLI
~/AI_Workflow/bin/h-pipeline execute PIPE-25-06-2026---18-06
```

### Flow Builder — Multi-Agent DAG Pipeline

Create a pipeline with multiple agents working in parallel:

```bash
# Submit a pipeline with Flow Builder layout
curl -X POST http://localhost:3333/api/pipelines \
  -H "Content-Type: application/json" \
  -d '{
    "project": "PAOS",
    "prompt": "Build a full-stack todo app",
    "builderLayout": {
      "nodes": [
        {
          "id": "plan-node",
          "type": "agentNode",
          "data": {
            "label": "Plan",
            "agentId": "opencode-plan",
            "prompt": "Create a plan for a full-stack todo app"
          }
        },
        {
          "id": "backend-node",
          "type": "agentNode",
          "data": {
            "label": "Backend",
            "agentId": "opencode-developer",
            "prompt": "Build the Express.js backend API"
          }
        },
        {
          "id": "frontend-node",
          "type": "agentNode",
          "data": {
            "label": "Frontend",
            "agentId": "opencode-developer",
            "prompt": "Build the React frontend"
          }
        }
      ],
      "edges": [
        {
          "id": "plan-to-backend",
          "source": "plan-node",
          "target": "backend-node"
        },
        {
          "id": "plan-to-frontend",
          "source": "plan-node",
          "target": "frontend-node"
        }
      ]
    }
  }'

# Execute the flow
curl -X POST http://localhost:3333/api/pipelines/PIPE-.../execute-flow

# Check live status
curl http://localhost:3333/api/pipelines/PIPE-.../flow-status
```

### Pipeline Intervention

Pause a running pipeline, edit instructions, and resume:

```bash
# Create intervention note
curl -X POST http://localhost:3333/api/pipelines/PIPE-.../intervene \
  -H "Content-Type: application/json" \
  -d '{
    "phase": 0,
    "label": "Backend Implementation"
  }'

# Read the current intervention note
curl http://localhost:3333/api/pipelines/PIPE-.../intervene

# Update the intervention note
curl -X PUT http://localhost:3333/api/pipelines/PIPE-.../intervene \
  -H "Content-Type: application/json" \
  -d '{"content": "# Intervention\n\nUse PostgreSQL instead of MongoDB\n\n- Change schema\n- Update connection string\n- Fix queries"}'

# Cancel intervention and resume
curl -X DELETE http://localhost:3333/api/pipelines/PIPE-.../intervene
```

### Retry or Skip a Phase

```bash
# Retry a failed phase
curl -X POST http://localhost:3333/api/pipelines/PIPE-.../phases/backend-node/retry

# Skip a phase
curl -X POST http://localhost:3333/api/pipelines/PIPE-.../phases/backend-node/skip
```

---

## 3. Agent-to-Agent Messaging

### From the CLI

```bash
# Send a message to another agent
# (Manually create a message file in their inbox)
cat > ~/AI_Workflow/memory/inbox/hermes-nous/$(date +%s)-developer.md << 'EOF'
---
from: opencode-developer
to: hermes-nous
subject: Health check results
timestamp: 2026-06-25T18:00:00Z
priority: normal
---

Health check complete. All 24 endpoints passed.

Results file: ~/AI_Workflow/health-check.html
EOF

# Check your own inbox
~/AI_Workflow/bin/h-inbox

# Check another agent's inbox
~/AI_Workflow/bin/h-inbox hermes-nous
```

### From the Dashboard API

```bash
curl -X POST http://localhost:3333/api/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "to": "hermes-nous",
    "from": "opencode-developer",
    "subject": "Pipeline PIPE-... completed",
    "body": "All tasks executed successfully.\n\nResults:\n- 24/24 endpoints passed\n- health-check.html generated\n- pipeline.json updated"
  }'
```

### Reading Messages via API

```bash
# Read all inboxes
curl http://localhost:3333/api/inbox

# Read a specific agent's inbox
curl "http://localhost:3333/api/inbox?agent=hermes-nous"

# Read with project scope
curl "http://localhost:3333/api/inbox?agent=hermes-nous&project=PAOS"
```

---

## 4. Dashboard API Usage

### System Overview

```bash
# Get system stats
curl http://localhost:3333/api/overview

# Full system health check
curl http://localhost:3333/api/system/doctor
```

### Ledger

```bash
# Read global ledger
curl http://localhost:3333/api/ledger

# Read project-scoped ledger
curl "http://localhost:3333/api/ledger?project=PAOS"

# View all ledgers merged
curl "http://localhost:3333/api/ledger?all=true"
```

### Agent Management

```bash
# List all agents with health status
curl http://localhost:3333/api/agents

# Detailed health check for one agent
curl http://localhost:3333/api/agents/hermes-nous/health

# List scoped git identity projects
curl http://localhost:3333/api/agents/scoped

# Apply scoped git identities for a project
curl -X POST http://localhost:3333/api/agents/scoped \
  -H "Content-Type: application/json" \
  -d '{"project": "PAOS"}'
```

### Task Management

```bash
# List all tasks
curl http://localhost:3333/api/tasks

# List project-scoped tasks
curl "http://localhost:3333/api/tasks?project=PAOS"
```

### Plans

```bash
# List all implementation plans
curl http://localhost:3333/api/plans

# Filter by project
curl "http://localhost:3333/api/plans?project=PAOS"
```

### Secrets

```bash
# Read global secrets (API keys)
curl http://localhost:3333/api/global-secrets

# Read project secrets
curl "http://localhost:3333/api/secrets?project=PAOS"

# Write project secrets
curl -X POST http://localhost:3333/api/secrets \
  -H "Content-Type: application/json" \
  -d '{
    "project": "PAOS",
    "secrets": {
      "DB_HOST": { "value": "localhost", "note": "Database host" },
      "DB_PORT": { "value": "5432", "note": "" }
    }
  }'
```

### Handoff

```bash
# Read global handoff
curl http://localhost:3333/api/handoff

# Read project handoff
curl "http://localhost:3333/api/handoff?project=PAOS"

# Write handoff
curl -X POST http://localhost:3333/api/handoff \
  -H "Content-Type: application/json" \
  -d '{"content": "# HANDOFF\n\n## Last Agent\n- opencode-developer\n\n## Active Task\nDocumentation complete"}'
```

### Events

```bash
# List project events
curl "http://localhost:3333/api/events?project=PAOS"

# Append an event
curl -X POST http://localhost:3333/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "project": "PAOS",
    "entry": {
      "agent": "opencode-developer",
      "action": "CREATE",
      "description": "Created API documentation"
    }
  }'
```

### Workspace Management

```bash
# List all workspaces
curl http://localhost:3333/api/workspaces

# Create a workspace from local source
curl -X POST http://localhost:3333/api/workspaces \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-project",
    "sourcePath": "/home/dev/projects/my-app"
  }'

# Import from GitHub
curl -X POST http://localhost:3333/api/workspaces \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-project",
    "source": "github",
    "gitUrl": "https://github.com/user/my-repo.git"
  }'

# Get workspace details
curl http://localhost:3333/api/workspaces/my-project

# Delete workspace
curl -X DELETE http://localhost:3333/api/workspaces/my-project
```

### Git Browser

```bash
# Get commit log
curl http://localhost:3333/api/gitview

# Filter by agent
curl "http://localhost:3333/api/gitview?agent=opencode-developer"

# Search commits
curl "http://localhost:3333/api/gitview?q=auth"

# Get commit details
curl "http://localhost:3333/api/gitview?commit=abc1234def5678"

# Directory tree visualization
curl "http://localhost:3333/api/gitview?visualize=true"
```

### Templates

```bash
# List all pipeline templates
curl http://localhost:3333/api/templates

# Create a custom template
curl -X POST http://localhost:3333/api/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CI/CD Pipeline",
    "description": "Build → Test → Deploy flow",
    "category": "feature",
    "tags": ["ci", "cd", "deployment"],
    "nodes": [
      {
        "id": "build",
        "type": "agentNode",
        "data": {
          "label": "Build",
          "agentId": "opencode-developer",
          "prompt": "Build the project and run linter"
        }
      },
      {
        "id": "test",
        "type": "agentNode",
        "data": {
          "label": "Test",
          "agentId": "opencode-developer",
          "prompt": "Run the test suite"
        }
      }
    ],
    "edges": [
      { "source": "build", "target": "test" }
    ]
  }'

# Get template suggestions for an agent
curl "http://localhost:3333/api/templates/suggestions?agentId=hermes-nous"
```

### Skills & MCP

```bash
# List available skills
curl http://localhost:3333/api/skills

# List configured MCP servers
curl http://localhost:3333/api/mcp-servers
```

### Queue Management

```bash
# View queue state
curl http://localhost:3333/api/queue

# Enqueue a pipeline
curl -X POST http://localhost:3333/api/queue \
  -H "Content-Type: application/json" \
  -d '{
    "action": "enqueue",
    "id": "PIPE-25-06-2026---18-06",
    "project": "PAOS"
  }'

# Dequeue (start executing)
curl -X POST http://localhost:3333/api/queue \
  -H "Content-Type: application/json" \
  -d '{"action": "dequeue"}'

# Mark as done
curl -X POST http://localhost:3333/api/queue \
  -H "Content-Type: application/json" \
  -d '{
    "action": "done",
    "status": "completed"
  }'
```

### Vault

```bash
# List daily notes
curl http://localhost:3333/api/vault

# Read a specific daily note
curl "http://localhost:3333/api/vault?date=2026-06-25"

# List chat transcripts
curl "http://localhost:3333/api/vault?type=chats"

# Read a specific chat
curl "http://localhost:3333/api/vault?type=chats&slug=2026-06-25-auth-implementation"

# Project-scoped vault
curl "http://localhost:3333/api/vault?project=PAOS&date=2026-06-25"
```

### Admin / Code-SRS

```bash
# Read Code-SRS configuration
curl http://localhost:3333/api/admin/code-srs

# Update features
curl -X PATCH "http://localhost:3333/api/admin/code-srs?type=features" \
  -H "Content-Type: application/json" \
  -d '{
    "features": [
      { "name": "auth", "description": "Authentication & authorization" },
      { "name": "billing", "description": "Payment processing" }
    ]
  }'
```

---

## 5. H-Command CLI Reference

All `/h-*` commands are available from the PAOS root:

```bash
# List all available commands
~/AI_Workflow/bin/h-help

# Agent identity
~/AI_Workflow/bin/h-whoami

# System status
~/AI_Workflow/bin/h-status

# Read inbox messages
~/AI_Workflow/bin/h-inbox
~/AI_Workflow/bin/h-inbox hermes-nous

# Create/read daily notes
~/AI_Workflow/bin/h-daily 2026-06-25
~/AI_Workflow/bin/h-daily 2026-06-25 --project PAOS

# Dual-log: write to both events.md and global_ledger.md
~/AI_Workflow/bin/h-log CREATE docs/api.md "Created API documentation"

# Append to shared thinking context
~/AI_Workflow/bin/h-context "Working on auth module" "- Use JWT" "Next: add refresh tokens"

# Audit compliance check
~/AI_Workflow/bin/h-audit

# PAOS git commit
~/AI_Workflow/bin/h-commit "implemented JWT auth middleware"

# Save chat summary
~/AI_Workflow/bin/h-chat "Auth Implementation" "Implemented JWT auth with refresh tokens" --project PAOS

# Task management
~/AI_Workflow/bin/h-task list
~/AI_Workflow/bin/h-task read TASK-001
~/AI_Workflow/bin/h-task create "Implement password reset"

# Write handoff
~/AI_Workflow/bin/h-write-handoff \
  "Working on auth module" \
  "- JWT middleware done\n- Login route done" \
  "- Register route pending\n- Tests pending" \
  "Session 2026-06-25"

# Workspace management
~/AI_Workflow/bin/h-workspace list
~/AI_Workflow/bin/h-workspace create my-project /path/to/source
~/AI_Workflow/bin/h-workspace open PAOS
~/AI_Workflow/bin/h-workspace show PAOS
~/AI_Workflow/bin/h-workspace delete my-project
```

### Combined end-of-session sync

The `h-sync` command chains handoff writing, git commit, and chat sync:

```bash
~/AI_Workflow/bin/h-sync \
  "Implemented JWT auth" \
  "- Added JWT middleware (src/middleware/auth.ts)\n- Created auth routes (src/routes/auth.ts)\n- Added user model (src/models/user.ts)" \
  "- Refresh token endpoint not implemented\n- Tests not yet written\n- Need to add rate limiting" \
  "Session 2026-06-25" \
  "Agent[opencode-developer]: implemented JWT authentication"
```

---

## 6. MCP Tool Usage

The shared-memory MCP server provides 14 tools accessible by all agents. Here are common usage patterns:

### Audit Ledger (append_ledger / read_ledger)

Every agent action must be logged. Use the MCP tools directly from agent conversations:

```
# Read recent ledger entries
shared-memory: read_ledger (tail_lines: 20)

# Append to ledger
shared-memory: append_ledger
  timestamp: "2026-06-25T18:00:00Z"
  task_id: "#TASK-001"
  agent_name: "opencode-developer"
  action_type: "CREATE"
  files_modified: "docs/api.md"
  description: "Created comprehensive API documentation"
  commit_hash: "abc1234"
```

### Cross-Agent Handoff (write_handoff / read_context)

```bash
# Write session handoff
shared-memory: write_handoff
  agent: "opencode-developer"
  active_task: "Writing documentation"
  what_done: "- Created dashboard README\n- Created API docs\n- Created examples"
  what_pending: "- Review by architect\n- Publish to docs site"

# Read shared context
shared-memory: read_context (tail_lines: 30)

# Append thinking
shared-memory: write_context
  agent: "opencode-developer"
  task_id: "#TASK-001"
  thinking: "API docs cover all 56 endpoints across 22 resource groups"
  decisions: "- File-system based, no DB\n- All routes in docs/api.md"
```

### Agent Communication (send_message / read_inbox)

```bash
# Send a message to another agent
shared-memory: send_message
  target_agent: "hermes-nous"
  sender: "opencode-developer"
  subject: "Pipeline complete"
  body: "All tasks done. Walkthrough at pipeline dir."
  priority: "normal"

# Check your inbox
shared-memory: read_inbox (agent: "opencode-developer", limit: 10)
```

### Task Management (create_task / read_task)

```bash
# Create a task for another agent
shared-memory: create_task
  task_id: "TASK-005"
  title: "Review documentation"
  description: "Review all new docs for accuracy and completeness"
  assigned_to: "architect"
  created_by: "opencode-developer"
  priority: "normal"
  depends_on: "TASK-001"

# Read a task
shared-memory: read_task (task_id: "TASK-001")
```

### Pipeline Submission (submit_pipeline)

```bash
# Submit a cross-agent pipeline plan
shared-memory: submit_pipeline
  planner_agent: "opencode-developer"
  prompt: "Add password reset feature"
  plan_content: "# Plan\n\n## Objective\n..."
  tasks_content: "- [ ] Create reset token model\n- [ ] Add send email endpoint\n..."
  executor: "opencode-developer"
  project_path: "/home/dev/AI_Workflow"
```

### Housekeeping (process_notes / process_questions)

```bash
# Archive completed notes
shared-memory: process_notes
  project_path: "/home/dev/AI_Workflow"
  agent: "opencode-developer"
  completed: ["- [x] Write API docs", "- [x] Update dashboard README"]

# Archive answered questions
shared-memory: process_questions
  project_path: "/home/dev/AI_Workflow"
  project_name: "PAOS"
  agent: "opencode-developer"
  qa_pairs: [
    {
      question: "How do I add a new API route?",
      answer: "Create a directory under dashboard/app/api/ with a route.ts file"
    }
  ]
```

### Git Commit (agent_commit)

```bash
# Commit as the current agent
shared-memory: agent_commit
  agent_id: "opencode-developer"
  message: "Agent[opencode-developer]: added comprehensive documentation"
  stage_all: true
```

---

## 7. Project Integration

### Import an existing project

```bash
# Via CLI workspace manager
~/AI_Workflow/bin/h-workspace create my-project /home/dev/projects/my-app

# Or via API
curl -X POST http://localhost:3333/api/workspaces \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my-project",
    "sourcePath": "/home/dev/projects/my-app"
  }'
```

### Integrate a project (deep analysis)

```bash
curl -X POST http://localhost:3333/api/projects/my-project/integrate
```

Response includes:
- Language detection (TS/JS, Python, Go, etc.)
- Framework detection (Next.js, Express, React, etc.)
- Test framework detection (Jest, Vitest, pytest, etc.)
- CI/CD detection
- Docker detection
- Entry point analysis
- Package manager detection

### Get project source tree

```bash
curl http://localhost:3333/api/projects/my-project/tree
```

Returns a recursive directory tree (max depth 3, skipping node_modules, .git, etc.)

### Manage project secrets

```bash
# Read project secrets
curl "http://localhost:3333/api/secrets?project=my-project"

# Write project secrets
curl -X POST http://localhost:3333/api/secrets \
  -H "Content-Type: application/json" \
  -d '{
    "project": "my-project",
    "secrets": {
      "DATABASE_URL": { "value": "postgresql://localhost:5432/db", "note": "Prod DB" }
    }
  }'
```

---

## 8. Health Checks & Auditing

### System Health

```bash
# Full system check
curl http://localhost:3333/api/system/doctor

# Individual agent check
curl http://localhost:3333/api/agents/hermes-nous/health

# Overview with health stats
curl http://localhost:3333/api/overview
```

### Compliance Audit (CLI)

```bash
# Run full compliance audit
~/AI_Workflow/bin/h-audit

# Checks:
# 1. Dual-logging — events.md + global_ledger.md
# 2. Git activity — recent commits
# 3. HANDOFF freshness — modification timestamp
# 4. Stale inbox — messages older than 7 days
```

### Ledger Validation

```bash
# Lint the global ledger format
~/AI_Workflow/bin/lint-ledger.sh

# Lint a specific project ledger
~/AI_Workflow/bin/lint-ledger.sh ~/AI_Workflow/memory/pipelines/PAOS/ledger.md
```

### Agent Identity Verification

```bash
# Verify all agent identities
~/AI_Workflow/bin/test-agents.sh

# List all registered agents
~/AI_Workflow/bin/paos-agent list

# Check one agent's health
~/AI_Workflow/bin/paos-agent doctor hermes-nous
```

---

## 9. Git & Commits

### Per-Agent Commits

Every agent commits under its own identity:

```bash
# Commit as a specific agent
~/AI_Workflow/bin/agent-commit.sh claude "Agent[claude]: refactored auth module"
~/AI_Workflow/bin/agent-commit.sh opencode-developer "Agent[opencode-developer]: added tests"
~/AI_Workflow/bin/agent-commit.sh codex "Agent[codex]: optimized database queries"
~/AI_Workflow/bin/agent-commit.sh gemini "Agent[gemini]: updated API docs"

# Without auto-staging
~/AI_Workflow/bin/agent-commit.sh developer "Agent[developer]: fixed typo" --no-stage
```

### Using the H-Command Wrapper

```bash
# Simpler alternative (auto-detects agent identity)
~/AI_Workflow/bin/h-commit "added user authentication"

# End-of-session commit (part of h-sync)
~/AI_Workflow/bin/h-sync \
  "Implement auth" \
  "- Done" \
  "- Nothing pending" \
  "Session" \
  "Agent[opencode-developer]: implemented auth"
```

### Viewing Agent Activity

```bash
# Via dashboard API
curl http://localhost:3333/api/gitview

# Filter by agent
curl "http://localhost:3333/api/gitview?agent=opencode-developer"

# Search commits
curl "http://localhost:3333/api/gitview?q=documentation"

# Get detailed commit view
curl "http://localhost:3333/api/gitview?commit=abc1234"
```

---

## Real-World Workflow: End-to-End

Here's a complete workflow from session start to finish:

```bash
# ===== START SESSION =====

# 1. Read handoff and recent context
cat ~/AI_Workflow/memory/shared/HANDOFF.md
tail -20 ~/AI_Workflow/memory/global_ledger.md

# 2. Create a pipeline for the new task
cat > /tmp/plan.md << 'PLAN'
# Add Search Feature

## Objective
Add full-text search to the API.

## Tasks
1. Index data in Elasticsearch
2. Create search endpoint
3. Add search UI
PLAN

cat > /tmp/tasks.md << 'TASKS'
- [ ] Set up Elasticsearch connection
- [ ] Create search indexer
- [ ] Add GET /api/search endpoint
- [ ] Build search UI component
- [ ] Write integration tests
TASKS

~/AI_Workflow/bin/h-pipeline submit \
  --planner opencode-developer \
  --prompt "Add full-text search feature" \
  --plan /tmp/plan.md \
  --tasks /tmp/tasks.md

# 3. Execute the pipeline
~/AI_Workflow/bin/h-pipeline execute PIPE-...

# 4. Track progress via API
watch -n 5 'curl -s http://localhost:3333/api/pipelines | python3 -m json.tool | grep -E "status|progress"'

# ===== END SESSION =====

# 5. Commit changes
~/AI_Workflow/bin/agent-commit.sh opencode-developer \
  "Agent[opencode-developer]: implemented full-text search"

# 6. Write handoff and sync
~/AI_Workflow/bin/h-sync \
  "Implement search feature - in progress" \
  "- Elasticsearch connection set up\n- Search endpoint created" \
  "- Search UI not started\n- Tests not written" \
  "Session 2026-06-25"

# 7. Sync chat transcript
python3 ~/AI_Workflow/bin/sync-chat.py
```

---

*For more information, see the [API Reference](api.md), [Dashboard Guide](../dashboard/README.md), and the [main README](../README.md).*
