# PAOS Shared Skills Index

> All skills in `~/AI_Workflow/skills/` are shared across every PAOS agent.
> Add new skills here with a descriptive entry.

## Core Workflow Skills

| Skill | Description | Category | Agent Access |
|-------|-------------|----------|-------------|
| [antigravity-review-loop](antigravity-review-loop/SKILL.md) | Artifact-driven review loop: Plan → Review → Execute → Walkthrough. User reviews markdown artifacts inline before any code is written. | workflow | all agents |
| [project-scaffolder](project-scaffolder/SKILL.md) | Full-stack project scaffolding from templates with SRS, MCP, and governance baked in. | devops | all agents |
| [system-analysis-and-design](system-analysis-and-design/SKILL.md) | Structured system analysis: domain elicitation, SRS authoring, use case diagrams, architecture design. | design | all agents |
| [skill-creator-elicitation](skill-creator-elicitation/SKILL.md) | Identity elicitation via the Profiler agent — scans knowledge base, produces user.md and projects.md. | identity | @profiler |

## Infrastructure Skills

| Skill | Description | Category | Agent Access |
|-------|-------------|----------|-------------|
| [vps-kit](vps-kit/SKILL.md) | AWS EC2 VPS connection and management (13.233.237.221, Ubuntu 26.04, ap-south-1). SSH, server info, quick commands. | infrastructure | all agents |

## Software Development Skills

| Skill | Description | Category | Agent Access |
|-------|-------------|----------|-------------|
| [ponytail](ponytail/SKILL.md) | Minimal-essential coding philosophy — lazy senior dev mode. ~54% less code, ~20% cheaper, ~27% faster, 100% safe. Before writing code: YAGNI → stdlib → native → installed dep → one line → minimum. | software-development | all agents |

## Documentation Skills

| Skill | Description | Category | Agent Access |
|-------|-------------|----------|-------------|
| [context7-mcp](context7-mcp/SKILL.md) | Fetch current library/framework documentation via Context7 MCP. Use for API refs, setup questions, code examples for React, Next.js, Prisma, etc. | documentation | all agents |

## Adding a New Skill

1. Create `~/AI_Workflow/skills/<skill-name>/SKILL.md` with YAML frontmatter
2. Add supporting files in `references/`, `templates/`, `scripts/`, or `assets/` subdirectories
3. Register the skill above with a brief description and category
4. Append an entry to `global_ledger.md`

## Agent-Specific Skills

Each agent has its own skill/plugin system alongside the shared PAOS skills:

| Agent | Skills Location | Format |
|-------|---------------|--------|
| Hermes | `~/.hermes/skills/` | Hermes SKILL.md format (16 skills) |
| Claude Code | `config/claude/CLAUDE.md` | Instructions + references |
| Gemini | `config/gemini/` | Config + prompts |
| Codex | `config/codex/instructions.md` | Instructions |
| OpenCode | `opencode.json` + `AGENTS.md` | Config + agent rules |
| OpenClaw | `config/openclaw/` | Config + channels |
