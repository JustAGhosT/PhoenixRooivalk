import os
import tempfile
import time
import unittest
from datetime import datetime, timedelta, timezone

from backend.services.blockchain.errors import BlockchainPermanentError, BlockchainTransientError
from backend.services.blockchain import logger as logger_mod
from backend.services.blockchain.outbox import (
    enqueue,
    fetch_due,
    increment_attempts,
    mark_dead,
    mark_done,
    process_outbox,
)


class TestOutbox(unittest.TestCase):
    def setUp(self):
        # Arrange: isolate SQLITE file per test
        self._tmpdir = tempfile.TemporaryDirectory()
        os.environ["BLOCKCHAIN_OUTBOX_DB"] = os.path.join(self._tmpdir.name, "outbox.sqlite3")
        # Re-import module-level DB init
        import importlib
        import backend.services.blockchain.outbox as outbox_mod

        importlib.reload(outbox_mod)  # re-run schema init for isolated DB
        self.outbox = outbox_mod
        # Quiet logs
        logger_mod.get_logger().setLevel("CRITICAL")

    def tearDown(self):
        self._tmpdir.cleanup()

    def test_enqueue_and_mark_done(self):
        # Arrange
        job_id = "job-1"
        self.outbox.enqueue(job_id, "submit_tx", {"tx": {"_": 1}})

        # Act
        due = self.outbox.fetch_due(limit=10)

        # Assert
        self.assertEqual(len(due), 1)
        self.assertEqual(due[0].id, job_id)

        # Act 2: mark done
        mark_done(job_id)
        due2 = fetch_due(limit=10)
        self.assertEqual(len(due2), 0)

    def test_transient_retry_schedules_backoff(self):
        # Arrange
        job_id = "job-2"
        enqueue(job_id, "submit_tx", {"tx": {"_": 2}})

        def handler(_item):
            raise BlockchainTransientError("temp")

        # Act: process once -> schedules retry
        process_outbox(handler, max_attempts=3, batch_limit=10)
        items = fetch_due(limit=10)

        # Assert: after processing, it should not be immediately due (next_attempt_at > now)
        self.assertEqual(len(items), 0)

    def test_dlq_after_max_attempts(self):
        # Arrange
        job_id = "job-3"
        enqueue(job_id, "submit_tx", {"tx": {"_": 3}})

        def handler(_item):
            raise BlockchainTransientError("temp")

        # Act: process until DLQ
        for _ in range(5):
            process_outbox(handler, max_attempts=3, batch_limit=10)
            # Fast-forward by setting next_attempt_at to now
            items = self.outbox.fetch_due(limit=10)
            if not items:
                # Force due by manually decrementing next_attempt_at for the job (not ideal, but simple)
                with self.outbox._connect() as conn:  # type: ignore[attr-defined]
                    conn.execute(
                        "UPDATE outbox SET next_attempt_at = ? WHERE id = ?",
                        ((datetime.now(timezone.utc) - timedelta(seconds=1)).isoformat(), job_id),
                    )

        # Assert: item should no longer be pending
        with self.outbox._connect() as conn:  # type: ignore[attr-defined]
            cur = conn.execute("SELECT status FROM outbox WHERE id = ?", (job_id,))
            row = cur.fetchone()
        self.assertIsNotNone(row)
        self.assertEqual(row[0], "dead")

    def test_permanent_error_marks_dead_immediately(self):
        # Arrange
        job_id = "job-4"
        enqueue(job_id, "submit_tx", {"tx": {"_": 4}})

        def handler(_item):
            raise BlockchainPermanentError("bad")

        # Act
        process_outbox(handler, max_attempts=10, batch_limit=10)

        # Assert
        with self.outbox._connect() as conn:  # type: ignore[attr-defined]
            cur = conn.execute("SELECT status FROM outbox WHERE id = ?", (job_id,))
            row = cur.fetchone()
        self.assertIsNotNone(row)
        self.assertEqual(row[0], "dead")


if __name__ == "__main__":
    unittest.main()
