---
name: system-analysis-and-design
description: Generate a complete, academic-grade System Requirements Specification (SRS) and system-design document from a project idea. Use this skill whenever the user asks for an SRS, software requirements document, system design document, UML diagrams for a software project, a CRM/mobile/web app specification, MVP vs scalable architecture breakdown, or anything resembling "design this system for me," "write an SRS for my project," "create a system design," "build me the UML diagrams for X," or similar. Triggers on phrases like "SRS", "software requirements", "system design", "architecture document", "UML diagrams", "MVP design", "technical spec", "design document", "system analysis", even when the user doesn't explicitly say the word "SRS."
---

# System Analysis and Design

A skill that produces a complete, exam-quality System Requirements Specification + system-design document from a project idea, delivered as Markdown and PDF with properly rendered diagrams.

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
