# Feasibility Study: Integrating LangChain/LangGraph into PAOS

**Date**: 2026-06-26  
**Author**: hermes-nous  
**Status**: Draft / Assessment  
**Version**: 1.0

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [PAOS Current Architecture](#2-paos-current-architecture)
3. [LangGraph's StateGraph](#3-langgraphs-stategraph)
4. [LangChain Tool-Calling](#4-langchain-tool-calling)
5. [MCP Support Comparison](#5-mcp-support-comparison)
6. [Integration Effort Analysis](#6-integration-effort-analysis)
7. [Concrete Recommendation](#7-concrete-recommendation)
8. [Decision Matrix](#8-decision-matrix)

---

## 1. Executive Summary

PAOS already has a working, production-tested pipeline DAG system built around:
- **@xyflow/react** (React Flow) for visual DAG editing
- **Kahn's algorithm** topological sort for execution ordering
- **systemd path units** for real-time pipeline dispatch
- **File-inbox agent dispatch** for inter-agent communication
- **16 `/h-*` bash scripts** for CLI-driven operations

After thorough research of LangChain v1 (`create_agent`, `@tool` decorator, MCP adapters) and LangGraph (`StateGraph`, checkpointing, conditional edges, human-in-the-loop), the conclusion is:

> **Adopt nothing directly from LangChain/LangGraph. Adapt one concept (StateGraph's typed state model). Skip the rest as YAGNI.**

PAOS's pipeline system is _architecturally better suited_ to its multi-agent orchestration use case than LangGraph, and LangChain's tool-calling abstractions add a Python dependency without benefit over bash/MCP tools that already work.

---

## 2. PAOS Current Architecture

### 2.1 Pipeline DAG System

PAOS has a complete DAG-based pipeline execution system:

| Component | Implementation |
|-----------|---------------|
| **Visual editor** | `@xyflow/react` v12 — drag-and-drop node wiring |
| **DAG serialization** | `pipeline-flow.json` (nodes, edges, agent assignments) |
| **Layout persistence** | `builder-layout.json` (node positions, edge types) |
| **Topological sort** | Kahn's algorithm (BFS in `execute-flow/route.ts`) |
| **Phase execution** | Sequential spawn of agents per phase, cascading on completion |
| **Agent dispatch** | File-inbox messages (`memory/inbox/<agent>/*.md`) |
| **Real-time trigger** | systemd `paos-pipeline.path` + handler script |
| **Fallback watcher** | `paos-pipeline-watch.sh` (inotify for containers/WSL) |
| **Retry/skip** | Per-phase via API: `POST /phases/:id/retry` and `/skip` |
| **Status tracking** | `pipeline.json` (runtime), `META.json` (immutable metadata) |
| **Parallel execution** | DAG-parallel: independent phases run concurrently via topological sort |

### 2.2 Tool-Calling via `/h-*` Commands

PAOS agents expose capabilities through **bash scripts** in `bin/`:

```
h-help       h-commit     h-pipeline    h-audit
h-chat       h-context    h-daily       h-inbox
h-log        h-status     h-sync        h-task
h-whoami     h-workspace  h-write-handoff
```

Each script:
1. Sources `lib/h-common.sh` for shared utilities
2. Reads/writes files in `memory/` (inboxes, tasks, ledger)
3. Returns structured output (JSON for machine, colorized for TTYs)
4. Zero dependencies — works without a running server

### 2.3 MCP Integration

PAOS's `mcp/mcp-config.json` currently serves **7 MCP servers**:

| Server | Type | Purpose |
|--------|------|---------|
| `shared-memory` | stdio (Node) | 14 PAOS memory tools |
| `scaffold` | stdio (Node) | Project scaffolding |
| `gitkraken` | stdio (gk) | Git visualization |
| `context7` | HTTP | Documentation querying |
| `hostinger-domains` | stdio (npx) | Domain management |
| `hostinger-dns` | stdio (npx) | DNS management |
| `agent-browser` | stdio | Browser automation |

This MCP config is loaded by Hermes Agent's runtime and injected into the agent's tool set, bypassing any need for LangChain's abstraction layer.

---

## 3. LangGraph's StateGraph

### 3.1 How StateGraph Works

LangGraph's `StateGraph` is a Python/TypeScript library for building **stateful, cyclic graphs** with typed state:

```python
from langgraph.graph import StateGraph, START, END

class GraphState(TypedDict):
    question: str
    generation: str
    documents: List[str]
    steps: List[str]

workflow = StateGraph(GraphState)
workflow.add_node("retrieve", retrieve_fn)
workflow.add_node("generate", generate_fn)
workflow.add_edge(START, "retrieve")
workflow.add_conditional_edges(
    "retrieve",
    grade_documents,
    {"web_search": "web_search", "generate": "generate"}
)
app = workflow.compile()
```

Key features:
- **Typed shared state** — all nodes read/write a single `TypedDict`
- **Cyclic graphs** — loops allowed (e.g., `rewrite → agent → retrieve`)
- **Conditional edges** — routing functions return the next node name
- **Checkpointing** — `SqliteSaver` persists state at every step
- **Human-in-the-loop** — `interrupt_before` pauses for user input
- **Durable execution** — survives crashes via checkpoint replay

### 3.2 Comparison: StateGraph vs PAOS DAG

| Dimension | LangGraph StateGraph | PAOS DAG |
|-----------|---------------------|----------|
| **Graph type** | Cyclic (loops allowed) | Acyclic (DAG) |
| **State model** | Single typed dict, shared across all nodes | File-based: each phase writes artifacts to its `phases/<id>/` dir |
| **Node type** | Python functions (or async) | Full agent sessions (opencode, Claude Code, Hermes) |
| **Node granularity** | Fine — single function per node | Coarse — entire agent workflow per phase |
| **Execution model** | In-process Python/JS | Agent-level orchestration across processes |
| **Persistence** | SqliteSaver / PostgresSaver checkpointing | File system (pipeline.json, META.json, phase artifacts) |
| **Human-in-loop** | Built-in via `interrupt_before` | Custom via `POST /api/pipelines/:id/intervene` |
| **Conditional routing** | First-class: routing functions | Manual: `order` array in pipeline-flow.json, linear only |
| **Cycles (loops)** | Supported | Not supported (pure DAG) |
| **Language** | Python / TypeScript | Bash / TypeScript (Next.js API) |

### 3.3 What StateGraph Would Add

1. **Typed shared state** — a formal schema for pipeline-wide state, vs. PAOS's implicit file-based state
2. **Conditional branching** — routing decisions as Python functions, vs. PAOS's linear `order` array
3. **Checkpointing** — built-in crash recovery, vs. PAOS's manual status-file updates
4. **Cyclic workflows** — retry loops, refinement cycles, self-correcting agents
5. **In-process execution** — faster for fine-grained tasks, but irrelevant for PAOS's multi-agent model

### 3.4 What PAOS Already Does Better

1. **Multi-agent orchestration** — PAOS dispatches entire agent processes (Hermes, opencode, Claude Code). LangGraph runs functions in a single process.
2. **Language independence** — PAOS works with any agent (Hermes in TypeScript, opencode in Python, bash scripts). LangGraph locks you into Python/TypeScript.
3. **Visual editing** — React Flow DAG editor with drag-and-drop. LangGraph has no built-in UI.
4. **Real-time execution** — systemd path units trigger on file events. LangGraph requires a running server.
5. **Scalability** — PAOS phases can run on different machines via file inboxes. LangGraph is single-process.

---

## 4. LangChain Tool-Calling

### 4.1 How LangChain Tools Work

LangChain provides a `@tool` decorator for defining callable functions:

```python
from langchain.tools import tool

@tool
def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"

agent = create_agent(
    model="claude-sonnet-4-6",
    tools=[get_weather],
)
```

Key concepts:
- **`@tool` decorator** — wraps a Python function with a name, description, and JSON schema
- **`create_agent`** — creates an LLM agent with tool-calling loop
- **Middleware** — `AgentMiddleware` for dynamic tool registration at runtime
- **`MultiServerMCPClient`** — converts MCP tools into LangChain tool objects

### 4.2 Comparison: LangChain Tools vs PAOS `/h-*` Commands

| Dimension | LangChain `@tool` | PAOS `/h-*` Commands |
|-----------|-------------------|----------------------|
| **Definition** | Python function + decorator | Bash script in `bin/` |
| **Schema** | Auto-generated from type hints (Pydantic) | Manual arg parsing (`argparse` or bash `$1`) |
| **Discovery** | Agent middleware | `h-help` enumerates scripts |
| **Execution** | LLM decides to call, tool runs in-process | User/agent runs script in shell |
| **Dependencies** | Python + langchain + model SDK | Bash (no deps) |
| **Composability** | Chainable with other tools | Pipeable with other scripts |
| **MCP bridge** | `@langchain/mcp-adapters` | Direct MCP config in `mcp-config.json` |

### 4.3 Analysis

**PAOS's approach is already superior for its use case**:

1. **Zero-dependency tools** — `/h-*` scripts are pure bash. They work on any machine, in containers, over SSH. LangChain tools require the entire Python LangChain stack.

2. **Tool = process** — PAOS tools are subprocesses. They can read files, write files, make HTTP calls, spawn other processes. LangChain tools are Python functions — they can call subprocesses too, but then you're wrapping bash in Python, gaining nothing.

3. **LLM-agnostic tool discovery** — PAOS agents discover tools via their own mechanism (Hermes MCP tools, opencode commands, Claude Code plugins). LangChain's `create_agent` is specific to LangChain's agent loop.

4. **The `/h-*` pattern is already evolving into MCP** — PAOS defines tools as MCP servers (`shared-memory`, `scaffold`, etc.), which any MCP-compatible client can consume. LangChain's MCP adapter (`@langchain/mcp-adapters`) could theoretically consume PAOS's MCP servers, but this would be LangChain consuming PAOS, not the reverse.

---

## 5. MCP Support Comparison

### 5.1 LangChain MCP Support

LangChain has `@langchain/mcp-adapters` (Python/JS):

```python
from langchain_mcp_adapters.client import MultiServerMCPClient

client = MultiServerMCPClient({
    "math": {
        "transport": "stdio",
        "command": "node",
        "args": ["/path/to/math_server.js"],
    },
})
tools = await client.get_tools()
agent = create_agent("claude-sonnet-4-6", tools)
```

Features:
- Connects to stdio and HTTP MCP servers
- Converts MCP tools into LangChain `Tool` objects
- Each tool invocation creates a fresh stateless session
- Works with both Python and TypeScript LangChain

### 5.2 PAOS MCP Support

PAOS defines MCP servers declaratively in `mcp/mcp-config.json`:

```json
{
  "mcpServers": {
    "shared-memory": {
      "command": "node",
      "args": [".../shared-memory-server/index.js"],
      "env": { "MEMORY_DIR": "/home/dev/AI_Workflow/memory" }
    },
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp",
      "headers": { "CONTEXT7_API_KEY": "..." }
    }
  }
}
```

PAOS's approach:
- **Hermes-native** — MCP servers are loaded directly by the Hermes Agent runtime
- **No adapter needed** — tools are injected into the agent's tool set without a conversion layer
- **Supports all transports** — stdio, HTTP, and SSE
- **Env injection** — per-server environment variables configured declaratively
- **Disable/enable toggles** — per-server `disabled` field

### 5.3 What Each Brings

| Capability | LangChain MCP | PAOS MCP |
|------------|---------------|----------|
| Connect to stdio MCP | ✅ `MultiServerMCPClient` | ✅ `mcp-config.json` |
| Connect to HTTP MCP | ✅ `transport: "http"` | ✅ `type: "http"` |
| Tool discovery | `client.get_tools()` | Runtime injection |
| Stateless sessions | ✅ (fresh per invocation) | ✅ (default for stdio) |
| Stateful sessions | ❌ | ✅ (shared-memory server) |
| Agent framework | LangChain only | Hermes + any MCP client |
| Declarative config | ❌ (imperative) | ✅ (JSON config file) |

**Verdict**: LangChain's MCP support adds nothing PAOS doesn't already have. PAOS's MCP integration is actually _more flexible_ because it's framework-agnostic — any MCP-compatible agent can use it, not just LangChain ones.

---

## 6. Integration Effort Analysis

### 6.1 Option A: Make LangGraph Serve PAOS (Not Recommended)

The idea: PAOS pipeline phases become LangGraph nodes, with LangGraph handling state management and checkpointing.

**Required work:**

| Task | Effort | Risk |
|------|--------|------|
| Install Python LangGraph + deps | Low | Medium — Python PEP 668, venv management |
| Create StateGraph schema matching PAOS pipeline state | Medium | Low — but re-architects PAOS's file-based state |
| Wrap each PAOS agent as a LangGraph async node | High | High — agents are subprocesses, not functions |
| Replace file-based dispatch with LangGraph checkpointing | High | High — loses systemd watch, inbox protocol, audit trail |
| Bridge LangGraph execution back to PAOS dashboard | High | Medium — need WebSocket/SSE bridge |
| Port Kahn's algorithm → LangGraph edges | Medium | Low — LangGraph handles topology natively |
| Handle multi-process agent spawning from in-process graph | Very High | High — fundamentally different execution models |

**Total estimated effort**: **2-4 weeks** for a full rewrite of pipeline execution.

**Risk assessment**: **HIGH**. PAOS agents are entire LLM sessions, not Python functions. Wrapping `opencode run` or a Hermes session inside a LangGraph node is an impedance mismatch — LangGraph expects fine-grained function calls, not coarse-grained process spawns.

### 6.2 Option B: LangChain Agents for Tool-Calling (Not Recommended)

The idea: Replace `/h-*` scripts with LangChain tools registered via `@tool`.

**Required work:**

| Task | Effort | Risk |
|------|--------|------|
| Port 16 bash scripts to Python functions | Medium | Low — mechanical translation |
| Set up Python venv + LangChain | Low | Medium — dependency chain |
| Register tools with MCP adapter | Medium | Low |
| Remove bash dependencies | Low | Low |

**Why not do this:**

1. Python-based tools lose the **zero-dependency advantage** of bash
2. PAOS agents (Hermes, opencode) already have their own tool-calling mechanisms — they don't need LangChain's
3. Bash scripts can be run via SSH, in containers, in cron — Python tools require the LangChain runtime
4. `@tool` adds no new capability — `h-status` already outputs JSON, `h-pipeline` already manages pipelines

### 6.3 Option C: Adapt One Concept — StateGraph's Typed State Model (Recommended)

The idea: Don't import LangGraph. **Adapt its typed-state concept** into PAOS's pipeline-flow.json.

**Current PAOS state** is implicit:

```json
{
  "phases": {
    "n1": { "status": "completed", "artifacts": ["..."] },
    "n2": { "status": "executing", "artifacts": ["..."] }
  },
  "order": ["n1", "n2"]
}
```

**Proposed PAOS state schema** — inspired by StateGraph's `TypedDict`:

```json
{
  "pipelineState": {
    "$schema": "https://paos.dev/schemas/pipeline-state-v1",
    "type": "object",
    "properties": {
      "shared": {
        "description": "Key-value store shared across all phases",
        "type": "object",
        "additionalProperties": true
      },
      "artifacts": {
        "description": "Named references to phase outputs",
        "type": "object",
        "additionalProperties": {
          "type": "object",
          "properties": {
            "phase": { "type": "string" },
            "path": { "type": "string" },
            "type": { "type": "string", "enum": ["file", "json", "text"] }
          }
        }
      },
      "checkpoints": {
        "description": "Execution checkpoints for rollback",
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "phase": { "type": "string" },
            "timestamp": { "type": "string", "format": "date-time" },
            "state": { "type": "object" }
          }
        }
      }
    }
  }
}
```

**What this achieves:**
- Formal schema validation for inter-phase data exchange
- Checkpoint snapshots for crash recovery (without LangGraph)
- Documentation of what each phase produces and consumes
- Enables the dashboard to visualize data flow between phases

**Implementation effort**: **2-3 days**

| Task | Effort |
|------|--------|
| Write JSON schema for pipeline state | 0.5 day |
| Update `pipeline-flow.json` to optional `stateSchema` field | 0.5 day |
| Add checkpoint write on phase completion to `execute-flow/route.ts` | 0.5 day |
| Update dashboard to display state/checkpoints | 1 day |

### 6.4 Option D: Conditional Branching (Future Consideration)

The idea: Add conditional edges to PAOS's DAG, inspired by LangGraph's `add_conditional_edges`.

**Current**: Phases execute in a fixed topological order defined by edges in `builder-layout.json`.

**Proposed**: Allow edges to have a `condition` field referencing a decision function.

```json
{
  "edges": [
    { "source": "retrieve", "target": "grade", "condition": null },
    { "source": "grade", "target": "web_search", "condition": "needs_more_sources" },
    { "source": "grade", "target": "generate", "condition": "sources_sufficient" }
  ]
}
```

**Implementation effort**: **3-5 days**

| Task | Effort |
|------|--------|
| Define condition schema in `builder-layout.json` | 0.5 day |
| Update Kahn's algorithm to handle conditional edges | 1 day |
| Create `POST /api/pipelines/:id/resolve-condition` endpoint | 0.5 day |
| Update Flow Builder UI for conditional edge configuration | 2 days |
| Update pipeline execution to pause at condition junction | 1 day |

**Recommendation**: Skip for now (YAGNI). PAOS pipelines are primarily linear (n1 → n2 → ...). Add conditional branching only when a real use case demands it (e.g., "if phase-2 analysis fails, route to human review phase").

---

## 7. Concrete Recommendation

### 7.1 Summary Decision

| Component | Decision | Rationale |
|-----------|----------|-----------|
| **LangGraph StateGraph** | ✅ Adapt (state schema only) | Typed shared state is useful; PAOS doesn't need in-process execution |
| **LangGraph conditional edges** | ⏸ Defer | YAGNI for current linear pipeline patterns |
| **LangGraph checkpointing** | ✅ Adapt (lightweight) | Add checkpoint snapshots, not full SqliteSaver |
| **LangGraph cycles** | ❌ Skip | PAOS pipelines are DAGs by design; cycles add complexity without need |
| **LangChain `create_agent`** | ❌ Skip | PAOS already has Hermes + opencode agents |
| **LangChain `@tool`** | ❌ Skip | `/h-*` bash scripts are superior for PAOS's use case |
| **LangChain MCP adapters** | ❌ Skip | PAOS MCP config is more flexible and framework-agnostic |
| **LangChain middleware** | ❌ Skip | PAOS MCP server pattern already handles dynamic tool registration |

### 7.2 What to Adopt

**Typed pipeline state schema** — add formal schema validation to `pipeline-flow.json`:

- Define a `stateSchema` in `pipeline-flow.json` that each phase declares its inputs/outputs
- Add a `sharedState` field that phases can read/write (currently implicit via file artifacts)
- This is a **JSON Schema addition** to existing config files, costing 2-3 days of implementation

**Lightweight checkpoint snapshots** — add a `checkpoints.json` per pipeline:

- On phase completion, snapshot the pipeline state (file list, status, shared vars)
- Enables rollback to last known-good state if a phase fails
- No SqliteSaver, no LangGraph dependency — just atomic file writes (already in `execute-flow/route.ts`)

### 7.3 What to Adapt

**Nothing in the existing codebase changes** — only `pipeline-flow.json` schema evolves:

1. Add `optional` `stateSchema` to the `pipeline-flow.json` structure
2. Add checkpoint-writing step to `execute-flow/route.ts` (5 lines)
3. Update dashboard's ConfigPanel to show state schema editor (1 day)
4. Document the new schema in `docs/pipelines.md`

### 7.4 What to Skip (YAGNI)

| Item | YAGNI Rationale |
|------|-----------------|
| Python LangChain/LangGraph dependency | PAOS's stack is Node + Bash + systemd. Adding Python LangChain creates a 50+ MB dependency chain for no gain. |
| `create_agent` loop | PAOS agents already have their own LLM interaction loops. Nesting a LangChain loop inside a Hermes session is redundant. |
| `@tool` decorators | `/h-*` bash scripts are more portable, have zero deps, and work over SSH/containers/cron. |
| `MultiServerMCPClient` | PAOS MCP config is declarative, supports env injection, and works with any MCP client. |
| `SqliteSaver` checkpointing | File-based checkpoints are simpler, more transparent, and already partially implemented. |
| LangGraph cycles | PAOS pipelines model sequential multi-agent workflows, not agent-internal reasoning loops. If PAOS agents need cycles, they implement them internally. |

---

## 8. Decision Matrix

| Criterion | Adopt LangGraph | Adapt State Schema | Skip (Stay with PAOS) |
|-----------|----------------|-------------------|----------------------|
| **Effort** | 4-6 weeks | 2-3 days | 0 |
| **Risk** | High (architectural mismatch) | Low | None |
| **New capability** | Stateful in-process graphs | Formal state modeling | None needed |
| **Maintenance burden** | High (LangGraph API churn) | Low (just JSON schema) | None |
| **PAOS compatibility** | Low (different execution model) | High (config-only change) | Perfect |
| **Vendor lock-in** | LangChain ecosystem | None (pure JSON schema) | None |
| **Portability** | Python-only | Any language | Bash + any |
| **Dashboard integration** | Requires WebSocket bridge | Already works | Already works |
| **Multi-agent support** | Poor (single-process) | Excellent | Excellent |
| **Real-time execution** | Requires server | systemd works | systemd works |

---

## Appendix A: LangGraph Code Patterns (Reference)

```python
# LangGraph — for comparison only. Not recommended for PAOS.
from langgraph.graph import StateGraph, END, START
from typing import TypedDict, List

class AgentState(TypedDict):
    messages: List[str]
    next_agent: str

def hermes_node(state: AgentState) -> AgentState:
    return {"messages": ["hermes: analyzing..."], "next_agent": "opencode"}

def opencode_node(state: AgentState) -> AgentState:
    return {"messages": ["opencode: executing..."], "next_agent": "hermes"}

def route(state: AgentState) -> str:
    return END if "done" in state["messages"][-1] else state["next_agent"]

builder = StateGraph(AgentState)
builder.add_node("hermes", hermes_node)
builder.add_node("opencode", opencode_node)
builder.add_conditional_edges("hermes", route)
builder.add_edge(START, "hermes")
graph = builder.compile()
```

## Appendix B: PAOS Pipeline State Schema (Proposed)

```json
{
  "pipeline-flow.json": {
    "stateSchema": {
      "sharedState": {
        "type": "object",
        "properties": {
          "context": { "type": "string", "description": "Aggregated context from completed phases" },
          "decision": { "type": "string", "enum": ["approve", "reject", "retry"] },
          "artifacts": { "type": "array", "items": { "type": "string" } }
        }
      },
      "phaseOutputs": {
        "n1": { "provides": ["analysis.md"], "schema": { "type": "object" } },
        "n2": { "expects": ["analysis.md"], "provides": ["implementation.zip"] }
      }
    }
  }
}
```
