import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "category",
      label: "Overview",
      collapsed: false,
      items: [
        "overview",
        "ai_benefits",
        "blockchain_benefits",
        "ai_blockchain_benefits",
        "technical_overview",
        "phoenix_rooivalk_whitepaper",
      ],
    },
    {
      type: "category",
      label: "Architecture",
      items: [
        "architecture/overview",
        "architecture/c2",
        "architecture/comms",
        "architecture/safety",
      ],
    },
    {
      type: "category",
      label: "Operations",
      items: [
        "operations/modes",
        "operations/observability",
        "operations/deployment",
      ],
    },
    {
      type: "category",
      label: "Legal & Governance",
      items: [
        "legal/countermeasure-policy",
        "legal/responsible-use",
        "legal/compliance",
        {
          type: "link",
          label: "Request Access",
          href: "https://github.com/JustAGhosT/PhoenixRooivalk/blob/main/ACCESS.md",
        },
      ],
    },
  ],
};

export default sidebars;
