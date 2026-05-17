# Chat Summary — 2026-05-17 — Notes/Questions Wiring

**Agent**: claude  
**Session**: T20 + T21 — Wire project-start protocol + smoke test

## What Was Done

### T20 — Project Start Protocol Wired into All Agents
Added Step 4 (process notes.md + user-questions.md at project start) to every agent config:

| File | Status |
|------|--------|
| `agents/architect/soul.md` | ✓ Step 4 added |
| `agents/coordinator/soul.md` | ✓ Step 4 added |
| `agents/codex/soul.md` | ✓ Step 4 added |
| `agents/openclaw/soul.md` | ✓ Step 4 added |
| `GEMINI.md` | ✓ Step 4 added (manual archive instructions — no MCP) |
| `.github/copilot-instructions.md` | ✓ Project Start section added |
| `config/codex/instructions.md` | ✓ Step 4 added |
| `config/opencode/opencode.json` | No change needed — agents inherit via soul.md |
| `config/claude/CLAUDE.md` | Already done last session |
| `CLAUDE.md` (project) | Already done last session |
| `agents/developer/soul.md` | Already done last session |

### T21 — Smoke Test
Manually simulated process_notes and process_questions logic (Node.js, /tmp/test-project):

- **process_notes**: Strips `- [ ]` and `- ` prefixes, matches by normalized text, removes matched items, archives to notes-done.md table — **PASS**
- **process_questions**: Removes answered questions by normalized text match, archives Q&A with timestamp+agent to knowledge/questions/<name>.md — **PASS**

## Files Modified This Session
- `agents/architect/soul.md`
- `agents/coordinator/soul.md`
- `agents/codex/soul.md`
- `agents/openclaw/soul.md`
- `GEMINI.md`
- `.github/copilot-instructions.md`
- `config/codex/instructions.md`
- `vault/memory/shared/HANDOFF.md`
- `vault/daily/2026-05-17.md`

## Open Items / Next Session
1. Fix Claude MCP config — `config/claude/mcp.json` missing `REPO_ROOT` env var (agent_commit tool broken from Claude)
2. Fill knowledge base — `skills/system-analysis-and-design/` references srs-template.md etc. that don't exist
3. Wire real projects to PAOS (Tradingview, project-gemini)
4. Run a full live pipeline test with OpenCode @developer

## Key Decisions
- All agents now process notes.md + user-questions.md at project start — universal protocol
- Gemini/Copilot get manual instructions (no MCP), all others call process_notes + process_questions MCP tools
- MCP server at v1.2.0 with 13 tools total
