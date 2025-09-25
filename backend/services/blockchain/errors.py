"""
Domain-specific exceptions for blockchain operations.
"""
from typing import Optional


class BlockchainError(Exception):
    """Base class for all blockchain-related errors."""

    def __init__(self, message: str, *, code: Optional[str] = None, context: Optional[dict] = None):
        super().__init__(message)
        self.code = code
        self.context = context or {}


class BlockchainTransientError(BlockchainError):
    """Errors that are expected to resolve on retry (timeouts, rate limits, connection resets)."""


class BlockchainPermanentError(BlockchainError):
    """Errors that retrying will not fix (validation, malformed tx, nonce issues not attributable to race conditions)."""
