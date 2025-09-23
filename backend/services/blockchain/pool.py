"""
HTTP session and provider pooling utilities.
"""
from __future__ import annotations

import functools
from threading import RLock
from typing import Dict, Tuple

import requests  # type: ignore[import-not-found]
from requests.adapters import HTTPAdapter  # type: ignore[import-not-found]

from .logger import get_logger

_logger = get_logger()


def build_pooled_session(
    *, pool_connections: int = 10, pool_maxsize: int = 50, timeout: Tuple[float, float] = (3.05, 10.0)
) -> requests.Session:
    session = requests.Session()
    adapter = HTTPAdapter(pool_connections=pool_connections, pool_maxsize=pool_maxsize, max_retries=0)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    # Ensure a default timeout is applied
    session.request = functools.partial(session.request, timeout=timeout)  # type: ignore[method-assign]
    return session


class ProviderFactory:
    """
    Lazily constructs and caches RPC provider clients keyed by endpoint/network.
    Avoids re-creating HTTP connections by reusing a pooled requests.Session.
    """

    def __init__(self) -> None:
        self._lock = RLock()
        self._web3_cache: Dict[Tuple[str, str], object] = {}
        self._session = build_pooled_session()

    def get_web3(self, endpoint: str, network: str) -> object:
        key = (endpoint, network)
        with self._lock:
            if key in self._web3_cache:
                return self._web3_cache[key]
            # Import web3 at call-time to avoid hard dependency at import-time
            try:
                from web3 import HTTPProvider, Web3  # type: ignore
            except Exception as ex:  # pragma: no cover - import-time dependency
                _logger.error("web3_import_failed", extra={"error": str(ex)})
                raise
            w3 = Web3(HTTPProvider(endpoint_uri=endpoint, session=self._session))
            self._web3_cache[key] = w3
            return w3


# Singleton factory for convenience
provider_factory = ProviderFactory()
