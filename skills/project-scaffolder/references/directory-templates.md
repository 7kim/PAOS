# AI-Optimized Directory Structure Templates

This reference defines the canonical directory structures for each project type.
Every scaffolded project follows one of these templates.

**Design principles:**
- Max 4 levels deep (exception: `src/` may go deeper for domain organization)
- Flat is better than nested
- Configuration files live at root, not hidden in subdirectories
- Source code lives under `src/`
- Tests live next to source (colocated) or in `__tests__/` — never in a separate tests directory at root (exception: Python)

---

## Template A — CLI Tool (Node.js / TypeScript)

```
<project-name>/
├── .vscode/
│   └── settings.json              # Editor settings for the project
├── src/
│   ├── index.ts                   # Entry point (Commander.js)
│   ├── commands/
│   │   └── init.ts                # Example command scaffold
│   ├── utils/
│   │   ├── logger.ts              # Terminal logger (chalk, ora)
│   │   ├── config.ts              # Config file management (conf)
│   │   └── errors.ts              # Custom error classes
│   ├── services/
│   │   └── example.ts             # Business logic
│   └── types/
│       └── index.ts               # Shared type definitions
├── .github/
│   └── workflows/
│       └── ci.yml                 # CI pipeline
├── .gitignore
├── .gitattributes
├── .editorconfig
├── .env.example
├── .prettierrc
├── .markdownlint.json
├── tsconfig.json                  # Strict TypeScript
├── package.json
├── vitest.config.ts               # Test configuration
├── tsup.config.ts                 # Build configuration
├── Dockerfile                     # Optional: for dev environment
├── docker-compose.yml             # Optional: for testing
├── README.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── CLAUDE.md                      # Claude Code instructions
├── .cursorrules                   # Cursor instructions
├── .github/
│   └── copilot-instructions.md    # Copilot instructions
└── AGENTS.md                      # AI agent roster
```

---

## Template B — Web Application (Next.js 16)

```
<project-name>/
├── .vscode/
│   └── settings.json
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout (metadata, fonts)
│   │   ├── page.tsx               # Home page
│   │   ├── not-found.tsx          # 404 page
│   │   ├── error.tsx              # Error boundary
│   │   ├── loading.tsx            # Loading state
│   │   └── api/
│   │       └── health/
│   │           └── route.ts       # Health check endpoint
│   ├── components/
│   │   ├── ui/                    # Primitives (Button, Card, Input, etc.)
│   │   ├── layout/                # Layout components (Header, Footer, Sidebar)
│   │   └── features/              # Feature-specific components
│   ├── lib/
│   │   ├── utils.ts               # cn(), formatters, helpers
│   │   ├── db.ts                  # Database client (if applicable)
│   │   └── api-client.ts          # API client functions
│   ├── hooks/                     # Custom React hooks
│   ├── store/                     # State management (zustand, context)
│   ├── styles/
│   │   └── globals.css            # Tailwind base + custom vars
│   └── types/
│       └── index.ts               # Shared types
├── __tests__/
│   ├── setup.ts                   # Test setup (vitest)
│   └── app/
│       └── home.test.tsx          # Home page smoke test
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Lint, test, build
│       └── cd.yml                 # Deploy
├── .gitignore
├── .gitattributes
├── .editorconfig
├── .env.example                   # All env vars documented
├── .env.local                     # Local overrides (gitignored)
├── .prettierrc
├── .eslintrc.cjs                  # Flat config
├── .markdownlint.json
├── tsconfig.json                  # Strict
├── next.config.ts                 # Next.js config
├── tailwind.config.ts             # Tailwind configuration
├── postcss.config.mjs             # PostCSS config
├── vitest.config.ts               # Test config
├── package.json
├── Dockerfile                     # Multi-stage
├── docker-compose.yml             # Dev with hot-reload
├── .dockerignore
├── README.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── CLAUDE.md
├── .cursorrules
├── .github/
│   └── copilot-instructions.md
└── AGENTS.md
```

---

## Template C — API Service (Express / Fastify)

```
<project-name>/
├── src/
│   ├── index.ts                   # Server entry (graceful shutdown)
│   ├── app.ts                     # App factory (Express/Fastify)
│   ├── config/
│   │   └── env.ts                 # Environment variable validation (zod/envalid)
│   ├── routes/
│   │   ├── health.ts              # Health check (/health, /ready)
│   │   └── v1/
│   │       └── example.ts         # Versioned route
│   ├── middleware/
│   │   ├── auth.ts                # Auth middleware
│   │   ├── error-handler.ts       # Global error handler
│   │   ├── request-logger.ts      # Structured request logging
│   │   ├── rate-limiter.ts        # Rate limiting
│   │   └── validator.ts           # Request validation
│   ├── services/
│   │   └── example.ts             # Business logic
│   ├── repositories/
│   │   └── example.ts             # Data access layer
│   ├── types/
│   │   └── index.ts               # Shared types
│   └── __tests__/
│       ├── setup.ts               # Test setup
│       ├── health.test.ts         # Health check test
│       └── routes/
│           └── example.test.ts    # Route tests
├── migrations/                    # Database migrations
│   └── 001_initial.sql
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
├── .gitignore
├── .gitattributes
├── .editorconfig
├── .env.example
├── .prettierrc
├── .eslintrc.cjs
├── .markdownlint.json
├── tsconfig.json
├── vitest.config.ts
├── tsup.config.ts
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── README.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── CLAUDE.md
├── .cursorrules
├── .github/
│   └── copilot-instructions.md
└── AGENTS.md
```

---

## Template D — Library / SDK (npm package)

```
<project-name>/
├── src/
│   ├── index.ts                   # Public API exports
│   ├── client.ts                  # Main client class
│   ├── types.ts                   # Public types
│   └── __tests__/
│       └── client.test.ts
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── .gitattributes
├── .editorconfig
├── .env.example
├── .prettierrc
├── .eslintrc.cjs
├── .markdownlint.json
├── tsconfig.json
├── vitest.config.ts
├── tsup.config.ts                 # Build for CJS + ESM
├── package.json                   # exports field for CJS/ESM dual
├── README.md                      # API docs with examples
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── CLAUDE.md
├── .cursorrules
└── AGENTS.md
```

---

## Template E — Monorepo (pnpm workspaces)

```
<project-name>/
├── packages/
│   ├── core/                      # Core library
│   │   ├── src/
│   │   ├── __tests__/
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── cli/                       # CLI tool (depends on core)
│   │   ├── src/
│   │   ├── __tests__/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                       # Web app (depends on core)
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── tsconfig.json
├── tools/
│   └── scripts/
│       └── build.sh               # Shared build scripts
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Runs lint/test/build on all packages
│       └── release.yml            # Release workflow
├── pnpm-workspace.yaml            # Workspace definition
├── .gitignore
├── .gitattributes
├── .editorconfig
├── .prettierrc
├── .eslintrc.cjs                  # Root ESLint (extends to packages)
├── .markdownlint.json
├── tsconfig.json                  # Root tsconfig (references)
├── package.json                   # Root scripts (lint, test, build all)
├── vitest.config.ts               # Root test config (workspace mode)
├── tsup.config.ts                 # Root build config
├── Dockerfile                     # Optional: service Dockerfile
├── docker-compose.yml             # Optional: service orchestration
├── README.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── CLAUDE.md
├── .cursorrules
└── AGENTS.md
```

---

## Template F — Python Service (FastAPI)

```
<project-name>/
├── src/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app, lifespan, health check
│   ├── config.py                  # Pydantic BaseSettings
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py                # Dependency injection
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py          # Route registration
│   │       └── endpoints.py       # Endpoint functions
│   ├── models/
│   │   ├── __init__.py
│   │   └── domain.py              # Pydantic models / SQLAlchemy models
│   ├── services/
│   │   ├── __init__.py
│   │   └── example.py             # Business logic
│   ├── repositories/
│   │   ├── __init__.py
│   │   └── example.py             # Data access
│   └── core/
│       ├── __init__.py
│       ├── security.py            # Auth utilities
│       ├── exceptions.py          # Custom exceptions
│       └── logging.py             # Structured logging setup
├── tests/
│   ├── __init__.py
│   ├── conftest.py                # Fixtures
│   └── test_health.py             # Health check test
├── alembic/                       # Database migrations
│   └── versions/
├── alembic.ini
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
├── .gitignore                     # Python-specific ignores
├── .gitattributes
├── .editorconfig
├── .env.example
├── pyproject.toml                 # Project config, deps, tool configs
├── requirements.txt               # Pinned dependencies
├── requirements-dev.txt           # Dev dependencies
├── Dockerfile                     # Multi-stage Python
├── docker-compose.yml
├── .dockerignore
├── README.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── CLAUDE.md
├── .cursorrules
└── AGENTS.md
```

---

## Template G — VS Code Extension

```
<project-name>/
├── src/
│   ├── extension.ts               # Activation entry point
│   ├── commands/
│   │   └── hello.ts               # Command handler example
│   ├── providers/
│   │   ├── sidebar.ts             # Tree view provider
│   │   └── webview.ts             # Webview panel provider
│   └── __tests__/
│       └── extension.test.ts
├── .vscode/
│   ├── launch.json                # Debug config
│   ├── tasks.json                 # Build task
│   └── settings.json
├── test-resources/
│   └── fixtures/                  # Test fixtures
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── .gitattributes
├── .editorconfig
├── .prettierrc
├── .eslintrc.cjs
├── .markdownlint.json
├── tsconfig.json
├── vitest.config.ts
├── package.json
├── README.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── CLAUDE.md
└── AGENTS.md
```

---

## Template H — MCP Server

```
<project-name>/
├── src/
│   ├── index.ts                   # MCP server entry point
│   ├── server.ts                  # Server setup (StdioServerParameters)
│   ├── tools/
│   │   └── example.ts             # Tool definition + handler
│   ├── resources/
│   │   └── example.ts             # Resource definitions
│   ├── services/
│   │   └── example.ts             # Business logic
│   └── types/
│       └── index.ts               # Shared types
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── .gitattributes
├── .editorconfig
├── .env.example
├── .prettierrc
├── .eslintrc.cjs
├── .markdownlint.json
├── tsconfig.json
├── vitest.config.ts
├── tsup.config.ts
├── package.json
├── Dockerfile
├── README.md
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── CLAUDE.md
└── AGENTS.md
```

---

## Template Selection Guide

| Survey Response | Template | Notes |
|----------------|----------|-------|
| "CLI tool" | A | Commander.js + ESM + conf |
| "Web app", "Next.js" | B | App Router + Tailwind + TypeScript |
| "API", "REST", "GraphQL" | C | Express (default) or Fastify |
| "Library", "SDK", "npm package" | D | Dual CJS/ESM build |
| "Monorepo", "multi-package" | E | pnpm workspaces |
| "Python service", "FastAPI" | F | Pydantic v2 + SQLAlchemy |
| "VS Code extension" | G | @vscode/test-electron |
| "MCP server" | H | @modelcontextprotocol/sdk |
| "Static site" | B (light) | Remove API routes, no server deps |
| "Desktop app" | Custom | Electron + Next.js or Tauri |
| "Mobile app" | Custom | React Native / Expo |

---

## Common Directories — All Templates

These directories appear in ALL templates and serve the same purpose:

| Directory | Purpose |
|-----------|---------|
| `.vscode/` | Editor settings, debug configurations |
| `.github/workflows/` | CI/CD pipeline definitions |
| `src/` | All source code |
| `src/__tests__/` or `tests/` | Test files |

**Not included by default** (create when needed):
| Directory | When to Create |
|-----------|----------------|
| `docs/` | When ADRs or architecture docs exceed 5 files |
| `scripts/` | When you have 3+ build/deploy helper scripts |
| `migrations/` | When database is configured |
| `k8s/` | When Kubernetes deployment is planned |
| `terraform/` | When cloud infrastructure is needed |
| `ansible/` | When VPS provisioning is needed |
| `assets/` | When static assets exist beyond code |
