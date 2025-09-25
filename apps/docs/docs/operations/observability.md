# Observability (Public-safe)

> High-level approach to traces, metrics, logs, and mission evidence.
> Implementation specifics are restricted.

## Goals

- End-to-end visibility for control and payload paths.
- Rapid incident triage with minimal operator burden.
- Audit-grade evidence capture for post-mission review.

## Components

- Tracing/metrics/logs: OpenTelemetry exporters, Prometheus scraping, and
  Grafana dashboards.
- Structured events: Task/track timelines with correlation IDs.
- Evidence: Append-only WORM object storage with retention and chain-of-custody.

## Practices

- Consistent labels for vehicle, mission, module, link, and task IDs.
- Health probes and SLOs on link manager, fusion, and C2 gateways.
- Protected retention policies for regulatory/theater compliance.

For partner integrations and schemas, request access via `ACCESS.md`.
