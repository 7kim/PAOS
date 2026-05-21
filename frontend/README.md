# Code-SRS Frontend

Enterprise app-building platform powered by the PAOS pipeline.

## Quick Start

```bash
cd frontend
npm install        # already done after scaffolding
npm run dev        # starts at http://localhost:3334
```

## Port

| App | Port |
|-----|------|
| Frontend (Code-SRS) | `3334` |
| Dashboard (Admin) | `3333` |

## Environment Variables

Copy `.env.local.template` to `.env.local` and fill in the values:

```bash
cp .env.local.template .env.local
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PAOS_VAULT_PATH` | Path to PAOS vault for audit logging | `/home/dev/AI_Workflow/vault` |
| `CODE_SRS_CONFIG_PATH` | Path to Code-SRS config files | `/home/dev/AI_Workflow/config/code-srs` |
| `JWT_SECRET` | Secret for JWT token signing | *(generate with `openssl rand -base64 32`)* |
| `NEXTAUTH_URL` | Frontend base URL | `http://localhost:3334` |

## Architecture

```
frontend/
├── app/
│   ├── layout.tsx              Root layout (Inter + JetBrains Mono fonts)
│   ├── page.tsx                Landing page (Together AI design)
│   ├── global-error.tsx        Root error boundary
│   ├── auth/
│   │   ├── login/page.tsx      Sign in form
│   │   └── signup/page.tsx     Invite-only signup
│   ├── app/
│   │   ├── layout.tsx          Authenticated shell (sidebar + topbar)
│   │   ├── new/page.tsx        "Describe your app" form
│   │   ├── [projectId]/
│   │   │   ├── page.tsx        Project dashboard with SSE console
│   │   │   └── files/page.tsx  File tree view with SRS filter
│   │   └── error.tsx           App-level error boundary
│   └── api/
│       ├── models/route.ts     GET model aliases (no real IDs)
│       ├── pipeline/route.ts   POST submit project pipeline
│       ├── stream/[id]/route.ts GET SSE pipeline stream
│       └── auth/login/route.ts POST login/signup, DELETE logout
├── components/
│   ├── ui/                     Button, Input, Card primitives
│   ├── layout/                 Navbar, Sidebar, Topbar
│   ├── landing/                Hero, HowItWorks, FeatureBand
│   ├── project/                SRSPhaseTracker, FileTree
│   └── pipeline/               StreamConsole (SSE)
├── lib/
│   ├── models.ts               Model alias loader (server-side only)
│   ├── features.ts             Feature flag loader
│   ├── api.ts                  Client-side typed fetch wrappers
│   ├── audit.ts                Audit logging to PAOS ledger
│   └── utils.ts                cn() utility (clsx + tailwind-merge)
├── middleware.ts               Auth guard + rate limiting
└── app/globals.css             Together AI design tokens
```

## Key Design Decisions

- **Model aliases**: Real model IDs never leave the server. The `/api/models` endpoint returns only alias names, provider, and tier.
- **SRS visibility**: Hidden from users by default. Admin toggle in dashboard (`/settings/code-srs`) controls `features.yaml`.
- **Invite-only**: Signup requires an invite code (`features.yaml` `invite_only: true`).
- **Together AI design**: Canvas-dark (#010120), orange-magenta-periwinkle gradient, JetBrains Mono, 4px border radius.
- **Next.js 16**: Turbopack by default, App Router, Tailwind v4 CSS-based configuration.

## Related

- Dashboard admin: `http://localhost:3333/settings/code-srs`
- PAOS config: `/home/dev/AI_Workflow/config/code-srs/`
- Pipeline artifacts: `/home/dev/AI_Workflow/vault/memory/pipelines/`
