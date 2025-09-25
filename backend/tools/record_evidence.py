from __future__ import annotations

import argparse
import json
import os
import sys
from typing import Any, Dict

from backend.services.blockchain_handler import BlockchainHandler, ProviderConfig


def _load_payload(payload_arg: str) -> Dict[str, Any]:
    # If starts with @, treat as file path and load JSON from it
    if payload_arg.startswith("@"):
        path = payload_arg[1:]
        # Validate path to prevent traversal and restrict to a safe base directory.
        # Base directory defaults to current working directory; override via EVIDENCE_PAYLOAD_BASE.
        base_dir = os.path.abspath(os.getenv("EVIDENCE_PAYLOAD_BASE", os.getcwd()))
        abs_path = os.path.abspath(path)
        # Ensure abs_path is within base_dir
        if os.path.commonpath([abs_path, base_dir]) != base_dir:
            raise ValueError("Invalid file path: access outside allowed base directory is not permitted")
        if not os.path.isfile(abs_path):
            raise ValueError(f"Invalid file path: '{path}' does not exist or is not a file")
        with open(abs_path, "r", encoding="utf-8") as f:
            return json.load(f)
    # Else parse as inline JSON
    return json.loads(payload_arg)


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Record evidence and optionally enqueue on-chain anchoring")
    p.add_argument("event_type", help="Short type label, e.g., engagement_summary")
    p.add_argument(
        "payload",
        help="Inline JSON (e.g., '{\"a\":1}') or @path/to/file.json to load from file",
    )
    p.add_argument(
        "--enqueue-anchor",
        action="store_true",
        help="Enqueue an outbox job to anchor the digest on-chain (requires env configuration)",
    )
    p.add_argument(
        "--provider-endpoint",
        default=os.getenv("PROVIDER_ENDPOINT", "http://localhost"),
        help="Provider endpoint for BlockchainHandler (default from PROVIDER_ENDPOINT or http://localhost)",
    )
    p.add_argument(
        "--provider-network",
        default=os.getenv("PROVIDER_NETWORK", "etherlink-mainnet"),
        help="Provider network name (default from PROVIDER_NETWORK or etherlink-mainnet)",
    )

    args = p.parse_args(argv)

    try:
        payload = _load_payload(args.payload)
    except Exception as ex:
        print(f"Failed to parse payload: {ex}", file=sys.stderr)
        return 2

    try:
        handler = BlockchainHandler(ProviderConfig(endpoint=args.provider_endpoint, network=args.provider_network))
        digest = handler.record_event_evidence(args.event_type, payload, enqueue_anchor=args.enqueue_anchor)
    except Exception as ex:
        print(f"Failed to record evidence: {ex}", file=sys.stderr)
        return 2

    print(json.dumps({"sha256": digest}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
