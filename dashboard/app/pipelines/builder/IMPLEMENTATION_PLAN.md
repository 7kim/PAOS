# Pipeline Flow Builder — Implementation Plan (v2)

## Overview
Enhance the Flow Builder and pipeline system with templates, smart suggestions, rich DAG visualization, REASONING.md, execution cascade, better context display, and error recovery.

---

## Build Order

| Step | Phase | Description | Dependencies |
|------|-------|-------------|-------------|
| 1 | A | Pipeline path & project context display | None |
| 2 | B | REASONING.md generation (backend only) | None |
| 3 | C | Enrich flow-status + expandable DAG cards | B |
| 4 | D | Execution cascade & error recovery | C |
| 5 | E | Pipeline template system (CRUD + presets) | C |
| 6 | F | Smart suggestions per agent | E |
| 7 | G | Read-only React Flow DAG on visualize page | C |
| 8 | H | Standard pipeline template integration | E |

---

## Phase A: Pipeline Context & Path Display

### A.1 Show project context on visualize page
- **File**: `app/pipelines/[id]/visualize/page.tsx`
- Change title from `{id}` to `{project} / {id}`
- Read project from META.json (already available in `data.meta`)
- Add tooltip showing full filesystem path: `~/AI_Workflow/memory/pipelines/{project}/{id}/`

### A.2 Show project on pipeline list cards
- **File**: `app/pipelines/page.tsx`
- Add project badge next to pipeline ID
- Ensure project is visible even when not filtered

---

## Phase B: REASONING.md Generation

### B.1 Backend — generate role-specific REASONING.md
- **File**: `app/api/pipelines/[id]/execute-flow/route.ts`
- In `generateNodeImplementation()`, generate `REASONING.md` alongside `IMPLEMENTATION.md`
- Templates are **role-specific**:

**Proposer:**
```markdown
# Reasoning — {label}
## What problem am I solving?
## What approaches did I consider?
## Why this approach over alternatives?
## What assumptions am I making?
```

**Enhancer:**
```markdown
# Reasoning — {label}
## What gaps or risks did I identify?
## What improvements did I suggest?
## What edge cases did I consider?
```

**Architect:**
```markdown
# Reasoning — {label}
## What architecture did I choose and why?
## What components / modules are needed?
## What data flows between components?
## What trade-offs did I make?
```

**Planner:**
```markdown
# Reasoning — {label}
## How did I break down the work?
## What are the dependencies between tasks?
## What's the estimated effort per task?
```

**Implementer:**
```markdown
# Reasoning — {label}
## What's my implementation strategy?
## What edge cases am I handling?
## What tests cover this?
## What could go wrong?
```

**Code Reviewer:**
```markdown
# Reasoning — {label}
## What did I check?
## What issues did I find?
## Severity and risk level?
## Suggestions for improvement?
```

**Tester:**
```markdown
# Reasoning — {label}
## What test strategy did I use?
## What scenarios are covered?
## What's not covered and why?
```

**Documenter:**
```markdown
# Reasoning — {label}
## What needs documentation?
## Who is the audience?
## What examples are most helpful?
```

**Deployer:**
```markdown
# Reasoning — {label}
## What's the deploy strategy?
## What rollback plan exists?
## What monitoring is in place?
```

### B.2 Fallback template
If the role is unrecognized, use a generic:
```markdown
# Reasoning — {label}
## What I understand about this task
## Key decisions I made
## Trade-offs considered
## Why this approach
## What could go wrong
```

---

## Phase C: Enrich Flow-Status + Expandable DAG Cards

### C.1 Backend — enrich flow-status with phase content
- **File**: `app/api/pipelines/[id]/flow-status/route.ts`
- Read per phase:
  - `IMPLEMENTATION.md` — full content
  - `REASONING.md` — full content
  - File list from phase directory
  - `output.log` — last 2000 chars for preview
- Return enriched phase objects:
```ts
phase: {
  status: "running",
  pid: 12345,
  prompt: "Build a REST API...",
  fileRefs: [{ path: "src/api.ts", type: "file", name: "api.ts" }],
  selectedSkills: ["ponytail"],
  selectedMcps: ["context7"],
  implementation: "# Agent: Implementer...",
  reasoning: "# Reasoning\n\n## What I understand...",
  artifacts: ["IMPLEMENTATION.md", "REASONING.md", "output.log"],
  outputPreview: "Compiled successfully...",
  hasWalkthrough: false,
}
```

### C.2 Frontend — expandable DAG cards (visualize page + builder canvas)
- **File**: `app/pipelines/[id]/visualize/page.tsx`
- Each DAG node card gets a click-to-expand toggle
- **Collapsed** state shows: agent, label, status badge, skills count, file count
- **Expanded** state shows:
  - Full prompt (not truncated)
  - Referenced files with path links
  - Selected MCPs
  - IMPLEMENTATION.md content (read-only preview)
  - REASONING.md content
  - Output log preview
  - Phase directory artifacts list
  - "Retry" button if failed
  - "Skip" button if failed

- **File**: `components/pipeline-builder/AgentNode.tsx`
- DAG node cards in the **builder** also become expandable (inline, not just via side panel)
- Click the card body (not the drag handle) to expand/collapse
- Shows full prompt, files, MCPs inline

---

## Phase D: Execution Cascade & Error Recovery

### D.1 Backend — cascade to next node on completion
- **File**: `app/api/pipelines/[id]/execute-flow/route.ts`
- In the `proc.on("close")` handler:
  - Read `pipeline-flow.json`
  - Find completed node's position in the DAG order
  - Find the next node(s) in topological order whose dependencies are all met
  - Spawn the next ready node's agent process
  - Update flow status: new node → "running", captures PID
  - Repeat until all nodes are done or a node fails

### D.2 Backend — handle branching DAGs
- If a node has multiple successors (branching), all successors become "ready" when it completes
- If a node has multiple predecessors (join), wait for all predecessors to complete before starting it

### D.3 Backend — retry logic
- Add `retryCount` to each phase in `pipeline-flow.json`
- **New endpoint**: `POST /api/pipelines/[id]/phases/[nodeId]/retry`
  - Resets phase status to "ready", increments retry counter
  - Re-runs `opencode run` on that node's IMPLEMENTATION.md
  - Returns new PID

### D.4 Backend — skip logic
- **New endpoint**: `POST /api/pipelines/[id]/phases/[nodeId]/skip`
  - Marks phase as "skipped"
  - Checks if the next node(s) can now proceed (cascade logic)
  - If yes, spawns the next ready node

### D.5 Frontend — retry + skip buttons
- **File**: `app/pipelines/[id]/visualize/page.tsx`
- On failed nodes: "Retry" button (calls retry endpoint)
- On failed or stuck nodes: "Skip" button (marks skipped, advances DAG)
- On running nodes: "Cancel" button (kills process, marks failed)

### D.6 Auto-retry setting
- **File**: `components/pipeline-builder/BuilderSettings.tsx`
- Add "Auto-retry failed nodes" toggle (default: off)
- Add "Max retries" slider (1-5, default: 2)
- When enabled, execute-flow auto-retries failed nodes up to the max

---

## Phase E: Pipeline Template System

### E.1 Data model
- **File**: `components/pipeline-builder/types.ts`
```ts
export interface PipelineTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];          // ["quick", "full", "review", "deploy"]
  nodes: any[];
  edges: any[];
  createdAt: string;
  updatedAt: string;
}
```

### E.2 Template storage
- Stored in `~/AI_Workflow/config/templates/{id}.json`
- **Export**: download a template as `{name}.json` (portable, shareable)
- **Import**: upload a `.json` file to add it to local templates

### E.3 Backend — templates API
- **New file**: `app/api/templates/route.ts`
  - `GET /api/templates` — list all templates (sorted by name)
  - `POST /api/templates` — create (body: name, description, category, tags, nodes, edges)
- **New file**: `app/api/templates/[id]/route.ts`
  - `GET /api/templates/[id]` — get single template
  - `PUT /api/templates/[id]` — update
  - `DELETE /api/templates/[id]` — delete
- **New file**: `app/api/templates/import/route.ts`
  - `POST /api/templates/import` — import from uploaded JSON
- **New file**: `app/api/templates/export/route.ts` (or frontend-side download)

### E.4 Preset templates
Pre-seeded on first run (if directory empty):

| Template | Nodes | Tags | Category |
|----------|-------|------|----------|
| **Quick Dev** | Plan → Implement | `#quick`, `#dev` | feature |
| **Full Delivery** | Propose → Enhance → Plan → Review Plan → Implement | `#full`, `#production` | feature |
| **Quality Flow** | Implement → Code Review → Fix → Test | `#quality`, `#review` | bug-fix |
| **Design First** | Research → Architect → Plan → Implement | `#design`, `#architecture` | feature |
| **Review Pipeline** | Implement → Code Review → Deploy | `#review`, `#deploy` | hotfix |
| **Documentation** | Analyze → Document | `#docs`, `#quick` | documentation |
| **Research Spike** | Research → Report | `#research`, `#quick` | research |
| **Bug Fix** | Diagnose → Fix → Test | `#bug`, `#fix`, `#quick` | bug-fix |

### E.5 Frontend — template browser dialog
- **File**: `app/pipelines/builder/page.tsx`
- "Templates" button in top bar opens a dialog with:
  - **Grid view** of template cards
  - Each card: name, description, category badge, tag pills, node count
  - **Search bar** to filter by name/tag
  - **Category tabs** (All, Feature, Bug Fix, Documentation, Research)
  - **"Load Template"** — replaces canvas with template DAG
  - **"Save as Template"** — saves current canvas as a new template

### E.6 Frontend — save as template dialog
- Small dialog asking for: name, description, category, tags
- Validates name is unique
- Saves current nodes + edges from canvas

### E.7 Frontend — edit/delete template
- In template browser, each card has a dropdown menu:
  - Edit: opens rename/redescription dialog
  - Delete: confirmation dialog, removes template file
  - Export: downloads as .json

---

## Phase F: Smart Suggestions Per Agent

### F.1 Backend — role suggestions API
- **New file**: `app/api/templates/suggestions/route.ts`
  - `GET /api/templates/suggestions?agentId=hermes-nous`
  - Returns suggested roles + prompt templates + suggested label

### F.2 Suggestion data
```ts
const AGENT_SUGGESTIONS = {
  "hermes-nous": {
    roles: [
      { role: "Proposer", label: "Proposal", prompt: "Analyze the request and create a detailed proposal..." },
      { role: "Architect", label: "Architecture", prompt: "Design the technical architecture..." },
      { role: "Enhancer", label: "Enhancement", prompt: "Review the proposal and enhance it..." },
      { role: "Planner", label: "Planning", prompt: "Create a detailed implementation plan..." },
    ],
  },
  "opencode-developer": {
    roles: [
      { role: "Implementer", label: "Implementation", prompt: "Implement the solution..." },
      { role: "Tester", label: "Testing", prompt: "Write and run tests..." },
      { role: "Fixer", label: "Bug Fix", prompt: "Diagnose and fix the issue..." },
    ],
  },
  "opencode-plan": {
    roles: [
      { role: "Planner", label: "Planning", prompt: "Break down the requirements into tasks..." },
    ],
  },
  "antigravity": {
    roles: [
      { role: "Code Reviewer", label: "Code Review", prompt: "Review the implementation..." },
      { role: "Plan Reviewer", label: "Plan Review", prompt: "Review the plan..." },
      { role: "Quality Checker", label: "Quality Check", prompt: "Perform a quality audit..." },
    ],
  },
  "claude": {
    roles: [
      { role: "Implementer", label: "Implementation", prompt: "Implement using Claude Code..." },
      { role: "Code Reviewer", label: "Code Review", prompt: "Review code quality..." },
      { role: "Documenter", label: "Documentation", prompt: "Write comprehensive documentation..." },
    ],
  },
};
```

### F.3 Frontend — suggestion UI in ConfigPanel
- **File**: `components/pipeline-builder/ConfigPanel.tsx`
- When user changes the agent dropdown:
  - Fetch suggestions from API
  - Show role suggestion buttons below the agent selector
  - Each button: role icon + name
  - Clicking a button:
    - Sets label to the role name
    - Fills prompt with the default template
  - Always keep manual override ability

### F.4 Suggestion on palette click
- **File**: `components/pipeline-builder/NodePalette.tsx`
- When clicking an agent in the palette, show a quick role picker before adding the node
- Small popover: "Pick a role for this agent" with the suggestions
- Or "Quick Add" to use default

---

## Phase G: Read-Only React Flow DAG on Visualize Page

### G.1 Frontend — replace flat DAG cards with React Flow
- **File**: `app/pipelines/[id]/visualize/page.tsx`
- Replace the current `div.flex.flex-wrap.gap-3` DAG layout with a **read-only React Flow canvas**
- Import `@xyflow/react` (already installed)
- Container: `h-[400px]` with border, rounded corners

### G.2 ReadOnlyNode component
- **New file**: `components/pipeline-builder/ReadOnlyNode.tsx`
- Based on AgentNode but:
  - No drag handles (not interactive)
  - No Handle components (no ports)
  - Status badge prominently in the header
  - Click handler opens phase detail side panel
  - Same visual style: agent color, label, prompt preview, skills/files badges
  - Shows reasoning badge if REASONING.md exists

### G.3 Phase detail side panel
- **New file or inline in visualize page**: side panel or modal
- When a DAG node is clicked:
  - Slides open from the right (like current ConfigPanel)
  - Shows:
    - **Header**: agent, label, status, PID, duration
    - **Prompt tab**: full implementation prompt
    - **Reasoning tab**: REASONING.md content
    - **Files tab**: referenced files + phase directory artifacts
    - **Skills/MCPs tab**: what was toggled
    - **Output tab**: output.log content
  - Action buttons: Retry (if failed), Skip (if failed/stuck), View in Builder (link)

### G.4 Controls
- MiniMap for overview
- Zoom controls (fit view, zoom in/out)
- Background dots
- No selection, no editing, no dragging

---

## Phase H: Standard Pipeline Template Integration

### H.1 Backend — accept templateId on pipeline creation
- **File**: `app/api/pipelines/route.ts` (POST)
- Accept `templateId` field
- When present:
  - Load the template from `~/AI_Workflow/config/templates/{templateId}.json`
  - Store its `nodes` and `edges` as `builder-layout.json`
  - Generate phases from template nodes
  - Save as a builder-type pipeline (so visualize page shows DAG)

### H.2 Frontend — template picker in New Pipeline dialog
- **File**: `app/pipelines/page.tsx`
- In "New Pipeline" dialog, add "Templates" tab
- Shows same template grid as Flow Builder
- Selecting a template:
  - Sets the project
  - Sets the prompt from template description
  - Shows "Create from Template" button
  - On create, calls POST with `templateId` and routes to visualize

---

## File Change Summary

| File | Phase | Change |
|------|-------|--------|
| `app/pipelines/[id]/visualize/page.tsx` | A, C, D, G | Project path, expandable cards, retry/skip buttons, read-only React Flow |
| `app/api/pipelines/[id]/flow-status/route.ts` | C | Enrich with IMPLEMENTATION.md, REASONING.md, output, artifacts |
| `app/api/pipelines/[id]/execute-flow/route.ts` | B, D | Generate REASONING.md, execution cascade, retry, retry count |
| `app/api/pipelines/[id]/phases/[nodeId]/retry/route.ts` | D | New: retry single node |
| `app/api/pipelines/[id]/phases/[nodeId]/skip/route.ts` | D | New: skip single node |
| `components/pipeline-builder/AgentNode.tsx` | C | Inline expandable cards |
| `components/pipeline-builder/ReadOnlyNode.tsx` | G | New: read-only DAG node |
| `components/pipeline-builder/types.ts` | E | Add PipelineTemplate type |
| `app/api/templates/route.ts` | E | New: list + create templates |
| `app/api/templates/[id]/route.ts` | E | New: get + update + delete |
| `app/api/templates/import/route.ts` | E | New: import template |
| `app/api/templates/suggestions/route.ts` | F | New: agent role suggestions |
| `app/pipelines/builder/page.tsx` | E, F | Template browser, save dialog |
| `app/pipelines/page.tsx` | E, H | Template picker in New Pipeline dialog |
| `components/pipeline-builder/ConfigPanel.tsx` | F | Role suggestion UI |
| `components/pipeline-builder/BuilderSettings.tsx` | D | Auto-retry setting |
| `app/api/pipelines/route.ts` | H | Accept templateId |
