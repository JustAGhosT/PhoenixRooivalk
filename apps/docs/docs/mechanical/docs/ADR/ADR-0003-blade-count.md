# ADR-0003 — Blade Count (2 vs 3 vs 4)

**Status:** Accepted (baseline = 3‑blade) • **Date:** 2025-09-25

## Decision

Adopt **3‑blade** as the standard for ducted pods. Offer **4‑blade** as an
acoustic/thermal kit (**TQ‑Q**). Avoid **2‑blade** inside ducts; reserve 2‑blade
for open tail pusher in QP variant.

## Why

- **3‑blade**: best compromise of solidity, hover power, smoothness, and tip‑gap
  margin.
- **4‑blade**: allows **RPM −10–15%** at same thrust (acoustic/IR/ESC headroom)
  with small FoM penalty.
- **2‑blade**: higher blade loading → more hover power, stronger 2P vibration;
  worse in ducts.

## Acceptance (ducted pod)

- Tip clearance **≥ 10 mm**; **tip speed ≤ 120 m/s**; **FoM ≥ 0.68**; **OASPL@10
  m** within gates; no tip rub.
