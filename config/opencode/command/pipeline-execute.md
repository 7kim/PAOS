---
description: Execute a pipeline by ID (e.g. /pipeline-execute PIPE-xxx)
---

Execute pipeline $ARGUMENTS. First verify the pipeline directory exists at memory/pipelines/$ARGUMENTS/. Read META.json to check its status. If already completed or executing, report that and stop. Otherwise, update memory/pipelines/$ARGUMENTS/pipeline.json to mark status as "executing". Then read PLAN.md and TASKS.md. Execute ALL tasks in order. For each task: update TASKS.md markers ([ ] → [~] → [x]), update pipeline.json with currentTask and progress (e.g. "3/8"). When all tasks are done, write WALKTHROUGH.md with a full summary, update META.json status to "completed" with completed_at timestamp.
