# ADR-0002 — Single vs Coaxial Contra per Duct

**Status:** Accepted (baseline = Single; kit = Coax) • **Date:** 2025-09-25  
**Context:** Same Ø0.60 m duct; need option for higher thrust in same footprint
and torque cancellation.

## Options

- **Single 3‑blade** (baseline)
- **Coax 3+3** (XR kit)

## Decision

Use **Single 3‑blade** for endurance, acoustic discretion, and lower tilt
inertia. Provide **Coax 3+3** as an **XR** pod for hot/high or heavy sorties.

## Comparison (concise)

- Thrust: Coax **~1.6–1.8×** single in same Ø.
- Power for same thrust: Coax **+10–25%** (interference).
- Torque: Single non‑zero; Coax ≈ **0**.
- Tilt loads: Coax **↑ I·ω** → **↑ servo torque** or slower tilt.
- Acoustic: Coax **more tones** (interaction).
- Mass/parts: Coax **↑**.

## Gates

- If coax used: axial spacing **0.20–0.30 R** (60–90 mm), independent ESCs,
  **tilt‑rate ≤ 30°/s** unless actuator margin ≥ 2×.

## Risks

- **Unbalanced pair fault** → asym torque. **Mitigate:** immediate mixer
  response; cross‑pod counter‑torque; abort envelope.

## Reversal

Full: XR pods are bolt‑on; swap to single without airframe changes.
