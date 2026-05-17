# Implementation Plan: AI Workflow Hub Consolidation

**Objective:** Consolidate all AI agent configurations (opencode, Claude Code, Antigravity, PAOS) into a single version-controlled `~/AI_Workflow/` directory with shared memory, shared knowledge, and MCP-based cross-agent access.

---

## Scope

| System | From | To |
|--------|------|----|
| **opencode home** | `~/.opencode/` | `~/AI_Workflow/` (symlink back) |
| **opencode system config** | `~/.config/opencode/` | `~/AI_Workflow/config/opencode/` (symlink back) |
| **Claude Code** | `~/.claude/` | `~/AI_Workflow/config/claude/` (symlink back) |
| **Antigravity VS Code ext** | `~/.antigravity/` | `~/AI_Workflow/config/antigravity/` (symlink back) |
| **Home AGENTS.md** | `~/AGENTS.md` | `~/AI_Workflow/config/opencode/AGENTS.md` (symlink back) |
| **Knowledge base** | `~/.opencode/knowledge/` | `~/AI_Workflow/knowledge/` (enriched with PAOS + templates) |
| **Shared memory** | `~/.opencode/logs/` | `~/AI_Workflow/memory/` (expanded) |
| **PAOS constitution** | `~/.opencode/workflow.md` | `~/AI_Workflow/workflows/workflow.md` |
| **Project registry** | `~/.opencode/projects.md` | `~/AI_Workflow/projects.md` |
| **Skills** | `~/.opencode/skills/` | `~/AI_Workflow/skills/` |
| **Agents** | `~/.opencode/agents/` | `~/AI_Workflow/agents/` |
| **Binary** | `~/.opencode/bin/opencode` | `~/AI_Workflow/bin/opencode` + PATH update |
| **Scaffold template** | `project-gemini/` | `~/AI_Workflow/knowledge/templates/fullstack-monorepo/` |
| **PATH** | `.bashrc` line | update to `~/AI_Workflow/bin` |
| **Obsidian vault** | (new) | `~/AI_Workflow/vault/` with `.obsidian/` + symlinks |
| **MCP servers** | (new) | `~/AI_Workflow/mcp/` with shared-memory + scaffold |
| **Git repo** | (new) | `~/AI_Workflow/.git/` — single source of truth |

---

## Target Directory Structure

```
~/AI_Workflow/
├── bin/
│   └── opencode                        # (moved from ~/.opencode/bin/)
│
├── config/
│   ├── opencode/                        # (moved from ~/.config/opencode/)
│   │   ├── opencode.json
│   │   ├── opencode.jsonc
│   │   ├── AGENTS.md
│   │   ├── user.md
│   │   ├── walkthrough.md
│   │   └── .gitignore
│   ├── claude/                          # (moved from ~/.claude/)
│   │   ├── settings.json
│   │   ├── settings.local.json
│   │   ├── .credentials.json
│   │   ├── history.jsonl
│   │   ├── projects/
│   │   │   ├── -home-dev/
│   │   │   └── -home-dev-Documents-Dev/
│   │   └── ...
│   └── antigravity/                     # (moved from ~/.antigravity/)
│       ├── argv.json
│       └── extensions/
│
├── agents/                              # (moved from ~/.opencode/agents/)
│   ├── architect/
│   ├── coordinator/
│   └── profiler/
│
├── skills/                              # (moved from ~/.opencode/skills/)
│   ├── antigravity-review-loop/
│   ├── project-scaffolder/
│   ├── skill-creator-elicitation/
│   └── system-analysis-and-design/
│
├── knowledge/                           # (moved from ~/.opencode/knowledge/, enriched)
│   ├── paos/                            # PAOS constitution + H-Factor docs
│   ├── templates/                       # Scaffold templates
│   │   └── fullstack-monorepo/          # (copied from project-gemini scaffold)
│   └── references/                      # (from knowledge/docs/ + enriched)
│
├── memory/                              # (moved + expanded from ~/.opencode/logs/)
│   ├── global_ledger.md
│   ├── system_status.md
│   ├── learnings.md
│   └── identity_state.json
│
├── vault/                               # (new — Obsidian vault)
│   ├── .obsidian/                       # Obsidian config directory
│   ├── knowledge/  ──symlink──> ../knowledge/
│   ├── memory/     ──symlink──> ../memory/
│   └── projects/                        # Symlinks to all real project dirs
│       └── README.md
│
├── mcp/                                 # (new — MCP servers)
│   ├── shared-memory-server/
│   │   ├── package.json
│   │   ├── index.js
│   │   └── README.md
│   ├── scaffold-server/
│   │   ├── package.json
│   │   ├── index.js
│   │   └── README.md
│   └── mcp-config.json
│
├── workflows/                           # (moved from ~/.opencode/ + enriched)
│   └── workflow.md                      # PAOS Constitution
│
├── .gitignore
├── projects.md
└── README.md
```

---

## Steps

### Phase 1 — Create the Hub (structure + git init)

1. Create `~/AI_Workflow/` with all subdirectories (`bin/`, `config/`, `agents/`, `skills/`, `knowledge/`, `memory/`, `vault/`, `mcp/`, `workflows/`, `templates/`).
2. `git init` inside `~/AI_Workflow/`.
3. Write `.gitignore` — block `node_modules/`, `*.credentials.json`, `extensions/`, `sessions/`, `.obsidian/`, `*.log`.

### Phase 2 — Move Then Symlink (opencode home)

4. **Move** all contents of `~/.opencode/` into `~/AI_Workflow/` (rsync, then rm originals):
   - `agents/` → `agents/`
   - `skills/` → `skills/`
   - `knowledge/` → `knowledge/`
   - `logs/` → `memory/` (rename `global_ledger.md`)
   - `bin/opencode` → `bin/opencode`
   - `user.md` → `config/opencode/user.md`
   - `walkthrough.md` → `config/opencode/walkthrough.md`
   - `workflow.md` → `workflows/workflow.md`
   - `projects.md` → `projects.md`
   - `.gitignore` → merge with root `.gitignore`
   - `node_modules/`, `package.json`, `package-lock.json` → move as-is for runtime safety
5. **Remove** the original `~/.opencode/` directory.
6. **Create symlink**: `ln -s ~/AI_Workflow ~/.opencode`

### Phase 3 — Move Then Symlink (opencode system config)

7. **Move** all contents of `~/.config/opencode/` into `~/AI_Workflow/config/opencode/`:
   - `opencode.json`, `opencode.jsonc`, `opencode.json.bak`
   - `AGENTS.md`
   - `.gitignore`
   - `node_modules/`, `package.json`, `package-lock.json`
8. **Remove** `~/.config/opencode/`.
9. **Create symlink**: `ln -s ~/AI_Workflow/config/opencode ~/.config/opencode`

### Phase 4 — Move Then Symlink (Claude Code)

10. **Move** all contents of `~/.claude/` into `~/AI_Workflow/config/claude/`:
    - `settings.json`, `settings.local.json`
    - `.credentials.json` (preserve strict permissions)
    - `history.jsonl`
    - `mcp-needs-auth-cache.json`
    - `projects/` (including session JSONLs)
    - `backups/`, `cache/`, `downloads/`, `file-history/`, `ide/`, `plugins/`, `session-env/`, `sessions/`, `shell-snapshots/`
11. **Remove** `~/.claude/`.
12. **Create symlink**: `ln -s ~/AI_Workflow/config/claude ~/.claude`

### Phase 5 — Move Then Symlink (Antigravity)

13. **Move** contents of `~/.antigravity/` into `~/AI_Workflow/config/antigravity/`:
    - `argv.json`
    - `extensions/` (keep — may be large)
14. **Remove** `~/.antigravity/`.
15. **Create symlink**: `ln -s ~/AI_Workflow/config/antigravity ~/.antigravity`

### Phase 6 — Move Then Symlink (Home AGENTS.md)

16. Check diff between `~/AGENTS.md` and `~/AI_Workflow/config/opencode/AGENTS.md`. If different, merge into `~/AI_Workflow/config/opencode/AGENTS.md` and note the changes.
17. **Remove** `~/AGENTS.md`.
18. **Create symlink**: `ln -s ~/AI_Workflow/config/opencode/AGENTS.md ~/AGENTS.md`

### Phase 7 — Update PATH

19. Edit `~/.bashrc`:
    - Change `export PATH=/home/dev/.opencode/bin:$PATH`
    - To: `export PATH="$HOME/AI_Workflow/bin:$PATH"`

### Phase 8 — Enrich Knowledge Base

20. Create `knowledge/paos/` — copy PAOS constitution and H-Factor docs
21. Create `knowledge/templates/fullstack-monorepo/` — copy the empty scaffold structure from `project-gemini/`
22. Create `knowledge/references/` — existing knowledge/docs/ content + enriched

### Phase 9 — Scaffold Obsidian Vault

23. Create `vault/.obsidian/` — minimal Obsidian config (`app.json`, `community-plugins.json`, `core-plugins.json`, `workspace.json`)
24. Create symlink: `vault/knowledge/` → `../knowledge/`
25. Create symlink: `vault/memory/` → `../memory/`
26. Create `vault/projects/` with `projects.md` index file pointing to all project symlinks (future — user adds project dirs manually)

### Phase 10 — Scaffold MCP Servers

27. Create `mcp/shared-memory-server/` — Node.js MCP server exposing:
    - **Resources**: `memory://` (all files in `memory/`), `knowledge://` (all files in `knowledge/`)
    - **Tool**: `append_ledger` (appends to `memory/global_ledger.md` with format enforcement)
28. Create `mcp/scaffold-server/` — Node.js MCP server exposing:
    - **Tool**: `scaffold_project(name, template)` — copies template from `knowledge/templates/` to target
29. Create `mcp/mcp-config.json` — master MCP config referencing both servers

### Phase 11 — Verify

30. Test opencode: `opencode --version` (should still resolve)
31. Test symlinks: `ls -la ~/.opencode`, `~/.config/opencode`, `~/.claude`, `~/.antigravity`, `~/AGENTS.md` — all should point to `~/AI_Workflow/`
32. Git status check in `~/AI_Workflow/`
33. `git add -A && git commit -m "Agent[Coordinator]: AI_Workflow hub consolidation"`

---

## Risks & Rollback

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| `node_modules` not found after move | Low | Move entire dir; test binary immediately after |
| Symlink loop / broken ref | Low | Test each symlink with `readlink -f` |
| `.credentials.json` permission broken | Low | Preserve `chmod 600` on move |
| Path not reloaded in current shell | Medium | User runs `source ~/.bashrc` or opens new terminal |
| Claude sessions break from path change | Low | Symlinks preserve original paths — Claude never knows it moved |

**Rollback**: Keep a timestamped backup of all originals before deletion. If anything breaks: restore originals, remove symlinks, revert PATH change.

---

## Knowledge Check

- Consulted: `~/.opencode/` structure, `~/.config/opencode/`, `~/.claude/`, `~/.antigravity/`, `~/AGENTS.md`, `.bashrc`
- Template referenced: `project-gemini/` scaffold
- PAOS Articles: Article II (3-Phase), Article III (Structured Logging), Article IV (Git Integration), Article VI (Agent Communication)

## Design Assumptions

- `~/AI_Workflow/` resolves to `/home/dev/AI_Workflow/`. If user intended filesystem root `/AI_Workflow/`, paths and symlinks need adjustment.
- `node_modules/` in `~/.opencode/` and `~/.config/opencode/` are runtime dependencies and should move with the binary.
- Claude Code's `.credentials.json` contains API keys — handled with restricted permissions.
- Antigravity's `extensions/` directory (VS Code extensions) is large but must move.
- The home `AGENTS.md` and config `AGENTS.md` may differ — will merge.
