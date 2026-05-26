#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Any


DEFAULT_COMPLETION_PROMISE = "<promise>COMPLETE</promise>"
DEFAULT_MAX_ITERATIONS = 0


def now_iso() -> str:
    return datetime.now().astimezone().isoformat(timespec="seconds")


def project_root() -> Path:
    return Path(__file__).resolve().parents[1]


def state_path(root: Path) -> Path:
    return root / ".codex-loop" / "ralph-loop.json"


def loop_dir(root: Path) -> Path:
    return root / ".codex-loop"


def tasks_path(root: Path) -> Path:
    return loop_dir(root) / "tasks.json"


def load_state(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def write_state(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def normalize_max_iterations(value: int | None) -> int:
    try:
        parsed = int(value or 0)
    except (TypeError, ValueError):
        parsed = 0
    return parsed if parsed > 0 else 0


def display_max_iterations(value: Any) -> str:
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return "until-complete"
    return str(parsed) if parsed > 0 else "until-complete"


def all_tasks_complete(root: Path) -> bool:
    path = tasks_path(root)
    if not path.exists():
        return False
    payload = json.loads(path.read_text(encoding="utf-8"))
    tasks = payload.get("tasks", [])
    if not isinstance(tasks, list) or not tasks:
        return False
    return all(str(task.get("status", "")).lower() in {"done", "completed", "complete", "skipped"} for task in tasks)


def stale_state_warning(root: Path, state: dict[str, Any]) -> str:
    warnings: list[str] = []
    if tasks_path(root).exists() and not state.get("active"):
        status = state.get("status", "inactive") if state else "missing"
        warnings.append(
            "inactive Ralph state has an existing task graph; "
            f"status={status}. Start with --require-task-completion only if this task graph belongs to the new prompt."
        )
    if state.get("status") in {"cancelled", "blocked", "max_iterations"}:
        warnings.append(f"previous Ralph loop stopped with status={state.get('status')}.")
    return "\n".join(f"warning: {item}" for item in warnings)


def archive_loop_dir(root: Path) -> Path | None:
    source = loop_dir(root)
    if not source.exists():
        return None
    timestamp = datetime.now().astimezone().strftime("%Y%m%d-%H%M%S")
    target = root / f".codex-loop.archive-{timestamp}"
    counter = 1
    while target.exists():
        target = root / f".codex-loop.archive-{timestamp}-{counter}"
        counter += 1
    source.rename(target)
    return target


def refresh_context(root: Path, source: str) -> None:
    script = root / "scripts" / "context_engine.py"
    if not script.exists():
        return
    subprocess.run(
        [sys.executable, str(script), "refresh", "--source", source],
        cwd=root,
        capture_output=True,
        text=True,
    )


def cmd_start(args: argparse.Namespace) -> int:
    root = project_root()
    path = state_path(root)
    current = load_state(path)
    if current.get("active") and not args.force:
        print("An active Ralph loop already exists. Use --force to replace it.", file=sys.stderr)
        return 2

    timestamp = now_iso()
    normalized_max_iterations = normalize_max_iterations(args.max_iterations)
    payload: dict[str, Any] = {
        "version": 2,
        "active": True,
        "status": "active",
        "prompt": args.prompt.strip(),
        "completionPromise": args.completion_promise,
        "maxIterations": normalized_max_iterations,
        "currentIteration": 0,
        "startedAt": timestamp,
        "updatedAt": timestamp,
        "lastAssistantMessage": "",
        "lastContinuationPrompt": "",
        "requireTaskCompletion": bool(args.require_task_completion),
    }
    write_state(path, payload)
    refresh_context(root, "ralph-session-start")

    print("Ralph loop armed.")
    print(f"- state: {path}")
    print(f"- completion promise: {payload['completionPromise']}")
    print(f"- max iterations: {display_max_iterations(payload['maxIterations'])}")
    return 0


def cmd_cancel(args: argparse.Namespace) -> int:
    root = project_root()
    path = state_path(root)
    current = load_state(path)
    if not current.get("active"):
        print("No active Ralph loop.")
        return 0

    current["active"] = False
    current["status"] = "cancelled"
    current["cancelledAt"] = now_iso()
    current["updatedAt"] = current["cancelledAt"]
    if args.reason:
        current["cancelReason"] = args.reason
    write_state(path, current)
    refresh_context(root, "ralph-session-cancel")

    print("Cancelled the active Ralph loop.")
    print(f"- state: {path}")
    return 0


def cmd_archive(args: argparse.Namespace) -> int:
    root = project_root()
    path = state_path(root)
    current = load_state(path)
    if current.get("active") and not args.force:
        print("An active Ralph loop exists. Cancel it first or use --force.", file=sys.stderr)
        return 2

    archived = archive_loop_dir(root)
    if archived is None:
        print("No .codex-loop directory to archive.")
        return 0

    print("Archived Ralph project state.")
    print(f"- archived: {archived}")
    return 0


def cmd_status(args: argparse.Namespace) -> int:
    root = project_root()
    path = state_path(root)
    current = load_state(path)
    if args.json:
        print(json.dumps(current, ensure_ascii=False, indent=2))
        return 0
    if not current:
        print("No Ralph loop state file yet.")
        if tasks_path(root).exists():
            print("warning: task graph exists without a Ralph session state.")
        return 0

    print(f"active: {bool(current.get('active'))}")
    print(f"상태: {current.get('status', '알 수 없음')}")
    print(f"current iteration: {current.get('currentIteration', 0)}")
    print(f"completion promise: {current.get('completionPromise', DEFAULT_COMPLETION_PROMISE)}")
    print(f"max iterations: {display_max_iterations(current.get('maxIterations', DEFAULT_MAX_ITERATIONS))}")
    print(f"require task completion: {bool(current.get('requireTaskCompletion'))}")
    warning = stale_state_warning(root, current)
    if warning:
        print(warning)
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Manage the hook-native Ralph loop state.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    start = subparsers.add_parser("start", help="Start or replace the active Ralph loop")
    start.add_argument("--prompt", required=True, help="Original task prompt to keep replaying")
    start.add_argument("--completion-promise", default=DEFAULT_COMPLETION_PROMISE, help="String that marks real completion")
    start.add_argument("--max-iterations", type=int, default=DEFAULT_MAX_ITERATIONS, help="Maximum Stop-hook continuations before allowing the turn to end. Use 0 for until-complete.")
    start.add_argument("--force", action="store_true", help="Replace an existing active loop")
    start.add_argument("--require-task-completion", action="store_true", help="Require .codex-loop/tasks.json to be complete before accepting the completion promise. Off by default to avoid stale task leakage between prompts.")
    start.set_defaults(func=cmd_start)

    cancel = subparsers.add_parser("cancel", help="Cancel the active Ralph loop")
    cancel.add_argument("--reason", help="Optional cancellation reason")
    cancel.set_defaults(func=cmd_cancel)

    archive = subparsers.add_parser("archive", help="Archive the project .codex-loop directory so a new run starts cleanly")
    archive.add_argument("--force", action="store_true", help="Archive even if the loop state says it is active")
    archive.set_defaults(func=cmd_archive)

    status = subparsers.add_parser("status", help="Show the active Ralph loop state")
    status.add_argument("--json", action="store_true", help="Print raw JSON")
    status.set_defaults(func=cmd_status)
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
