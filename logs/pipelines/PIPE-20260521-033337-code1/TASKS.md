# TASKS — Code-SRS Frontend
## Pipeline: PIPE-20260521-033337-code1

---

## Phase 0 — Config & Foundation

- [ ] **T-001** Create `config/code-srs/` directory
- [ ] **T-002** Write `config/code-srs/models.yaml` (Nova/Atlas/Apex/Spark/Cortex aliases)
- [ ] **T-003** Write `config/code-srs/features.yaml` (srs_visibility_toggle=false, invite_only=true)
- [ ] **T-004** Scaffold Next.js 16 app at `frontend/` with TypeScript + Tailwind + App Router
- [ ] **T-005** Install additional deps: js-yaml, zod, lucide-react, class-variance-authority, clsx, tailwind-merge
- [ ] **T-006** Configure `tailwind.config.ts` with Together AI design tokens (canvas-dark, orange, magenta, periwinkle, mint, Inter, JetBrains Mono, 4px radius)
- [ ] **T-007** Write `frontend/.env.local.template` with PAOS_VAULT_PATH, CODE_SRS_CONFIG_PATH, JWT_SECRET, NEXTAUTH_URL
- [ ] **T-008** Write `frontend/lib/models.ts` — reads models.yaml, exports alias map
- [ ] **T-009** Write `frontend/lib/features.ts` — reads features.yaml, exports feature flags
- [ ] **T-010** Write `frontend/lib/api.ts` — typed fetch wrappers for internal routes

## Phase 1 — Landing & Auth Pages

- [ ] **T-011** Write `frontend/app/layout.tsx` — root layout with Inter+JetBrains Mono fonts, canvas-dark background, global CSS
- [ ] **T-012** Write `frontend/components/ui/Button.tsx` — primary (gradient), secondary (outlined), ghost variants, 4px radius
- [ ] **T-013** Write `frontend/components/ui/Input.tsx` — Together AI styled input
- [ ] **T-014** Write `frontend/components/ui/Card.tsx` — dark and light surface variants
- [ ] **T-015** Write `frontend/components/layout/Navbar.tsx` — logo, nav links, CTA, Together AI style
- [ ] **T-016** Write `frontend/components/landing/Hero.tsx` — dark band, mono eyebrow, 96px display heading, gradient CTA
- [ ] **T-017** Write `frontend/components/landing/HowItWorks.tsx` — white band, 3-step flow
- [ ] **T-018** Write `frontend/components/landing/FeatureBand.tsx` — dark band, 4-feature grid
- [ ] **T-019** Write `frontend/app/page.tsx` — assemble landing: Hero + HowItWorks + FeatureBand + CTA
- [ ] **T-020** Write `frontend/app/auth/login/page.tsx` — email+password form
- [ ] **T-021** Write `frontend/app/auth/signup/page.tsx` — invite code + email + password form

## Phase 2 — Authenticated App Shell & Project Flow

- [ ] **T-022** Write `frontend/app/app/layout.tsx` — authenticated shell with sidebar + topbar
- [ ] **T-023** Write `frontend/components/layout/Sidebar.tsx` — "New Project", "My Projects", "Settings" nav
- [ ] **T-024** Write `frontend/components/layout/Topbar.tsx` — model alias selector, user menu
- [ ] **T-025** Write `frontend/app/app/new/page.tsx` — idea textarea + model selector + submit form
- [ ] **T-026** Write `frontend/components/project/SRSPhaseTracker.tsx` — 14 SRS sections as step indicators
- [ ] **T-027** Write `frontend/components/pipeline/StreamConsole.tsx` — SSE consumer, live agent output display
- [ ] **T-028** Write `frontend/app/app/[projectId]/page.tsx` — project dashboard (phase tracker + stream console)
- [ ] **T-029** Write `frontend/components/project/FileTree.tsx` — recursive file tree with SRS filter logic
- [ ] **T-030** Write `frontend/app/app/[projectId]/files/page.tsx` — file tree view with filtered/unfiltered toggle

## Phase 3 — API Routes & Model Proxy

- [ ] **T-031** Write `frontend/app/api/models/route.ts` — GET returns alias list only (no real IDs)
- [ ] **T-032** Write `frontend/app/api/pipeline/route.ts` — POST: resolve alias server-side, write pipeline to vault, return projectId
- [ ] **T-033** Write `frontend/app/api/stream/[id]/route.ts` — GET SSE stream watching pipeline dir for updates
- [ ] **T-034** Write `frontend/app/api/auth/login/route.ts` — POST: validate credentials, issue JWT httpOnly cookie
- [ ] **T-035** Write `frontend/middleware.ts` — auth guard (redirect unauth to /auth/login), rate limit /api/pipeline

## Phase 4 — Admin Dashboard Panel

- [ ] **T-036** Write `dashboard/app/settings/code-srs/page.tsx` — SRS visibility toggle + model alias table
- [ ] **T-037** Write `dashboard/app/api/admin/code-srs/route.ts` — GET/PATCH for features.yaml + models.yaml
- [ ] **T-038** Update `dashboard/components/Sidebar.tsx` — add "Code-SRS" settings link

## Phase 5 — Enterprise Scaffolding

- [ ] **T-039** Write `frontend/app/global-error.tsx` — root error boundary
- [ ] **T-040** Write `frontend/app/app/error.tsx` — authenticated app error boundary
- [ ] **T-041** Add Zod validation schemas to all API routes (T-031 through T-034)
- [ ] **T-042** Add rate limiting logic to `middleware.ts` (5 req/hr/user, in-memory store)
- [ ] **T-043** Add audit logging (`append_ledger` call) to pipeline submission route
- [ ] **T-044** Write `frontend/README.md` — port (3334), env vars, how to start

## Completion Criteria

- [ ] `npm run build` passes in `frontend/` with zero TypeScript errors
- [ ] Landing page renders at `localhost:3334` matching Together AI design system
- [ ] Model alias API returns alias names only — grep confirms no real model IDs in any API response
- [ ] Admin toggle in dashboard writes to `config/code-srs/features.yaml` and file tree reflects change
- [ ] All commits via `bin/agent-commit.sh opencode-developer "Agent[opencode-developer]: <desc>"`
- [ ] WALKTHROUGH.md written to `vault/memory/pipelines/PIPE-20260521-033337-code1/WALKTHROUGH.md`
