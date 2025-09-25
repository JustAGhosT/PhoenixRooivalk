from __future__ import annotations

import io
import json
import os
import tempfile
from typing import Any, Dict

from backend.services import evidence_log


def read_jsonl(path: str) -> list[Dict[str, Any]]:
    items: list[Dict[str, Any]] = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            items.append(json.loads(line))
    return items


def test_record_event_canonical_hash_and_append_only() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        out = os.path.join(tmp, "ev.jsonl")

        payload1 = {"b": 2, "a": 1}
        payload1_equiv = {"a": 1, "b": 2}

        # Hash should be identical for semantically equivalent dicts (canonicalization)
        h1 = evidence_log.record_event("test", payload1, evidence_path=out)
        h1b = evidence_log.record_event("test", payload1_equiv, evidence_path=out)
        assert h1 == h1b

        # Append-only: two lines should exist now
        items = read_jsonl(out)
        assert len(items) == 2

        # Each record must contain required fields
        for rec in items:
            assert set(rec.keys()) == {"ts", "type", "sha256", "payload"}
            assert isinstance(rec["ts"], str) and rec["ts"]
            assert rec["type"] == "test"
            assert isinstance(rec["sha256"], str) and len(rec["sha256"]) == 64
            assert rec["payload"] == {"a": 1, "b": 2}  # canonical order

        # Third record should append as well
        h2 = evidence_log.record_event("other", {"x": 3}, evidence_path=out)
        items2 = read_jsonl(out)
        assert len(items2) == 3
        assert items2[-1]["type"] == "other"
        assert items2[-1]["payload"] == {"x": 3}
        assert items2[-1]["sha256"] == h2


def test_record_event_rejects_empty_type() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        out = os.path.join(tmp, "ev.jsonl")
        try:
            evidence_log.record_event(" ", {"a": 1}, evidence_path=out)
            assert False, "expected ValueError"
        except ValueError:
            pass
