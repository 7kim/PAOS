# Skill: Identity Elicitation — Field of Expertise & Coding Style Scanner

## Purpose
Elicit the **Field of Expertise (FoE)** and **Coding Style Vector (CSV)** of the current operator by scanning:
1. Git history (commits, branches, contribution patterns).
2. File header metadata (`#!`, `@author`, license blocks, module docstrings).
3. Directory tree topology (language distribution, framework usage, project types).

## H-Factor Rationale
H-Factor §I3 (Identity First) requires that every action binds to a known identity. This skill bootstraps that identity by answering **"Who is operating here?"** before any delivery work begins.

## Canonical Knowledge Base

The canonical knowledge base is `~/AI_Workflow/knowledge/`. All .md ebooks, reference documents, and design catalogs live here. The scan target for identity elicitation is this directory.

## Procedure

### Step 0: Scan the Knowledge Base
```bash
find ~/AI_Workflow/knowledge/ -type f -name "*.md" > /tmp/knowledge_files.txt
```
- List all .md ebooks and reference documents.
- Extract domain topics from filenames and first-level headings:
  ```bash
  grep -rh "^#" ~/AI_Workflow/knowledge/ 2>/dev/null | sort -u > /tmp/knowledge_topics.txt
  ```
- Catalog available knowledge domains for the identity profile.

### Step 1: Scan Git History
```bash
git log --all --oneline --since="2 years ago" --format="%h %s" > /tmp/git_history.txt
```
- Count commits, extract domain keywords (e.g., "feat", "fix", "api", "frontend", "infra").
- Identify primary programming languages via file extensions in commit diffs.

### Step 2: Scan File Headers
```bash
# Collect first 5 lines of every source file for copyright/author/module info
find . -type f \( -name "*.py" -o -name "*.js" -o -name "*.ts" -o -name "*.go" -o -name "*.rs" -o -name "*.java" -o -name "*.md" \) -exec head -5 {} \; > /tmp/file_headers.txt
```
- Parse `@author`, `@license`, `module docstrings`, `#!` shebangs.

### Step 3: Scan Directory Tree
```bash
find . -type f | sed 's|/[^/]*$||' | sort -u > /tmp/dir_tree.txt
find . -name "package.json" -o -name "Cargo.toml" -o -name "go.mod" -o -name "setup.py" -o -name "Makefile" 2>/dev/null > /tmp/build_files.txt
```
- Identify frameworks (React, Flask, Axum, etc.).
- Infer project type (web-app, library, monorepo, CLI tool).

### Step 4: Synthesize Identity
Build a profile in `~/AI_Workflow/user.md` (or `.opencode/user.md` via symlink) using this template:

```markdown
# Operator Identity Profile
## Field of Expertise
- Domains: [detected from commit messages + file topology]
- Languages: [ranked by frequency]
- Frameworks: [detected]
- Project Archetype: [inferred]

## Coding Style Vector
- Commit Convention: [Conventional Commits / manual / mixed]
- Line Endings: [CRLF / LF]
- Indentation: [spaces / tabs, width]
- Naming: [camelCase / snake_case / kebab-case]
- Docstrings: [present / absent / thorough]
- License: [detected from headers]
```

### Step 5: Update user.md
Write the synthesized profile to `~/AI_Workflow/user.md` (resolves to `.opencode/user.md` via symlink). If `user.md` exists, diff the new profile against the old and flag significant deltas as `## EVOLUTION_NOTICE`.

## Output
- `~/AI_Workflow/user.md` — populated operator identity.
- `~/AI_Workflow/knowledge/identity_state.json` — machine-readable identity record.
