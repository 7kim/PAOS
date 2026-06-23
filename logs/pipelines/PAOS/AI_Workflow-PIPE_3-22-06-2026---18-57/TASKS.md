# Tasks — Real-time Cross-Agent Execution

Status Key: `[ ]` pending | `[~]` in progress | `[x]` done

- [x] Task 1 — Initial Proposal
  **File**: `PROPOSAL-opencode-developer.md` | **Complexity**: S
  Original proposal: systemd path unit, 8 lines, zero deps.

- [x] Task 2 — Hermes Enhancement
  **File**: `ENHANCED_IDEAS-hermes-nous.md` | **Complexity**: M
  Hermes added: multi-agent scope, security guardrails, hybrid architecture, fallback.

- [x] Task 3 — Create IMPLEMENTATION_PLAN.md
  **File**: `memory/pipelines/PIPE-20260622-185724-pia2ix/IMPLEMENTATION_PLAN.md` | **Complexity**: M | **Deps**: 1, 2
  Full plan: architecture, guardrails, handler flow, fallback.

- [x] Task 4 — Create TASKS.md
  **File**: `memory/pipelines/PIPE-20260622-185724-pia2ix/TASKS.md` | **Complexity**: S | **Deps**: 3
  This file. Numbered task breakdown.

- [x] Task 5 — Create systemd path unit
  **File**: `~/.config/systemd/user/paos-pipeline.path` | **Complexity**: S | **Deps**: 3
  4-line `.path` file: watch `memory/pipelines/` with `PathChanged`.

- [x] Task 6 — Create systemd service unit
  **File**: `~/.config/systemd/user/paos-pipeline.service` | **Complexity**: S | **Deps**: 5
  4-line `.service` file: runs `bin/paos-pipeline-handler.sh`.

- [x] Task 7 — Create handler script
  **File**: `bin/paos-pipeline-handler.sh` | **Complexity**: L | **Deps**: 3
  Main routing script with all guardrails (lock, rate limit, whitelist, timeout, kill switch).

- [x] Task 8 — Create fallback watcher script
  **File**: `bin/paos-pipeline-watch.sh` | **Complexity**: S | **Deps**: 7
  Inotifywait loop for containers/WSL. Thin wrapper calling handler.sh.

- [x] Task 9 — Create whitelist config
  **File**: `~/.config/paos/pipeline-whitelist.txt` | **Complexity**: XS | **Deps**: 7
  Default whitelist: `hermes-nous`, `opencode-developer`, `claude`.

- [x] Task 10 — Enable and start systemd units
  **Complexity**: S | **Deps**: 5, 6
  `systemctl --user daemon-reload && systemctl --user enable --now paos-pipeline.path`

- [x] Task 11 — Verify end-to-end
  **Complexity**: M | **Deps**: 10
  Submit test pipeline → verify handler detects it → verify inbox notification → optionally verify auto-execution.

- [x] Task 12 — Update documentation
  **Complexity**: S | **Deps**: 10
  Add "Auto-Execution" section to `config/claude/CLAUDE.md`, `skills/INDEX.md`, and relevant soul.md files.

- [x] Task 13 — Send completed pipeline to Hermes
  **Complexity**: XS | **Deps**: 11, 12
  Write to Hermes' inbox: plan implemented, units active, verification passed.
