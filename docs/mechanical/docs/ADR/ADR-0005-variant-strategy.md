# ADR-0005 — Pod Variant Strategy (TQ‑B, TQ‑Q, TQ‑XR)
**Status:** Accepted • **Date:** 2025-09-25

## Variants
- **TQ‑B (Baseline):** Ducted + single 3‑blade, E2 motor, standard shroud.  
- **TQ‑Q (Quiet/Thermal):** Ducted + single 4‑blade; RPM −10–15% @ equal thrust; same mounts.  
- **TQ‑XR (High‑Lift):** Ducted + coax 3+3; axial spacing 0.20–0.30 R; independent ESCs; tilt‑rate limit unless actuator up‑sized.

## Interface control (ICD snippet)
- **Mechanical:** QA common mounts; hinge 40×40 mm block; arm section 60×90 mm; 4× M6‑8.8, 9.5 N·m, Loctite 243.  
- **Electrical:** HV bus 16–20S; each pod has dedicated ESC telemetry (V/I/RPM/T).  
- **Data:** CAN/TTL per pod; mixer supports torque‑neutral coax (XR).

## Acceptance gates
- **FoM ≥ 0.68**, **tip ≤ 120 m/s**, **tip gap ≥ 10 mm**; **IMU jitter < 0.08 g**, **OASPL@10 m** within kit limits; **servo margin ≥ 2× I·ω·θ̇**.
