# PhoenixRooivalk

Modular Counter‑UAS System (restricted partner access)

> Notice: This repository contains restricted content intended for approved
> defense partners. Redistribution or public disclosure is prohibited. See
> `RESPONSIBLE_USE.md` and `ACCESS.md`.

Quick access: [Glossary](./docs/glossary.md)

## Overview

PhoenixRooivalk delivers a layered, modular counter‑UAS capability for
contested EM environments. The public materials in this repository provide a
high‑level overview and governance. Partner‑only details (specifications,
simulations, integration guides) are shared upon approval.

## Mission

Provide a modular, layered defense against low‑cost UAS threats by cueing the
cheapest effective effector first, preserving high‑value effectors, and
maintaining C2 in heavy EW through resilient optical and RF links.

## System overview (abstract)

- RKV‑M: Aerial VTOL mothership for picket, relay, and mini launch; resilient
  comms and survivability provisions.
- RKV‑I: Deployable minis (interceptor, decoy, ISR). Control via RF or optional
  fiber for jam‑resistant teleoperation. Non‑kinetic baseline.
- RKV‑G: Ground support rover acting as mobile GCS, mast, and logistics node;
  can bear fiber spools for engagements.
- RKV‑C2: Command, control, and data plane with strict QoS, eventing, and
  observability; weapon‑agnostic integration patterns.

For detailed specifications and planning baselines, see [`index.md`](./index.md)
(restricted).

## Operating modes

- Mobile picket: Extend detection/relay ahead of maneuver elements.
- Site‑fixed overwatch: Short micro‑tether or elevated optical mast.
- Fiber‑engage: Rover establishes fiber link for spoof‑resistant control.
- Logistics: Resupply, magazine swap, and net deployment support.

## Documentation map

- Business plan and high‑level brief: see [`index.md`](./index.md)
  - Technical and business docs (selected public sections):
    - [Executive summary](./docs/executive_summary.md)
    - [Technical overview](./docs/technical_overview.md)
    - [Glossary](./docs/glossary.md)
    - [Blockchain integration](./docs/blockchain_integration.md)
    - Architecture Decisions (ADRs):
      - [ADR 0001: Chain selection for anchoring (Solana vs others)](./docs/adr/0001-solana-vs-others.md)
      - [ADR 0002: Solana anchoring — Memo vs Smart Contract](./docs/adr/0002-solana-memo-vs-contract.md)
      - [ADR 0003: L0 adoption strategy and pilots](./docs/adr/0003-l0-adoption-strategy.md)
      - [ADR 0004: Layered blockchain strategy — L2 + L3 for ops, L1 for anchoring](./docs/adr/0004-layered-strategy-l1-l2-l3.md)
    - [Competitor analysis](./docs/competitor_analysis.md)
    - [Marketing and risk analysis](./docs/marketing_and_risk_analysis.md)
    - [Civilian use cases](./docs/civilian_use_cases.md)
    - [Financial projections](./docs/financial_projections.md)
    - [Implementation plan](./docs/implementation_plan.md)

If any link appears broken, verify filenames use underscores (not hyphens) in the `docs/` directory.

## Operational tasks

### Outbox worker (process anchoring jobs)

- PowerShell helper: `./scripts/Invoke-OutboxWorker.ps1`
- Example:

```powershell
# Optional anchoring env (Solana pilot)
$env:EVIDENCE_ANCHOR_CHAIN = "solana"
$env:SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com"
$env:SOLANA_SECRET_KEY = "file://C:/secrets/solana-keypair.json"

./scripts/Invoke-OutboxWorker.ps1 -ProviderEndpoint "http://localhost" -IntervalSec 5 -BatchLimit 25 -MaxAttempts 10
```

Python entry (alternative):

```powershell
python -m backend.workers.outbox_worker
```

### Record evidence and enqueue anchoring (CLI)

- Python CLI: `python -m backend.tools.record_evidence <event_type> <payload_or_@file.json> [--enqueue-anchor]`
- Examples:

```powershell
python -m backend.tools.record_evidence engagement_summary '{"missionId":"M-123","result":"success"}' --enqueue-anchor
python -m backend.tools.record_evidence engagement_summary @C:\data\payload.json --enqueue-anchor
```

For runbook-style metrics capture, use the Operations Log template:

- [Operations log template — anchoring runs](./docs/ops/operations_log_template.md)

## Access request (partners)

Approved defense partners may request access to extended documentation and
artifacts. Please see [`ACCESS.md`](./ACCESS.md) for intake details and
required information.

## Responsible use

This project is weapon‑agnostic by design. Integration of restricted payloads
occurs only under applicable law and export controls. See
[`RESPONSIBLE_USE.md`](./RESPONSIBLE_USE.md).

## Site preview (if enabled)

If GitHub Pages is configured for this repository, you can view the rendered
materials at:
[JustAGhosT.github.io/PhoenixRooivalk](https://JustAGhosT.github.io/PhoenixRooivalk/)

## Contributing

Contributions are limited to approved collaborators. Review [`CONTRIBUTING.md`](./CONTRIBUTING.md) for guidelines.

## License

This project is licensed under a proprietary license. See [`LICENSE`](./LICENSE) for details.

## Contact

Jurie Smit  
PhoenixVC  
mailto:smit.jurie@gmail.com
