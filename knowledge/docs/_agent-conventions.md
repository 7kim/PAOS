---
title: "PAOS Agent Conventions — Obsidian Markdown"
description: "Canonical conventions for all PAOS agents writing markdown in the Obsidian vault — wikilinks, tags, frontmatter, and folder organization."
version: 1.0.0
tags:
  - paos
  - conventions
  - agent-guide
  - obsidian
related:
  - "[[session-protocol]]"
  - "[[_agent-conventions]]"
status: active
---

# PAOS Agent Conventions — Obsidian Markdown

> Single source of truth for how every PAOS agent (Hermes, Claude Code, OpenCode Developer, Antigravity, Gemini, Codex, etc.) must format, link, and organize markdown documents in this Obsidian vault.
>
> **Vault root:** `~/AI_Workflow/knowledge/docs/`
> **Agents affected:** All 13 PAOS agents.

---

## 1. YAML Frontmatter — Every Document

**Every document MUST start with YAML frontmatter** delimited by `---` on its own line above and below. Frontmatter is the structured metadata Obsidian (and agents) use for queries, graph analysis, and automation.

### Required fields

```yaml
---
title: "Short, Descriptive Title"
description: "One-line summary of what this doc covers"
tags:
  - paos
  - relevant-category
related:
  - "[[related-doc-1]]"
  - "[[related-doc-2]]"
status: active   # active | draft | review | archived
---
```

### Optional but encouraged fields

```yaml
version: 1.0.0
author: hermes-nous
created: 2026-06-26
updated: 2026-06-26
depends_on:
  - "[[other-doc]]"
```

### Field rules

| Field | Required? | Rule |
|-------|-----------|------|
| `title` | ✅ | Double-quoted, sentence case. Keep under 80 chars. |
| `description` | ✅ | Single line, under 160 chars. No wikilinks here. |
| `tags` | ✅ | List of `#tag` values. Always include `paos`. |
| `related` | ✅ | List of `[[wikilinks]]` to documents this doc references. Use `"-`" per item. |
| `status` | ✅ | One of: `active`, `draft`, `review`, `archived`, `deprecated`. |
| `version` | 🔶 | Semantic version (`1.0.0`). Bump minor on additions, patch on fixes. |
| `created` | 🔶 | ISO date `YYYY-MM-DD`. |
| `updated` | 🔶 | ISO date `YYYY-MM-DD`. Update when you modify the doc. |

---

## 2. Wikilink Syntax

**Use `[[wikilinks]]`** to connect documents. Obsidian renders these as clickable links and populates the **backlinks** panel and **graph view**.

### Basic wikilinks

```markdown
See the [[session-protocol]] for session start/end rules.
Refer to [[pipeline-system]] for the execution pipeline.
```

### Display text (alias)

When the page title doesn't match the link text, use the pipe syntax:

```markdown
See [[session-protocol|Session Protocol v3]] for details.
Configure agents via [[agent-inbox-protocol|Inbox Protocol]].
```

### Wikilinks to headings

Link to a specific section within a document:

```markdown
For frontmatter rules, see [[_agent-conventions#1-yaml-frontmatter--every-document]].
```

### Wikilinks to blocks

Link to a specific paragraph or code block (add `^block-id` to the target):

```markdown
As defined in [[session-protocol#^session-start]].
```

### When to use wikilinks vs. URLs

| Use case | Syntax |
|----------|--------|
| Link to another doc in this vault | `[[doc-name]]` |
| Link to a heading in any vault doc | `[[doc-name#heading]]` |
| External URL | `[label](https://example.com)` |
| Reference to a file outside vault | Use absolute path or `[label](file:///path)` |

### When to create a new document vs. update an existing one

| Scenario | Action |
|----------|--------|
| New concept that doesn't exist yet | **Create** a new doc with `_` prefix if it's a conventions/meta doc (e.g., `_agent-conventions.md`) |
| New information on an existing topic | **Update** the existing doc. Search for it by title first. |
| Overlapping topic | **Link** from the existing doc via `[[wikilink]]` and add a short summary there. Do not duplicate. |
| Temporary / session-specific | Use `daily/YYYY-MM-DD.md` in the vault, not `docs/`. |

---

## 3. Tagging Conventions

Tags categorize documents for filtering, search, and graph clustering. Every document MUST include at least 2 tags.

### Required tag: `#paos`

Every document in this vault gets `#paos` as its first tag. This identifies it as part of the PAOS knowledge base.

### Category tags — pick one primary

| Tag | Applies to |
|-----|-----------|
| `#architecture` | System design, component relationships, data flow |
| `#pipeline` | `/h-pipeline`, execution plans, task routing |
| `#agent` | Agent identity, soul docs, agent-specific protocols |
| `#security` | Authentication, authorization, secrets, threat models |
| `#protocol` | Session protocol, communication rules, conventions |
| `#infrastructure` | VPS, deployment, CI/CD, hosting |
| `#reference` | External references, research, bookmarks |
| `#tutorial` | How-to guides, walkthroughs |
| `#meta` | Documents about the vault itself (like this one) |
| `#template` | Templates and boilerplate |

### Qualifier tags — zero or more

```markdown
tags:
  - paos
  - architecture
  - security
  - review
```

Qualifiers add nuance:
- `#review` — doc needs human review
- `#wip` — work in progress
- `#needs-update` — doc content is stale
- `#automated` — generated or maintained by an agent

### Tag format rules

1. **Lowercase only** — `#Architecture` is invalid; use `#architecture`
2. **Hyphens for multi-word** — `#agent-guide`, `#data-flow`
3. **No spaces** — tags are atomic
4. **No special characters** — only `[a-z0-9-]`

---

## 4. Folder Organization

```
knowledge/docs/                  # ← Obsidian vault root
├── _agent-conventions.md        # ← You are here (meta docs prefixed with _)
├── session-protocol.md          # Protocol docs
├── repos.md                     # Reference docs
├── push-vps-pull-local.md       # How-to docs
├── user-questions.md            # Q&A tracking
├── notes.md                     # Project notes
├── notes-done.md                # Processed notes archive
├── user-questions-answered.md   # Answered Q&A archive
│
├── _templates/                  # Doc templates (future)
├── _archive/                    # Stale/deprecated docs (future)
└── daily/                       # Daily notes (at vault level)
```

### Naming conventions

| Pattern | Rule |
|---------|------|
| **Conventions / meta docs** | Prefix with `_`: `_agent-conventions.md`, `_naming-rules.md` |
| **Standard knowledge docs** | Lowercase with hyphens: `session-protocol.md`, `push-vps-pull-local.md` |
| **Document titles** | Sentence case in frontmatter: `"Session Protocol v3.0.0"` |
| **Avoid** | Underscores (except `_` prefix), spaces, camelCase in filenames |

---

## 5. Markdown Formatting Rules for Agents

### Headings

- Use ATX headings (`#`, `##`, `###`...) — not Setext (`===`, `---`)
- Skip from `#` to `###` only when `##` doesn't exist (no heading level gaps)
- Every heading must have the correct frontmatter `title` as the `#` H1

### Code blocks

- Always specify the language: ` ```yaml `, ` ```bash `, ` ```python `, ` ```markdown `
- Use ` ``` ` fences — never indented code blocks

### Lists

- Use `-` for unordered lists (not `*`)
- Use `1.` for ordered lists
- Indent sub-items with 2 spaces

### Emphasis

| Purpose | Syntax |
|---------|--------|
| Italic | `*single asterisks*` |
| Bold | `**double asterisks**` |
| Bold + italic | `***triple***` |
| Inline code | `` `backticks` `` |

### Horizontal rules

Use `---` on its own line (3+ dashes) to separate sections. Must have blank lines before and after.

### Callouts / blockquotes

```markdown
> This is a blockquote for emphasis or callouts.
>
> Use blank lines between paragraphs inside blockquotes.
```

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
```

---

## 6. Complete Example Document

```markdown
---
title: "Pipeline Execution System"
description: "Architecture and flow of the PAOS /h-pipeline plan-and-execute system"
tags:
  - paos
  - architecture
  - pipeline
related:
  - "[[session-protocol]]"
  - "[[agent-inbox-protocol]]"
  - "[[_agent-conventions]]"
status: active
version: 1.2.0
created: 2026-05-20
updated: 2026-06-25
---

# Pipeline Execution System

> The `/h-pipeline` subsystem accepts a plan from a Planner agent, creates task cards, and hands them off to an Executor agent via the shared memory inbox system.

## Overview

The pipeline follows a **plan → decompose → execute → review** flow.

### Phase 1 — Planning

The Planner agent (e.g., Hermes or Architect) writes an `IMPLEMENTATION_PLAN.md` with:
- Objective
- Scope
- Ordered steps

See the [[session-protocol#phase-a--strategic-planning|Planning Phase]] for details.

### Phase 2 — Execution

The Executor agent reads task cards from its inbox and executes each step. Results are logged to the [[global-ledger|global ledger]].

## Key Tags

- `#pipeline` for all pipeline-related docs
- `#architecture` for design docs

---

## 7. Quick Reference Card

```yaml
# MINIMAL frontmatter template
---
title: "Document Title"
description: "What this doc covers in one line"
tags:
  - paos
  - category-tag
related:
  - "[[related-doc]]"
status: active
---
```

### Do's ✅

- Always add frontmatter to every new doc
- Use `[[wikilinks]]` to connect related docs — always search for existing docs first
- Tag every doc with `#paos` plus at least one category tag
- Use `[[doc-name#heading|Display Text]]` for human-readable links
- Prefix meta/conventions docs with `_` so they sort to the top
- Update `updated` in frontmatter when you modify content

### Don'ts ❌

- Don't use bare URLs when a `[[wikilink]]` exists in the vault
- Don't create duplicate docs on the same topic — find and update the existing one
- Don't use spaces in tag names — `#my tag` breaks everything
- Don't put wikilinks inside `description` frontmatter — they don't render there
- Don't leave `status` at default — pick one explicitly
- Don't create dangling wikilinks (links to docs that don't exist) without a plan to create them

---

## 8. Obsidian Feature Reference (for Agent Context)

This vault (`~/AI_Workflow/knowledge/docs/`) has these Obsidian capabilities:

| Feature | Enabled? | Agent Usage |
|---------|----------|-------------|
| **Graph view** | ✅ | `[[wikilinks]]` and `tags` power the global and local graph |
| **Backlinks** | ✅ | Every `[[wikilink]]` automatically creates a backlink on the target doc |
| **Tags pane** | ✅ | Frontmatter `tags:` field feeds the tag browser |
| **Canvas** | ✅ | Create `.canvas` files in the vault for visual diagrams (agents can write JSON canvas files) |
| **Daily notes** | ✅ | Use `daily/YYYY-MM-DD.md` for session scratch notes (not `docs/`) |

---

*PAOS Agent Conventions v1.0.0 — Last updated: 2026-06-26 by hermes-nous.*
*All 13 PAOS agents must follow these conventions when creating or editing markdown in this vault.*
