# RKV-M Tilt-Quad — Rotor/Powerplant Trades (Engineer Brief)

**Date:** 2025-09-25  
**Scope:** Decisions and trade studies for tilt-pod geometry (ducted/open),
rotor topology (single/coax), blade count (2/3/4), and six motor/energy options
for the **RKV‑M‑TQ** family.  
**Audience:** Flight controls, propulsion, structures, systems, and test
engineers.

---

## Baseline (accepted)

- **Pod:** _Ducted_, **single** rotor, **3‑blade** (Øouter duct = **0.60 m**,
  tip clearance **≥ 10 mm**).
- **Motor/ESC:** **E2 HV outrunner (16–20S)**, Kv sized to keep **tip ≤ 120
  m/s** at hover thrust.
- **Gates:** Ducted static **FoM ≥ 0.68**, **ESC ΔT@60s hover < 25 °C**,
  **IMU/EO jitter < 0.08 g rms** at 2P/3P, **OASPL@10 m ≤ baseline + 3 dB**,
  **tilt‑servo margin ≥ 2× I·ω·θ̇**.

## Kits (mission options)

- **TQ‑Q (quiet/thermal):** _Ducted single 4‑blade_; −10–15% RPM for equal
  thrust; small FoM penalty; lower acoustic tone.
- **TQ‑XR (high‑lift):** _Ducted coax 3+3_; +60–80% static thrust in same Ø;
  +10–25% power for same thrust; torque‑neutral; higher mass/tones/tilt loads.
- **QP tail pusher (variant):** _Open 2‑blade folding_ prop for cruise only (not
  a TQ pod).

## Figures

- Top‑down technical plate (Rev‑E) with datum tags and macro inset is in
  `docs/figures/`.

> See ADRs for rationale, constraints, risks, and reversibility.
