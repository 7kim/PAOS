# PAOS Constitution — Personal Agent Operating System
## H-Factor Protocol v2.0.0 (Hyper-Structured Factor)

---

## Article I — Governance Gates

### Section 1.1 — The H-Factor Mandate
Every action taken within the PAOS must satisfy four invariants before, during, and after execution:

| ID | Invariant | Meaning |
|----|-----------|---------|
| **I1** | Separation of Powers | Planner ≠ Reviewer ≠ Executor. No single agent may control more than one phase. |
| **I2** | Audit Immutability | `global_ledger.md` entries are append-only. Past entries are never edited or deleted. |
| **I3** | Identity First | Every action is attributed to a known agent identity (defined in `agents/<name>/soul.md`). |
| **I4** | Skill Boundary | Agents may only act within the capabilities declared in their `soul.md`. |

### Section 1.2 — The Safety Gate
No agent may execute a `bash` or `edit` command without a Peer Review token. The token is a `## REVIEW [STATUS]` block appended to `IMPLEMENTATION_PLAN.md` by the Architect. Valid statuses: `PASS`, `FAIL`, `CONDITIONAL`.

---

## Article II — 3-Phase Execution

### Phase A — Strategic Planning (Lead Agent)
1. The Lead Agent (assigned by Coordinator or invoked directly) produces `IMPLEMENTATION_PLAN.md` at the project root.
2. Required sections:
   - **Objective**: one-line goal.
   - **Scope**: files, systems, APIs affected.
   - **Steps**: numbered, ordered, with owner.
   - **Risks**: failure modes and rollback strategy.
   - **Knowledge Check**: list of relevant docs consulted from `knowledge/`.
3. The plan must be written **before any execution begins**.

### Phase B — Peer Review (Architect)
1. The Architect reads `IMPLEMENTATION_PLAN.md` and `user.md`.
2. Appends:
   ```
   ## REVIEW [PASS | FAIL | CONDITIONAL]
   **Reviewer**: @architect
   **Summary**: <2-3 sentence analysis>
   **Blocking Issues**: <list or "None">
   **Recommendations**: <list or "None">
   ```
3. `[FAIL]` → Plan returned to Phase A. **No execution permitted.**
4. `[PASS]` or `[CONDITIONAL]` → Execution may proceed. CONDITIONAL items must be addressed during execution.

### Phase C — Execution & Structured Logging
1. The Lead Agent executes the approved plan.
2. Every state change is logged **immediately** to the agent's `log.md` AND a summary appended to `global_ledger.md`.
3. Log entries must use the Structured Logging Protocol (Article III).

---

## Article III — Structured Logging Protocol

### Section 3.1 — Agent Logs (`agents/<name>/log.md`)
Every agent must append this schema for each action:

```
[TIMESTAMP] | AGENT: <name> | ACTION: <Read|Write|Exec>
THINKING: "<free-form reasoning — why this approach?>"
EXECUTION: "<exact commands or edit operations performed>"
IMPACT: "<what changed, which files, line references>"
```

### Section 3.2 — Global Ledger (`logs/global_ledger.md`)
The unified audit trail uses a tabular format:

```
| TIMESTAMP | ACTION | FILE | STATUS |
```

Global ledger entries are summaries. The detail lives in each agent's `log.md`.

### Section 3.3 — Dual-Logging Mandate
**Every entry written to an agent's `log.md` MUST have a corresponding summary entry in `global_ledger.md`.** This is not optional. The dual-log invariant ensures:

1. The global ledger is the single source of truth for cross-agent audit
2. No action can exist only in an agent's private log
3. A reader scanning `global_ledger.md` can reconstruct the full timeline of all PAOS activity

**Procedure**: After writing to `log.md`, the agent immediately appends a summary row to `global_ledger.md` with the same timestamp. The global entry uses the format:

```
| TIMESTAMP | ACTION | FILE | STATUS |
```

Where:
- `ACTION` = short uppercase descriptor (e.g., `SKILL_INTEGRATION`, `PLAN_REVIEW`, `FILE_EDIT`)
- `FILE` = primary file(s) affected
- `STATUS` = `OK`, `FAIL`, or `CONDITIONAL`

**Violation**: An agent that logs to `log.md` but skips `global_ledger.md` has violated H-Factor §I2 (Audit Immutability). The Coordinator must catch this during log verification.

---

## Article IV — Git Integration (System of Record)

### Section 4.1 — Auto-Commit Protocol
After every successful Phase C execution, the Lead Agent must:
1. Stage all changes: `git add -A`
2. Commit with the message standard:
   ```
   Agent[<name>]: <present-tense description of what was done>
   ```
3. The commit message must reference the `IMPLEMENTATION_PLAN.md` objective.

### Section 4.2 — Branching Strategy
- **Feature branches** use the pattern: `feat/<brief-description>`
- **Experiment branches** use the pattern: `exp/<hypothesis>` — these are for testing ideas before PR review.
- Agents must create sub-branches for experiments so the user can review "thinking" in a PR before merging.

### Section 4.3 — System of Record
Git is the PAOS memory. If the system resets, the first instruction is `git log` to restore context. Every `log.md` entry should be commitable by referencing its timestamp range.

---

## Article V — Knowledge Retrieval (RAG-Lite)

### Section 5.1 — Canonical Knowledge Base
The canonical knowledge base is `~/AI_Workflow/knowledge/`. All .md ebooks, reference documents, and design patterns live here. This is the primary scan target for identity elicitation and the first place agents consult for technical context.

### Section 5.2 — Mandatory Consultation
Before finalizing any `IMPLEMENTATION_PLAN.md`, the Lead Agent must:
1. Run `find ~/AI_Workflow/knowledge/ -name "*.md"` to list available references.
2. Run `grep -ri <domain-keywords> ~/AI_Workflow/knowledge/` for relevant technical context.
3. Run `grep -ri <domain-keywords> ~/AI_Workflow/agents/*/docs/` for agent-specific context.
4. Cite findings in the plan's **Knowledge Check** section.

### Section 5.3 — Knowledge Format
- All knowledge artifacts are `.md` files (converted from PDFs via `pandoc` or `marker`).
- Shared knowledge lives in `~/AI_Workflow/knowledge/`.
- Agent-specific knowledge lives in `~/AI_Workflow/agents/<name>/docs/`.

### Section 5.4 — Single Source of Truth & Directory Rules
To prevent duplicate data and fragmentation across the PAOS:
1. **Projects Registry**: `~/AI_Workflow/projects.md` is the canonical registry. NEVER create duplicate copies in `vault/` or `knowledge/`. Use symlinks if Obsidian visibility is required.
2. **Active Project Documentation**: All active project docs (e.g., Tradingview) MUST live in `~/AI_Workflow/knowledge/docs/<ProjectName>.md`. NEVER store them in `vault/projects/` or `knowledge/previous-projects/`.
3. **The Vault**: `~/AI_Workflow/vault/` is an interface. `vault/knowledge` and `vault/memory` are STRICT SYMLINKS to the root folders. NEVER delete them and NEVER replace them with actual directories.
4. **Dashboard**: `vault/dashboard.md` serves as the Obsidian entry point, but it relies on `[[links]]` to the canonical docs in `knowledge/docs/`.

---

## Article VI — Agent Communication

### Section 6.1 — Coordinator Delegation
When the Coordinator is active:
1. User speaks to Coordinator.
2. Coordinator reads `workflow.md`, selects agent via `soul.md` fit, and delegates.
3. Agent executes within its boundary.
4. Coordinator verifies `log.md` entry before reporting back.

### Section 6.2 — Direct Invocation
Agents may be invoked directly:
- `@coordinator <request>` — Full orchestration.
- `@architect review` — Peer review the current plan.
- `@architect design <request>` — Create a system design plan.
- `@profiler` — Re-elicit identity.

---

## Article VIII — Antigravity Review Loop

### Section 8.1 — Artifact-Driven Workflow
For any multi-step feature work, refactoring, or system change, agents MUST use the Antigravity Review Loop (skill: `antigravity-review-loop`). This replaces ad-hoc planning with a structured, user-facing review process using three artifacts:

1. **TASKS.md** — Numbered task list with status markers, complexity, dependencies
2. **IMPLEMENTATION_PLAN.md** — Technical architecture, scope, risks, rationale
3. **WALKTHROUGH.md** — Post-execution summary with file references, commands, verification

### Section 8.2 — Four-Phase Flow

| Phase | Name | Gate |
|-------|------|------|
| 1 | Planning — produce TASKS.md + IMPLEMENTATION_PLAN.md | Agent produces artifacts, then stops |
| 2 | User Review — user comments, edits, or approves | User writes `## APPROVED` or adds `<!-- COMMENT: ... -->` |
| 3 | Execution — run tasks in order, update TASKS.md live | All tasks `[x]` |
| 4 | Walkthrough — produce WALKTHROUGH.md | User reviews, may trigger re-execution |

### Section 8.3 — Comment Protocol
User feedback is expressed directly inside the `.md` artifacts:
- `<!-- COMMENT: ... -->` — inline feedback requiring a response
- `> NOTE: ...` — block-quote notes for broader feedback
- Direct edits to task descriptions or plan sections — agent must incorporate

On receiving a "review" or "proceed" signal, the agent:
1. Re-reads both artifacts
2. Addresses every comment explicitly
3. Presents revised artifacts
4. Waits for approval again

### Section 8.4 — Approval Signals
- `## APPROVED` written in either artifact
- User says: "approved", "proceed", "go ahead", "looks good"
- All comments removed + user says "review"

### Section 8.5 — Rework Loop
- No fixed iteration limit. The agent revises until explicit approval.
- Each revision cycle presents a **diff summary** of artifact changes.
- If the user is silent, the agent **waits** — never auto-proceeds.

### Section 8.6 — Quick Start Fallback
If the user says "skip review" or "just do it":
1. Produce artifacts normally
2. Flag all decisions as assumptions in a "Design Assumptions" appendix
3. Pause 5 seconds for cancellation window
4. Proceed to execution
5. Still produce WALKTHROUGH.md

### Section 8.7 — H-Factor Mapping
This skill integrates with the existing PAOS Constitution:
- Phase 1 = Article II, Phase A (Strategic Planning)
- Phase 2 = Article II, Phase B (Peer Review) — Architect reviews plan AND user reviews artifacts
- Phase 3 = Article II, Phase C (Execution & Logging)
- Phase 4 = Article III (Structured Logging) — user-facing summary

The `IMPLEMENTATION_PLAN.md` serves dual purpose: Antigravity artifact AND H-Factor plan for Architect review.

### Section 8.8 — Dual-Logging During Execution
Every task execution step logged to the agent's `log.md` MUST have a corresponding entry in `global_ledger.md` per Article III §3.3. The WALKTHROUGH.md is a user-facing summary; the logs are the audit trail.

---

## Article IX — Obsidian Vault Protocol (Mandatory)

### Section 9.1 — The Vault as Shared Memory

The Obsidian vault at `~/AI_Workflow/vault/` is the **shared persistent memory** of the PAOS. All agents MUST write to it every session. `vault/memory/` and `vault/knowledge/` are symlinked to the live `memory/` and `knowledge/` directories — writing to either is equivalent. This is how agents share state across sessions and across tools (Claude, OpenCode, Antigravity, OpenClaw, Ollama).

**Violation**: Completing a session without writing to the vault violates §I2 (Audit Immutability) and §I3 (Identity First).

### Section 9.2 — Mandatory Session Protocol

**Session START — read before acting:**

1. Read `vault/memory/global_ledger.md` — understand what other agents have done.
2. Read `vault/memory/shared/context.md` — load shared thinking context.
3. Read `vault/memory/inbox/<agent-id>/` — check messages from other agents.
4. Read `vault/daily/<YYYY-MM-DD>.md` — check today's focus and activity.

**Session END — write before closing:**

1. Append all actions to `vault/memory/<agent-id>/events.md`.
2. Append summary rows to `vault/memory/global_ledger.md`.
3. Update `vault/daily/<YYYY-MM-DD>.md` — add activity rows and linked files.
4. Write `vault/chats/<YYYY-MM-DD>-<slug>.md` — decisions, files created/modified, open questions.
5. Append thinking summary to `vault/memory/shared/context.md`.

### Section 9.3 — Daily Note Format

```markdown
# <YYYY-MM-DD>

## Today's Focus
- <one-line focus>

## Activity
| Action | Agent | Project | Files | Ref |
| ------ | ----- | ------- | ----- | --- |

## Linked Memory
- [[memory/global_ledger.md]]
- [[memory/shared/context.md]]
```

### Section 9.4 — Chat Summary Format

```markdown
---
date: <YYYY-MM-DD>
agent: <agent-id>
focus: <one-line>
---

# <Session Title>

## Decisions
| # | Decision | Rationale |
| - | -------- | --------- |

## Files Created
| File | Purpose |
| ---- | ------- |

## Files Modified
| File | Change |
| ---- | ------ |

## Open Questions
-
```

### Section 9.5 — Knowledge Contributions

When an agent learns something reusable, it MUST write it to `vault/knowledge/` (`knowledge/`), enriching the shared knowledge base for all future agents.

---

## Article VII — Amending the Constitution

Amendments to `workflow.md` require:
1. An amendment proposal in `IMPLEMENTATION_PLAN.md`.
2. Peer Review by the Architect (`[PASS]` required).
3. Logging the amendment in `global_ledger.md`.
4. A git commit: `Agent[Coordinator]: Amended workflow.md — <summary of change>`

---

## Article X — Shared Infrastructure Convention

### Section 10.1 — The Mandate

When the operator says "install an MCP server" or "install a skill", the installation target is ALWAYS the PAOS shared infrastructure — not a single agent. Every MCP server and every skill installed in PAOS must be usable by all agents in the ecosystem (Hermes, Claude Code, Gemini, Antigravity, Codex, OpenCode, OpenClaw, and any future agent).

### Section 10.2 — Shared MCP Servers

The canonical MCP registry is:
```
~/AI_Workflow/mcp/mcp-config.json
```

Every PAOS-compatible agent MUST reference this file as its MCP configuration. The standard mechanism is a symlink:
```
config/<agent>/mcp.json → ../../mcp/mcp-config.json
```

To add a new shared MCP server:
1. Add the server definition to `~/AI_Workflow/mcp/mcp-config.json`
2. Verify each agent's MCP config resolves through the symlink
3. Append an entry to `global_ledger.md`

MCP servers are implemented in `~/AI_Workflow/mcp/<server-name>/` with their own `package.json` and source code.

### Section 10.3 — Shared Skills

The canonical skills repository is:
```
~/AI_Workflow/skills/
```

Skills follow the PAOS SKILL.md format (YAML frontmatter + markdown body). Every skill added here is available for all agents to reference.

- **Hermes Agent** discovers shared skills via its own skills system (symlinked or external_dirs in config.yaml)
- **Claude Code, Gemini, Codex, OpenCode, OpenClaw** reference shared skills through their agent config files (e.g., `CLAUDE.md`, `instructions.md`, `soul.md`)
- Each skill in `~/AI_Workflow/skills/` may include `references/`, `templates/`, and `assets/` subdirectories for supporting files

To add a new shared skill:
1. Create `~/AI_Workflow/skills/<skill-name>/SKILL.md` with proper YAML frontmatter
2. Add supporting files in `references/`, `templates/`, `scripts/`, or `assets/` as needed
3. Register the skill in the skill index: `~/AI_Workflow/skills/INDEX.md`
4. Append an entry to `global_ledger.md`

### Section 10.4 — Agent Wiring Verification

After any shared infrastructure change, verify that every agent can access it:

| Agent | MCP Config Location | Skill Access |
|-------|-------------------|--------------|
| Hermes | `~/.hermes/config.yaml` (mcp_servers) | `~/.hermes/skills/` + external_dirs |
| Claude Code | `config/claude/mcp.json` → `mcp/mcp-config.json` | via `CLAUDE.md` |
| Gemini | `config/gemini/config/mcp_config.json` → `mcp/mcp-config.json` | via `soul.md` |
| Codex | `config/codex/mcp_config.json` → `mcp/mcp-config.json` | via `instructions.md` |
| OpenCode | `opencode.json` (mcp section) | via `AGENTS.md` |
| OpenClaw | `config/openclaw/mcp_config.json` → `mcp/mcp-config.json` | via `soul.md` |
| Antigravity | `config/antigravity2/mcp_config.json` → `mcp/mcp-config.json` | via `soul.md` |

### Section 10.5 — Skill Index

A skill index at `~/AI_Workflow/skills/INDEX.md` catalogs all shared skills. Every new skill MUST be registered here. The index format:

```markdown
# PAOS Shared Skills Index

| Skill | Description | Category |
|-------|-------------|----------|
| antigravity-review-loop | Artifact-driven review workflow | workflow |
| project-scaffolder | Project scaffolding from templates | devops |
| ...
```

---

*PAOS Constitution v2.1.0 — Article X: Shared Infrastructure. All agents share one MCP config and one skills repo.*
