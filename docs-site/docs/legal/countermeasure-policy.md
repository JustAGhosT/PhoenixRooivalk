# Countermeasure Policy (Public-safe)

This page summarizes high-level policies for counter‑UAS countermeasures. It
intentionally excludes any procedural steps, parameters, deployment guidance, or
operational tuning.

See repository policies:
- Responsible use: https://github.com/JustAGhosT/PhoenixRooivalk/blob/main/RESPONSIBLE_USE.md
- Access request: https://github.com/JustAGhosT/PhoenixRooivalk/blob/main/ACCESS.md

## Scope and purpose

- Conceptual guidance for architecture/governance.
- No instructions for RF denial, GNSS/GPS deception, or signal disruption.
- Testing guidance and deployable detail are out of scope for public docs.

## RF jamming (policy summary)

- Prohibited for civilian use in many jurisdictions (e.g., FCC in the U.S.).
- Any testing requires explicit regulator authorization and RF‑shielded or
  approved ranges.
- Public docs remain weapon‑agnostic and omit waveforms, power levels, bands,
  filters, or procedures.

## GNSS/GPS deception (policy summary)

- Generating or transmitting deceptive signals is illegal or tightly regulated
  in most jurisdictions.
- Public docs exclude generation, transmission, or configuration details.
- Focus on resilience strategy (sensor fusion, integrity checks) rather than
  offensive methods.

## Integration considerations (conceptual)

- Modular architecture enabling lawful substitution of modules by jurisdiction.
- Simulation‑only evaluation in SITL/HIL or shielded labs when applicable.

## Legal & safety

- Prohibitions
  - Civilian manufacture/operation/sale of RF jammers and deliberate GNSS/GPS
    spoofing devices is illegal or tightly regulated in many jurisdictions.
- Required authorizations
  - Written approvals from competent authorities (e.g., FCC experimental
    authorization in the U.S., or local regulators elsewhere) before any RF
    emissions testing.
  - Use of RF‑shielded facilities or certified ranges.
  - Export‑control review and compliance with sanctions/dual‑use rules.
- Mandatory sign‑off
  - Security and legal review prior to any publishing, integration, or
    distribution of countermeasure‑related material.

## Partner engagement

For lawful engagement, authorized partners should request access via
`ACCESS.md` (link above). Public docs will not include operational details.
