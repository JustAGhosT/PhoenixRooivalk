"""
Solana on-chain anchoring via the Memo program.

This module provides a minimal helper to anchor a SHA-256 digest (hex) to the
Solana blockchain by submitting a transaction that includes a Memo instruction
containing the digest. This is suitable for anchoring tamper-evidence without
exposing raw data on-chain.

Dependencies:
- Optional runtime dependency on `solana` and `solders` packages (solana-py).
  If not installed, `anchor_digest_memo` raises a clear ImportError with guidance.

Environment variables (optional defaults):
- SOLANA_RPC_URL: RPC endpoint URL (e.g., https://api.mainnet-beta.solana.com)
- SOLANA_COMMITMENT: commitment level (processed, confirmed, finalized). Default: confirmed
- SOLANA_PAYER: Base58 public key (optional, informational only)
- SOLANA_SECRET_KEY: The secret key in JSON array format (64-byte seed or keypair),
  compatible with solana-keygen output. Alternatively, a path to a JSON file prefixed with
  "file://" may be provided.

Security note:
- Do NOT store real secrets in the repository. Use environment variables or secret stores.
"""
from __future__ import annotations

import json
import os
import random
import time
from typing import Optional, Callable


class SolanaAnchorUnavailable(RuntimeError):
    pass


def _load_keypair(secret: str):
    try:
        from solders.keypair import Keypair  # type: ignore
    except Exception as ex:  # pragma: no cover - import guard
        raise ImportError(
            "solana/solders not installed. Install with: pip install solana solders"
        ) from ex

    if secret.startswith("file://"):
        path = secret[len("file://") :]
        with open(path, "r", encoding="utf-8") as f:
            arr = json.load(f)
    else:
        arr = json.loads(secret)
    if not isinstance(arr, list):
        raise ValueError("SOLANA_SECRET_KEY must be a JSON array or file:// path to JSON array")
    return Keypair.from_secret_key(bytes(arr))


def anchor_digest_memo(
    digest_hex: str,
    *,
    rpc_url: Optional[str] = None,
    secret_key_json: Optional[str] = None,
    commitment: Optional[str] = None,
) -> str:
    """
    Anchor a hex digest on Solana using the Memo program. Returns the transaction signature.

    Parameters:
      - digest_hex: hex string (64 chars for SHA-256)
      - rpc_url: Solana RPC URL; falls back to SOLANA_RPC_URL
      - secret_key_json: JSON array for the secret key or file:// path; falls back to SOLANA_SECRET_KEY
      - commitment: processed|confirmed|finalized; defaults to env or 'confirmed'
    """
    rpc = rpc_url or os.getenv("SOLANA_RPC_URL")
    if not rpc:
        raise SolanaAnchorUnavailable("SOLANA_RPC_URL not set")

    secret = secret_key_json or os.getenv("SOLANA_SECRET_KEY")
    if not secret:
        raise SolanaAnchorUnavailable("SOLANA_SECRET_KEY not set")

    level = (commitment or os.getenv("SOLANA_COMMITMENT") or "confirmed").lower()

    try:
        # Lazy imports so the rest of the app doesn't require solana deps
        from solders.pubkey import Pubkey  # type: ignore
        from solders.system_program import ID as SYSTEM_PROGRAM_ID  # noqa: F401
        from solders.message import MessageV0  # type: ignore
        from solders.instruction import Instruction  # type: ignore
        from solana.rpc.api import Client  # type: ignore
        from solders.hash import Hash  # type: ignore
        from solders.transaction import VersionedTransaction  # type: ignore
    except Exception as ex:  # pragma: no cover - import guard
        raise ImportError(
            "solana/solders not installed. Install with: pip install solana solders"
        ) from ex

    payer = _load_keypair(secret)

    memo_program_id = Pubkey.from_string("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
    memo_data = digest_hex.encode("utf-8")

    # Build memo instruction
    ix = Instruction(program_id=memo_program_id, accounts=[], data=memo_data)

    # RPC client
    client = Client(rpc)

    # Get recent blockhash
    resp = client.get_latest_blockhash(commitment=level)
    if not resp.value:
        raise RuntimeError("Failed to fetch recent blockhash")
    blockhash = resp.value.blockhash

    msg = MessageV0.try_compile(payer.pubkey(), [ix], [], Hash.from_string(str(blockhash)))
    tx = VersionedTransaction(msg, [payer])

    sig = client.send_transaction(tx, opts={"skip_preflight": False, "preflight_commitment": level})
    # The solana-py client returns RPC response object; extract signature
    signature = str(sig.value) if getattr(sig, "value", None) else str(sig)
    return signature


def _is_transient_error(ex: Exception) -> bool:
    """Best-effort check for transient RPC errors that merit a retry.

    We avoid tight coupling to specific exception classes to keep optional deps minimal.
    """
    msg = str(ex).lower()
    transient_markers = [
        "rate limit",
        "429",
        "timeout",
        "temporarily unavailable",
        "connection reset",
        "gateway timeout",
        "blockhash not found",
        "preflight transaction was not confirmed",
    ]
    return any(m in msg for m in transient_markers)


def anchor_digest_memo_retry(
    digest_hex: str,
    *,
    rpc_url: Optional[str] = None,
    secret_key_json: Optional[str] = None,
    commitment: Optional[str] = None,
    max_attempts: int = 5,
    base_delay_sec: float = 0.5,
    backoff_factor: float = 2.0,
    jitter_sec: float = 0.2,
) -> str:
    """Retry wrapper for anchor_digest_memo with exponential backoff and jitter.

    Raises the last exception if all retries fail or a non-transient error occurs.
    """
    attempt = 0
    last_error: Optional[Exception] = None
    while attempt < max_attempts:
        try:
            return anchor_digest_memo(
                digest_hex,
                rpc_url=rpc_url,
                secret_key_json=secret_key_json,
                commitment=commitment,
            )
        except Exception as ex:  # noqa: BLE001
            last_error = ex
            if not _is_transient_error(ex):
                raise
            # sleep with backoff and jitter
            delay = base_delay_sec * (backoff_factor ** attempt) + random.uniform(0, jitter_sec)
            time.sleep(delay)
            attempt += 1
    assert last_error is not None
    raise last_error
