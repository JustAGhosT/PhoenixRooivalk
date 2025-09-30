# Security Policy

- **Scope**

  - Vulnerabilities in code, documentation site (Jekyll/GitHub Pages), and
    deployment workflows.
  - Excludes partner-only artifacts not hosted in this repo.

- **Reporting**

  - Email: security@phoenixvc.tech (fallback: smit.jurie@gmail.com)
  - Include: affected files/URLs, reproduction steps, impact, and any logs/PoCs.
  - Use encrypted channel if sensitive; PGP on request.

- **Disclosure**

  - We follow an embargo process. Do not publicly disclose prior to coordinated
    fix and advisory.
  - Typical timelines: acknowledge within 3 business days; triage within 10
    business days; fix priority based on severity.

- **Hardening**

  - Signed artifacts, SBOMs, and CI checks for integrity where applicable.
  - No secrets in repo. Use environment variables/secret stores.

- **Out of scope examples**
  - Non-exploitable markdown or spelling issues.
  - Social engineering against maintainers or partners.
