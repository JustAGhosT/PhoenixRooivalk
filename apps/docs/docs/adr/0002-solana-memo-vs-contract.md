# ADR 0002: Solana anchoring — Memo vs Smart Contract

Date: 2025-09-23
Status: Accepted (Memo for pilot; contract reserved for Phase 2)

## Context

We need to anchor SHA-256 digests of mission evidence on Solana. Two approaches are common:

- Memo Program: lightweight instruction carrying arbitrary UTF-8 data (the digest).
- Custom Program (smart contract): on-chain program storing events (e.g., PDA log) with richer semantics.

## Decision

Use the Memo program for the initial pilot. Revisit a custom program in Phase 2 if we need richer state/query semantics.

## Rationale

- Simplicity: no contract deployment, minimal footprint, low operational risk.
- Cost/Latency: memo TX is cheap and fast; ideal for frequent anchoring.
- Privacy/Safety: memo stores only a digest; raw data remains off-chain.
- Tooling: supported by standard wallets/RPC; easy to verify via explorers.

When to prefer a smart contract:
- Need to enforce on-chain rules (e.g., authorized signers, sequence checks).
- Need indexed, queryable on-chain structures (e.g., mission IDs, tags, Merkle roots).
- Need aggregated anchors (e.g., periodic Merkle commitments of many digests).

## Consequences

- Memo-based anchoring has limited native indexing; verification requires fetching TXs by signature/time window.
- If discoverability/indexing becomes a pain point, implement a program that stores a compact event (digest + metadata) under a PDA.

## Links

- Implementation (Memo): `backend/services/solana_anchor.py`
- Integration: `backend/services/blockchain_handler.py`
- Ops: `docs/blockchain_integration.md#solana-on-chain-anchoring-pilot`
