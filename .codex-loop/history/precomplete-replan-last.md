Refreshed the task graph in place.

Updated:
- `.codex-loop/tasks.json`
- `.codex-loop/tasks/TASK-006.json`
- `.codex-loop/tasks/TASK-007.json`
- `.codex-loop/tasks/TASK-008.json`
- Added `TASK-009`, `TASK-010`, `TASK-011`
- Refreshed `.codex-loop/context/handoff.md` and `current-state.md`
- Aligned `.codex-loop/state.json` so all tasks are no longer marked complete

Current runnable next task is:

`009` in_progress: first-screen generator-first design remediation.

Remaining chain:
- `009` design-contract remediation
- `010` clean verification evidence and rerun smoke
- `011` final commit/push and re-evaluation

Validated JSON with `jq`; `tasks.json` statuses are only `done`, `in_progress`, and `todo`.

<promise>COMPLETE</promise>