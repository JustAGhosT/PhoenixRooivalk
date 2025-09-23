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
        "payload": json.loads(canonical.decode("utf-8")),  # stored in canonical form
    }

    # Ensure directory exists
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)

    # Append atomically-ish using text mode with explicit newline
    line = json.dumps(record, separators=(",", ":")) + "\n"
    with io.open(path, mode="a", encoding="utf-8") as f:
        f.write(line)

    return digest
