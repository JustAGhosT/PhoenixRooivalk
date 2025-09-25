# Architecture Overview (Public-safe)

> High-level architecture outline. Partner-only specifics are not published.
> See also: [Glossary](../glossary.md) for definitions of acronyms and terms used throughout the documentation.

## Modules

- RKV‑M: VTOL mothership acting as picket, relay, and mini launcher. Features land-relaunch capability for persistent area control, energy conservation, and reduced detectability.
- RKV‑I: Minis (interceptor, decoy, ISR) with RF or optional fiber control.
- RKV‑G: Ground rover as mobile GCS, mast, logistics.
- RKV‑C2: Command/control/data with strict QoS and observability.

## Data plane & messaging

> [Back to Glossary](../glossary.md)

- gRPC for control plane APIs; eventing with NATS/Kafka for fusion and tasks.
- Observability via OpenTelemetry; evidence to WORM storage.

## Combined Operational Approach

The PhoenixRooivalk system achieves maximum effectiveness through the integrated deployment of all components:
- RKV-M establishes aerial presence with capability to land and conserve power for extended missions
- RKV-I units deploy from the mothership for specialized tasks
- RKV-G provides ground support and secure communication links
- RKV-C2 orchestrates all components through a unified control framework

This layered approach enables flexible, scalable responses across various mission profiles, particularly for area control operations where land-relaunch capabilities provide tactical advantages in persistence, stealth, and energy management.

For restricted specifications and planning baselines, request access via
`ACCESS.md`.
