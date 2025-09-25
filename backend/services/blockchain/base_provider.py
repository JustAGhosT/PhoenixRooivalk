"""
Abstract base class for blockchain providers.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional


class BaseBlockchainProvider(ABC):
    """Contract that concrete providers must implement."""

    @abstractmethod
    def name(self) -> str:
        """Human-readable provider name."""

    @abstractmethod
    def network(self) -> str:
        """Network identifier (e.g., etherlink-mainnet)."""

    @abstractmethod
    def send_transaction(self, tx: Dict[str, Any]) -> str:
        """Send a raw transaction and return tx hash."""

    @abstractmethod
    def get_receipt(self, tx_hash: str, *, timeout: Optional[float] = None) -> Dict[str, Any]:
        """Wait for and return a tx receipt as a dict."""

    @abstractmethod
    def call(self, method: str, *params: Any) -> Any:
        """Low-level RPC call helper for read-only operations."""
