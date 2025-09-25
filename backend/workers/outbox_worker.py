"""
Outbox worker: periodically processes blockchain outbox operations.

- Calls BlockchainHandler.process_outbox_batch() on a schedule.
- Configurable via environment variables.

Environment:
- PROVIDER_ENDPOINT: optional endpoint string for ProviderConfig (default: http://localhost)
- PROVIDER_NETWORK: optional network name (default: etherlink-mainnet)
- OUTBOX_INTERVAL_SEC: sleep interval between batches (default: 10)
- OUTBOX_BATCH_LIMIT: max operations per batch (default: 50)
- OUTBOX_MAX_ATTEMPTS: max attempts passed to process_outbox (default: 10)

Anchoring configuration (if anchoring digests on Solana):
- EVIDENCE_ANCHOR_CHAIN=solana
- SOLANA_RPC_URL, SOLANA_SECRET_KEY, SOLANA_COMMITMENT

Run:
    python -m backend.workers.outbox_worker
"""
from __future__ import annotations

import os
import time
from typing import Optional

from backend.services.blockchain_handler import BlockchainHandler, ProviderConfig


def _get_env_int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, str(default)))
    except ValueError:
        return default


def main() -> None:
    endpoint = os.getenv("PROVIDER_ENDPOINT", "http://localhost")
    network = os.getenv("PROVIDER_NETWORK", "etherlink-mainnet")

    interval = _get_env_int("OUTBOX_INTERVAL_SEC", 10)
    batch_limit = _get_env_int("OUTBOX_BATCH_LIMIT", 50)
    max_attempts = _get_env_int("OUTBOX_MAX_ATTEMPTS", 10)

    handler = BlockchainHandler(ProviderConfig(endpoint=endpoint, network=network))

    while True:
        try:
            handler.process_outbox_batch(max_attempts=max_attempts, batch_limit=batch_limit)
        except Exception as ex:  # noqa: BLE001
            # Best-effort logging without introducing a logging dependency here
            print(f"[outbox_worker] error: {ex}")
        time.sleep(interval)


if __name__ == "__main__":
    main()
