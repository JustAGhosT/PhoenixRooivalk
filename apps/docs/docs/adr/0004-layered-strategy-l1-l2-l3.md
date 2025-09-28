# ADR 0004: Layered blockchain strategy — L2 + L3 for ops, L1 for anchoring

Date: 2025-09-24 Status: Proposed

## Context

Drone operations require both high-throughput/low-latency coordination and
high-assurance immutability. Relying on a single layer imposes trade-offs. We
adopt a layered approach across L1/L2/L3 to meet performance and assurance
goals.

## Decision

- Use L2 (e.g., Arbitrum, Polygon, Optimism) for scalable, low-latency
  operational flows such as swarm coordination, real-time command distribution,
  and frequent status updates.
- Employ L3 adapters where cross-network application workflows are needed (e.g.,
  IBC/Quant/Icon) for allied or multi-theater operations.
- Anchor critical evidence digests and compliance markers on an L1 (e.g., Solana
  or Ethereum) to provide tamper-evident audit trails and long-term integrity.

## Rationale

- Performance: L2 scales throughput while inheriting L1 security.
- Interoperability: L3 adapters unlock cross-chain workflows needed in coalition
  contexts.
- Assurance: L1 anchoring provides durable, verifiable records independent of
  L2/L3 availability.

## Consequences

- Additional integration complexity (bridges/relays) and operational runbooks
  for incidents.
- Need for clear policies on what data stays off-chain vs what is anchored as a
  digest.
- Monitoring/metrics required across layers (latency, cost, success rate) to
  tune cadence.

## Implementation notes

- Current pilot anchors digests on Solana via Memo, with optional L2 batching.
- Outbox worker handles retries and scheduling; see
  `backend/workers/outbox_worker.py`.
- Evidence hashing uses `backend/services/evidence_log.py` with canonical JSON +
  SHA-256.

## Links

- Background:
  `docs/blockchain_integration.md#evaluation-of-l1-l2-and-l3-and-their-adapters`
- Related ADRs: 0001 (Solana vs others), 0002 (Memo vs Contract), 0003 (L0
  adoption)

## Appendix: L1/L2/L3 summary snapshot (canonical in blockchain_integration.md)

Reference:
`docs/blockchain_integration.md#evaluation-of-l1-l2-and-l3-and-their-adapters`

| Layer | Focus                 | Example entries                                                       |
| ----- | --------------------- | --------------------------------------------------------------------- |
| L1    | Security & settlement | Ethereum (H/M/M/M/H/M), Solana (H/H/H/M/M/H), Bitcoin (H/L/L/L/H/L)   |
| L2    | Scaling & efficiency  | Arbitrum (H/H/H/H/M/H), Polygon (M/H/H/H/M/H), Optimism (H/H/M/H/H/M) |
| L3    | App-level interop     | IBC (M/M/M/H/M/M), Quant (H/M/M/H/H/M), Icon (M/H/H/H/M/H)            |

Notes: Ratings abbreviate
Security/Scalability/Latency/Interoperability/Resilience/Efficiency.

Matrices last updated: 2025-09-24
