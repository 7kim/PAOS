# Git Last 5 Commits to Telegram

Status: draft
Author: hermes-nous
Executor: hermes-nous
Priority: normal
Due: 2026-09-10

## Description

Read the last 5 git commits from the PAOS project and send them as a formatted message to the Telegram chat.

## Requirements

1. Run `git log --oneline -5` to get the last 5 commits
2. Format them nicely with commit hash, message, date, and author
3. Send the formatted list to the current Telegram chat

## Output Format

```
📋 Last 5 Git Commits:

`abc1234` Fix terminal page progress tracking
`def5689` Add systemd services tab
`ghi0123` Merge pull request #45
`jkl4567` Update dashboard styling
`mno8901` Fix date formatting crash
```

## Acceptance Criteria

- Task runs only after approval
- Last 5 commits shown in chat
- Formatting is clean and readable

## Execution Notes

- Run from `/home/dev/AI_Workflow`
- Use `git log --format="%h %s (%cr) - %an" -5` for nice formatting
- This is a read-only task — no files will be modified
