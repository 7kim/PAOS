# Benchmark Dashboard & API Reference

The benchmark dashboard is at `/benchmarks` in the PAOS dashboard.
The API endpoints are under `/api/benchmarks/`.

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/benchmarks` | GET | List all benchmark runs + computed trend data |
| `/api/benchmarks` | POST | Placeholder for future background runner |
| `/api/benchmarks/[id]` | GET | Full detail: categories, gaps, SRS files, audit, plan |
| `/api/benchmarks/[id]/gaps/[n]` | PATCH | Toggle gap status (Pending / "In Progress" / Fixed / "Won't Fix") |
| `/api/benchmarks/[id]/gaps/[n]/create-pipeline` | POST | Generate flow-builder layout from a gap |

## Data Source

The API reads directly from `~/AI_Workflow/benchmarks/Benchmark_{N}_{date}/`.
No database needed — file-as-database pattern.

## Dashboard Features

- Timeline cards with grade badges (A/B/C/D/F color-coded)
- Trend indicator (improving/declining)
- Mini bar chart of last 5 scores
- Category performance breakdown with horizontal bars
- Benchmark file browser (SRS-as-is.md, SRS-to-be.md, gaps.md, implementation.md, per-gap files)
- Expanded gap content with phase-card-style Toggle (full .md rendered)
- "Create Pipeline" button per gap → opens flow builder with pre-filled prompts
- **4-column Kanban** (Pending / In Progress / Fixed / Won't Fix)
- Pending ↔ Won't Fix: click to toggle. In Progress + Fixed set by pipeline execution only.
- Won't Fix gaps auto-removed from gaps.md and implementation.md
- Status persists back to gap .md files on disk

## File Tree Integration

When a benchmark is selected (`benchmarkId` prop), the FileTreeExplorer in the flow
builder shows a purple "Benchmark Files" section listing:
- SRS-as-is.md
- SRS-to-be.md
- gaps.md (combined)
- implementation.md (full implementation spec)
- full-audit.md (complete audit)
- gap-{NN}.md (per-gap files, one per gap)

These can be toggled as file references for agent prompts.
