# Agent: Execute (opencode-developer)
# Task 2/2 — Test Builder Layout Visualize View

## Instructions

Execute a comprehensive test of the builder layout visualize view for pipeline PIPE-26-06-2026---12-42.

### Context

This pipeline (PIPE-26-06-2026---12-42) was created via the Pipeline Builder UI. It has:
- `builder: true` in META.json
- A `builderLayout` with 2 nodes (n0: Plan, n1: Execute) and 1 edge connecting them
- 2 phase directories (n0, n1) with standard artifacts

The visualize view at `/pipelines/[id]/visualize` leverages `builderLayout` data to render a read-only React Flow DAG (MiniDagView component) showing the pipeline's node/edge structure with live status enrichment.

### Test Scope (CLI-verifiable)

Since this executor runs in a CLI environment, testing covers:
1. **Data integrity** — Validate the builderLayout JSON in META.json
2. **API correctness** — Verify `/api/pipelines/[id]` and `/api/pipelines/[id]/flow-status` return correct data
3. **Static analysis** — TypeScript compilation check on builder-related components
4. **Edge cases** — Test visualize view resilience with boundary conditions

### Phase n0 Artifacts

The planner (hermes-nous) in phase n0 produced these artifacts in `phases/n0/`:
- `IMPLEMENTATION.md` — planning instructions
- `TASKS.md` — task breakdown
- `REASONING.md` — analysis and decisions

## Tasks
- [ ] 1. Validate builderLayout data integrity in META.json
- [ ] 2. Verify pipeline API endpoint returns correct builderLayout data
- [ ] 3. Run TypeScript compilation check on builder components
- [ ] 4. Test edge cases and data resilience
- [ ] 5. Create necessary files and modifications
- [ ] 6. Verify everything works
- [ ] 7. Update task markers
- [ ] 8. Write WALKTHROUGH.md with summary

---
Handoff from hermes-nous (n0 Plan). See phases/n0/REASONING.md for full analysis.
