"""
Blockchain services package.

Exports key interfaces and helpers for provider implementations and handlers.
"""
from .errors import (
    BlockchainError,
    BlockchainTransientError,
    BlockchainPermanentError,
)
from .retry import retry_on_transient
from .logger import get_logger, with_correlation_id, CorrelationId
from .base_provider import BaseBlockchainProvider

# Note: EtherlinkProvider is intentionally NOT imported here to avoid heavy dependencies
# (web3/requests) at package import time, which can interfere with test discovery.
# Import it directly from .etherlink_provider where needed.
