# Deployment (Public-safe)

> High-level deployment patterns. Site-specific parameters remain restricted.

## Environments

- Local: simulation and doc preview.
- Lab/staging: hardware-in-the-loop, controlled RF.
- Field: production with theater policies and governance.

## Patterns

- Immutable artifacts with SBOMs and signatures.
- Configuration-as-data with environment overlays.
- Blue/green or canary for C2 and services when feasible.

## Controls

- Access control for docs site (password/SSO) and C2 endpoints.
- Audit logging and version pinning for mission runs.
- Secret management via platform vaults (no secrets in repo).

For partner runbooks and IaC, request access via `ACCESS.md`.
