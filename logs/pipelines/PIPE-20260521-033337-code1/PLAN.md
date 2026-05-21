# IMPLEMENTATION PLAN — Code-SRS Frontend
## Pipeline: PIPE-20260521-033337-code1
**Planner**: claude  
**Executor**: opencode-developer  
**Submitted**: 2026-05-21T03:33:37Z  

---

## Executive Summary

Build **Code-SRS** — a private, enterprise-grade app-building platform where users describe their app idea, the PAOS pipeline forces `system-analysis-and-design` end-to-end, then helps them test, build, and deploy. The frontend lives at `frontend/` alongside the existing `dashboard/`. The design system is Together AI from `knowledge/templates/awesome-design-md/design-md/together.ai/DESIGN.md`. Backend is Next.js 16 App Router. Models are proxied with custom aliases; real model IDs never reach the client.

---

## Design System Reference

Source: `knowledge/templates/awesome-design-md/design-md/together.ai/DESIGN.md`

| Token | Value |
|-------|-------|
| `canvas-dark` | `#010120` |
| `canvas` | `#ffffff` |
| `orange` | `#fc4c02` |
| `magenta` | `#ef2cc1` |
| `periwinkle` | `#bdbbff` |
| `mint` | `#c8f6f9` |
| Primary font | Inter (substitute for "The Future") |
| Mono font | JetBrains Mono (substitute for "PP Neue Montreal Mono") |
| Border radius | 4px (`rounded.sm`) |
| Eyebrows | Mono uppercase |

Dark hero bands alternate with white canvas sections. Orange-magenta-periwinkle gradient used on primary CTAs and key accents.

---

## Architecture

```
AI_Workflow/
├── frontend/                    ← NEW: Code-SRS user-facing app
│   ├── app/
│   │   ├── layout.tsx           ← Root layout, Inter+JetBrains Mono fonts, global CSS
│   │   ├── page.tsx             ← Landing page (Together AI hero design)
│   │   ├── auth/
│   │   │   ├── login/page.tsx   ← Private auth (email/password, no OAuth MVP)
│   │   │   └── signup/page.tsx  ← Invite-only signup
│   │   └── app/
│   │       ├── layout.tsx       ← Authenticated shell (sidebar + topbar)
│   │       ├── new/page.tsx     ← "Describe your app" entry form
│   │       ├── [projectId]/
│   │       │   ├── page.tsx     ← Project overview / SRS phase dashboard
│   │       │   ├── srs/page.tsx ← SRS live view (phases, progress)
│   │       │   └── files/page.tsx ← File tree view (SRS files filtered by config)
│   │       └── settings/page.tsx ← User settings
│   ├── components/
│   │   ├── ui/                  ← Primitives: Button, Input, Card, Badge, Modal
│   │   ├── layout/              ← Navbar, Sidebar, PageShell
│   │   ├── landing/             ← Hero, FeatureBand, HowItWorks, CTA
│   │   ├── project/             ← ProjectCard, SRSPhaseTracker, FileTree
│   │   └── pipeline/            ← StreamConsole (SSE), PhaseProgress, AgentBadge
│   ├── lib/
│   │   ├── models.ts            ← Load config/code-srs/models.yaml → alias map
│   │   ├── features.ts          ← Load config/code-srs/features.yaml
│   │   └── api.ts               ← Typed fetch wrappers
│   ├── app/api/
│   │   ├── pipeline/route.ts    ← POST: submit project idea → triggers h-pipeline
│   │   ├── stream/[id]/route.ts ← GET: SSE stream for pipeline progress
│   │   └── models/route.ts      ← GET: return alias list (no real IDs)
│   ├── tailwind.config.ts       ← Together AI tokens as Tailwind theme extension
│   ├── next.config.ts
│   └── package.json
│
├── config/code-srs/
│   ├── models.yaml              ← Model alias → real ID mapping
│   └── features.yaml            ← Feature flags (srs_visibility_toggle, etc.)
│
└── dashboard/                   ← EXISTING: admin dashboard
    └── app/
        └── settings/
            └── code-srs/page.tsx ← NEW admin panel: SRS toggle + model aliases
```

---

## Phase 0 — Config & Foundation (no UI)

### 0.1 Create `config/code-srs/models.yaml`

```yaml
# Model alias proxy — real IDs never exposed to frontend users
models:
  - alias: "Nova"
    provider: together
    model_id: "meta-llama/Llama-3.3-70B-Instruct-Turbo"
    tier: free
    description: "Fast general-purpose model"
  - alias: "Atlas"
    provider: together
    model_id: "deepseek-ai/DeepSeek-R1"
    tier: pro
    description: "Advanced reasoning model"
  - alias: "Apex"
    provider: openai
    model_id: "gpt-4o"
    tier: pro
    description: "Flagship multimodal model"
  - alias: "Spark"
    provider: anthropic
    model_id: "claude-haiku-4-5-20251001"
    tier: free
    description: "Fast, lightweight tasks"
  - alias: "Cortex"
    provider: anthropic
    model_id: "claude-sonnet-4-6"
    tier: pro
    description: "Balanced performance and reasoning"
```

### 0.2 Create `config/code-srs/features.yaml`

```yaml
features:
  srs_visibility_toggle:
    enabled: false           # Admin default: SRS files hidden from users
    description: "Show/hide SRS system-analysis files in user file tree"
  invite_only:
    enabled: true
    description: "Restrict signup to invited users only"
  public_signup:
    enabled: false
    description: "Open registration (future SaaS phase)"
  model_selector:
    enabled: true
    description: "Allow users to select from aliased models"
```

### 0.3 Scaffold Next.js 16 at `frontend/`

```bash
cd /home/dev/AI_Workflow
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --no-git
cd frontend && npm install
```

**Additional deps:**
```bash
npm install js-yaml zod lucide-react class-variance-authority clsx tailwind-merge
npm install -D @types/js-yaml
```

### 0.4 Configure Tailwind with Together AI tokens

`tailwind.config.ts` — extend theme:
```ts
colors: {
  canvas: { dark: '#010120', DEFAULT: '#ffffff' },
  brand: {
    orange: '#fc4c02',
    magenta: '#ef2cc1',
    periwinkle: '#bdbbff',
    mint: '#c8f6f9',
  },
  neutral: { 900:'#0a0a1a', 800:'#141428', 700:'#1e1e3a', ... }
},
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
},
borderRadius: { sm: '4px', md: '6px', lg: '8px', xl: '12px' },
```

---

## Phase 1 — Landing & Auth Pages

### 1.1 Root Layout (`app/layout.tsx`)

- Load Inter + JetBrains Mono from `next/font/google`
- Set `<html>` background to `canvas.dark` (`#010120`)
- Global CSS: scrollbar styling, selection color

### 1.2 Landing Page (`app/page.tsx`)

**Structure (Together AI alternating bands):**

```
[DARK HERO]
  mono eyebrow: "CODE-SRS — POWERED BY PAOS"
  h1 (96px display): "Describe your app.\nWe build the spec."
  subtext: "AI-native SRS generation end-to-end..."
  CTA button: "Start building →" (orange-magenta gradient, 4px radius)
  
[WHITE BAND]
  "How it works" — 3 steps with icons:
  1. Describe your idea  2. SRS generated & reviewed  3. Built & deployed

[DARK BAND]
  Features grid (4 cards)
  
[WHITE BAND]
  CTA: "Request early access"
```

### 1.3 Auth Pages

- `app/auth/login/page.tsx` — email + password form, Together AI style
- `app/auth/signup/page.tsx` — invite code + email + password (invite_only flag)
- Session: simple JWT in httpOnly cookie (next-auth-ready but not wired in MVP)

---

## Phase 2 — Authenticated App Shell & Project Flow

### 2.1 App Layout (`app/app/layout.tsx`)

- Sidebar: "New Project", "My Projects", "Settings"
- Topbar: model selector (alias names only), user menu
- Sidebar collapses to icons on mobile

### 2.2 New Project Form (`app/app/new/page.tsx`)

```
"Describe the app you want to build"
[Textarea — min 3 lines, max 2000 chars]
[Model selector: alias dropdown]
[Submit → "Generate SRS"]
```

On submit:
- `POST /api/pipeline` with `{ prompt, model_alias }`
- API resolves alias → real model ID (server-side only)
- Triggers h-pipeline with `system-analysis-and-design` skill
- Redirects to `/app/[projectId]` with SSE stream

### 2.3 Project Dashboard (`app/app/[projectId]/page.tsx`)

- Phase tracker: 14 SRS sections as steps (from `system-analysis-and-design` skill)
- Live SSE console showing agent output
- "Current phase" highlighted, completed phases checkmarked
- Status: Analyzing | Generating | Review | Ready to Build

### 2.4 File Tree (`app/app/[projectId]/files/page.tsx`)

```typescript
// lib/features.ts controls SRS visibility
const SRS_FILE_PATTERNS = [
  /IMPLEMENTATION_PLAN\.md$/,
  /TASKS\.md$/,
  /SRS\.md$/,
  /system-analysis/,
  /WALKTHROUGH\.md$/,
];

function filterFileTree(files: FileNode[], showSRS: boolean): FileNode[] {
  if (showSRS) return files;
  return files.filter(f => !SRS_FILE_PATTERNS.some(p => p.test(f.path)));
}
```

---

## Phase 3 — API Routes & Model Proxy

### 3.1 `app/api/models/route.ts`

```typescript
GET /api/models
→ Returns: [{ alias: "Nova", tier: "free", description: "..." }, ...]
// Real model_id NEVER included in response
```

### 3.2 `app/api/pipeline/route.ts`

```typescript
POST /api/pipeline
Body: { prompt: string, model_alias: string, projectId?: string }

Server-side:
1. Load models.yaml → resolve alias to real model_id
2. Load features.yaml → check flags
3. Submit to PAOS pipeline (write to inbox/developer/ + pipelines/)
4. Return { projectId, pipelineId }
```

### 3.3 `app/api/stream/[id]/route.ts`

```typescript
GET /api/stream/[id]
Headers: { 'Content-Type': 'text/event-stream' }

Watch pipeline directory for updates:
- Tail events.md or pipeline status file
- Send SSE events: { phase, message, timestamp }
- Close on pipeline completion
```

### 3.4 OpenCode Connection

`config/code-srs/opencode-bridge.ts`:
- Read `opencode.json` models config
- Expose as typed interface for pipeline API
- Model aliases map onto OpenCode model IDs

---

## Phase 4 — Admin Dashboard Panel

### 4.1 `dashboard/app/settings/code-srs/page.tsx`

**SRS Visibility Toggle:**
```
[Toggle: "Show SRS files to users"]
Reads/writes config/code-srs/features.yaml at runtime
```

**Model Aliases Table:**
```
Alias    Provider    Model ID         Tier    Actions
Nova     Together    llama-3.3-70B    free    [Edit] [Delete]
Atlas    Together    deepseek-r1      pro     [Edit] [Delete]
[+ Add Model]
```

**API: `dashboard/app/api/admin/code-srs/route.ts`**
- `GET` → read features.yaml + models.yaml
- `PATCH /features` → toggle flags
- `PATCH /models` → add/update/remove model aliases

### 4.2 Add to existing Sidebar

In `dashboard/components/Sidebar.tsx`:
- Add "Code-SRS" section with Settings link

---

## Phase 5 — Enterprise Scaffolding

### 5.1 Error Boundaries

- `app/global-error.tsx` — root error boundary
- `app/app/error.tsx` — authenticated app errors
- Friendly error UI with "Try again" CTA

### 5.2 Rate Limiting

- `middleware.ts` — rate limit `/api/pipeline` to 5 requests/hour/user
- In-memory store for MVP; Redis-ready interface

### 5.3 Input Validation

- All API routes use Zod schemas
- Prompt sanitization: strip HTML, max 2000 chars
- Model alias validation: must exist in models.yaml

### 5.4 Audit Logging

- Every pipeline submission → `append_ledger` MCP call
- Action: `PIPELINE_SUBMIT`, Task: projectId, Agent: frontend-user

### 5.5 Environment Config

`frontend/.env.local.template`:
```
PAOS_VAULT_PATH=/home/dev/AI_Workflow/vault
CODE_SRS_CONFIG_PATH=/home/dev/AI_Workflow/config/code-srs
JWT_SECRET=<generate>
NEXTAUTH_URL=http://localhost:3334
```

---

## Port Assignment

| App | Port |
|-----|------|
| `dashboard/` (existing) | 3333 |
| `frontend/` (Code-SRS) | 3334 |

---

## Key Constraints

1. **Real model IDs never leave the server** — alias resolution is server-only
2. **SRS files hidden by default** — `features.yaml` `srs_visibility_toggle.enabled: false`
3. **Invite-only auth** — no open registration in MVP
4. **Together AI design tokens** — follow DESIGN.md strictly, no deviations
5. **Next.js 16 App Router** — same version as dashboard, check `node_modules/next/dist/docs/` for breaking changes
6. **Per-agent commits** — all commits via `bin/agent-commit.sh opencode-developer "Agent[opencode-developer]: <desc>"`
7. **No MCP tools from frontend** — frontend writes to vault via server-side API routes only
