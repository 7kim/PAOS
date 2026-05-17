# Governance Templates

Reference templates for the PAOS governance system initialized in Phase 5.
All templates follow the append-only, immutable audit principles of H-Factor §I2.

---

## 1. Governance Directory Structure

```
.governance/
├── ledger.md             # Append-only action log
├── adr/
│   ├── 000-template.md   # ADR template (copy for new ADRs)
│   └── 001-initial-scaffold.md  # First ADR
├── tasks/
│   ├── active.md         # Current sprint/iteration tasks
│   └── backlog.md        # Future tasks
├── status/
│   └── system.md         # System status manifest
└── changelog/
    └── CHANGELOG.md      # SemVer changelog
```

---

## 2. Ledger Template (`ledger.md`)

```markdown
# Governance Ledger

Append-only audit trail for this project. Every action executed by any agent is recorded here.
Past entries are NEVER edited or deleted.

| Timestamp | Action | File | Agent | Status |
|-----------|--------|------|-------|--------|
| <ISO-8601> | <ACTION_TYPE> | <file path> | <agent-name> | OK/FAIL/CONDITIONAL |

## Action Types

| Type | Meaning |
|------|---------|
| PROJECT_INIT | Project initialization / scaffolding |
| ADR_CREATED | Architecture Decision Record created |
| ADR_AMENDED | ADR status changed (Superseded, Deprecated) |
| FILE_CREATED | New file added |
| FILE_EDITED | Existing file modified |
| FILE_DELETED | File removed |
| DEPENDENCY_ADDED | New dependency installed |
| CONFIG_CHANGED | Configuration modified |
| TASK_STARTED | Task execution begun |
| TASK_COMPLETED | Task execution finished |
| TASK_FAILED | Task execution failed |
| PHASE_COMPLETED | Full phase finished |
| VALIDATION_PASS | Validation step succeeded |
| VALIDATION_FAIL | Validation step failed |
| VALIDATION_FIX | Validation failure auto-repaired |
| GOVERNANCE_SEED | Governance system initialized |
| MILESTONE | Project milestone reached |
```

---

## 3. ADR Template (`adr/000-template.md`)

```markdown
# ADR-NNN: <Title>

**Status**: [Proposed | Accepted | Deprecated | Superseded]
**Date**: <YYYY-MM-DD>
**Author**: <agent or person name>

## Context

What is the issue that we're seeing that is motivating this decision or change?
What are the forces at play? This should be a clear, concise description of the problem.

## Decision

What is the change that we're proposing and/or doing?
What did we actually decide? Be specific.

## Consequences

### Positive
- List beneficial outcomes of this decision

### Negative
- List trade-offs or drawbacks

### Neutral
- List things that must be monitored or revisited

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|-----------------|
| Option B | <why not> |
| Option C | <why not> |

## Compliance

- [ ] This decision is reflected in the current architecture
- [ ] Documentation has been updated
- [ ] Configuration matches this decision
```

---

## 4. ADR Summary Table

For the `docs/architecture/adr-summary.md` file:

```markdown
# Architecture Decision Record Summary

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| 001 | Project Initialization | Accepted | <YYYY-MM-DD> |
| 002 | <Title> | Proposed | <YYYY-MM-DD> |

## Legend

| Status | Meaning |
|--------|---------|
| Proposed | Under review, not yet implemented |
| Accepted | Approved and implemented |
| Deprecated | No longer relevant |
| Superseded | Replaced by a newer ADR |
```

---

## 5. Task Board Template (`tasks/active.md`)

```markdown
# Active Tasks

## Current Sprint/Iteration

| ID | Task | Priority | Complexity | Dependencies | Status | Owner |
|----|------|----------|------------|--------------|--------|-------|
| T-001 | <description> | High/Med/Low | S/M/L | None | [ ] | <name> |

## In Progress

- T-001: <brief update>

## Recently Completed

- T-000: <description> — <date>

## Status Markers

| Marker | Meaning |
|--------|---------|
| [ ] | Not started |
| [~] | In progress |
| [x] | Completed |
| [-] | Cancelled |
| [!] | Blocked |
```

---

## 6. Backlog Template (`tasks/backlog.md`)

```markdown
# Task Backlog

| ID | Task | Priority | Complexity | Notes |
|----|------|----------|------------|-------|
| T-010 | <description> | Low | L | <notes> |
```

---

## 7. System Status Template (`status/system.md`)

```markdown
# System Status

**Last Updated**: <YYYY-MM-DD HH:MM>

## Services

| Service | Status | Uptime | Version | Notes |
|---------|--------|--------|---------|-------|
| API | Operational | 99.9% | 0.1.0 | Healthy |
| Database | Operational | 99.9% | - | Connected |

## Recent Incidents

| Date | Incident | Resolution |
|------|----------|------------|
| <date> | <description> | <resolution> |

## Deployment

| Environment | Status | Last Deployed | Commit |
|-------------|--------|---------------|--------|
| Development | Active | <date> | <hash> |
| Staging | - | - | - |
| Production | - | - | - |
```

---

## 8. Changelog Baseline (`CHANGELOG.md`)

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- <new features>

### Changed
- <changes to existing functionality>

### Deprecated
- <soon-to-be-removed features>

### Removed
- <removed features>

### Fixed
- <bug fixes>

### Security
- <vulnerability fixes>

---

## [0.1.0] - <YYYY-MM-DD>

### Added
- Project initialized via project-scaffolder skill
- Full development toolchain configured (TypeScript, ESLint, Prettier, Vitest)
- Docker development environment with hot-reload
- CI/CD pipeline configured
- Governance system initialized (ADRs, ledger, task board)
- AI agent configuration (Claude Code, opencode, Cursor, Copilot)
- Health check endpoint
- Security defaults (env-based config, CORS, rate limiting)
- Architecture documentation
```

---

## 9. AI Agent Configuration Files

### CLAUDE.md (Claude Code)

```markdown
# Claude Code Project Guide

## Project Overview
<one-line purpose from survey>

## Commands
- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run lint` — Lint check
- `npm run test` — Run tests
- `npm run typecheck` — TypeScript check

## Architecture
- <brief architecture summary>
- See `ARCHITECTURE.md` for full details
- See `docs/adr/` for key decisions

## Conventions
- 2-space indentation
- ESM modules
- TypeScript strict mode
- Conventional commits for git messages

## Important Files
- `src/` — All source code
- `.env.example` — Required environment variables
```

### .cursorrules (Cursor)

```
You are an expert software engineer working on <project-name>.
<one-line purpose>

## Tech Stack
- <list key technologies>

## Conventions
- 2-space indentation
- TypeScript strict mode
- ESM modules
- Conventional commits

## Commands
- dev: <command>
- build: <command>
- lint: <command>
- test: <command>
- typecheck: <command>

## Important
- Read ARCHITECTURE.md before proposing major changes
- Read docs/adr/ for key decisions
- Always check .env.example for required env vars
```

### .github/copilot-instructions.md

```markdown
# GitHub Copilot Instructions

## Project Context
- <project name>: <one-line purpose>
- Language: TypeScript (strict mode)
- Module system: ESM
- Package manager: pnpm

## Coding Guidelines
- Write tests for all new features
- Follow existing code patterns in the project
- Use environment variables for all configuration
- Document public APIs with JSDoc comments

## Architecture
- See ARCHITECTURE.md for system overview
- Check docs/adr/ before making architectural changes
```

---

## 10. PAOS Governance Directory Structure

If the user enables PAOS governance, create `.opencode/` with:

```
.opencode/
├── workflow.md           # PAOS Constitution (copy from global)
├── user.md               # Operator identity (copy from global)
├── agents/
│   ├── coordinator.md
│   ├── architect.md
│   └── profiler.md
├── skills/
│   └── <relevant skills>
├── logs/
│   └── global_ledger.md  # Project-specific audit trail
└── knowledge/
    └── <project-specific docs>
```
