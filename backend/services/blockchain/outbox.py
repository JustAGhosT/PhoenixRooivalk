"""
SQLite-backed outbox for failed blockchain operations with retry scheduling.
"""
from __future__ import annotations

import json
import os
import sqlite3
import threading
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any, Iterable, List, Optional, Callable

from .errors import BlockchainPermanentError, BlockchainTransientError
from .logger import get_logger
from .retry import _compute_backoff  # reuse backoff computation

_logger = get_logger()

_DB_PATH = os.getenv("BLOCKCHAIN_OUTBOX_DB", os.path.join(os.getcwd(), "blockchain_outbox.sqlite3"))

_SCHEMA = """
CREATE TABLE IF NOT EXISTS outbox (
    id TEXT PRIMARY KEY,
    op_type TEXT NOT NULL,
    payload TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    next_attempt_at TEXT NOT NULL,
    last_error TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_outbox_next_attempt ON outbox (status, next_attempt_at);
"""

_lock = threading.RLock()

# Test-friendly time provider (dependency injection for clock)
# In production, this resolves to datetime.now(timezone.utc).
NOW_FN: Callable[[], datetime] = lambda: datetime.now(timezone.utc)

def set_time_provider(now_fn: Callable[[], datetime]) -> None:
    """Override the time provider (intended for tests)."""
    global NOW_FN
    NOW_FN = now_fn

def reset_time_provider() -> None:
    """Reset the time provider to the default (system clock)."""
    global NOW_FN
    NOW_FN = lambda: datetime.now(timezone.utc)


@contextmanager
def _connect():
    with _lock:
        conn = sqlite3.connect(_DB_PATH)
        try:
            yield conn
            conn.commit()
        finally:
            conn.close()


def _init_db():
    with _connect() as conn:
        conn.executescript(_SCHEMA)


_init_db()


@dataclass
class OutboxItem:
    id: str
    op_type: str
    payload: dict
    attempts: int
    next_attempt_at: datetime
    last_error: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime

    @staticmethod
    def from_row(row: Iterable[Any]) -> "OutboxItem":
        r = list(row)
        return OutboxItem(
            id=r[0],
            op_type=r[1],
            payload=json.loads(r[2]),
            attempts=int(r[3]),
            next_attempt_at=datetime.fromisoformat(r[4]),
            last_error=r[5],
            status=r[6],
            created_at=datetime.fromisoformat(r[7]),
            updated_at=datetime.fromisoformat(r[8]),
        )


def enqueue(id: str, op_type: str, payload: dict, *, delay_seconds: int = 0) -> None:
    now = NOW_FN()
    next_at = now + timedelta(seconds=delay_seconds)
    with _connect() as conn:
        conn.execute(
            """
            INSERT OR REPLACE INTO outbox (id, op_type, payload, attempts, next_attempt_at, last_error, status, created_at, updated_at)
            VALUES (?, ?, ?, COALESCE((SELECT attempts FROM outbox WHERE id = ?), 0), ?, COALESCE((SELECT last_error FROM outbox WHERE id = ?), NULL), COALESCE((SELECT status FROM outbox WHERE id = ?), 'pending'), COALESCE((SELECT created_at FROM outbox WHERE id = ?), ?), ?)
            """,
            (
                id,
                op_type,
                json.dumps(payload),
                id,
                next_at.isoformat(),
                id,
                id,
                id,
                now.isoformat(),
                now.isoformat(),
            ),
        )
    _logger.info("outbox_enqueued", extra={"id": id, "op_type": op_type, "next_attempt_at": next_at.isoformat()})


def fetch_due(limit: int = 50) -> List[OutboxItem]:
    now_iso = NOW_FN().isoformat()
    with _connect() as conn:
        cur = conn.execute(
            """
            SELECT id, op_type, payload, attempts, next_attempt_at, last_error, status, created_at, updated_at
            FROM outbox
            WHERE status = 'pending' AND next_attempt_at <= ?
            ORDER BY next_attempt_at ASC
            LIMIT ?
            """,
            (now_iso, limit),
        )
        rows = cur.fetchall()
        return [OutboxItem.from_row(r) for r in rows]


def mark_done(id: str) -> None:
    now = NOW_FN().isoformat()
    with _connect() as conn:
        conn.execute("UPDATE outbox SET status = 'done', updated_at = ? WHERE id = ?", (now, id))
    _logger.info("outbox_done", extra={"id": id})


def mark_dead(id: str, error: str) -> None:
    now = NOW_FN().isoformat()
    with _connect() as conn:
        conn.execute(
            "UPDATE outbox SET status = 'dead', last_error = ?, updated_at = ? WHERE id = ?",
            (error, now, id),
        )
    _logger.error("outbox_dead", extra={"id": id, "error": error})


def increment_attempts(id: str, attempts: int, last_error: str, *, base_delay: float = 0.5, max_delay: float = 60.0) -> None:
    next_delay = _compute_backoff(attempts, base_delay, max_delay)
    next_at = NOW_FN() + timedelta(seconds=next_delay)
    with _connect() as conn:
        conn.execute(
            """
            UPDATE outbox
            SET attempts = ?, last_error = ?, next_attempt_at = ?, updated_at = ?
            WHERE id = ?
            """,
            (attempts, last_error, next_at.isoformat(), NOW_FN().isoformat(), id),
        )
    _logger.warning(
        "outbox_retry_scheduled",
        extra={"id": id, "attempts": attempts, "next_attempt_at": next_at.isoformat(), "last_error": last_error},
    )


def process_outbox(handler_fn, *, max_attempts: int = 10, batch_limit: int = 50) -> None:
    """
    Process due items using the provided handler function.

    handler_fn signature: handler_fn(item: OutboxItem) -> None
    It should raise BlockchainPermanentError or BlockchainTransientError to influence scheduling.
    """
    items = fetch_due(limit=batch_limit)
    for item in items:
        try:
            handler_fn(item)
            mark_done(item.id)
        except BlockchainPermanentError as ex:
            mark_dead(item.id, str(ex))
        except BlockchainTransientError as ex:
            attempts = item.attempts + 1
            if attempts >= max_attempts:
                mark_dead(item.id, f"Retry exhausted: {ex}")
            else:
                increment_attempts(item.id, attempts, str(ex))
        except Exception as ex:  # safeguard
            increment_attempts(item.id, item.attempts + 1, f"Unhandled error: {ex}")


def get_status(id: str) -> Optional[str]:
    """Return the status string for an outbox item, or None if not found.

    Intended for tests and diagnostics; avoids direct DB access in test code.
    """
    with _connect() as conn:
        cur = conn.execute("SELECT status FROM outbox WHERE id = ?", (id,))
        row = cur.fetchone()
    return row[0] if row else None
