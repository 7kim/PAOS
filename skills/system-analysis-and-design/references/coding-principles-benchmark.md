# Coding Principles Benchmark Reference

The canonical benchmark document is at:
`~/AI_Workflow/Coding-Principles-Benchmark.md` (v2.0 — Strict Evidence-Based)

This reference exists only as a pointer. Read the canonical file for the full 110-question framework.

## Key Properties

- 110 questions across 13 categories
- Raw max: 220 → Normalize to 100
- Grade thresholds: A ≥ 90, B ≥ 75, C ≥ 50, D ≥ 25, F < 25
- Every question needs file:line evidence
- Weight tiers: Heavy (48%), Medium (25%), Moderate (18%), Supporting (9%)
- Auto-grade penalty for ★ failures
- Gaps generate implementation plans (NEVER auto-execute)
- Kanban: 4 columns (Pending / In Progress / Fixed / Won't Fix)
- Pending ↔ Won't Fix toggled by click. In Progress/Fixed set by pipeline execution.
- Won't Fix gaps auto-removed from gaps.md and implementation.md

## Full Benchmark Workflow (when user says "benchmark" or "make a new benchmark")

1. Run the full 110-question audit against the codebase
2. Load the system-analysis-and-design skill
3. Generate SRS-as-is.md (current state requirements)
4. Generate SRS-to-be.md (target state with all gaps closed)
5. Create gaps.md (combined), implementation.md, implementation-plan.md
6. Send ALL files to Telegram automatically:
   - SRS-as-is.md, SRS-to-be.md, gaps.md, implementation.md, implementation-plan.md

## Audit Procedure

1. Set up tooling (grep commands listed in benchmark doc)
2. Score each question 0/1/2 with evidence
3. Compute grade with normalization
4. Document gaps for scores < 2
5. Create implementation plans (user-triggered only)
6. Generate SRS files using system-analysis-and-design skill
7. Deliver everything to Telegram
