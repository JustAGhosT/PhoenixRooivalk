# Legal Compliance (Public-safe)

This page summarizes public-safe compliance and licensing considerations. It is
non-exhaustive and does not constitute legal advice.

See repository policies:

- Responsible use:
  [RESPONSIBLE_USE.md](https://github.com/JustAGhosT/PhoenixRooivalk/blob/main/RESPONSIBLE_USE.md)
- Access request:
  [ACCESS.md](https://github.com/JustAGhosT/PhoenixRooivalk/blob/main/ACCESS.md)

## RF jamming — compliance and licensing (summary)

- **Prohibitions**

  - Civilian manufacture, operation, or sale of RF jammers is illegal or tightly
    regulated in many jurisdictions.

- **U.S. (FCC)**

  - Generally prohibited under the Communications Act; enforcement by FCC.
  - Testing may be possible only under specific authorizations (e.g., FCC
    experimental authorizations) and in shielded facilities or approved ranges.
  - Operational restrictions include power limits, restricted bands, and
    emissions constraints defined by applicable parts (e.g., Part 5/Part 15 for
    experiments; Part 97 is Amateur Radio and does not authorize jamming).

- **Other jurisdictions**

  - Similar prohibitions or licensing regimes (e.g., Ofcom in the UK, ETSI/EU
    frameworks). Local counsel is required.

- **Licensing process (high level)**

  - Determine competent regulator and applicable authorization type.
  - Prepare a test plan and mitigation (shielding, range, safety), device
    description, and compliance measures.
  - Obtain written authorization before any emissions testing.
  - Maintain logs, mark devices, and comply with reporting/renewals.

- **Operational restrictions**

  - Use only within authorized locations, times, frequencies, bandwidths, and
    power levels. Implement safeties, monitoring, and cutoffs.

## GNSS/GPS deception — compliance (summary)

- Generally illegal or tightly regulated to generate/transmit deceptive GNSS
  signals. Any testing requires specific authorization and RF‑shielded or
  approved facilities.

- **Critical warning**

  - GNSS/GPS spoofing can interfere with critical navigation systems and
    aviation safety and may violate federal law.

- **Safety zones**

  - Mandatory exclusion zones around airports, heliports, and other critical
    infrastructure (e.g., ports, power plants). Coordinate NOTAMs where
    applicable.

- **Authorization**

  - Conduct only under written authorization from competent authorities and in
    shielded facilities or certified ranges. Coordinate with aviation and public
    safety authorities as required.

- **Wartime/operational theaters**

  - Technology may be used only under lawful authority, applicable rules of
    engagement (ROE), and theater policy. This documentation remains public‑safe
    and omits operational details.

## Export controls and dual‑use

- Assess EAR/ITAR or local equivalents. Classify items, check end‑users and
  destinations, and obtain licenses as applicable.

## Mandatory sign‑off

- Security/legal review is required before any publishing or integration related
  to RF denial, GNSS deception, or signal disruption. Public docs omit
  operational details by design.
