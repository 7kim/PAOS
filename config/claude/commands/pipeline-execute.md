---
description: Execute a pipeline by ID. Usage: /pipeline-execute PIPE-xxx
---

Execute the pipeline with the given ID. Read `~/AI_Workflow/memory/pipelines/<ID>/META.json`, `PLAN.md`, and `TASKS.md`. If the pipeline is already completed or executing, report and stop. Otherwise, set status to "executing" in pipeline.json, then work through each task in order. Update TASKS.md markers ([ ] → [~] → [x]) and pipeline.json (currentTask, progress) as you go. When done, write WALKTHROUGH.md and update META.json status to "completed".
