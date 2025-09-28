# ADR 0001: Chain selection for on-chain anchoring (Solana vs others)

Date: 2025-09-24
Status: Accepted (pilot on Solana)

## Context

Matrices last updated: 2025-09-24

We need a Layer 1 anchoring target for tamper-evident hashes of mission
evidence. Criteria: security, latency, cost, resilience, interoperability,
and operational fit for contested environments.

## Options considered

- Ethereum (L1)
- Solana (L1)
- Avalanche (L1 / Subnets)
- Polkadot (Relay + parachains)
- Bitcoin (L1)

## Decision

Adopt Solana as the initial pilot chain for anchoring evidence digests.

## Rationale

- Low-latency finality and high throughput support near-real-time anchoring for dynamic operations.
- Low fees enable frequent anchoring without prohibitive cost.
- Mature Memo program allows simple, contract-free anchoring path.
- Ecosystem tooling is sufficient for a pilot (solana-py/solders).

## Consequences

- Resilience must be monitored during high network load; add retry/backoff and outbox batching.
- For compliance/archival use cases, we may also implement periodic Ethereum anchoring.
- Subnet/private chain options (e.g., Avalanche) can be revisited for classified deployments.

## Links

- Implementation: `backend/services/solana_anchor.py`, `backend/services/blockchain_handler.py`
- Operations: `docs/blockchain_integration.md#solana-on-chain-anchoring-pilot`

## Appendix: L1 suitability snapshot (canonical in blockchain_integration.md)

Reference: `docs/blockchain_integration.md#evaluation-of-l1-l2-and-l3-and-their-adapters`

| Chain / Adapter example | Security | Scalability | Latency | Interoperability | Resilience | Efficiency |
| --- | --- | --- | --- | --- | --- | --- |
| Ethereum (with Wormhole bridge) | H | M | M | M | H | M |
| Solana (with native cross-chain tools) | H | H | H | M | M | H |
| Bitcoin (with Lightning adapters) | H | L | L | L | H | L |

Notes (abridged): Ethereum = robust security; Solana = low-latency anchoring; Bitcoin = archival immutability.
