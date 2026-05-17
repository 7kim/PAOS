# Skill: project-scaffolder

## Trigger

Activate when the user says any of:
- "scaffold a new project", "initialize a project", "new project setup"
- "create a project harness", "set up a new app"
- `@scaffold <project-name>`
- `@developer scaffold <project-name>`

## Owner

**Agent**: `opencode-developer` (primary), `opencode-coordinator` (delegation)  
**Phase**: Article II Phase A + C (Planning then Execution)  
**H-Factor**: I4 (Skill Boundary)

## What this skill produces

A production-grade, AI-agent-optimized project directory:

```
<project-name>/
├── CLAUDE.md                — Agent instructions for this project
├── AGENTS.md                — OpenCode agent config
├── .gitignore               — Comprehensive ignores
├── README.md                — Project overview
├── IMPLEMENTATION_PLAN.md   — Initial plan (from discovery survey)
├── TASKS.md                 — Initial task list
├── src/                     — Source code (language-specific)
├── tests/                   — Test suite
├── docs/                    — Documentation
├── .github/                 — CI/CD workflows
│   └── workflows/ci.yml
└── memory/                  — Project-local memory (optional)
    ├── global_ledger.md
    └── inbox/
```

## Workflow

1. Read `skills/project-scaffolder/SKILL.md` for full protocol
2. Run **10-point discovery survey**:
   - Project name, type (web/api/cli/library/ml), primary language
   - Runtime (Node/Python/Go/Rust), package manager
   - Framework, database, auth method
   - CI/CD target, deployment target, testing framework
3. Generate directory structure based on answers
4. Write `CLAUDE.md` and `AGENTS.md` with PAOS vault protocol
5. Generate initial `IMPLEMENTATION_PLAN.md` + `TASKS.md`
6. Commit: `Agent[opencode-developer]: scaffold <project-name>`
7. Log to vault: `vault/memory/developer/events.md` + `vault/memory/global_ledger.md`

## Invocation examples

```
@scaffold my-api-service
@developer scaffold a Next.js app called dashboard-v2
new project setup for a Python CLI tool called paos-cli
```

## Quick-start (skip survey)

If user says "just scaffold it" or "skip survey", use sensible defaults:
- TypeScript + Node 20 + npm
- Express (API) or Next.js (web)
- Jest for tests, GitHub Actions for CI
- Flag all assumptions in a "Design Assumptions" appendix in IMPLEMENTATION_PLAN.md

## References

- `skills/project-scaffolder/SKILL.md` — full protocol
- `knowledge/templates/` — project templates
- `knowledge/paos/constitution.md` — H-Factor binding rules
