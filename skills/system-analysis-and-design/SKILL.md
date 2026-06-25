---
name: system-analysis-and-design
description: Generate a complete, academic-grade System Requirements Specification (SRS) and system-design document from a project idea, AND evaluate an existing codebase against computer science principles using strict evidence-based benchmarking. Use this skill whenever the user asks for an SRS, software requirements document, system design document, UML diagrams, code audit, code benchmark, quality grading, SWOT analysis of a software project, or anything resembling "design this system for me," "write an SRS," "audit this codebase," "benchmark the code," "grade the project," or "run the benchmark." Also triggers on "coding principles," "strict audit," "gaps report," "gaps kanban," "implementation plan," and "SWOT benchmark" in the context of evaluating code quality.
---

# System Analysis and Design

A skill that produces a complete, exam-quality System Requirements Specification + system-design document from a project idea, delivered as Markdown and PDF with properly rendered diagrams.

**Also:** Evaluates existing codebases against computer science and mathematics principles using the PAOS Code Audit Framework v2.0. This is a separate workflow from SRS generation — see the reference file for the full three-phase process (coding principles benchmark → gaps/implementation plans → SWOT analysis).

## Code Audit Workflow (v2.0 — Strict Evidence-Based)

### The Three-Phase Assessment

```
Phase 1: Coding Principles Benchmark  →  Phase 2: Gaps + Implementation Plans  →  Phase 3: SWOT Analysis
```

### Phase 1 — Run the Benchmark

Use the canonical benchmark at `~/AI_Workflow/Coding-Principles-Benchmark.md` (v2.0). Key rules:

- **Every question scored 0/1/2 with file:line evidence.** No evidence = score 0.
- **110 questions across 13 categories** (OOP, Data Structures, Graph Theory, Linear Algebra, Digital Logic, Numerical Analysis, System Analysis, Database, Calculus, UX/UI, Security, API Endpoints, Code Quality).
- **Raw max is 220.** Normalize to 100: `round(raw / 220 * 100)`.
- **Grade thresholds:** A ≥ 90, B ≥ 75, C ≥ 50, D ≥ 25, F < 25.
- **Auto-grade penalty:** Any ★ question scored 0 drops the grade one letter.
- **Floor rule:** 89 is B, not A. No rounding.
- **Weight tiers:** Heavy (48%: OOP, DS, Sys Analysis, Dig Logic, Security), Medium (25%: Code Quality, API, Database), Moderate (18%: UX/UI, Linear Algebra), Supporting (9%: Graph Theory, Calculus, Num Analysis).

### Phase 2 — Gaps & Implementation Plans

For every question scored < 2, the auditor MUST:

1. **Document the gap** with file:line evidence
2. **Create an individual gap file** at `benchmarks/Benchmark_N_{date}/gaps/gap-{NN}-{title}.md`
3. **Create a combined gaps file** at `gaps.md` (not `gaps/index.md`)
4. **Create an implementation spec** at `implementation.md` with concrete code per gap
5. **Create an implementation plan** at `implementation-plan.md` with 4 phases (Security, Data Integrity, Code Quality, API & Analytics)
6. **Generate SRS files** using this skill (system-analysis-and-design):
   - `SRS-as-is.md` — current state requirements
   - `SRS-to-be.md` — target state with all gaps closed
7. **Send all files to Telegram** — SRS-as-is.md, SRS-to-be.md, gaps.md, implementation.md, implementation-plan.md

Each gap file must contain:
- Source question number and category
- Severity (Critical / High / Medium)
- Score and evidence
- The Fix (concrete code steps)
- Files to modify
- Acceptance criteria
- Estimated effort
- Status line (`⏳ Pending` / `🔄 In Progress` / `✅ Fixed` / `🚫 Won't Fix`)

**CRITICAL RULE — NEVER AUTO-EXECUTE:**
```
🚫 The auditor must NOT execute any implementation plan, start any work
   described in a gap, fix any code found during the audit, or trigger
   dependents of any gap.
✅ ONLY the user can trigger work by saying:
   "work on gap {N}"
   "work on implementation plan benchmark-gap-{N}"
   "implement benchmark-gap-{N}"
   (These only trigger code changes — the pipeline is still created in builder for user to edit/run)
```

**Gap→Pipeline conversion:** Only create a pipeline for a gap when the user explicitly says "create pipeline for gap {N}". The pipeline opens in the builder with pre-filled prompts referencing SRS-to-be.md, gaps.md, implementation.md, and the individual gap file. Small gaps (5–10 min) show an alert with the direct fix instead.

**Benchmark directory structure:**
```
benchmarks/
└── Benchmark_{N}_{DD-MM-YYYY}---{HH-MM}/
    ├── README.md                  # Overview + scores + tier breakdown
    ├── full-audit.md              # Complete audit report
    ├── SRS-as-is.md              # Current state (via system-analysis-and-design)
    ├── SRS-to-be.md              # Target state (via system-analysis-and-design)
    ├── gaps.md                    # ALL gaps combined (auto-removes Won't Fix)
    ├── implementation.md          # Full implementation spec with code
    ├── implementation-plan.md     # Prioritized fix plan
    └── gaps/
        ├── gap-01-{title}.md      # Individual gap
        └── ...
```

**Kanban status tracking (4 columns):**
- **Pending** ↔ **Won't Fix** — click to toggle manually. Won't Fix gaps are auto-removed from gaps.md and implementation.md.
- **In Progress** — set by pipeline execution, not clickable in UI.
- **Fixed** — set by pipeline execution, not clickable in UI.
- The dashboard at `/benchmarks` shows gaps in a 4-column Kanban board. The FileTreeExplorer in the flow builder shows benchmark files (SRS-as-is.md, SRS-to-be.md, gaps.md, implementation.md, per-gap files) when benchmarkId is provided.

**Benchmark files in flow builder:** When a benchmark is selected, the ConfigPanel's file tree shows a purple "Benchmark Files" section listing SRS-as-is.md, SRS-to-be.md, gaps.md, implementation.md, full-audit.md, and per-gap files. These can be toggled as file references for agent prompts.

### Phase 3 — SWOT Analysis

Use `~/AI_Workflow/SWOT-Benchmark.md` to evaluate the project as an investment. Score Strengths, Weaknesses, Opportunities, Threats across 31 sub-questions. Produce a Buy/Hold/Sell recommendation with a SWOT matrix.

## What This Skill Produces

- **One SRS document** in Markdown and PDF
- **14 sections**: Introduction, Literature Review, SWOT/PESTLE, Planning, Methodology, Requirements (FR + NFR), Process & Data Modelling, System Design, UML Diagrams, MVP Design, Testing, Deployment, Maintenance, References
- **All UML diagram types**: Use Case, Class, Object, Component, Deployment, Package, Activity, State Machine, Sequence, Communication, Interaction Overview, Timing, plus ERD, DFD levels 0 and 1, and Context Diagrams for both MVP and Scalable
- **MVP-first, then Scalable** — two tiers clearly separated
- **Database schema + API endpoints** as structured tables
- **Requirements Traceability Matrix** mapping every FR to test cases
- **Design Rationale subsection** explaining key trade-offs

## The Non-Negotiable Core Workflow

Follow these steps in order. Do not skip the elicitation phase — an SRS written on assumptions rather than elicited facts is generic and unusable.

### Step 1 — Read the References

Before doing anything else, consult:

1. `references/srs-template.md` — the canonical section-by-section template. Every deliverable follows this structure.
2. `references/elicitation-workflow.md` — the full interview flow, including which questions are critical vs nice-to-have.
3. `references/diagram-cookbook.md` — correct Mermaid syntax for every diagram type, plus the workarounds for the known rendering pitfalls (use-case diagrams with `((circles))` span multiple pages; ER diagrams break on `PK_FK`; labeled dotted arrows break on `+` characters; etc.).
4. `references/pdf-build-guide.md` — exact pandoc + xelatex + mermaid-cli command sequence.

### Step 2 — Elicit the Project

Never start writing the SRS before completing elicitation. The user's initial brief will always be incomplete. Use the `assets/elicitation-survey.md` as the interview checklist. Resolve every **Critical** question before proceeding. For **Important** questions, offer defaults but get explicit sign-off. Surface the answers back to the user as a master checklist before committing to writing.

Pedagogical elicitation principle: when a user's answer reveals a misconception (e.g., they think OAuth requires a backend when it doesn't), explain the correct model with an analogy, confirm their understanding, and only then lock the decision in. The SRS is defensible only if the user can explain their own design choices.

### Step 3 — Draft the SRS

Follow `references/srs-template.md` section by section. Fill every section. Do not skip. For each section, keep academic formal register; use "shall" for binding requirements; use tables for structured data; keep prose tight.

### Step 4 — Render Diagrams

Use Mermaid for every diagram except use-case diagrams. For use-case diagrams, use the hand-crafted SVG template in `assets/usecase-template.svg` to avoid the known Mermaid pitfall where `((circles))` produce page-spanning output.

After embedding Mermaid blocks in the Markdown, extract them to `diagrams/fig_NN.mmd` files, render each to PNG via `mmdc` with `-w 1600`, check aspect ratios — any diagram with h/w > 1.5 must be rewritten horizontally (change `TD`/`TB` to `LR`). This check is not optional. Diagrams taller than 1.5× their width will span pages in the final PDF.

### Step 5 — Build the PDF

Run `pandoc` with `--pdf-engine=xelatex`. Do NOT use `--number-sections` if section headings already contain numbers in the source — it duplicates them ("3.3 3.3 Lead Management"). Use `![](path.png)` not `![Figure N](path.png)` to suppress duplicate figure captions.

### Step 6 — Present

Save both the `.md` and `.pdf` to the outputs folder. Present both files to the user via `present_files`.

## Scope Discipline

An MVP SRS and a scalable SRS are different documents with different audiences. This skill produces **one combined document** with MVP and Scalable clearly separated per section. Requirements are tagged `(MVP)` or `(Scalable)` in the functional-requirements tables. Architecture has MVP and Scalable subsections. Evolution plan lays out Phase A → B → C.

## Common Mistakes to Avoid

- **Inventing facts about the user's project.** If the brief doesn't specify a detail, elicit it — do not invent.
- **Merging Activity Diagram and Flowchart.** These are distinct diagrams with distinct roles. Activity diagram = happy-path swimlane flow. Flowchart = exhaustive decision-tree with a diamond for every `if`.
- **Using `flowchart LR` for use-case diagrams.** This produces unusable output. Use the SVG template instead.
- **Forgetting the design rationale section.** Examiners ask "why?" for every non-obvious choice. If the rationale isn't in the document, the student cannot defend it.
- **Skipping the traceability matrix.** FR → test-case mapping is the difference between "has tests" and "has verifiable tests."
- **Copy-pasting a generic SRS.** The document is only valuable if every section reflects *this* project's decisions. Repetition and vague prose are telltales of generic content.
- **Auto-executing benchmark implementation plans.** NEVER implement, start, or fix anything from a benchmark gap unless the user explicitly says "work on gap N". Rule is also in memory.
- **Forgetting the canonical benchmark files.** The authoritative documents are at `~/AI_Workflow/Coding-Principles.md`, `~/AI_Workflow/Coding-Principles-Benchmark.md`, and `~/AI_Workflow/SWOT-Benchmark.md`. Read these directly instead of relying on stale references.

## Quick Start for Urgent Tasks

If the user says "just do it" and declines elicitation, follow this fallback:
1. Use sensible defaults for every Important question.
2. Flag every assumption in a "Design Assumptions" appendix.
3. Tell the user explicitly which assumptions they must review.

This path produces a lower-quality SRS but unblocks the user. Prefer full elicitation whenever possible.

## Output Format Checklist

Before presenting the final deliverables:

- [ ] All 14 sections present
- [ ] Every functional requirement tagged `(MVP)` or `(Scalable)`
- [ ] Use-case diagrams rendered as proper UML (stick-figure actor, system boundary, ellipse use cases)
- [ ] No diagram spans more than one page in the PDF
- [ ] Requirements Traceability Matrix present
- [ ] Design Rationale subsection present with at least 3 trade-off explanations
- [ ] References section includes all SDKs, frameworks, and RFCs actually mentioned in the body
- [ ] PDF opens cleanly (no LaTeX errors)
- [ ] Markdown source opens cleanly (no broken Mermaid syntax)
