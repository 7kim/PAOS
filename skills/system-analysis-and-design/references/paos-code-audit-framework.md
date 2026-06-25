# PAOS Code Audit Framework

**Purpose:** Evaluate a codebase against computer science and mathematics principles using strict, evidence-based scoring. Produces grades, gap reports, SRS files, implementation plans, SWOT analysis, and sends everything to Telegram.

---

## When to Use

- User asks for a "benchmark", "audit", "code review", "quality assessment", or "grading" of the PAOS AI_Workflow codebase.
- User asks to evaluate code against the PAOS Coding Principles.
- User asks for SWOT analysis of the project.
- User asks for implementation plans to fix identified gaps.
- User says "benchmark" or "make a new benchmark" — triggers full workflow.

---

## Three-Phase Process

### Phase 1 — Coding Principles Audit

Run the benchmark defined in `~/AI_Workflow/Coding-Principles-Benchmark.md`.

**Key rules:**
- **Teacher mindset** — look for the simplest mistakes, the missed opportunities, the lazy shortcuts. Be harsh.
- **Evidence required** — every score needs `file.ts:line` proof. No evidence = score 0.
- **0/1/2 per question** — 0 = violated, 1 = partial with documented gaps, 2 = fully correct with evidence.
- **110 questions** across 13 categories (220 raw max → normalized to 100).
- **Star questions** — any ★ question scored 0 auto-drops the grade one letter.
- **Grade scale:** A (90+), B (75+), C (50+), D (25+), F (<25).

**Categories (with weights):**
| Tier | Weight | Categories |
|------|--------|-----------|
| Heavy | 48% | OOP, Data Structures, System Analysis, Digital Logic, Security |
| Medium | 25% | Code Quality, API Endpoints, Database |
| Moderate | 18% | UX/UI, Linear Algebra |
| Supporting | 9% | Graph Theory, Calculus, Numerical Analysis |

**Audit procedure:**
1. Run tooling searches (grep for `: any`, `.then(`, etc.)
2. Score each question with file:line evidence
3. Compute raw total → normalize to 100 → letter grade
4. Apply star-question penalty
5. Generate gaps register

### Phase 2 — Gaps, SRS & Implementation Plans

Every question scored < 2 becomes a gap:

1. **Create benchmark folder** at `benchmarks/Benchmark_N_{DD-MM-YYYY}---{HH-MM}/`
2. **Create individual gap files** at `gaps/gap-{NN}-{title}.md` with concrete fix steps
3. **Create combined gaps file** at `gaps.md`
4. **Generate SRS files** using the system-analysis-and-design skill:
   - `SRS-as-is.md` — current state requirements
   - `SRS-to-be.md` — target state with all gaps closed
5. **Create implementation spec** at `implementation.md` with concrete code per gap
6. **Create implementation plan** at `implementation-plan.md` with prioritized phases
7. **Send all files to Telegram** — SRS-as-is.md, SRS-to-be.md, gaps.md, implementation.md, implementation-plan.md

**Never auto-execute** — only the user can trigger work by saying "work on gap {N}".

**Kanban:** 4-column board (Pending / In Progress / Fixed / Won't Fix).
- Pending ↔ Won't Fix: click to toggle.
- In Progress/Fixed: set by pipeline execution only.
- Won't Fix gaps auto-removed from gaps.md and implementation.md.

**Gap→Pipeline:** Only create a pipeline when the user says "create pipeline for gap {N}". Small gaps (5-10 min) show the direct fix instead.

### Phase 3 — SWOT Analysis

Run the SWOT benchmark defined in `~/AI_Workflow/SWOT-Benchmark.md`.

**Four quadrants:**
- **Strengths** — internal, positive. Architecture clarity, correctness guarantee, UX, data integrity, extensibility, persistence, real-time feedback, responsive design.
- **Weaknesses** — internal, negative. Type safety, error handling, code duplication, test coverage, documentation gaps, coupling, state management, performance.
- **Opportunities** — external, positive. Template marketplace, agent plugins, analytics, collaboration, export/import, CI/CD, benchmarking, self-healing.
- **Threats** — external, negative. Competing agents, provider lock-in, tech decay, data loss, security surface, adoption friction, maintainer burnout.

**Final verdict:** Buy / Hold / Sell recommendation.

---

## Benchmark Directory Structure

```
~/AI_Workflow/benchmarks/
└── Benchmark_{N}_{DD-MM-YYYY}---{HH-MM}/
    ├── README.md                  # Overview + scores + tier breakdown
    ├── full-audit.md              # Complete audit report
    ├── SRS-as-is.md              # Current state (via system-analysis-and-design)
    ├── SRS-to-be.md              # Target state (via system-analysis-and-design)
    ├── gaps.md                    # ALL gaps combined
    ├── implementation.md          # Full implementation spec with code
    ├── implementation-plan.md     # Prioritized fix plan
    └── gaps/
        └── gap-{NN}-{title}.md    # Individual gap
```

## Dashboard Integration

- `/benchmarks` page in the dashboard shows timeline, kanban, and benchmark files
- Flow builder has a "Benchmarks" button that opens a benchmark browser dialog
- Click a gap → "Create Pipeline" → opens builder with pre-filled prompts
- File tree shows benchmark files when `benchmarkId` is set

## Reference Files

- `~/AI_Workflow/Coding-Principles.md` — the full 10-section principles document
- `~/AI_Workflow/Coding-Principles-Benchmark.md` — the 110-question audit with strict grading
- `~/AI_Workflow/SWOT-Benchmark.md` — the investment-view analysis
- `~/AI_Workflow/benchmarks/` — past benchmark runs with all generated files
