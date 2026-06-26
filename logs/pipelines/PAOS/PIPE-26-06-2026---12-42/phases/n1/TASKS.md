## Test Plan — Builder Layout Visualize View

### Task Overview
| # | Task | Complexity | Dependencies |
|---|------|------------|--------------|
| 1 | Validate builderLayout data integrity in META.json | S | None |
| 2 | Verify pipeline API endpoint returns correct builderLayout data | S | Task 1 |
| 3 | Run TypeScript compilation check on builder components | M | None |
| 4 | Test edge cases and data resilience | M | Tasks 1-2 |

### Task Details

#### Task 1: Validate builderLayout Data Integrity (S)
- Read META.json and verify `builder` field is `true`
- Verify `builderLayout.nodes` is an array with >= 1 node
- Verify each node has required fields: `id`, `type`, `position`, `data`
- Verify `builderLayout.edges` is an array
- Verify each edge connects valid node IDs
- Check for duplicate node IDs
- Run topological sort to detect cycles

**Evidence**: Output a validation report with pass/fail per check.

#### Task 2: Verify Pipeline API Endpoint (S)
- Check if dashboard is running (curl to localhost:3333 or configured port)
- Fetch `GET /api/pipelines/PIPE-26-06-2026---12-42`
- Verify response includes `builderLayout` with correct nodes/edges
- Verify phases array contains correct phase data
- Verify taskList is populated with progress info
- Check stats object has correct values

**Evidence**: Save API response to `phases/n1/output/api-response.json`

#### Task 3: TypeScript Compilation Check (M)
- Run `npx tsc --noEmit` in dashboard directory
- Check for errors specifically in:
  - `components/pipeline-builder/MiniDagView.tsx`
  - `components/pipeline-builder/ReadOnlyNode.tsx`
  - `components/pipeline-builder/VisualToolbar.tsx`
  - `app/pipelines/[id]/visualize/page.tsx`
- If full compilation takes too long, use `tsc --noEmit --pretty` for targeted check
- Report any errors found

**Evidence**: Save compilation output to `phases/n1/output/tsc-output.txt`

#### Task 4: Edge Cases and Data Resilience (M)
- Test with what happens if:
  - `builderLayout` is missing from META.json
  - Nodes have no edges (single node pipeline)
  - Phase has missing status field
  - Flow status endpoint returns no data
- These are "what-if" analysis tests — verify the code handles these gracefully
- Check the MiniDagView component code for defensive checks (empty arrays, null checks)
- Check the visualize page for loading/empty states

**Evidence**: Save edge case analysis to `phases/n1/ANALYSIS.md`

### Task Status
- [ ] 1. Validate builderLayout data integrity in META.json
- [ ] 2. Verify pipeline API endpoint returns correct builderLayout data
- [ ] 3. Run TypeScript compilation check on builder components
- [ ] 4. Test edge cases and data resilience
- [ ] 5. Create necessary files and modifications
- [ ] 6. Verify everything works
- [ ] 7. Update task markers
- [ ] 8. Write WALKTHROUGH.md with summary
