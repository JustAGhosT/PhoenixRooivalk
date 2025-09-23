"""
Etherlink provider implementation using web3.py with pooled HTTP sessions.
"""
from __future__ import annotations

from typing import Any, Dict, Optional

import requests  # type: ignore[import-not-found]
from web3 import Web3  # type: ignore[import-not-found]
from web3.types import RPCEndpoint  # type: ignore[import-not-found]

from .base_provider import BaseBlockchainProvider
from .errors import BlockchainPermanentError, BlockchainTransientError
from .logger import get_logger
from .pool import provider_factory
from .retry import retry_on_transient

_logger = get_logger()


class EtherlinkProvider(BaseBlockchainProvider):
    def __init__(self, *, endpoint: str, network: str = "etherlink-mainnet") -> None:
        self._endpoint = endpoint
        self._network = network
        self._w3: Web3 = provider_factory.get_web3(endpoint, network)  # type: ignore[assignment]

    def name(self) -> str:
        return "etherlink"

    def network(self) -> str:
        return self._network

    def _classify_error(self, ex: Exception) -> Exception:
        # Transient classes: network connectivity and timeouts
        transient_types = (
            requests.exceptions.ConnectionError,
            requests.exceptions.Timeout,
        )
        # Certain web3 exceptions might be transient (HTTP 429/5xx)
        msg = str(ex).lower()
        if isinstance(ex, transient_types) or any(code in msg for code in ["429", "503", "502", "504", "connection reset", "timed out"]):
            return BlockchainTransientError(
                f"Transient RPC error: {ex}",
                code="TRANSIENT",
                context={"provider": self.name(), "endpoint": self._endpoint},
            )
        return BlockchainPermanentError(
            f"Permanent RPC error: {ex}",
            code="PERMANENT",
            context={"provider": self.name(), "endpoint": self._endpoint},
        )

    @retry_on_transient(max_attempts=5, base_delay=0.5, max_delay=8.0)
    def send_transaction(self, tx: Dict[str, Any]) -> str:
        try:
            # tx should be a signed raw transaction (hexstr) or dict
            if "raw" in tx:
                tx_hash = self._w3.eth.send_raw_transaction(tx["raw"])  # type: ignore[no-untyped-call]
            else:
                tx_hash = self._w3.eth.send_transaction(tx)  # type: ignore[no-untyped-call]
            return tx_hash.hex() if hasattr(tx_hash, "hex") else str(tx_hash)
        except Exception as ex:  # noqa: BLE001
            raise self._classify_error(ex)

    @retry_on_transient(max_attempts=6, base_delay=1.0, max_delay=12.0)
    def get_receipt(self, tx_hash: str, *, timeout: Optional[float] = None) -> Dict[str, Any]:
        try:
            receipt = self._w3.eth.wait_for_transaction_receipt(tx_hash, timeout=timeout)  # type: ignore[no-untyped-call]
            return dict(receipt)  # web3 returns AttributeDict
        except Exception as ex:  # noqa: BLE001
            raise self._classify_error(ex)

    @retry_on_transient(max_attempts=5, base_delay=0.5, max_delay=8.0)
    def call(self, method: str, *params: Any) -> Any:
        try:
            return self._w3.manager.request_blocking(RPCEndpoint(method), params)  # type: ignore[arg-type]
        except Exception as ex:  # noqa: BLE001
            raise self._classify_error(ex)
