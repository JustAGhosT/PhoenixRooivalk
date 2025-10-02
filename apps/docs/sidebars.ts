import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "category",
      label: "📊 Executive Documentation",
      collapsed: false,
      items: [
        "executive/Executive_Summary",
        "executive/Global_Strategy",
        "executive/Team_Status",
        "executive/Strategic_Recommendations",
      ],
    },
    {
      type: "category",
      label: "🔧 Technical Documentation",
      collapsed: false,
      items: [
        "technical/Technical_Architecture",
        "technical/System_Architecture",
        "technical/Blockchain_Integration",
        "technical/Decentralized_AI",
        "technical/Hardware_Foundation",
        "technical/Defense_Integration",
        "technical/Technical_Architecture_Synthesis",
      ],
    },
    {
      type: "category",
      label: "💼 Business Documentation",
      collapsed: false,
      items: [
        "business/Market_Analysis",
        "business/Business_Model",
      ],
    },
    {
      type: "category",
      label: "⚖️ Legal Documentation",
      collapsed: false,
      items: [
        "legal/Compliance_Framework",
      ],
    },
    {
      type: "category",
      label: "🚀 Operations Documentation",
      collapsed: false,
      items: [
        "operations/Manufacturing_Strategy",
        "operations/Operational_Resilience",
      ],
    },
  ],
};

export default sidebars;
