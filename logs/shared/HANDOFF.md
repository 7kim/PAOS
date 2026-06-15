# HANDOFF — Current PAOS State

> This file is **rewritten** (not appended) each session. It is the first thing every agent reads.
> Always current. Max 60 lines. For full history see: `shared/context.md` and `vault/chats/`.

---

## Last Agent
- **Agent**: opencode-developer
- **Tool**: OpenCode Developer
- **Timestamp**: 2026-06-15T07:36:26.748Z
- **Session**: PAOS-RECOVERY + BrainChart env setup

## Active Task
PAOS system recovery complete + BrainChart environment setup

## What Was Just Done
- Fixed missing `python` command: created /usr/local/bin/python → python3
- Reinstalled Codex CLI v0.139.0 (@openai/codex from npm)
- Merged 449MB live ~/.config/Antigravity data into PAOS config/antigravity2/config
- Created ~/.config/Antigravity → config/antigravity2/config symlink (live Antigrity IDE survived uninterrupted)
- Merged 71MB live ~/.gemini data into PAOS config/gemini/
- Created ~/.gemini → config/gemini symlink (Gemini CLI 0.46.0 still works)
- Linked ~/.gemini/config/mcp_config.json → PAOS version (was 0-byte empty)
- Created 8 agent binary symlinks in AI_Workflow/bin/: claude, gemini, codex, ollama, agy, gk, antigravity, python
- Full 41-point health check passed
- All PAOS logs updated (events.md, global_ledger.md, context.md, HANDOFF.md, daily note)
- BrainChart environment: Created `developer` venv via `uv venv`, installed 50 packages, registered IPython kernel, fixed uvicorn PATH in brain.py, full end-to-end test passed

## What Is NOT Done Yet
- Signal agent has no real CLI binary (PAOS-conceptual notification agent — uses PAOS pipeline, not a standalone CLI tool)
- The ~/.gemini.bak and ~/.config/Antigravity.bak backup dirs contain old state and can be cleaned up
- antigravity-ide CLI binary (agy-ide) references old location /opt/antigravity-ide/ — may need attention if running

## Active Projects

| Project | Path | Stack | Status |
| ------- | ---- | ----- | ------ |
| PAOS-WEB (Code-SRS) | `~/Documents/Dev/PAOS-WEB/` | Next.js 16 App Router, Together AI design | Active — frontend built, OAuth wired |
| PAOS-VPS | `~/Documents/Dev/PAOS-VPS/` | Shell script | Active |
| Tradingview | `~/Documents/Dev/Tradingview/` | Python FastAPI + React + Vite + lightweight-charts | Active |
| AgentHarness Enterprise | `knowledge/srs/SRS-2-*.md` | Design only | SRS complete — not yet built |

## Key Decisions (permanent)

- `bin/agent-commit.sh` is the only way to commit — never plain `git commit`
- MCP servers: `shared-memory` (12 tools) + `scaffold` (2 tools) + `gitkraken` (read-only)
- Every agent reads HANDOFF.md as Step 0 — universal cold-start
- **Code-SRS model proxy**: real model IDs resolved server-side only
- **frontend/ port**: 3334 | **dashboard/ port**: 3333
- **CHAT CONTINUITY**: Read `vault/chats/active_chat_transcript.md` at session start, run `python3 bin/sync-chat.py` at end
- **SRS location**: `knowledge/srs/` — both .md and .pdf artifacts
- **Documentation**: All new documentation MUST be created in `knowledge/docs/` (NEVER in `knowledge/` root) to prevent duplicates.
- **Vault Symlinks**: `vault/knowledge` and `vault/memory` are critical symlinks mapping to root folders. NEVER delete them.

## How to Pick Up
1. Read this file (done)
2. Call `shared-memory: read_ledger` — last 20 rows
3. Read `vault/chats/` — most recent chat summary
4. Ask the operator: "Continuing from HANDOFF — what's next?"
