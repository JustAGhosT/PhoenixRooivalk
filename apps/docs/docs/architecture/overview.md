# Architecture Overview (Public-safe)

> High-level architecture outline. Partner-only specifics are not published.

## Modules

- RKV‑M: VTOL mothership acting as picket, relay, and mini launcher.
- RKV‑I: Minis (interceptor, decoy, ISR) with RF or optional fiber control.
- RKV‑G: Ground rover as mobile GCS, mast, logistics.
- RKV‑C2: Command/control/data with strict QoS and observability.

## Data plane & messaging

- gRPC for control plane APIs; eventing with NATS/Kafka for fusion and tasks.
- Observability via OpenTelemetry; evidence to WORM storage.

For restricted specifications and planning baselines, request access via
`ACCESS.md`.
