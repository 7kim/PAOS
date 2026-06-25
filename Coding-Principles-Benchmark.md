# PAOS Coding Principles Benchmark — Strict Audit

> **Version**: 2.0  
> **Purpose**: A strict, evidence-based scoring system. Every score MUST be backed by a concrete code snippet (file:line). The auditor is a **teacher grading an exam** — look for the simplest mistakes, the missed opportunities, the lazy shortcuts. Partial credit only when the student showed real understanding but made a minor slip.

---

## How This Audit Works

### The Mindset
You are not a reviewer. You are an **examiner**. You read every line as if the author is trying to hide something. You look for:

- **Hygiene errors**: unused imports, inconsistent naming, magic numbers, dead code
- **Missed abstractions**: copy-paste where a function/component would do
- **Leaky encapsulation**: internal state exposed, file paths in API responses, implementation details in interface names
- **Wrong data structures**: array when Set would do, object when Map would do, O(n²) when O(1) exists
- **Silent failures**: try/catch with empty body, `.catch(() => {})`, swallowed errors
- **Fragile patterns**: string literals as identifiers, positional magic, temporal coupling

### Scoring

**Per question:** 0 = violated/missing, 1 = partial, 2 = fully correct.  
**Raw max:** 220 (2 × 110 questions).  
**Final score:** `(raw / 220) × 100` — normalized to 100.  

### Weight Tiers

| Tier | Weight | Categories | Questions | % of Grade |
|------|--------|------------|-----------|-----------|
| **Heavy** | 48% | OOP, Data Structures, System Analysis, Digital Logic, Security | 53 | 48% |
| **Medium** | 25% | Code Quality, API Endpoints, Database | 28 | 25% |
| **Moderate** | 18% | UX/UI, Linear Algebra | 14 | 18% |
| **Supporting** | 9% | Graph Theory, Calculus, Numerical Analysis | 15 | 9% |

This reflects the user's priority: OOP, data structures, architecture, and security carry the most weight. Code hygiene and API design are medium. UX and math support the rest.

### Grade Thresholds (100-point scale)

| Score | Grade | Meaning |
|-------|-------|---------|
| 90–100 | **A** | Fewer than 10 infractions across the entire codebase |
| 75–89 | **B** | Some correctable patterns, no systemic failures |
| 50–74 | **C** | Systemic issues in one or more categories |
| 25–49 | **D** | Major refactoring needed |
| 0–24 | **F** | Architectural rewrite required |
| **Any 0** on a ★ question | **Auto -1 grade** | Must be fixed before next audit |

**Floor rule:** 89 is B, not A. No rounding. The first ★ question scored 0 drops the grade by one full letter regardless of total.

---

## Audit Template

Every scored question must follow this template:

```
## Q1 — Does every module hide its internal state?
Score: 2/2
Evidence:
✅ `src/Canvas.tsx:15-20` — Internal nodes/edges state managed via `useNodesState` hook, exposed only through `onSave` callback
✅ `src/api/queue/route.ts:40-55` — GET handler returns only serialized queue state, not file handles or raw paths
```

```
## Q14 — Does each file have a single responsibility?
Score: 0/2
Evidence:
❌ `src/utils/helpers.ts:1-300` — Contains 7 unrelated functions: date formatting, API calls, DOM manipulation, color parsing.
    A teacher would fail this on principle. Split into `date.ts`, `api.ts`, `dom.ts`, `colors.ts`.
```

---

## Scoring Categories

### 1. Object-Oriented Programming (36 points)

**1.1 Encapsulation (★)**

| # | Question | Max | Check |
|---|----------|-----|-------|
| 1 | Does every module/component hide its internal state? | 2 | Open any component. Can you modify its internals from outside? That's 0. |
| 2 | Are API responses abstract (not exposing file paths or raw structures)? | 2 | `grep -r '"path":' routes/` — if paths like `/home/dev/...` leak, that's 0. |
| 3 | Can a consumer break internal state by calling a method? | 2 | Find a public method that mutates state without validation. |
| 4 | Are React props minimal (no prop drilling of entire objects)? | 2 | Trace a prop. Does component `<A>` pass `pipeline` to `<B>` when `<B>` only needs `pipeline.name`? |
| 5 | Does the frontend construct filesystem paths (0 = yes, 2 = no)? | 2 | ⚡ `grep -r 'join(HOME\|fs\|readFile\|writeFile' app/` — any hits in frontend = 0. |

**1.2 Inheritance**

| # | Question | Max | Check |
|---|----------|-----|-------|
| 6 | Are shared behaviors extracted (not duplicated)? | 2 | `grep -r 'function.*map\|for.*\.\.\.of' *.tsx` — find 3+ lines repeated in 2+ files. |
| 7 | Is composition preferred over inheritance? | 2 | `grep -r 'extends' *.tsx` — if > 2 uses, examine each for composition viability. |
| 8 | Can a new node type be added without touching canvas logic? | 2 | Check if `nodeTypes` is a registry vs a switch statement in rendering. |

**1.3 Polymorphism (★)**

| # | Question | Max | Check |
|---|----------|-----|-------|
| 9 | Do different agent types share a common interface? | 2 | `grep -rn 'interface.*Provider\|type.*Executor'` — must exist and be used. |
| 10 | Are there no `if/switch` on agent type in execution logic? | 2 | ⚡ `grep -rn 'agentId\|agent.*===\|agent.*type' execute-flow/` — 0 matches = 2. |
| 11 | Can a new agent be added without changing the engine? | 2 | ⚡ Check if adding to `AVAILABLE_AGENTS` array is sufficient. |

**1.4 Abstraction**

| # | Question | Max | Check |
|---|----------|-----|-------|
| 12 | Does each entity represent a coherent concept, not implementation details? | 2 | Is `Pipeline` a collection of phases, or a directory path with metadata? Check the interface. |
| 13 | Are API routes named after resources (RESTful)? | 2 | `GET /api/pipelines/[id]/execute-flow` — action verbs in URLs = 0. Should be resource-oriented. |

**1.5 SOLID**

| # | Question | Max | Check |
|---|----------|-----|-------|
| 14 | Single responsibility per file? | 2 | ★ Find a file that does 3+ unrelated things. |
| 15 | Open for extension, closed for modification? | 2 | Can you add a new template category without editing existing template code? |
| 16 | Liskov substitution? | 2 | Can `ReadOnlyNode` replace `AgentNode` in the canvas without breaking layout? |
| 17 | Interface segregation? | 2 | 🖇️ Find a component that receives 8+ props but only uses 3. |
| 18 | Dependency inversion? | 2 | ⚡ Do modules depend on abstractions or concrete implementations (e.g., direct `fetch` call vs injected service)? |

---

### 2. Data Structures (18 points)

| # | Question | Max | Check |
|---|----------|-----|-------|
| 19 | Is pipeline topology stored as a proper DAG? | 2 | ★ Check `builder-layout.json`: must have separate `nodes[]` and `edges[]`. Flat list = 0. |
| 20 | Is topological sort (Kahn's) used for execution? | 2 | ★ `grep -rn 'inDegree\|shift\|dequeue' execute-flow/` — must find Kahn's BFS. DFS post-order = 0. |
| 21 | Is cycle detection implemented? | 2 | ⚡ Run topoSort on a cyclic input. Does it error or silently truncate? Silent = 0. |
| 22 | Queue with proper enqueue/dequeue/complete? | 2 | Find all 3 operations in `queue/route.ts`. Missing any = 0. |
| 23 | Hash maps for O(1) lookups? | 2 | `grep -rn '\.find(\|\.filter(' | grep -v 'test'` — if used on an array > 100 items, should be Map. |
| 24 | Sets for uniqueness instead of Array.includes? | 2 | `grep -rn '\.includes('` — each is a candidate for Set. Count > 3 = 0. |
| 25 | Recursive tree rendering? | 2 | Check `FileTreeExplorer.tsx` — does it recursively call `renderNode`? Flat map = 0. |
| 26 | Arrays for order, Sets for uniqueness? | 2 | Check: `selectedSkills` is an array but skills should be unique. Should be Set. |
| 27 | DAG validated on every read? | 2 | ⚡ Find validation code in `GET /api/pipelines/[id]`. None = 0. |

---

### 3. Graph Theory & Discrete Mathematics (12 points)

| # | Question | Max | Check |
|---|----------|-----|-------|
| 28 | Branching DAG handled correctly? | 2 | ★ Create a DAG with 2 parallel roots. Does the cascade spawn both? |
| 29 | Join nodes wait for ALL predecessors? | 2 | ★ Create a diamond DAG (A→B, A→C, B+C→D). Does D wait for both B AND C? Single-path cascade = 0. |
| 30 | Every node in exactly one FSM state? | 2 | Check `ReadOnlyNode.tsx` — is the status display exhaustive? Missing state = 0. |
| 31 | FSM transitions deterministic? | 2 | Can the same input produce different state transitions? Random/delays = 0. |
| 32 | Set operations for permissions? | 2 | `grep -rn 'subset\|intersection\|union\|has('` — check permission logic. |
| 33 | Execution order deterministic? | 2 | ⚡ Run same pipeline twice. Do phases execute in the same order? |

---

### 4. Linear Algebra (8 points)

| # | Question | Max | Check |
|---|----------|-----|-------|
| 34 | Zoom/pan transforms saved and restored? | 2 | `grep -rn 'getViewport\|viewport' Canvas.tsx` — must exist. |
| 35 | DAG coordinates preserved across sessions? | 2 | ★ Save → reload. Same node positions? Lost = 0. |
| 36 | Node distances/layout consistent? | 2 | Add 5 nodes. Are they evenly spaced? Arbitrary gaps = 0. |
| 37 | Similarity metrics for template matching? | 2 | `grep -rn 'cosine\|distance\|similarity\|embedding'` — any? |

---

### 5. Digital Logic & Design (8 points)

| # | Question | Max | Check |
|---|----------|-----|-------|
| 38 | All button visibility conditions combinatorial? | 2 | `grep -rn 'show\|visible\|disabled' *.tsx` — check if any have side effects. |
| 39 | Pipeline cascade as sequential circuit? | 2 | ★ Does `node.completed` → cascade to next depend on stored state (pipeline-flow.json)? |
| 40 | Permission checks side-effect free? | 2 | Calling `canExecute()` must never modify state. Check. |
| 41 | Crash recovery via persisted execution state? | 2 | ⚡ Kill the process mid-execution. Restart. Does it resume from pipeline-flow.json? |

---

### 6. Numerical Analysis (8 points)

| # | Question | Max | Check |
|---|----------|-----|-------|
| 42 | No floating-point equality (uses epsilon)? | 2 | `grep -rn '===.*0\.[0-9]\|!==.*0\.[0-9]'` — any float comparisons without epsilon? |
| 43 | Slider values rounded to nearest step? | 2 | ⚡ Check slider handler: does it use `Math.round(value/step)*step` or raw value? |
| 44 | Progress monotonic (never decreases)? | 2 | ★ Can pipeline progress ever go from 3/5 → 2/5? If yes = 0. |
| 45 | Edge cases handled (NaN, Infinity, div/0)? | 2 | `grep -rn '/ [a-zA-Z]'` — check for potential division by zero. |

---

### 7. System Analysis & Design (14 points)

| # | Question | Max | Check |
|---|----------|-----|-------|
| 46 | Frontend never reads filesystem directly? | 2 | ★ `grep -r 'readFile\|writeFile\|fs\|join(' app/` — 0 hits = 2. |
| 47 | Clean layered architecture? | 2 | ⚡ Page → Component → Route → Filesystem. Check if any layer skips (e.g., component calls filesystem). |
| 48 | Low coupling? | 2 | Count imports per file. More than 10 distinct modules = co-dependency smell. |
| 49 | High cohesion? | 2 | Each file answers one question. If a file begins with "imports + types + utils + component" = 0. |
| 50 | UI never mixed with business logic? | 2 | ★ `grep -rn 'fetch\|api/' *.tsx` — check if fetch is inside render logic vs in a hook/effect. |
| 51 | Queue separate from pipeline storage? | 2 | Queue operations should only touch queue.json, not META.json or pipeline.json. |
| 52 | Execute-flow independent of queue? | 2 | Stop the queue service. Run execute-flow. Does it work? If not = 0. |

---

### 8. Database Systems (File-as-Database) (16 points)

| # | Question | Max | Check |
|---|----------|-----|-------|
| 53 | Atomic writes for critical updates? | 2 | ★ Multi-file updates: are they ordered so crash doesn't corrupt? |
| 54 | Crash leaves recoverable state? | 2 | ★ Kill `writeFile` mid-write. On next read, are there fallback defaults? |
| 55 | Schema validated at read time? | 2 | `grep -rn 'JSON.parse\|\.catch(()' routes/` — all parses must have fallback. |
| 56 | File reads cached? | 2 | Same file read 3 times in one request? That's 0. Add cache layer. |
| 57 | Directory structure as index? | 2 | `readdir('pipelines/PAOS/PIPE-xxx')` = O(1). Iterating all dirs to find one = 0. |
| 58 | JSON parsed with try/catch + defaults? | 2 | ⚡ `grep -rn 'JSON.parse' *.ts` — any without .catch() = 0. |
| 59 | Concurrent writes prevented? | 2 | Two simultaneous execute-flow calls for same pipeline = both write META.json. Last wins = data loss. |
| 60 | Correct write order? | 2 | ★ Check: phase artifacts first → pipeline-flow → META.json last. Wrong order = 0. |

---

### 9. Calculus I–III (10 points)

| # | Question | Max | Check |
|---|----------|-----|-------|
| 61 | Progress as absolute counter? | 2 | `"3/5"` = counter. `"60%"` = derived. Both fine. `"unknown/infinity"` = 0. |
| 62 | Velocity tracking (tasks/unit time)? | 2 | Any timestamp diff + task count anywhere? No = 0. |
| 63 | Cumulative totals correct? | 2 | Sum of per-phase completed tasks = total completed? Mismatch = 0. |
| 64 | Moving averages for progress smoothing? | 2 | Does progress bar jump from 0→100% instantly? Smooth interpolation = 2. |
| 65 | Multi-variable resource optimization? | 2 | Are agent count, parallel branches, and token usage considered together? |

---

### 10. Human Error & UX/UI (20 points)

| # | Question | Max | Check |
|---|----------|-----|-------|
| 66 | System status visible for all long ops? | 2 | ★ Start a 2-minute task. Is there a spinner, progress bar, or status indicator? |
| 67 | ≥3 error recovery paths? | 2 | ★ Find: retry, skip, cancel. Missing one = 1. Missing two = 0. |
| 68 | Dangerous actions confirmed? | 2 | ⚡ `grep -rn 'delete\|remove\|clear\|reset' *.tsx` — each must have confirmation. |
| 69 | Responsive at 390px? | 2 | Resize browser to 390px. Any overflow, cutoff, or broken layout? |
| 70 | Responsive at 3840px? | 2 | Resize to 3840px. Content too narrow, whitespace awkward? |
| 71 | Scroll-wheel on all sliders? | 2 | ⚡ Every range input must support scroll. Try hovering each slider and scrolling. |
| 72 | Error messages specific and actionable? | 2 | ★ "An error occurred" = 0. "Missing API key for Anthropic. Set ANTHROPIC_API_KEY in your .env" = 2. |
| 73 | Consistent color system? | 2 | Gold primary (#f0b90b), dark background. Random color values = 0. |
| 74 | Progressive disclosure? | 2 | Tabs, expandable sections, collapsible panels. Everything visible at once = 0. |
| 75 | Affordances visually clear? | 2 | Clickable items look clickable (hover, shadow, cursor). Flat unresponsive elements that are actually buttons = 0. |

---

### 11. Security (20 points)

**Principle:** The system must protect secrets, validate all inputs, prevent injection, and limit blast radius. Think like a security auditor — what's the easiest way to break into or abuse this system?

| # | Question | Max | Check |
|---|----------|-----|-------|
| 76 | API keys and secrets never in config.yaml (only in .env)? | 2 | ★ `grep -rn 'api_key\|token\|secret\|password' config.yaml` — any match = 0. |
| 77 | .env file gitignored? | 2 | ⚡ `cat .gitignore | grep '.env'` — no entry = 0. |
| 78 | Shell command injection prevented? | 2 | ★ `grep -rn 'exec\|spawn\|execSync' routes/` — check if any pass unsanitized user input. `rm -rf $userInput` = 0. |
| 79 | File path traversal prevented? | 2 | `grep -rn 'join(dir,\|join(path,' routes/` — can `../../../etc/passwd` reach sensitive files? |
| 80 | All API inputs validated (type, range, format)? | 2 | ⚡ Check any POST/PUT route. Are params validated before use? Raw `req.json()` → `writeFile` = 0. |
| 81 | Rate limiting / DOS protection for API endpoints? | 2 | `grep -rn 'rateLimit\|throttle\|express-rate-limit'` — nothing = 0. Next.js Middleware can add this. |
| 82 | CORS properly configured? | 2 | Check `next.config.js` or middleware. Missing or wildcard (`*`) in production = 0. |
| 83 | Secrets redacted from logs and error messages? | 2 | ★ `grep -rn 'console.log\|error.*:' routes/` — check for API keys in debug output. |
| 84 | Agent subprocess runs with least privilege? | 2 | Are spawned agents running as the same user? No sandbox, chroot, or container = discuss. |
| 85 | Authentication/authorization on destructive endpoints? | 2 | ★ Can anyone call `DELETE /api/pipelines/[id]` without auth? Check. |
| 86 | XSS prevention in rendered content? | 2 | `grep -rn 'dangerouslySetInnerHTML\|innerHTML'` — any without sanitization = 0. |
| 87 | CSRF protection on state-changing endpoints? | 2 | Are POST/PUT/DELETE endpoints protected? Check middleware. |
| 88 | Dependency vulnerabilities? | 2 | ⚡ `npm audit 2>&1 \| grep -i 'critical\|high'` — any critical = 0. |
| 89 | Session/token management (no hardcoded tokens)? | 2 | `grep -rn 'telegram_bot_token\|BOT_TOKEN\|HARDCODED'` — hardcoded = 0. |
| 90 | Secure defaults (HTTPS, secure cookies, HSTS)? | 2 | Check if cookies have `Secure; HttpOnly; SameSite` flags. |

---

### 12. API Endpoints (20 points)

**Principle:** The API surface must be clean, consistent, and minimal. No duplicate endpoints, no redundant paths, no inconsistent response shapes. Every endpoint should serve a clear purpose and follow REST conventions.

| # | Question | Max | Check |
|---|----------|-----|-------|
| 91 | No duplicate endpoints (same resource, different paths)? | 2 | ★ `find app/api -name 'route.ts'` — any two routes handling the same resource? `GET /api/pipelines` vs `GET /api/pipeline` = 0. |
| 92 | Consistent HTTP methods (GET for reads, POST for creates, DELETE for deletes)? | 2 | ⚡ Find a POST that only reads data, or a GET that deletes. |
| 93 | Consistent response envelope across all endpoints? | 2 | ★ Pick 5 routes. Do they all return `{ ok: true/false }` or `{ error: ... }`? Inconsistent shapes = 0. |
| 94 | Proper HTTP status codes (200, 201, 400, 404, 409, 500)? | 2 | ⚡ Hitting a missing resource returns what? 500 Internal Server Error = wrong. Should be 404. |
| 95 | No redundant CRUD (endpoints that do the same thing as another)? | 2 | `POST /api/pipelines` + `PUT /api/pipelines/duplicate` doing same thing = 0. |
| 96 | List endpoints support pagination? | 2 | `GET /api/pipelines` returns ALL pipelines. At what count does it break? Test with 1000. |
| 97 | Endpoint naming follows consistent convention (kebab-case, plural)? | 2 | `grep -rn 'api/' app/ \| grep 'route.ts'` — mixed singular/plural = 0. |
| 98 | Orphaned/deprecated endpoints still live? | 2 | `grep -rn 'legacy\|old\|v1\|deprecated' app/api/` — if found, they should be removed. |
| 99 | API surface too large (maintenance burden)? | 2 | Count route files. > 30 routes for a single resource = over-fragmented. |
| 100 | Missing standard CRUD operations? | 2 | Does every resource have GET (list), GET/:id, POST, DELETE? Missing = consider adding or removing the resource entirely. |

---

### 13. Code Quality (20 points)

| # | Question | Max | Check |
|---|----------|-----|-------|
| 101 | TypeScript strict mode? | 2 | ⚡ `grep '"strict"' tsconfig.json` — must be `true`. |
| 102 | Zero `any` types? | 2 | `grep -rn ': any' src/` — any hit = 0. Each `any` is an admission you don't know the type. |
| 103 | Every API wrapped in try/catch with fallback? | 2 | ★ Pick 5 routes. All have error handling? Any missing = 0. |
| 104 | Async/await consistent (no raw .then chains)? | 2 | ⚡ `grep -rn '\.then(' src/` — more than 3 = 0. |
| 105 | Explicit imports (no barrel re-exports)? | 2 | `grep -rn 'export \* from\|export {' index.ts` — barrel files = 0. |
| 106 | kebab-case filenames? | 2 | `find src/ -name '*[A-Z]*'` — PascalCase files that aren't components = 0. |
| 107 | Single source of truth for each datum? | 2 | ★ Same default value defined in 2+ places? 0. |
| 108 | Config centralized (not scattered)? | 2 | Hardcoded paths like `/home/dev/...` in routes vs imported from `global-config.ts`. |
| 109 | React hooks rules followed? | 2 | ⚡ `grep -rn 'useState\|useEffect\|useCallback' *.tsx` — check inside loops/conditionals. |
| 110 | React.memo on expensive components? | 2 | `grep -rn 'export const\|export default function' *.tsx` — count components without memo that render lists or complex trees. |

---

## Audit Procedure

### Step 1 — Tooling Setup

```bash
# Required searches
grep -rn ': any' src/ --include='*.ts' --include='*.tsx'
grep -rn '\.then(' src/ --include='*.ts' --include='*.tsx'
grep -rn 'readFile\|writeFile\|fs\.' app/ --include='*.tsx'
grep -rn 'extends' src/ --include='*.ts' --include='*.tsx'
grep -rn 'agentId\|agent.*===' execute-flow/
find . -name '*[A-Z]*' -not -path '*/node_modules/*' -not -path '*/.next/*'
```

### Step 2 — Score Each Question

For each question:
1. Read the check column for what to search
2. Run the grep/command
3. If evidence found → score 2 with "✅ file:line — quote"
4. If partially found → score 1 with "✅ file:line / ❌ file:line — gap"
5. If not found or clearly violated → score 0 with "❌ file:line — fix"

### Step 3 — Grade Calculation

```
raw = sum(all scores)
total = round((raw / 220) * 100)   # normalize to 100

grade = 'F'
if total >= 90: grade = 'A'
elif total >= 75: grade = 'B'
elif total >= 50: grade = 'C'
elif total >= 25: grade = 'D'

# Auto-grade penalty: any ★ (essential) question scored 0
if any(star_questions where score == 0):
    grade = chr(ord(grade) + 1)  # A→B, B→C, etc.
    if grade > 'F': grade = 'F'
```

### Step 4 — Gaps & Implementation Plans

For every score < 2, the auditor must:

1. **Document the gap** in the Gaps section below
2. **Create an implementation plan file** at `.hermes/plans/benchmark-gap-{N}.md`

### Implementation Plan Format

```markdown
# Implementation Plan: Benchmark Gap #{N}

**Source**: Coding-Principles-Benchmark Q{N}
**Category**: {OOP / Data Structures / ...}
**Severity**: Critical / High / Medium / Low
**Score**: {current}/2
**Found by**: {auditor}

## The Gap
{what's wrong, with file:line evidence}

## The Fix
{what needs to change, in concrete steps}

## Files to Modify
1. `{path/to/file.ts}` — {what to change}
2. `{path/to/file.ts}` — {what to change}

## Acceptance Criteria
- {condition 1}
- {condition 2}
- Score on re-audit: 2/2

## Dependencies
- {prerequisite work, if any}

## Estimated Effort
{X} minutes / {Y} hours

## Status
⏳ Pending — User must trigger via "work on gap {N}" or "work on implementation plan benchmark-gap-{N}"
```

### Critical Rule — NEVER AUTO-EXECUTE

```
🚫 The auditor (me or any agent) must NOT:
   - Execute any implementation plan
   - Start any work described in a gap
   - Fix any code found during the audit
   - Trigger dependents of any gap

✅ ONLY the user can trigger work on a gap by saying:
   "work on gap {N}"
   "work on implementation plan benchmark-gap-{N}"
   "implement benchmark-gap-{N}"
```

### Gaps Register

```markdown
## Gaps Found

### Gap 1 — {Title}
- **Source**: Q{N}
- **Score**: {N}/2
- **Severity**: {Critical/High/Medium/Low}
- **Plan**: `.hermes/plans/benchmark-gap-1.md`
- **Status**: ⏳ Pending

### Gap 2 — {Title}
...
```

---

## Aggregated Report Example

For every score < 2, provide:
```
❌ Q{N} — {Question text} — Score: {N}/2
   Evidence: {file:line}
   What was found: {quote}
   Fix: {specific recommendation}
   Priority: High/Medium/Low
```

---

## Example — Completed Audit Output

```
═══════════════════════════════════════════════════════════════
 PAOS AI_Workflow — STRICT BENCHMARK AUDIT
═══════════════════════════════════════════════════════════════

Q1 — Does every module hide its internal state?  Score: 2/2
  ✅ Canvas.tsx:15 — useNodesState + onSave callback
  ✅ queue/route.ts:40 — serialized queue state only

Q3 — Can a consumer break internal state?  Score: 0/2
  ❌ ConfigPanel.tsx:88 — `onUpdate(node.id, { prompt: rawInput })`
     No validation on rawInput. User can inject arbitrary data.
     Fix: Add input sanitization before onUpdate dispatch.
     Priority: High ★ (essential)

Q6 — Is composition preferred over inheritance?  Score: 1/2
  ✅ AgentNode.tsx:1 — memo + props (composition pattern)
  ❌ legacy/BaseNode.ts:12 — extends BaseEntity
     Only 1 instance of extends, acceptable but flagged.
     Fix: Consider converting BaseEntity to a useBaseNode hook.
     Priority: Low

...

═══════════════════════════════════════════════════════════════
TOTAL: 172/220 raw = 78/100 normalized  Grade: B  (penalty: 1 ★ question scored 0)
═══════════════════════════════════════════════════════════════

FAILED ★ QUESTIONS (must fix):
  ❌ Q3 — Can a consumer break internal state?
  ❌ Q4 — Are React props minimal?

TOP 5 FIXES ORDERED BY IMPACT:
  1. Q3 — Input validation in ConfigPanel (2 min)
  2. Q21 — Cycle detection in topoSort (5 min)
  3. Q56 — File read caching (30 min)
  4. Q92 — Replace `any` types (15 min)
  5. Q93 — Missing try/catch in 2 routes (10 min)
```
