# Reasoning — Document

## What I understand about this task
Phase n2 of PIPE-25-06-2026---19-42 ("Test topological order"). The analysis
phase (n1) produced a 179-line ANALYSIS.md with 5 recommendations for
documentation. The task is to write documentation that fills genuine gaps in
the existing ~3,500 lines of docs across 10+ files.

## Key decisions I made
1. Created `docs/pipelines.md` (72 lines) — a pipeline system reference that
   covers lifecycle, directory structure, DAG phase execution, Flow Builder UI,
   agent dispatch, known issues, CLI ref, and API endpoints.
2. Updated `docs/README.md` hub to link to the new pipelines doc.
3. **Did not** create separate docs for agent inbox protocol, systemd watcher,
   or memory/ discrepancy — those are already covered in existing docs
   (examples.md, api.md, architecture.md) or are self-documenting shell scripts.
4. Included the "Known Issues" table from ANALYSIS.md section 10 as a canonical
   reference — this was genuinely undocumented.
5. Reused existing links to api.md and examples.md rather than duplicating
   content (YAGNI / ponytail).

## Trade-offs considered
- **New doc vs update existing**: Created a new `docs/pipelines.md` because the
  pipeline system spans multiple existing files (api.md, examples.md,
  architecture.md) with no single cohesive overview. A new doc fills the gap
  without bloating existing files.
- **Length**: 72 lines is concise enough to be useful, long enough to cover
  the full lifecycle, short enough to read in one pass.
- **Known issues placement**: Added to pipelines.md (pipeline-system doc) rather
  than a separate known-issues.md — avoids yet-another-file syndrome.

## Why this approach
The existing documentation is already comprehensive (3,500+ lines). The only
genuine gap was a cohesive pipeline system reference that connects the dots
between the API doc, examples, architecture, and the actual file structures on
disk. The known issues from the analysis were undocumented anywhere in the
codebase — now they're captured in a discoverable place.

## What could go wrong
- The pipeline system may evolve (new file formats, different DAG format) and
  this doc could go stale. Mitigation: the doc references the actual files
  (pipeline-flow.json, builder-layout.json) so structural drift will be obvious.
- Known issues list may not get updated as issues are fixed.
  Mitigation: it's a doc, not a tracker — real issue tracking should live in
  the task system.
