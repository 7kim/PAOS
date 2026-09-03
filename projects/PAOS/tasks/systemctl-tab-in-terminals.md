# Add systemd services tab to Terminals page

Status: done
Author: hermes-nous
Executor: hermes-nous
Priority: normal
Due: 2026-09-10

## Description

Add a new tab to the existing Terminals page (`/terminals`) that shows all systemd user services (the ones configured to run on boot/startup). This should be integrated alongside the existing three tabs: Terminals, Docker, and Node Processes.

## Requirements

- Add a 4th tab called "Services" with a `Server` icon from lucide-react
- List all systemd user services with: name, description, status (active/inactive), subStatus, PID, memory, uptime, enabled state
- Use `systemctl --user list-units --type=service --all` to discover services
- Parse the output to extract service details
- Show action buttons: Start, Stop, Restart for each service
- Use POST `/api/system/services` (already exists) for actions
- Auto-refresh every 5 seconds when tab is active
- Count badge on the tab showing total services
- Empty state if no services found

## UI Consistency

- Match the existing tab design (gold active border, count badges)
- Use same card design, expand/collapse, resource badges pattern
- Services that are active should have green dot, inactive = red/grey
- Show subStatus as a small badge (running, exited, failed, etc.)
- Expandable details: PID, memory, uptime, enabled state

## Technical Notes

- API route already exists at `/api/system/services` (GET and POST)
- The Terminals page is at `/home/dev/AI_Workflow/dashboard/app/terminals/page.tsx`
- Uses `Server` icon from lucide-react
- Follow the same tab pattern as Docker and Node Processes

## Acceptance Criteria

- 4th tab "Services" visible on Terminals page
- Services list with status, PID, memory, uptime
- Action buttons work (start/stop/restart)
- Auto-refreshes when active
- Responsive and consistent with other tabs


<!-- approved: 2026-09-02T23:39:06.679Z -->
Progress: Complete - Added 4th tab with full systemd integration