# ADR-0001 — Ducted vs Open Props for Tilt Pods (RKV‑M‑TQ)
**Status:** Accepted • **Date:** 2025-09-25 • **Owner:** J  
**Context:** Tilt‑quad pods must supply high static thrust, survive debris/strikes, control acoustic signature, and tolerate frequent tilt transitions. Øouter duct = **0.60 m**; tip clearance target **≥ 10 mm**; pod centers x = 0.50/1.20 m, ±y = 0.795 m.

## Options considered
1. **Ducted + Single** rotor  
2. **Ducted + Coax (3+3)**  
3. **Open + Single** rotor  
4. **Open + Coax**

## Decision
Adopt **Ducted + Single** as the **baseline** tilt pod. Keep **Ducted + Coax** as a **mission kit** (TQ‑XR) for hot/high or heavy payload cases. Open props are reserved for the **QP tail pusher** variant only.

## Rationale (trade summary)
- **Survivability & safety:** Duct protects tips and bystanders; best debris tolerance.  
- **Static thrust & control:** Ducted single has **higher FoM** at hover; smoother transitions than coax; simpler mixer/faults.  
- **Acoustics:** Duct enables **lower tip speed** for equal thrust; reduced tones vs open/coax.  
- **Mass/complexity:** Ducted single is lowest for protected pods.

## Consequences
- Pod shrouds drive **packaging & weight**, but net is positive for front‑line ops.  
- Coax XR kit raises **tilt servo torque** and tonal noise; must derate tilt rate or upsize actuator.

## Key parameters/KPPs
- Tip clearance **≥ 10 mm** through flex/tilt; **tip speed ≤ 120 m/s** at hover thrust.  
- Ducted static **FoM ≥ 0.68**; OASPL@10 m **≤ baseline + 3 dB** (TQ‑Q), **≤ +6 dB** (TQ‑XR).  
- Tilt servo margin **≥ 2× I·ω·θ̇**.

## Risks & mitigations
- **R1:** Shroud aero penalty in fast cruise → **M1:** Use TQ‑Q/TQ‑XR only as needed; keep fuselage low‑drag, verify trim power in SITL.  
- **R2:** Tip rub under high‑g maneuvers → **M2:** Measure deflection; qualify 10 mm min clearance with proof load.

## Reversibility
High: ducted pod mounts compatible with QA common fuselage; open prop reserved for QP tail pusher.

## References
- Trade matrix `docs/trade/rotor_powerplant_trade_matrix.csv`  
- Plate `docs/figures/RKV-M-TQ_top_view_plate_RELEASE_E.*`
