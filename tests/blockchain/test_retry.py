import unittest
from typing import List

from backend.services.blockchain.errors import BlockchainTransientError, BlockchainPermanentError
from backend.services.blockchain.retry import retry_on_transient


class TestRetryLogic(unittest.TestCase):
    def test_retries_on_transient_then_succeeds(self):
        # Arrange
        calls: List[int] = []

        class Svc:
            def __init__(self):
                self.failures = 2

            @retry_on_transient(max_attempts=5, base_delay=0.0, max_delay=0.0)
            def op(self) -> int:
                calls.append(1)
                if self.failures > 0:
                    self.failures -= 1
                    raise BlockchainTransientError("temp")
                return 42

        svc = Svc()

        # Act
        result = svc.op()

        # Assert
        self.assertEqual(result, 42)
        self.assertEqual(len(calls), 3)  # 2 failures + 1 success

    def test_stops_on_permanent_error_without_retry(self):
        # Arrange
        calls: List[int] = []

        class Svc:
            @retry_on_transient(max_attempts=5, base_delay=0.0, max_delay=0.0)
            def op(self) -> int:
                calls.append(1)
                raise BlockchainPermanentError("bad")

        svc = Svc()

        # Act / Assert
        with self.assertRaises(BlockchainPermanentError):
            svc.op()
        self.assertEqual(len(calls), 1)


if __name__ == "__main__":
    unittest.main()
