# PhoenixRooivalk

Modular Counter‑UAS System (restricted partner access)

## 🌐 Live Sites

- **Marketing Website**: [phoenixrooivalk.netlify.app](https://phoenixrooivalk.netlify.app) - Interactive demo, capabilities overview, and contact information
- **Documentation Site**: [phoenixrooivalk-docs.netlify.app](https://phoenixrooivalk-docs.netlify.app) - Technical specifications, architecture, and implementation guides

## Monorepo overview

This repository uses a Turborepo + pnpm monorepo to host multiple apps and
shared packages.

Structure:

- `apps/`
  - `docs/` — Docusaurus site (published under `/docs`).
    - Comprehensive technical documentation with executive, business, technical, legal, and operations sections.
  - `marketing/` — Next.js 14 static marketing site (exports to `out/`).
    - Includes threat simulator, ROI calculator, and interactive demos.
  - `api/` — Rust (Axum) API server.
  - `keeper/` — Rust blockchain keeper service.
  - `evidence-cli/` — Rust CLI for evidence management.
  - `scripts/` — Application-specific scripts.
- `packages/`
  - `types/` — Shared TypeScript type definitions.
  - `ui/` — Shared React UI components and hooks.
  - `utils/` — Shared utility functions.
- `crates/`
  - `evidence/` — Core evidence logging functionality.
  - `anchor-solana/` — Solana blockchain anchoring.
  - `anchor-etherlink/` — EtherLink blockchain anchoring.
  - `address-validation/` — Blockchain address validation.
- `docs/` — Legacy documentation (migrated to `apps/docs/`).
- `scripts/` — Root-level deployment and utility scripts.
- `blockchain_outbox.sqlite3` — SQLite database for blockchain evidence outbox.
- `ACCESS.md` — Access request information for defense partners.
- `CONTRIBUTING.md` — Contribution guidelines.
- `DEPLOYMENT.md` — Deployment documentation.
- `RESPONSIBLE_USE.md` — Responsible use guidelines.
- `SECURITY.md` — Security policy and reporting.

Tooling:

- Package manager: `pnpm` (via `corepack`).
- Orchestrator: `turbo` (see `turbo.json`).
- Linting: `eslint` with TypeScript, React, and security plugins.
- Formatting: `prettier` with consistent code style.
- Pre-commit: `husky` and `lint-staged` for automated quality checks.
- Spell checking: `cspell` for documentation and code comments.
- Rust tooling: `clippy` for Rust code quality and `cargo` for dependency management.
- Configuration: `tsconfig.base.json` for shared TypeScript configuration.

### Development commands

Run from the repository root:

```bash
# enable pnpm via corepack
corepack enable

# install workspace dependencies
pnpm install

# develop marketing (Next.js) - http://localhost:3000
pnpm --filter marketing dev

# develop docs (Docusaurus) - http://localhost:3000
pnpm --filter docs start

# build all
pnpm build

# build single app (static export)
pnpm --filter marketing build  # outputs to apps/marketing/out/
pnpm --filter docs build       # outputs to apps/docs/build/

# run Rust API locally
cargo run --manifest-path apps/api/Cargo.toml

# run Rust services
cargo run --manifest-path apps/keeper/Cargo.toml    # Blockchain keeper
cargo run --manifest-path apps/evidence-cli/Cargo.toml -- <command>  # Evidence CLI

# run utility scripts
./scripts/deploy.sh                    # Deployment script
./scripts/Invoke-Tests.ps1            # PowerShell test runner
./scripts/Invoke-OutboxWorker.ps1     # Blockchain outbox worker

# linting and formatting
pnpm lint                              # Run ESLint on all packages
pnpm typecheck                         # TypeScript type checking
pnpm format                            # Format code with Prettier
pnpm format:check                      # Check formatting without fixing

# Rust development
cargo check                            # Check Rust code without building
cargo clippy                           # Run Rust linter
cargo test                             # Run Rust tests
```

### Deployment

Deployments are performed by GitHub Actions to two separate Netlify sites:

- **Docs**: `.github/workflows/deploy-docs-site.yml` publishes `apps/docs/build/`
  - Secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_DOCS_SITE_ID`
  - Triggers: Push to `main` branch, changes to `apps/docs/**`
- **Marketing**: `.github/workflows/deploy-marketing-site.yml` publishes `apps/marketing/out/`
  - Secrets: `NETLIFY_AUTH_TOKEN`, `NETLIFY_MARKETING_SITE_ID`
  - Triggers: Push to `main` branch, changes to `apps/marketing/**`

Additional workflows:
- **CI/CD**: `.github/workflows/ci-marketing.yml`, `.github/workflows/ci-rust.yml`
- **Security**: `.github/workflows/codeql.yml` for vulnerability scanning

Netlify's "Deploys from Git" is disabled; Actions upload artifacts directly.

### Cross‑site links (env)

- Docs site can link back to marketing via `MARKETING_URL` (build‑time env for
  `apps/docs`).
- Marketing site can link to docs via `NEXT_PUBLIC_DOCS_URL` (public runtime env
  for `apps/marketing`).

Set these in each Netlify site’s Environment variables if you want absolute
cross‑links.

### Redirects

- Marketing site publishes `public/_redirects` to forward common paths to the
  docs site. Update the hostnames there to match your actual docs domain if it
  changes.

> Notice: This repository contains restricted content intended for approved
> defense partners. Redistribution or public disclosure is prohibited. See
> `RESPONSIBLE_USE.md` and `ACCESS.md`.

Quick access: [Glossary](./docs/glossary.md)

## Overview

PhoenixRooivalk delivers a layered, modular counter‑UAS capability for contested
EM environments. The public materials in this repository provide a high‑level
overview and governance. Partner‑only details (specifications, simulations,
integration guides) are shared upon approval.

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

- **Live Documentation**: [phoenixrooivalk-docs.netlify.app](https://phoenixrooivalk-docs.netlify.app) - Complete technical documentation
- **Legacy Documentation**: See `docs/` directory for historical reference
  - Executive: [Executive Summary](./docs/executive/Executive_Summary.md)
  - Business: [Market Analysis](./docs/business/Market_Analysis.md), [Business Model](./docs/business/Business_Model.md)
  - Technical: [Technical Analysis](./docs/technical/Technical_Analysis.md), [Glossary](./docs/technical/Glossary.md)
  - Operations: [Implementation Plan](./docs/operations/Implementation_Plan.md), [Operations Manual](./docs/operations/Operations_Manual.md)
  - Legal: [Compliance Framework](./docs/legal/Compliance_Framework.md)
  - Architecture Decisions: [Mechanical Design ADRs](./docs/technical/mechanical/Mechanical_Design_ADRs.md)

> **Note**: The primary documentation is now hosted in the Docusaurus site at `apps/docs/`. The `docs/` directory contains legacy documentation for reference.

## Operational tasks

### Evidence management (CLI)

- Rust CLI: `cargo run --bin evidence-cli -- <command>`
- Examples:

```powershell
# Record evidence
cargo run --bin evidence-cli -- record engagement_summary '{"missionId":"M-123","result":"success"}'

# Process anchoring jobs
cargo run --bin keeper -- --interval 5 --batch-limit 25
```

For runbook-style metrics capture, use the Operations Log template:

- [Operations log template — anchoring runs](./docs/operations/monitoring/Operations_Log_Template.md)

## Access request (partners)

Approved defense partners may request access to extended documentation and
artifacts. Please see [`ACCESS.md`](./ACCESS.md) for intake details and required
information.

## Responsible use

This project is weapon‑agnostic by design. Integration of restricted payloads
occurs only under applicable law and export controls. See
[`RESPONSIBLE_USE.md`](./RESPONSIBLE_USE.md).

## Site preview

Both sites are automatically deployed to Netlify via GitHub Actions:

- **Marketing Site**: Built with Next.js 14 and deployed from `apps/marketing/out/`
- **Documentation Site**: Built with Docusaurus and deployed from `apps/docs/build/`

You can view the live sites at the configured Netlify domains (see [Live Sites](#-live-sites) section above).

## Contributing

Contributions are limited to approved collaborators. Review
[`CONTRIBUTING.md`](./CONTRIBUTING.md) for guidelines.

## License

This project is licensed under a proprietary license. See [`LICENSE`](./LICENSE)
for details.

## Contact

Jurie Smit  
PhoenixVC  
mailto:smit.jurie@gmail.com
