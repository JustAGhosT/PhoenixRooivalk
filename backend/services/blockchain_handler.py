"""
High-level blockchain handler orchestrating provider operations, logging, retries, and outbox fallbacks.
"""
from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from typing import Any, Dict, Optional

from .blockchain.etherlink_provider import EtherlinkProvider
from .blockchain import (
    BlockchainTransientError,
    BlockchainPermanentError,
    get_logger,
    CorrelationId,
)
from .blockchain.outbox import enqueue, process_outbox, OutboxItem
from . import evidence_log
import os

_logger = get_logger()


@dataclass
class ProviderConfig:
    endpoint: str
    network: str = "etherlink-mainnet"


class BlockchainHandler:
    """
    Wraps provider to expose stable high-level operations and integrate with the outbox queue.
    """

    def __init__(self, config: ProviderConfig) -> None:
        self._provider = EtherlinkProvider(endpoint=config.endpoint, network=config.network)

    def _gen_job_id(self, op_type: str, payload: Dict[str, Any]) -> str:
        raw = json.dumps({"op": op_type, "payload": payload}, sort_keys=True).encode("utf-8")
        return hashlib.sha256(raw).hexdigest()

    def submit_transaction(self, tx: Dict[str, Any], *, correlation_id: Optional[str] = None) -> str:
        with CorrelationId(correlation_id):
            try:
                _logger.info("submit_tx_start", extra={"provider": self._provider.name(), "network": self._provider.network()})
                tx_hash = self._provider.send_transaction(tx)
                _logger.info("submit_tx_ok", extra={"txHash": tx_hash})
                return tx_hash
            except BlockchainTransientError as ex:
                _logger.warning("submit_tx_transient", extra={"error": str(ex)})
                # Enqueue for retry by the outbox worker
                job_id = self._gen_job_id("submit_tx", tx)
                enqueue(job_id, "submit_tx", {"tx": tx})
                raise
            except BlockchainPermanentError as ex:
                _logger.error("submit_tx_permanent", extra={"error": str(ex)})
                raise

    def wait_for_receipt(self, tx_hash: str, *, timeout: Optional[float] = None, correlation_id: Optional[str] = None) -> Dict[str, Any]:
        with CorrelationId(correlation_id):
            _logger.info("wait_receipt_start", extra={"txHash": tx_hash})
            receipt = self._provider.get_receipt(tx_hash, timeout=timeout)
            _logger.info("wait_receipt_ok", extra={"txHash": tx_hash, "status": receipt.get("status")})
            return receipt

    # Evidence hashing (off-chain) with optional future anchoring
    def record_event_evidence(
        self,
        event_type: str,
        payload: Dict[str, Any],
        *,
        enqueue_anchor: bool = False,
        correlation_id: Optional[str] = None,
    ) -> str:
        """Record an evidence entry and return its SHA-256 digest.

        - Stores an append-only JSONL entry using `backend/services/evidence_log.py`.
        - If `enqueue_anchor` is True, schedule a background outbox job to anchor
          the digest on-chain at a later time (implementation-specific and optional).
        """
        with CorrelationId(correlation_id):
            digest = evidence_log.record_event(event_type, payload)
            _logger.info("evidence_recorded", extra={"type": event_type, "sha256": digest})

            if enqueue_anchor:
                job_id = self._gen_job_id("anchor_digest", {"sha256": digest, "type": event_type})
                # Note: actual on-chain anchoring implementation is application-specific.
                # This outbox item is a placeholder for a deployment that supports anchoring.
                enqueue(job_id, "anchor_digest", {"sha256": digest, "type": event_type})
                _logger.info("anchor_enqueued", extra={"jobId": job_id, "sha256": digest})

            return digest

    # Outbox processing glue
    def process_outbox_batch(self, *, max_attempts: int = 10, batch_limit: int = 50) -> None:
        def handler(item: OutboxItem) -> None:
            if item.op_type == "submit_tx":
                tx = item.payload["tx"]
                # Attempt to submit again; let provider retries handle transient spikes
                self._provider.send_transaction(tx)
            elif item.op_type == "anchor_digest":
                # Chain-specific anchoring path. Currently supports Solana via Memo program.
                digest = item.payload.get("sha256")
                if not isinstance(digest, str) or len(digest) != 64:
                    raise BlockchainPermanentError("anchor_digest payload missing or invalid 'sha256'")

                chain = (os.getenv("EVIDENCE_ANCHOR_CHAIN") or "").strip().lower()
                if chain == "solana":
                    try:
                        from . import solana_anchor  # lazy import

                        sig = solana_anchor.anchor_digest_memo_retry(digest)
                        _logger.info("anchor_digest_solana_ok", extra={"sig": sig, "sha256": digest})
                    except Exception as ex:
                        # Treat unexpected errors as permanent to avoid infinite retries.
                        _logger.error("anchor_digest_solana_error", extra={"error": str(ex), "sha256": digest})
                        raise BlockchainPermanentError(str(ex))
                else:
                    # No chain configured; log and drop as permanent no-op.
                    _logger.warning(
                        "anchor_digest_no_chain_configured",
                        extra={"sha256": digest, "hint": "Set EVIDENCE_ANCHOR_CHAIN=solana and SOLANA_* vars"},
                    )
            else:
                raise BlockchainPermanentError(f"Unknown op_type: {item.op_type}")

        process_outbox(handler, max_attempts=max_attempts, batch_limit=batch_limit)
