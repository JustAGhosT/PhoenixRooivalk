# ADR 0003: Layer 0 (L0) adoption strategy and pilots

Date: 2025-09-24
Status: Proposed (pilot recommended)

## Context

Drone operations may span multiple chains and jurisdictions. We need a strategy
for cross-chain interoperability, resilience, and customizable networks without
sacrificing security or operational tempo.

## Decision

Pursue a staged evaluation of L0 technologies with pilots focused on:

1. Avalanche Subnets for isolated, high-performance drone-swarm networks.
2. Polkadot XCM for cross-chain data exchange across allied networks.

Ethereum/Solana remain as L1 targets for anchoring; L2 remains primary for
single-chain, high-throughput coordination.

## Rationale

- L0 provides ecosystem-level composition and interop beyond a single L1/L2.
- Subnets/parachains can be tailored for mission profiles (latency, access,
  cryptography), and segmented for security domains.
- Adapters (XCM/IBC) support allied collaboration and shared situational
  awareness with verifiable data exchange.

## Consequences

- Increased complexity (bridge/adapters) requires strong operational controls:
  multi-sig, audits, minimized trust in relays/bridges, and monitoring.
- Additional ops tooling needed for chain lifecycle (deploy, upgrade, observe).
- Budget allocation shifts: dedicate 30–40% to L0 pilots/integration while
  keeping 50–60% on L2 for immediate performance needs.

## Pilot outline

- Subnet pilot (Avalanche): define validation set, tx fees, and access; deploy
  a minimal evidence-anchoring adapter and measure latency/cost.
- XCM pilot (Polkadot): demonstrate cross-chain evidence hash relay between two
  parachains and verify end-to-end integrity.

## Links

- Background: `docs/blockchain_integration.md#evaluation-of-layer-0-l0-blockchains-and-adapters`
- Related ADRs: 0001 (Solana vs others), 0002 (Memo vs Contract on Solana)

## Appendix: L0 suitability snapshot (canonical in blockchain_integration.md)

Reference: `docs/blockchain_integration.md#evaluation-of-layer-0-l0-blockchains-and-adapters`

| Chain / Adapter | Security | Scalability | Latency | Interoperability | Resilience | Efficiency |
| --- | --- | --- | --- | --- | --- | --- |
| Polkadot (XCM) | H | H | M | H | H | M |
| Cosmos (IBC) | M | M | M | H | M | M |
| Avalanche (Subnets) | H | H | H | M | H | H |

Notes (abridged):

- Polkadot = shared security + XCM interop
- Cosmos = strong interop, zone-dependent security
- Avalanche = high-perf customizable subnets
