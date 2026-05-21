# PAOS Constitution — Personal Agent Operating System
## H-Factor Protocol v2.0.0 (Hyper-Structured Factor)

---

## Article I — Governance Gates

### Section 1.1 — The H-Factor Mandate
Every action taken within the PAOS must satisfy four invariants before, during, and after execution:

| ID | Invariant | Meaning |
|----|-----------|---------|
| **I1** | Separation of Powers | Planner (PM) ≠ Reviewer (Architect) ≠ Executor (Developer) ≠ Orchestrator (Coordinator). No single agent may control more than one phase. |
| **I2** | Audit Immutability | `global_ledger.md` entries are append-only. Past entries are never edited or deleted. |
| **I3** | Identity First | Every action is attributed to a known agent identity (defined in `agents/<name>/soul.md`). |
| **I4** | Skill Boundary | Agents may only act within the capabilities declared in their `soul.md`. |

### Section 1.2 — The Safety Gate
No agent may execute a `bash` or `edit` command without a Peer Review token. The token is a `## REVIEW [STATUS]` block appended to `IMPLEMENTATION_PLAN.md` by the Architect. Valid statuses: `PASS`, `FAIL`, `CONDITIONAL`.

---

## Article II — 3-Phase Execution

### Phase A — Strategic Planning (Lead Agent)
1. The Lead Agent (assigned by Coordinator or invoked directly — typically the Project Manager / `@plan`) produces `IMPLEMENTATION_PLAN.md` at the project root.
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
1. The **Developer** (`@developer`) executes the approved plan using the handoff prompt from the Project Manager.
2. Every state change is logged **immediately** to the agent's `log.md` (`logs/developer/events.md`) AND a summary appended to `global_ledger.md`.
3. Log entries must use the Structured Logging Protocol (Article III).
4. The task board at `memory/tasks/` must be updated after each task item completes.

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

### Section 3.3 — Project-Level Ledger
Every action performed on a project must also be logged to that project's ledger at `memory/projects/<project-name>/ledger.md`. This creates a per-project audit trail alongside the per-agent logs and global ledger. The project ledger uses the same tabular format as the global ledger:

```
| Timestamp (UTC) | Agent | Task ID | Action | Files | Commit |
```

### Section 3.4 — Dual-Logging Mandate
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

---

## Article VI — Agent Communication

### Section 6.1 — Coordinator Delegation
When the Coordinator is active:
1. User speaks to Coordinator.
2. Coordinator reads `workflow.md`, selects agent via `soul.md` fit, and delegates.
3. Agent executes within its boundary.
4. Coordinator verifies `log.md` entry before reporting back.

### Section 6.2 — Direct Invocation
The canonical roster, git identities, permissions, MCP bindings, and health checks live in `agents/registry.json`. The list below is the human-facing invocation shorthand.

Agents may be invoked directly:
- `@developer <request>` — Execute a task (default — no planning needed) or initiate the pipeline (planning needed → delegates to PM).
- `@plan <request>` — Project Manager: think, plan, produce Antigravity artifacts and handoff prompts.
- `@coordinator <request>` — Full orchestration, active routing between agents.
- `@architect review` — Peer review the current plan.
- `@architect design <request>` — Create a system design plan.
- `@profiler` — Re-elicit identity.
- `@openclaw <request>` — OpenClaw agent (reserved — install OpenClaw to activate; config at `~/AI_Workflow/config/openclaw/`).
- `@gemini <request>` — Google Gemini AI coding agent (config: `~/AI_Workflow/config/gemini/`; soul: `agents/gemini/soul.md`).
- `@signal <request>` — Notification & Messenger agent (config: `~/AI_Workflow/config/signal/`; soul: `agents/signal/soul.md`).
- `@antigravity <request>` — Antigravity Desktop IDE Agent (config: `~/AI_Workflow/config/antigravity2/`; soul: `agents/antigravity/soul.md`).
- `@hermes-nous <request>` — Nous Research Hermes Agent (binary: `~/.local/bin/hermes`; soul: `agents/hermes-nous/soul.md`; home: `~/.hermes/`).

### Section 6.3 — Pipeline Routing (Handoff Protocol)
The standard multi-agent pipeline is:

```
Developer → PM (Plan) → Architect + Coordinator (parallel review) → PM (Handoff) → Developer (Execute) → Coordinator (Verify)
```

1. **Developer** delegates planning to the Project Manager via `task(agent="plan", ...)`
2. **PM** produces Antigravity artifacts in `memory/pm-logs/` and a handoff prompt in `memory/prompts/`
3. **PM** delegates to Architect and Coordinator IN PARALLEL via `task()`
4. **Architect** reviews artifacts and issues PASS/FAIL/CONDITIONAL
5. **Coordinator** verifies procedural compliance and dual-logging
6. **PM** compiles results, writes WALKTHROUGH.md + handoff prompt, updates task card
7. **Developer** reads handoff, executes, updates task board live
8. **Coordinator** verifies completion and logs to `global_ledger.md`

### Section 6.4 — Shared Context & Inter-Agent Communication
All agents participate in three tiers of shared state:

**Tier A — Shared Context** (`memory/shared/context.md`)
Append-only thinking document. Every agent writes a structured entry when they start and finish work. Format:
```
## [date] @agent — Task: <task-id>
**Thinking**: <key ideas>
**Decisions**: <list>
**Handoff Notes**: <for next agent>
```

**Tier B — Task Board** (`memory/tasks/`)
Per-task markdown files with YAML frontmatter tracking status through the pipeline. Status flow:
```
proposed → needs_planning → planning → needs_review → approved → ready_for_execution → executing → done → blocked
```

**Tier C — Agent Inbox** (via MCP `send_message` / `read_inbox`)
Asynchronous messaging between agents. Each agent has an inbox at `memory/inbox/<agent>/`. Messages are sent via the shared-memory MCP server's `send_message` tool and read via `read_inbox`.

### Section 6.5 — PM Thinking Logs (Antigravity Format)
The Project Manager's thinking is captured in `memory/pm-logs/` using the Antigravity Review Loop artifact set:
1. `<task-id>-IMPLEMENTATION_PLAN.md` — technical architecture and plan
2. `<task-id>-TASKS.md` — numbered task breakdown with status markers
3. `<task-id>-WALKTHROUGH.md` — post-planning summary and handoff guide

These serve as both the PM's thinking log AND the input to Architect review and Developer execution.

### Section 6.6 — /h-pipeline Command (Cross-Agent Plan-Then-Execute)

The `/h-pipeline` command enables any planner agent to submit a structured plan to an executor agent through the PAOS pipeline system. This saves tokens by separating planning from execution.

**Flow**:
1. User types `/h-pipeline <prompt>` in any planner agent
2. Planner produces `IMPLEMENTATION_PLAN.md` + `TASKS.md`
3. Planner calls `shared-memory: submit_pipeline` MCP tool (or `bin/h-pipeline submit` CLI)
4. The system creates:
   - `memory/pipelines/PIPE-<id>/` with PLAN.md + TASKS.md + META.json
   - Task card at `memory/tasks/PIPE-<id>.md`
   - Message in executor's inbox at `memory/inbox/<executor>/`
   - Entry in `memory/global_ledger.md`
5. Executor picks up the task from its inbox and executes

**Planner Agents** (can invoke `/h-pipeline`):
- Claude Code, Gemini, Antigravity IDE, Antigravity 2.0 CLI, Codex, OpenClaw

**Executor Agents** (receive and execute plans):
- Default: `opencode-developer` (OpenCode)
- Fallback: `hermes` (notification-only pipelines)
- Configurable per pipeline via `config/pipeline-defaults.yaml`

**Pipeline Settings** (configured in each agent's config file and `config/pipeline-defaults.yaml`):
```yaml
pipeline:
  executor: opencode-developer
  review_mode: auto
  plan_format: antigravity
  auto_commit: true
  notify_on_complete: true
```

**Architecture**:
```
Planner Agent → submit_pipeline MCP tool → memory/pipelines/PIPE-xxx/
                                            ├── PLAN.md
                                            ├── TASKS.md
                                            └── META.json
                                        → memory/tasks/PIPE-xxx.md (task card)
                                        → memory/inbox/<executor>/ (message)
                                        → memory/global_ledger.md (audit entry)
```

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

The Obsidian vault at `~/AI_Workflow/vault/` is the **shared persistent memory** of the PAOS. All agents MUST write to it. This is not optional. The vault is how agents share state across sessions, across tools (Claude, OpenCode, Antigravity, OpenClaw, Ollama), and across time. `vault/memory/` and `vault/knowledge/` are symlinked to the live `memory/` and `knowledge/` directories — writing to either location is equivalent.

**Violation**: An agent that completes a session without writing to the vault has violated H-Factor §I2 (Audit Immutability) and §I3 (Identity First).

### Section 9.2 — Mandatory Session Protocol

Every agent, on every session, MUST perform these steps **in order**:

**Session START (read before acting):**

1. Read `vault/memory/global_ledger.md` — understand what other agents have done.
2. Read `vault/memory/shared/context.md` — load the shared thinking context.
3. Read `vault/memory/inbox/<agent-id>/` — check for messages from other agents.
4. Read `vault/daily/<YYYY-MM-DD>.md` — check today's focus and activity.

**Session END (write before closing):**

1. Append all actions to `vault/memory/<agent-id>/events.md`.
2. Append summary rows to `vault/memory/global_ledger.md`.
3. Update `vault/daily/<YYYY-MM-DD>.md` — add activity rows and linked files.
4. Write or update `vault/chats/<YYYY-MM-DD>-<session-slug>.md` — decisions, files created/modified, open questions.
5. Append thinking summary to `vault/memory/shared/context.md`.

### Section 9.3 — Daily Note Format

Every agent writes to `vault/daily/<YYYY-MM-DD>.md`. If the file does not exist, create it from the template below:

```markdown
# <YYYY-MM-DD>

## Today's Focus
- <one-line focus from user request>

## Activity
| Action | Agent | Project | Files | Ref |
| ------ | ----- | ------- | ----- | --- |
| <verb> | <agent-id> | <project> | <file(s)> | <task-id or commit> |

## Linked Memory
- [[memory/global_ledger.md]]
- [[memory/shared/context.md]]
```

### Section 9.4 — Chat Summary Format

Every session produces a chat summary at `vault/chats/<YYYY-MM-DD>-<slug>.md`:

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

### Section 9.5 — Cross-Agent Visibility

Because `vault/memory/` is a symlink to `memory/`, any agent writing to `memory/global_ledger.md` or `memory/<agent>/events.md` is automatically visible to every other agent reading the vault. This is the cross-agent shared memory mechanism. Agents MUST use it to communicate state without requiring direct coordination.

### Section 9.6 — Knowledge Contributions

When an agent learns something reusable (a pattern, a design decision, a gotcha), it MUST write it to `vault/knowledge/` (which is `knowledge/`). This enriches the shared knowledge base for all future agents and sessions.

---

## Article VII — Amending the Constitution

Amendments to `workflow.md` require:
1. An amendment proposal in `IMPLEMENTATION_PLAN.md`.
2. Peer Review by the Architect (`[PASS]` required).
3. Logging the amendment in `global_ledger.md`.
4. A git commit: `Agent[Coordinator]: Amended workflow.md — <summary of change>`

---

*PAOS Constitution v2.0.0 — Established 2026-05-15. Governed by H-Factor invariants I1–I4.*
