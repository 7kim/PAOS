---
name: ponytail
description: "Minimal-essential coding philosophy — 'He says nothing. He writes one line. It works.' Lazy senior dev mode that cuts ~54% code while keeping 100% safety."
category: software-development
triggers:
  - over-engineering
  - code bloat
  - minimal code
  - YAGNI
  - write less code
  - lazy developer
tags:
  - ponytail
  - minimalism
  - yagni
  - coding-philosophy
---

# Ponytail — Lazy Senior Dev Mode

> "He says nothing. He writes one line. It works."

Ponytail is a coding philosophy that makes AI agents write only what's necessary. ~54% less code (up to 94%), ~20% cheaper, ~27% faster, 100% safe.

## The Ladder

Before writing any code, stop at the first rung that holds:

1. **Does this need to exist?** → no: skip it (YAGNI)
2. **Stdlib does it?** → use it
3. **Native platform feature?** → use it
4. **Installed dependency?** → use it
5. **One line?** → one line
6. **Only then:** the minimum that works

## Rules

- No abstractions that weren't explicitly requested.
- No new dependency if it can be avoided.
- No boilerplate nobody asked for.
- Deletion over addition. Boring over clever. Fewest files possible.
- Question complex requests: "Do you actually need X, or does Y cover it?"
- Pick the edge-case-correct option when two stdlib approaches are the same size — lazy means less code, not the flimsier algorithm.
- Mark intentional simplifications with a `ponytail:` comment. If the shortcut has a known ceiling (global lock, O(n²) scan, naive heuristic), the comment names the ceiling and the upgrade path.

## Not Lazy About

- Input validation at trust boundaries
- Error handling that prevents data loss
- Security
- Accessibility
- The calibration real hardware needs (the platform is never the spec ideal, a clock drifts, a sensor reads off)
- Anything explicitly requested

## Verification

Non-trivial logic leaves ONE runnable check behind: the smallest thing that fails if the logic breaks (an assert-based demo/self-check or one small test file; no frameworks, no fixtures). Trivial one-liners need no test.

## Installation

Ponytail is already installed and configured for PAOS agents:

| Agent | Method | Status |
|-------|--------|--------|
| Claude Code | `claude plugin marketplace add DietrichGebert/ponytail` + `claude plugin install ponytail@ponytail` | ✅ Installed & enabled |
| OpenCode | Plugin in `~/.config/opencode/opencode.json` + command links in `~/.config/opencode/command/` | ✅ Configured |
| All PAOS agents (via AGENTS.md) | Ruleset in `skills/ponytail-repo/AGENTS.md` | ✅ Available |

## Commands (Claude Code / OpenCode)

| Command | What it does |
|---------|--------------|
| `/ponytail [lite \| full \| ultra \| off]` | Set intensity or turn off |
| `/ponytail-review` | Review current diff for over-engineering |
| `/ponytail-audit` | Audit whole repo for over-engineering |
| `/ponytail-debt` | Harvest shortcuts deferred into a ledger |
| `/ponytail-gain` | Show measured impact scoreboard |
| `/ponytail-help` | Quick reference |

## Configuration

Default mode: **full** (can be overridden via `PONYTAIL_DEFAULT_MODE` env var or `~/.config/ponytail/config.json`)

## References

- [Ponytail GitHub](https://github.com/DietrichGebert/ponytail)
- Repo cloned at: `~/AI_Workflow/skills/ponytail-repo/`
