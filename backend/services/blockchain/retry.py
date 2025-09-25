"""
Retry utilities with exponential backoff and full jitter for transient blockchain errors.
"""
from __future__ import annotations

import random
import time
from functools import wraps
from typing import Callable, TypeVar, Any, Optional

from .errors import BlockchainTransientError
from .logger import get_logger

F = TypeVar("F", bound=Callable[..., Any])


def _compute_backoff(attempt: int, base_delay: float, max_delay: float) -> float:
    delay = min(max_delay, base_delay * (2 ** (attempt - 1)))
    return random.uniform(0, delay)  # full jitter


def retry_on_transient(
    *,
    max_attempts: int = 5,
    base_delay: float = 0.5,
    max_delay: float = 8.0,
    on_retry: Optional[Callable[[int, float, Exception], None]] = None,
) -> Callable[[F], F]:
    """
    Retry a function when it raises BlockchainTransientError.

    - Exponential backoff with full jitter.
    - Logs each retry attempt.
    """

    def decorator(func: F) -> F:
        logger = get_logger()

        @wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            attempt = 0
            while True:
                try:
                    return func(*args, **kwargs)
                except BlockchainTransientError as ex:  # type: ignore[misc]
                    attempt += 1
                    if attempt >= max_attempts:
                        logger.error(
                            "retry_exhausted",
                            extra={
                                "op": func.__name__,
                                "attempt": attempt,
                                "error": str(ex),
                            },
                        )
                        raise
                    sleep = _compute_backoff(attempt, base_delay, max_delay)
                    if on_retry:
                        on_retry(attempt, sleep, ex)
                    logger.warning(
                        "transient_retry",
                        extra={
                            "op": func.__name__,
                            "attempt": attempt,
                            "sleep_s": round(sleep, 3),
                            "error": str(ex),
                        },
                    )
                    time.sleep(sleep)

        return wrapper  # type: ignore[return-value]

    return decorator
