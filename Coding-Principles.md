# PAOS AI_Workflow — Coding Principles

> **Version**: 1.0
> **Scope**: Entire PAOS ecosystem — Hermes Agent, Dashboard, Pipeline System, Agent Framework
> **Purpose**: A unified architectural constitution that grounds every engineering decision in foundational CS, math, and design principles.

---

## Table of Contents

1. [Object-Oriented Programming](#1-object-oriented-programming)
2. [Data Structures](#2-data-structures)
3. [Graph Theory & Discrete Mathematics](#3-graph-theory--discrete-mathematics)
4. [Linear Algebra](#4-linear-algebra)
5. [Digital Logic & Design](#5-digital-logic--design)
6. [Numerical Analysis](#6-numerical-analysis)
7. [System Analysis & Design](#7-system-analysis--design)
8. [Database Systems (File-as-Database Model)](#8-database-systems-file-as-database-model)
9. [Calculus I–III](#9-calculus-i-iii)
10. [Human Error & UX/UI](#10-human-error--uxui)

---

## 1. Object-Oriented Programming

### 1.1 Encapsulation

**Principle:** Every module hides its internal state and exposes only purposeful interfaces. Consumers interact through contracts, not internals.

**PAOS Application:**

| Component | Public Interface | Hidden Internals |
|-----------|-----------------|------------------|
| Pipeline Node | `label`, `agentId`, `prompt`, `selectedSkills` | `nodeColor`, `flowStatus`, `flowPid` |
| ConfigPanel | `onUpdate`, `onDelete` props | Internal form state, suggestion caching |
| FlowCanvas | `onSave`, `settings` props | Internal nodes/edges state, undo history |
| Queue | `enqueue`, `dequeue`, `done` actions | `queue.json` file layout, serialization format |

**Rule:** If a consumer can break your internal state by calling a method, that method should not exist. API endpoints guard their internal file structures — the queue API never exposes the raw JSON path to clients.

### 1.2 Inheritance

**Principle:** Shared behavior lives in base classes; specializations extend without modifying the base.

**PAOS Application:**

```
AgentNode (base)
├── ReadOnlyNode (DAG view — no interaction, shows status)
├── AgentNode (Flow Builder — draggable, configurable)
└── [Future]: MCPNode, SkillNode, GateNode
```

The React Flow node types follow this naturally — `nodeTypes` registry allows adding new node types without modifying the canvas logic.

**Rule:** Prefer composition over inheritance for behavioral reuse. Use inheritance only for "is-a" relationships, not "has-a".

### 1.3 Polymorphism

**Principle:** Different implementations satisfy the same interface. Callers don't care which concrete type they're using.

**PAOS Application:**

```typescript
type AgentProvider = {
  id: string;
  name: string;
  execute: (prompt: string, options: ExecOptions) => Promise<ExecResult>;
};
```

- `hermes-nous` — Hermes Agent
- `opencode-developer` — OpenCode CLI
- `codex` — Codex CLI
- `claude-code` — Claude Code CLI

The pipeline engine treats all agents the same: `spawnNode` doesn't know or care which agent it's running.

**Rule:** If you find yourself writing `if (agentType === "hermes") { ... } else if (agentType === "opencode") { ... }`, you've violated this. Extract the variant into a strategy, factory, or plugin.

### 1.4 Abstraction

**Principle:** Every entity represents a coherent abstraction, not a leaky collection of implementation details.

**PAOS Application:**
- A `Phase` is not a directory path — it's a unit of work with status, artifacts, and agent
- A `Pipeline` is not a folder on disk — it's a directed acyclic graph of phases
- A `Node` is not a position on screen — it's an agent configuration with execution semantics

The API layer bridges abstractions to filesystem: `GET /api/pipelines/[id]` returns a coherent pipeline object, not raw file contents. The frontend never constructs file paths.

### 1.5 SOLID Principles

| Principle | PAOS Example |
|-----------|-------------|
| **S**ingle Responsibility | Each API route handles exactly one resource. `execute-flow/route.ts` only orchestrates execution; it doesn't render UI or manage queue state. |
| **O**pen for Extension | New agent types register via `AVAILABLE_AGENTS` array. New template categories extend `TEMPLATE_CATEGORIES`. No core code changes needed. |
| **L**iskov Substitution | Any React Flow node type can replace another as long as it accepts `data` and fires `onUpdate`. ReadOnlyNode and AgentNode are interchangeable. |
| **I**nterface Segregation | FileTreeExplorer accepts `projectPath`, `selectedFiles`, `onToggleFile` — not a whole pipeline object with irrelevant fields. |
| **D**ependency Inversion | Canvas depends on `onSave: (layout) => void` (an abstraction), not on a specific API endpoint. The builder page wires the concrete fetch call. |

---

## 2. Data Structures

### 2.1 Directed Acyclic Graph (DAG)

**When to use:** Pipeline topology, dependency resolution, execution ordering.

**PAOS Location:** `builder-layout.json` — `{ nodes: [...], edges: [...] }`

**Operations:**
- **Topological sort** (Kahn's algorithm): determine execution order from edges
- **Reachability query**: which nodes depend on a given node?
- **Critical path**: what's the longest chain of sequential dependencies?

```typescript
// Kahn's algorithm — BFS-based, handles branching
function topoSort(nodes, edges): string[] {
  const inDegree = new Map();
  const adj = new Map();
  // ... process nodes with zero in-degree first
  while (queue.length > 0) {
    const id = queue.shift()!;
    order.push(id);
    for (const next of adj.get(id) || []) {
      // decrement in-degree, add to queue when zero
    }
  }
  return order;
}
```

**Benchmark:** O(V + E) time, O(V) space.

### 2.2 Queue

**When to use:** Pipeline execution scheduling, task processing, serialized work.

**PAOS Location:** `queue.json` — `{ pending: QueueItem[], running: QueueItem | null, done: QueueItem[] }`

**Operations:**
- **Enqueue**: add to pending (O(1) via unshift — array push then reverse read, or just unshift)
- **Dequeue**: shift from pending, set as running (O(n) shift — fine for small queues)
- **Complete**: move from running to done (O(1))
- **Validate**: cross-check each pending item's pipeline exists on disk

**Benchmark:** O(n) dequeue is acceptable for < 100 items. For larger scales, use a proper linked list or dedicated queue service.

### 2.3 Linked List

**When to use:** Phase ordering within a pipeline, sequential artifact chains, undo history.

**PAOS Location:** The pipeline execution cascade is conceptually a linked list — each node's completion triggers the next.

```
n1.completed → n2.completed → n3.completed → null
```

If a node fails, the chain breaks and requires retry/skip intervention.

### 2.4 Hash Map (Dictionary)

**When to use:** Agent lookup by ID, skill registry, MCP server lookup, phase status lookup by node ID.

**PAOS Location:** `flowStatus.phases[nodeId]`, `AVAILABLE_AGENTS.find()`, `nodeMap.get(nodeId)`

**Operations:**
- **Get**: O(1) average
- **Set**: O(1) average
- **Iterate**: O(n)

**Rule:** Use Map, not plain objects, when keys are dynamic strings from untrusted sources. Use objects only when the shape is known at code-writing time.

### 2.5 Tree

**When to use:** File system explorer, project directory structure, artifact hierarchy.

**PAOS Location:** `FileTreeExplorer.tsx` renders a recursive `TreeNode[]`

```
projects/PAOS/
├── dashboard/
│   ├── app/
│   ├── components/
│   └── package.json
├── vault/
├── secrets/
└── events.md
```

**Rule:** Trees are recursive data structures. Render them with recursive components. Each node is self-contained — it doesn't need to know about its parent or siblings to render correctly.

### 2.6 Set

**When to use:** Unique skill collections, visited node tracking in graph algorithms, deduplication.

**PAOS Location:** `visited.has(nodeId)` in topological sort, `hasIncoming` edge set

**Operations:**
- **Add**: O(1)
- **Has**: O(1)
- **Delete**: O(1)

---

## 3. Graph Theory & Discrete Mathematics

### 3.1 Topological Sorting (Hasse Diagrams)

**Principle:** A partial order over DAG nodes gives a linear execution order respecting all dependencies.

**When to use:** Every time a pipeline is executed or displayed.

**Algorithm choice:** **Kahn's algorithm** (BFS-based) over DFS-based post-order because:
- Handles branching naturally (multiple root nodes)
- Detects cycles (if result has fewer nodes than input)
- Produces order without reversing

**Cycle detection:** If `topoSort` returns fewer nodes than input, a cycle exists. The system should reject cyclic pipelines.

### 3.2 Finite State Machines (FSM)

**Principle:** Every pipeline node exists in exactly one state at a time. Transitions are deterministic.

**PAOS Node States:**

```
            ┌─────────────────────────────────┐
            │                                 │
            v                                 │
   PENDING ──► READY ──► RUNNING ──► COMPLETED
                              │
                              ▼
                            FAILED ──► (retry → RUNNING)
                              │
                              ▼
                            SKIPPED
```

**Transitions:**
- `PENDING → READY`: All predecessors completed
- `READY → RUNNING`: Spawned by cascade
- `RUNNING → COMPLETED`: Process exited with code 0
- `RUNNING → FAILED`: Process exited with non-zero
- `FAILED → RUNNING`: User clicked Retry
- `FAILED → SKIPPED`: User clicked Skip

### 3.3 Set Theory & Boolean Algebra

**Principle:** Agent capabilities, skill selections, and permission checks use set operations.

**PAOS Application:**
- `selectedSkills ⊆ availableSkills` (a node can only select from available)
- `selectedMcps ⊆ availableMcps`
- Pipeline `phases` is an ordered set (array) preserving topological sequence
- Intersection: which skills are selected across multiple nodes?
- Union: what MCPs does the whole pipeline need?

### 3.4 Combinatorics

**Principle:** Template combinations, pipeline permutations, agent assignment counts.

**PAOS Application:**
- 8 template presets × 10 agent roles = 80 pipeline configurations
- N nodes with M possible agents = M^N possible assignments (use templates to reduce this)
- Editor phase count: combinations of skills, MCPs, file refs form a configuration space

**Rule:** Exponentially growing spaces require constraints (templates, presets, defaults) to remain usable.

---

## 4. Linear Algebra

### 4.1 Vectors

**Principle:** Agent capability profiles as vectors for comparison.

**PAOS Application:** `[skills, mcps, fileRefs, promptEmbedding]` forms a feature vector for each node. Similarity between nodes can guide template suggestions.

```typescript
interface AgentVector {
  skills: number[];        // one-hot or embedding
  mcps: number[];          // one-hot  
  promptLength: number;    // scalar
  fileCount: number;       // scalar
}
```

### 4.2 Coordinate Transforms

**Principle:** React Flow viewport transforms (pan/zoom) are affine transformations.

**PAOS Application:** `reactFlowInstance.getViewport()` returns `{ x, y, zoom }`. Saving and restoring layout requires preserving these coordinates. Zoom-to-fit is a scaling transformation.

```typescript
// Model → screen coordinate transform
screenX = modelX * zoom + panX;
screenY = modelY * zoom + panY;
```

### 4.3 Distance Metrics

**Principle:** Template similarity, node clustering, layout optimization.

**PAOS Application:**
- Manhattan distance for grid-aligned node layout
- Euclidean distance for free-form layouts
- Cosine similarity for prompt matching

---

## 5. Digital Logic & Design

### 5.1 Finite State Machines (FSM)

(See §3.2 — FSM applies equally to digital logic design concepts)

### 5.2 Combinatorial Logic

**Principle:** Output depends only on current inputs (no memory).

**PAOS Application:**
- Permission checks: `canExecute(pipeline) = hasBuilderLayout && (status === "submitted" || status === "completed_with_errors")`
- Button visibility: `showExecute = hasBuilderLayout && !executing && status !== "completed"`
- Filter logic: `validTemplates = templates.filter(t => !category || t.category === category)`

### 5.3 Sequential Logic

**Principle:** Output depends on current inputs AND past state (has memory).

**PAOS Application:**
- Pipeline execution cascade — each node's state depends on previous node completion
- Agent task progress — task 3/5 status depends on tasks 1-2
- Edge animation — animates only when source completed but target not

```typescript
// Sequential: animation depends on both source AND target state
const shouldAnimate = 
  (srcPhase?.status === "completed" && tgtPhase?.status !== "completed") ||
  (srcPhase?.status === "running" && tgtPhase?.status !== "completed");
```

### 5.4 Register Transfer

**Principle:** State is stored in registers (files) and transferred between modules.

**PAOS Application:** META.json, pipeline-flow.json, queue.json act as state registers. Transfers happen via API reads/writes. Cache invalidation follows register update patterns — when META.json changes, re-read it; don't keep stale copies.

---

## 6. Numerical Analysis

### 6.1 Floating-Point Precision

**Principle:** Avoid equality comparisons on floats. Use epsilon-based comparison.

**PAOS Application:**
```typescript
// Slider values with step=0.005
// BAD: if (value === 0.03) { ... }
// GOOD: if (Math.abs(value - 0.03) < 0.001) { ... }
// BEST: round to nearest step before comparison
const rounded = Math.round(next / step) * step;
```

### 6.2 Error Bounds

**Principle:** Agent outputs have inherent uncertainty. Bound it.

**PAOS Application:**
- Progress is approximate: `"3/5"` means "task 3 of 5" not "60% confident"
- Agent output may contain hallucinated file paths or code
- Pipeline cascade uses binary pass/fail, not partial credit
- Error recovery: retry with same prompt, skip with manual intervention

### 6.3 Convergence

**Principle:** Multi-agent consensus requires convergence criteria.

**PAOS Application:**
- If two agents produce conflicting analyses, convergence requires:
  1. A tie-breaking mechanism (last agent's output wins)
  2. A diff comparison (show both versions, let user decide)
  3. A voting mechanism (3 agents, majority) — future feature

---

## 7. System Analysis & Design

### 7.1 Data Flow Diagrams (DFD)

**Principle:** Data moves through the system in predictable paths.

**PAOS Top-Level DFD:**

```
[User] → (Builder Page) → (API Route) → (File System)
                                   ↓
                             (Agent Process) → (Phase Files)
                                   ↓
                             (Visualize Page) ← (API Route)
```

**Level 1 — Pipeline Execution Flow:**
```
[User clicks Execute]
       ↓
[Canvas] → POST /api/pipelines/[id]/execute-flow
       ↓
[Execute Flow Route] → Reads builder-layout.json
       ↓
[Topological Sort] → Determines phase order
       ↓
[Phase Dir Creation] → Writes IMPLEMENTATION.md, TASKS.md, REASONING.md
       ↓
[Agent Spawn] → child_process.spawn(agent, [prompt, ...])
       ↓
[Status Polling] ← Canvas polls /api/pipelines/[id]/flow-status every 2s
       ↓
[Cascade] → On completion, spawn next node
       ↓
[Complete] → Update META.json, pipeline-flow.json, queue.json
```

### 7.2 Entity-Relationship Diagram (ERD)

**PAOS ERD:**

```
Project 1───* Pipeline 1───* Phase 1───* Artifact
                                     └───* AgentInstance
                                          ├── Process (PID)
                                          ├── Output (output.log)
                                          └── Status (flowStatus)
```

### 7.3 Architectural Patterns

**Pattern** | **Where Used** | **Why**
------------|----------------|--------
**Event-Driven** | Pipeline cascade, WebSocket polling | Nodes emit "completed" → cascade handler picks up
**Layered** | Dashboard: Page → Component → API → Filesystem | Each layer depends only on the layer below
**Repository** | `/api/pipelines` routes read/write filesystem | File system is the data store; routes are the repository
**Strategy** | Agent types (hermes, opencode, codex, claude) | All implement the same `execute` contract
**Factory** | Node creation in Canvas (`addNode`) | Creates typed nodes from configuration
**Observer** | FlowCanvas polls status every 2s | Polling simulates event-driven reactivity
**Dependency Injection** | Props flow down through React tree | Canvas receives `onSave`, `settings`, `visualSettings` as props

### 7.4 Coupling & Cohesion

**Principle:** High cohesion within modules, loose coupling between modules.

| Module | Cohesion | Coupling |
|--------|----------|----------|
| `Canvas.tsx` | High — all about DAG rendering and interaction | Low — depends on props and React Flow |
| `ConfigPanel.tsx` | High — all about node configuration | Low — receives `node` + `onUpdate`, returns changes |
| `execute-flow/route.ts` | High — all about execution orchestration | Low — reads files, spawns processes, returns status |
| `queue/route.ts` | Medium — queue operations + cleanup | Low — depends only on queue.json path |

**Rule:** If a file imports from 10+ different modules, it's likely doing too much. Split it.

### 7.5 Separation of Concerns

**PAOS Separation:**

| Concern | File(s) | Handles |
|---------|---------|---------|
| Pipeline definition | `builder-layout.json` | What to execute (nodes + edges) |
| Execution state | `pipeline-flow.json` | Current status of each node |
| Queue | `queue.json` | Which pipelines are waiting/running/done |
| Meta | `META.json` | Pipeline metadata, artifacts list |
| User interface | `*.tsx` files | Rendering, interaction, polling |
| Business logic | `*/route.ts` files | Validation, orchestration, file I/O |

**Rule:** Never mix UI rendering with business logic. A React component should never call `readFile` or `spawn`. A route handler should never render HTML.

---

## 8. Database Systems (File-as-Database Model)

### 8.1 The PAOS Fabric Model

PAOS uses the filesystem as its database. Every directory is a table, every file is a row.

```filesystem
memory/pipelines/PAOS/          ← "Database" — project workspace
├── PIPE-25-06-2026---19-42/    ← "Row" — pipeline record
│   ├── META.json               ← "Primary key" — pipeline metadata
│   ├── pipeline-flow.json      ← "Index" — execution state
│   ├── builder-layout.json     ← "Column" — DAG definition
│   ├── pipeline.json           ← "Index" — progress tracking
│   ├── TASKS.md                ← "Join table" — cross-phase tasks
│   └── phases/                 ← "Foreign table" — phase records
│       ├── n1/                 ← "Row" — phase instance
│       │   ├── IMPLEMENTATION.md
│       │   ├── REASONING.md
│       │   └── output.log
│       └── n2/
└── queue.json                  ← "Queue table"
```

### 8.2 ACID Properties

| Property | PAOS Implementation |
|----------|-------------------|
| **Atomicity** | Each file write is atomic on most filesystems. For multi-file writes (META.json + pipeline-flow.json), a crash may leave inconsistent state. Mitigation: write the less-critical file first (pipeline-flow), then the critical one (META.json). |
| **Consistency** | Schema validation happens at read time. Missing fields default to safe values (`"pending"`, `"unknown"`, `[]`). |
| **Isolation** | No concurrent writes to the same pipeline — execute-flow runs one pipeline at a time. File locks are not implemented (future: `lockfile`). |
| **Durability** | `writeFile` with `utf-8` guarantees data reaches disk (barring OS crash). No WAL, no replication. |

### 8.3 Indexing Strategy

PAOS indexing is directory-structure-based:

| Query Pattern | Index Method | Example |
|---------------|-------------|---------|
| "Find pipeline by ID" | Directory lookup | `/memory/pipelines/PAOS/PIPE-xxx/` |
| "Find all projects" | Directory listing | `readdir(memory/pipelines/)` |
| "Find pending pipelines" | Queue file | `readFile(queue.json)` |
| "Find phase files" | Directory listing | `readdir(phases/n1/)` |
| "Find META.json" | Fixed path | `join(dir, "META.json")` |

**Rule:** O(1) lookup by ID. O(n) scan for aggregates. If n > 10,000, add proper indexing (dedicated database).

### 8.4 Query Patterns

| Operation | File System Equivalent | Code |
|-----------|----------------------|------|
| SELECT | `readFile` + `JSON.parse` | `const meta = JSON.parse(await readFile(metaPath))` |
| INSERT | `writeFile` | `await writeFile(path, JSON.stringify(data))` |
| UPDATE | `writeFile` (overwrite) | `meta.status = "completed"; await writeFile(path, ...)` |
| DELETE | `rm` | `await rm(dir, { recursive: true })` |
| JOIN | Read multiple files, merge in memory | `phases.map(p => ({...p, ...artifact}))` |
| GROUP BY | `readdir` → filter → count | `dirs.filter(d => d.startsWith("PIPE-")).length` |
| ORDER BY | Sort in memory | `phases.sort((a,b) => a.order - b.order)` |

### 8.5 Transactions

**Principle:** Group related writes so partial failures don't leave inconsistent state.

**PAOS Implementation:** For multi-file updates (e.g., completing a phase), write in a specific order that minimizes inconsistency:

1. Write `pipeline-flow.json` (temporary state — safe to re-read)
2. Write `phase/OUTPUT.md`, `phase/WALKTHROUGH.md` (phase artifacts)
3. Write `META.json` (authoritative state — write this LAST)

If crash occurs after step 3 but before step 2, the system re-reads META.json and sees "completed" — the phase artifacts will be re-generated on next read.

---

## 9. Calculus I–III

### 9.1 Rate of Change (Derivatives) — Calculus I

**Principle:** Measure how fast the system is changing.

**PAOS Application:**
- **Pipeline progress velocity**: `Δ(completedTasks) / Δ(time)` — how fast tasks complete
- **Agent output rate**: `Δ(outputCharacters) / Δ(time)` — how fast agents produce content
- **Queue drain rate**: `Δ(pendingCount) / Δ(time)` — how fast the queue is processing
- **Phase completion derivative**: first derivative = completion rate, second derivative = acceleration/deceleration

### 9.2 Accumulation (Integrals) — Calculus II

**Principle:** Sum continuous change over time.

**PAOS Application:**
- **Cumulative agent output**: integral of output rate over time = total content produced
- **Total pipeline cost**: integral of compute time × resource cost over execution duration
- **Aggregated status**: integral of "running time" across all phases = total execution time
- **Moving average**: integral of recent progress values / window = smoothed progress

### 9.3 Multivariable Optimization — Calculus III

**Principle:** Optimize multiple interdependent variables simultaneously.

**PAOS Application:**
- **Pipeline configuration space**: `f(agent, skills, mcps, prompt, fileRefs)` — which combination gives the best output?
- **Resource allocation**: `g(nodes, agents, parallelBranches)` — how many parallel agents can run without resource contention?
- **Cost-benefit**: `h(accuracy, time, tokens)` — trade-off between quality, speed, and cost

**Gradient Descent Concept:** Each pipeline execution is one step. Retry with adjusted parameters is a gradient step toward better output.

---

## 10. Human Error & UX/UI

### 10.1 Nielsen's 10 Usability Heuristics

| Heuristic | PAOS Application |
|-----------|-----------------|
| **1. Visibility of system status** | Real-time status polling (2s interval), progress bars on running nodes, PID display, state badges (Pending→Ready→Running→Completed) |
| **2. Match between system and real world** | DAG nodes look like cards, edges look like connections, drag-and-drop matches mental model of "building a flow" |
| **3. User control and freedom** | Undo (clear canvas), retry/skip on failed nodes, cancel import, "Back to Pipelines" link, editable pipeline name |
| **4. Consistency and standards** | shadcn/ui components throughout, same visual settings on builder + visualize, gold (#f0b90b) primary color, consistent border/background patterns |
| **5. Error prevention** | Type `{name}_Delete` to confirm deletion, required field validation on import, cycle detection on pipeline save |
| **6. Recognition over recall** | Template browser shows previews, Load Pipeline lists available pipelines, file explorer shows directory tree |
| **7. Flexibility and efficiency of use** | Scroll-wheel on all sliders, keyboard shortcuts, template system for power users, load pipeline from queue |
| **8. Aesthetic and minimalist design** | Dark theme, gold accent, no redundant controls, progressive disclosure (config panel tabs, expandable phase cards) |
| **9. Help users recognize, diagnose, and recover from errors** | Failed nodes show error + retry/skip buttons, API errors shown inline, task progress marks specific failing steps |
| **10. Help and documentation** | Pipeline naming convention visible, tooltip on filesystem path, intervene note system for agent guidance |

### 10.2 Error Recovery Patterns

| Error | Recovery Mechanism | UX |
|-------|-------------------|-----|
| Agent process fails | Retry button | One click to re-run with same prompt |
| Agent produces bad output | Skip button | Skip to next phase |
| Pipeline save fails | Alert with error message | Show exact error, don't clear form |
| Network timeout | Auto-retry (3s polling) | User sees "Retrying..." |
| Phase directory missing | Auto-create on access | Transparent to user |
| Queue inconsistency | Auto-clean on read | Never shown to user |

### 10.3 Affordances & Signifiers

| Element | Affordance | Visual Cue |
|---------|-----------|------------|
| Node handle | Connect to another node | Circle on edge of card, visible on hover |
| Slider | Adjust value | Thumb, track, + scroll wheel |
| DAG node | Click to select | Hover highlight, border color |
| Template card | Click to load | Finger cursor, hover shadow |
| Trash icon | Delete | Red color, icon |
| Save button | Persist | Primary color, in top bar |

### 10.4 Responsive Design

**Principle:** The system must work at all screen sizes from 390px (mobile) to 3840px (4K).

**PAOS Implementation:**
- CSS `max-w-4xl`, `w-full`, percentage-based widths
- `grid grid-cols-1 sm:grid-cols-2` for cards
- Phase card width/max-height sliders in Visual Settings
- Scrollable panels in config sidebar (overflow-y-auto)
- Media queries for font sizes, gap spacing

---

## Appendix A: Principle Priority Matrix

When principles conflict, refer to this priority:

| Priority | Principle | Rationale |
|----------|-----------|-----------|
| 1 | **System correctness** | Wrong output at any cost is unacceptable |
| 2 | **Data integrity** | Never lose user data |
| 3 | **Error recovery** | User must always have a path forward |
| 4 | **Consistency** | Predictable patterns reduce errors |
| 5 | **Encapsulation** | Hidden internals enable refactoring |
| 6 | **Performance** | Optimize only after correctness |
| 7 | **Aesthetics** | Last priority, but still important |

## Appendix B: Code Review Checklist

Every pull request should pass:

- [ ] Does the code use the correct data structure for the problem?
- [ ] Are file-as-database ACID properties maintained?
- [ ] Is there a recovery path for every error?
- [ ] Does the component/module have a single responsibility?
- [ ] Are states properly encapsulated (no leaking internal state)?
- [ ] Is the DAG execution order deterministic?
- [ ] Do numeric operations handle precision correctly?
- [ ] Does the UI show system status (no "stuck" states)?
- [ ] Are edge animations consistent with node completion states?
- [ ] Would this code work on a fresh environment (no hidden dependencies)?
