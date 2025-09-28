# Communications (Public-safe)

> High-level comms stack. Link characteristics and profiles remain restricted.

## Backhaul

- **FSO**: Primary air-to-ground optical with acquisition/tracking and
  weather-aware fade management.
- **RF**: Mission-approved bands with MIMO, FEC, adaptive rate.

## Link policy

- Enforce SLOs and automatic fallbacks (FSO primary, RF secondary).
- EMCON profiles supported; observability on link health.

## Autonomy fallbacks

- Visual-inertial odometry and dead-reckoning for GNSS-degraded cases.

For partner specifics and integration, see `ACCESS.md`.
