# ADR-0004 — Powerplant Classes (Six Options)

**Status:** Accepted (baseline = E2 HV outrunner) • **Date:** 2025-09-25

## Options

- **E1 — Direct‑drive outrunner (12–14S)**: 2.5–3.5 kW cont, Kv 120–180.
- **E2 — HV outrunner (16–20S)**: 3–5 kW, Kv 90–140 (**baseline**).
- **E3 — Inrunner + gearbox (3–4:1)**: 3–4 kW, geared to 2400–3200 RPM prop.
- **E4 — Axial‑flux pancake**: 3–5 kW, thin form factor.
- **E5 — Coax twin motors (2×E1/E2)**: for XR coax pod.
- **E6 — Serial hybrid genset (ICE or micro‑turbine + HV bus)**: 8–15 kW DC bus
  feeding ESCs.

## Decision & Rationale

Choose **E2** for lower current at HV, cooler ESCs, and RPM headroom. Keep
**E4** where pod thickness is tight or smoothness premium. **E5** only with coax
XR. **E6** is an endurance kit; adds weight/acoustic but keeps pod interfaces
unchanged.

## Electrical/KPP

- Bus: 16–20S Li‑ion/LiPo equivalent; target ESC thermal rise **< 25 °C** in 60
  s hover.
- EMI: shielded leads; dv/dt filtering per ESC vendor; blade encoder optional
  for vibe monitoring.
