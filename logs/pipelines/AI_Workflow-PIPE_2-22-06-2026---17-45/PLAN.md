# PAOS Commands — Implementation Plan

## Objective

Create a unified set of `/h-*` slash commands that work across all PAOS agents, covering the full session lifecycle defined in the PAOS Constitution (Article IX).

## Scope

### Files to create (16 scripts)

| # | File | Purpose |
|---|------|---------|
| 1 | `bin/lib/h-common.sh` | Shared bash library: PATH detection, agent name, timestamps, colors |
| 2 | `bin/h-help` | List all available `/h-*` commands |
| 3 | `bin/h-status` | Show recent ledger, context, active project |
| 4 | `bin/h-inbox` | Check agent inbox — list messages |
| 5 | `bin/h-daily` | Read or create today's daily note |
| 6 | `bin/h-log` | Dual-log to events.md + global_ledger.md in one shot |
| 7 | `bin/h-context` | Append structured entry to shared context.md |
| 8 | `bin/h-task` | Create / read / list task cards |
| 9 | `bin/h-pipeline` | Submit a plan-then-execute pipeline |
| 10 | `bin/h-show-pipelines` | List all pipelines with status/progress |
| 11 | `bin/h-execute-pipeline` | Kick off a submitted pipeline for execution |
| 12 | `bin/h-write-handoff` | Rewrite HANDOFF.md with current session state |
| 13 | `bin/h-commit` | Git add + commit with Agent[<name>]: format |
| 14 | `bin/h-sync` | End-of-session ritual: handoff + commit + sync-chat.py |
| 15 | `bin/h-chat` | Write structured chat summary to vault/chats/ |
| 16 | `bin/h-whoami` | Show agent identity, soul.md, inbox path |
| 17 | `bin/h-audit` | Check dual-logging compliance |

### Files to modify

| # | File | Change |
|---|------|--------|
| 18 | `config/opencode/commands/` | Register 16 wrapper `.md` files |
| 19 | `config/claude/CLAUDE.md` | Document the `/h-*` command set |
| 20 | `skills/INDEX.md` | Add "PAOS Commands" section |
| 21 | Each agent's soul.md/instructions | Add "Available commands" note |

## Technical Approach

### Design Principle (Ponytail)

Each command is a **thin bash script** that wraps existing file operations. No new infrastructure, no daemons, no config files.

```bash
#!/usr/bin/env bash
# h-<name> — one-line description
# Usage: h-<name> [args]

source "$(dirname "$0")/lib/h-common.sh"
# ... do the thing ...
```

### Shared Library (`h-common.sh`)
- `PAOS_HOME` default: `~/AI_Workflow`
- `agent_name` from `git config user.name` or `$PAOS_AGENT`
- `ts()` for ISO-8601 timestamp
- `info()`, `warn()`, `error()` color output helpers
- `die()` for fatal exit

### Agent Registration

**OpenCode**: Each `.md` file in `config/opencode/commands/h-*.md`:
```markdown
---
description: <one-liner>
---
bin/h-<name> $ARGUMENTS
```

**Claude Code**: Document command set in CLAUDE.md. Agents invoke by running `bin/h-*` directly.

**Codex/Gemini/Hermes**: No native slash commands — they learn from soul.md and respond to `/h-*` by running the corresponding script.

### Build Order (recommended)
1. Infrastructure: `h-common.sh`, `h-help`, `h-whoami` (no deps)
2. Session start: `h-status`, `h-inbox`, `h-daily` (read-only)
3. During work: `h-log`, `h-context`, `h-task`, `h-pipeline`, `h-show-pipelines`, `h-execute-pipeline`
4. Session end: `h-write-handoff`, `h-commit`, `h-sync`, `h-chat`
5. Governance: `h-audit`
6. Registration: OpenCode wrappers, documentation updates

## Risks and Rollback

| Risk | Mitigation |
|------|-----------|
| Scripts not on agent PATH | Each agent config must add `~/AI_Workflow/bin` to PATH |
| bashisms on minimal shells | Use `/usr/bin/env bash`; keep POSIX where possible |
| Agents ignore convention | Document in each agent's primary prompt |
| MCP tools not available from shell | Scripts use direct file ops, not MCP |

**Rollback**: Delete scripts + wrappers. Git revert.

## Design Rationale
1. **Scripts over MCP tools**: Work even when MCP isn't running.
2. **No new config format**: Plain bash. stdin/stdout.
3. **`h-` prefix**: Avoids collision with agent-native commands.
4. **16 commands, not 50**: Covers full Article IX lifecycle. YAGNI beyond this.
5. **Decoupled from agent platform**: Logic in `bin/`, wrappers in `config/`.
