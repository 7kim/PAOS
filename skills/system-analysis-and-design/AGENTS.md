# Skill: system-analysis-and-design

## Trigger

Activate when the user says any of:
- "create an SRS", "system requirements specification"
- "design the system", "system design document"
- "architecture document", "technical spec"
- "UML diagrams", "draw the architecture"
- `@architect design <request>`

## Owner

**Agent**: `opencode-architect`  
**Phase**: Article II Phase A (Strategic Planning)  
**H-Factor**: I4 (Skill Boundary) — this is an architect-only skill

## What this skill produces

1. **SRS document** (`outputs/<project>-srs.md`) — 14 sections:
   - Introduction, Overall Description, User Requirements, System Requirements
   - Functional Requirements (MVP-tagged), Non-Functional Requirements
   - System Architecture, Data Model, API Design, Security Model
   - Deployment Architecture, Testing Strategy, RTM, Design Rationale, References

2. **System design PDF** (`outputs/<project>-srs.pdf`) — via pandoc + xelatex

3. **UML diagrams** (`diagrams/fig_NN.mmd`) — Mermaid for all except use-case (SVG)

4. **RTM** (Requirements Traceability Matrix) — maps every requirement to implementation

## Workflow

1. Read `skills/system-analysis-and-design/SKILL.md` for full protocol
2. Read `skills/system-analysis-and-design/references/` for templates
3. Run elicitation survey (`assets/elicitation-survey.md`) — resolve all Critical questions
4. Draft SRS following 14-section template
5. Render diagrams with Mermaid
6. Build PDF with pandoc
7. Log to vault: `vault/memory/architect/events.md` + `vault/memory/global_ledger.md`

## Invocation examples

```
@architect design a REST API for a task management system
@architect design the database schema for AI_Workflow memory
@architect design the microservices architecture for NodeAlgo platform
```

## References

- `skills/system-analysis-and-design/SKILL.md` — full protocol
- `skills/system-analysis-and-design/references/srs-template.md`
- `skills/system-analysis-and-design/references/elicitation-workflow.md`
- `skills/system-analysis-and-design/references/diagram-cookbook.md`
