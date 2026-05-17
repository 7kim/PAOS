---
id: TASK-003
title: "Create Gemini agent soul file"
status: needs_planning
created: 2026-05-17T15:30:00Z
created_by: claude
priority: medium
---

## Description

Gemini CLI is integrated into PAOS but has no soul file. Every other agent has `agents/<name>/soul.md` defining its identity, vault protocol, and MCP usage. Gemini needs one.

## Acceptance Criteria

- `agents/gemini/soul.md` exists
- Soul file follows the same structure as other agents (identity, session start, vault protocol, MCP tools, log format)
- `agents/gemini.md` overview file exists (like agents/codex.md)
- Gemini added to PAOS roster in workflow.md if not already there

## Notes

This is a pipeline smoke test for Gap 1. Agents: @plan → @architect + @coordinator → @developer → @coordinator verify.
Reference: `agents/codex/soul.md` as the closest equivalent (both are CLI coding agents).
