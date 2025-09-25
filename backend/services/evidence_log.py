"""
Append-only evidence logger for mission events.

- Stores JSON Lines (one JSON object per line) in an append-only file.
- Each record contains: ISO8601 timestamp, event type, SHA-256 of canonical payload, and the payload itself.
- Returns the hex digest for downstream anchoring or correlation.

Public-safe; intended for dev/test by default. Do not store classified content on public infrastructure.
"""
from __future__ import annotations

import hashlib
import io
import json
import os
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from contextlib import contextmanager


_DEFAULT_EVIDENCE_PATH = os.getenv(
    "EVIDENCE_LOG_PATH",
    os.path.join(os.getcwd(), "blockchain_evidence.jsonl"),
)


def _canonical_json(data: Any) -> bytes:
    """Return canonical JSON bytes for hashing and storage (sorted keys, no whitespace)."""
    return json.dumps(data, sort_keys=True, separators=(",", ":")).encode("utf-8")


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def record_event(
    event_type: str,
    payload: Dict[str, Any],
    *,
    evidence_path: Optional[str] = None,
) -> str:
    """
    Append an evidence record and return the SHA-256 hex digest of the canonical payload.

    Parameters:
    - event_type: short descriptor (e.g., "flight_log_hash", "engagement_summary")
    - payload: dict containing the event data (non-binary)
    - evidence_path: optional override for the destination JSONL file
    """
    if not isinstance(event_type, str) or not event_type.strip():
        raise ValueError("event_type must be a non-empty string")

    path = evidence_path or _DEFAULT_EVIDENCE_PATH

    # Compute canonical hash
    canonical = _canonical_json(payload)
    digest = hashlib.sha256(canonical).hexdigest()

    record = {
        "ts": _now_iso(),
        "type": event_type.strip(),
        "sha256": digest,
        # Store original payload; hashing still uses canonical bytes for stability
        "payload": payload,
    }

    # Ensure directory exists
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)

    # Append using cross-platform file locking to avoid interleaving between processes
    line = json.dumps(record, separators=(",", ":")) + "\n"
    _append_line_locked(path, line)

    return digest


@contextmanager
def _exclusive_lock(f):
    """Cross-platform exclusive file lock for the given file object."""
    if os.name == "nt":  # Windows
        try:
            import msvcrt  # type: ignore
        except Exception:
            # Best-effort: lock unavailable; proceed without
            yield
            return
        try:
            # Lock the whole file by locking a large region from start
            f.seek(0)
            msvcrt.locking(f.fileno(), msvcrt.LK_LOCK, 0x7FFFFFFF)
            yield
        finally:
            try:
                f.seek(0)
                msvcrt.locking(f.fileno(), msvcrt.LK_UNLCK, 0x7FFFFFFF)
            except Exception:
                pass
    else:  # POSIX
        try:
            import fcntl  # type: ignore
        except Exception:
            # Best-effort: lock unavailable; proceed without
            yield
            return
        try:
            fcntl.flock(f.fileno(), fcntl.LOCK_EX)
            yield
        finally:
            try:
                fcntl.flock(f.fileno(), fcntl.LOCK_UN)
            except Exception:
                pass


def _append_line_locked(path: str, line: str) -> None:
    """Append a single line to the file with an exclusive lock and fsync."""
    with io.open(path, mode="a", encoding="utf-8") as f:
        with _exclusive_lock(f):
            f.write(line)
            f.flush()
            try:
                os.fsync(f.fileno())
            except Exception:
                # Not all filesystems support fsync; best-effort
                pass
