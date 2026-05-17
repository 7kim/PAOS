# Standardized Project Discovery Survey

This is the canonical 10-point survey for project initialization.
Ask every question in order. Do not skip. Record all answers in `SURVEY.md`.

---

## 1. Project Identity

| Question | Purpose |
|----------|---------|
| What is the project name? | Used for directory name, package.json `name`, repo name |
| Write a one-line purpose. | Used for README, package.json `description`, ARCHITECTURE.md |
| Who is the target user/customer? | Informs UX decisions, feature scope, documentation tone |
| What problem does this project solve? | Forces clarity on value proposition before coding |

**Critical**: If the user cannot articulate a clear one-line purpose, probe until they can.
An unclear purpose produces unclear architecture.

---

## 2. Project Type & Scale

| Question | Purpose |
|----------|---------|
| What type of system is this? | Determines scaffold template (CLI, web, API, library, etc.) |
| Is this personal/single-user, team (2-10), or enterprise/multi-tenant? | Scales auth, database, deployment decisions |
| Expected usage frequency: occasional on-demand, continuous daemon, or scheduled batch? | Informs process model (long-lived vs. serverless vs. cron) |
| Expected data volume: <1GB, 1-100GB, 100GB+? | Database choice, caching strategy |
| Expected user count: <10, 10-1000, 1000+? | Auth system, rate limiting, deployment topology |

**Options for project type** (choose one):
- CLI tool (Node.js/TypeScript)
- CLI tool (Python)
- Web application (Next.js, full-stack)
- API service (REST/GraphQL)
- Library / SDK (npm package)
- Monorepo (multi-package workspace)
- VS Code Extension
- MCP Server (Model Context Protocol)
- Python service (FastAPI / Django)
- Static site (no backend)
- Desktop application (Electron / Tauri)
- Mobile application (React Native / Expo)
- Other (describe)

---

## 3. Frontend

| Question | Purpose |
|----------|---------|
| Does this project need a user interface? | Y/N — if no, skip the rest of this section |
| If yes: web, CLI/TUI, or both? | Determines framework choice |
| Any framework preference? | Next.js, Astro, vanilla HTML, React SPA, Vue, Svelte, etc. |
| Any UI library preference? | Tailwind CSS, shadcn/ui, Material UI, Chakra, Ant Design, none |
| Any design system or brand guidelines? | Color palette, typography, component library |
| Is SSR/SSG needed? | SEO, initial load performance |
| Are you targeting responsive/mobile views? | Layout strategy, testing matrix |
| Any PWA requirements? | Offline support, service workers, manifest |

**Fallback**: If the user wants a web UI but has no preference, default to:
- Next.js 16 + React 19 + Tailwind CSS 4
- TypeScript, strict mode
- App Router

---

## 4. Backend & Data

| Question | Purpose |
|----------|---------|
| Does this project need a server / API layer? | Y/N — if no, skip server scaffolding |
| Data storage required? | None, SQLite, PostgreSQL, MySQL, Redis, MongoDB, filesystem, S3-compatible |
| External API integrations? | List third-party services (OpenAI, GitHub, Slack, Stripe, etc.) |
| Is there a real-time/streaming requirement? | WebSocket, SSE, polling |
| File upload/storage needed? | Local filesystem, S3, Cloudflare R2 |
| Background job processing needed? | Cron, message queue (Bull, RabbitMQ), serverless functions |
| Search functionality needed? | Full-text search (PostgreSQL FTS, Meilisearch, Elasticsearch) |

**Database defaults by project type**:
| Type | Default DB | Rationale |
|------|-----------|-----------|
| CLI tool | SQLite (better-sqlite3) | Zero-config, portable |
| Web app (single-user) | SQLite | Simple, no server needed |
| Web app (multi-user) | PostgreSQL | Production standard |
| API service | PostgreSQL | Industry standard |
| Library/SDK | None | Data layer is consumer's choice |
| Local-first tool | SQLite | Embedded, no daemon |

---

## 5. Infrastructure

| Question | Purpose |
|----------|---------|
| Where will this be deployed? | Local machine, VPS, Docker, serverless, npm registry, VS Code marketplace, browser extension |
| Any cloud services required? | AWS, GCP, Azure, Cloudflare, Vercel, Railway, Fly.io, none |
| CI/CD needed? | GitHub Actions, GitLab CI, CircleCI, none |
| Domain name / DNS setup? | Custom domain, SSL certificate |
| Monitoring / observability? | Logging (winston/pino), metrics (Prometheus), tracing (OpenTelemetry), error tracking (Sentry) |
| Backup strategy? | Database backups, file storage backups, disaster recovery |

**Deployment defaults**:
| Type | Default Target | Container? |
|------|---------------|------------|
| CLI tool | npm registry | Optional (dev only) |
| Web app | Docker on VPS or Vercel | Recommended |
| API service | Docker on VPS | Yes |
| Library | npm registry | No |
| VS Code Extension | VS Code Marketplace | No |

---

## 6. AI Requirements

| Question | Purpose |
|----------|---------|
| Does this project use LLMs or AI models? | Y/N — if no, skip this section |
| Which AI provider(s)? | OpenAI, Anthropic, Google Gemini, Ollama (local), LM Studio, multi-provider |
| Mode of interaction? | Chat/completion, function calling, streaming, RAG/embeddings, vision, tool use |
| Is offline/local inference needed? | Ollama, llama.cpp, LM Studio |
| Is there a need for agentic behavior? | Multi-step reasoning, tool chaining, autonomous loops |
| Rate limiting / cost management needed? | Token budgeting, request throttling, fallback models |
| Any fine-tuning or custom model needs? | Fine-tuned models, LoRA adapters |

**Provider recommendation logic**:
- "I don't know" → Multi-provider abstraction layer (AI SDK or custom provider interface)
- "Specific provider mentioned" → Use that provider's SDK with abstraction for future switching
- "Local/offline" → Ollama + provider abstraction

---

## 7. Security & Auth

| Question | Purpose |
|----------|---------|
| Authentication required? | None (local-only), API keys, OAuth (GitHub/Google), JWT, session-based, passkeys |
| Multi-tenancy? | Single-user, team workspaces, organization accounts |
| Role-based access control (RBAC)? | Admin, user, read-only roles |
| Sensitive data handling? | PII, credentials, financial data, health data — determines encryption requirements |
| Compliance requirements? | SOC2, HIPAA, GDPR, PCI-DSS, none |
| Audit logging of user actions? | Y/N |
| Rate limiting / abuse prevention? | Y/N |

**Security defaults**:
- All secrets in environment variables
- `.env` in `.gitignore`
- CORS restricted to known origins
- Input validation on all API endpoints
- Helmet.js for HTTP headers (Express/Fastify)
- Rate limiting on auth endpoints
- Password hashing (bcrypt/argon2)
- SQL injection prevention (parameterized queries/ORM)

---

## 8. Testing Standards

| Question | Purpose |
|----------|---------|
| What level of testing? | None, unit only, unit + integration, unit + integration + E2E |
| Preferred test runner? | `node:test`, Vitest, Jest, Playwright, pytest, none |
| Code coverage target? | None, 50%, 80%, 90%+ |
| Is TDD preferred? | Y/N |
| E2E testing needed? | Playwright, Cypress, none |
| API testing needed? | Supertest (Node.js), pytest + httpx (Python) |

**Framework defaults**:
| Platform | Test Runner | Default Config |
|----------|-------------|----------------|
| TypeScript/Node.js | Vitest | `vitest.config.ts` with coverage |
| Next.js | Vitest + @testing-library/react | `vitest.config.ts` |
| Python | pytest | `pytest.ini` or `pyproject.toml` |
| CLI Tool | Vitest | `vitest.config.ts` |

---

## 9. Repository Strategy

| Question | Purpose |
|----------|---------|
| Monorepo or single package? | Determines workspace configuration |
| Package manager preference? | pnpm (default), npm, yarn, pip, uv |
| Git hosting? | GitHub, GitLab, self-hosted, none |
| License type? | MIT (default), Apache 2.0, GPL, proprietary, none |
| Branch strategy? | GitHub Flow, Git Flow, trunk-based |
| Conventional commits? | Y/N — enforces commit message standards |
| Any CI/CD platform preference? | GitHub Actions, GitLab CI, Drone CI, none |

**Defaults**:
- Structure: single package (monorepo if multi-service or library + demo)
- Package manager: pnpm for JS/TS, pip for Python
- License: MIT
- Branch: main + feature branches
- Commits: conventional commits

---

## 10. Governance

| Question | Purpose |
|----------|---------|
| Do you want PAOS governance initialized? | Creates `.opencode/`, agent definitions, dual-logging |
| Do you want the H-Factor 3-Phase workflow? | Plan → Review (architect) → Execute → Log |
| Do you want Architecture Decision Records (ADRs)? | Documents architectural decisions |
| Do you want a changelog? | Semantic versioning changelog |
| Do you want a task board? | `.governance/tasks/` with active/backlog |
| What AI agents will work on this project? | Claude Code, opencode, Cursor, Copilot, Cline, others |

**PAOS governance** creates:
- `.opencode/workflow.md` — PAOS Constitution
- `.opencode/user.md` — Operator identity
- `.opencode/agents/` — Agent definitions
- `.opencode/logs/global_ledger.md` — Global audit trail
- `.opencode/skills/` — Skill references

---

## Quick-Start Mode

If the user says "use defaults" or "quick start" or "you decide":

1. Use the **bolded defaults** throughout.
2. Record every assumption in `SURVEY.md` under a "Design Assumptions" section.
3. Proceed to Phase 2.
4. Flag the `SURVEY.md` assumptions for user review after scaffolding.

---

## Survey Completion Checklist

Before proceeding to Phase 2, verify:

- [ ] Project name and one-line purpose captured
- [ ] Project type selected from the list
- [ ] Scale (users, data volume, frequency) assessed
- [ ] Frontend need determined (Y/N, and framework if Y)
- [ ] Backend need determined (Y/N, and database if Y)
- [ ] Infrastructure target identified
- [ ] AI requirements assessed (Y/N, and provider if Y)
- [ ] Security requirements identified
- [ ] Testing level and framework chosen
- [ ] Repository structure and package manager chosen
- [ ] Governance preferences recorded
