"""
Structured logging helpers with correlation ID propagation.
"""
from __future__ import annotations

import contextvars
import logging
import sys
import uuid
from contextlib import contextmanager
from typing import Optional

# Correlation id stored in a context variable for per-request/task association
_correlation_id: contextvars.ContextVar[str] = contextvars.ContextVar("correlation_id", default="-")


class CorrelationFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.correlation_id = _correlation_id.get()
        return True


def get_logger(name: str = "blockchain") -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            fmt="%(asctime)s %(levelname)s %(name)s corr=%(correlation_id)s %(message)s",
            datefmt="%Y-%m-%dT%H:%M:%S%z",
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    # Avoid adding duplicate filters
    if not any(isinstance(f, CorrelationFilter) for f in logger.filters):
        logger.addFilter(CorrelationFilter())

    return logger


@contextmanager
def CorrelationId(corr_id: Optional[str] = None):  # noqa: N802 (keep PascalCase as per user C# style note not applicable to Python)
    token = _correlation_id.set(corr_id or str(uuid.uuid4()))
    try:
        yield _correlation_id.get()
    finally:
        _correlation_id.reset(token)


def with_correlation_id(func):
    def wrapper(*args, **kwargs):
        with CorrelationId():
            return func(*args, **kwargs)

    return wrapper
