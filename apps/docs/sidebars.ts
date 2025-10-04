import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "category",
      label: "📊 Executive Documentation",
      collapsed: false,
      items: [
        "executive/executive-summary",
        "executive/global-strategy",
        "executive/team-status",
        "executive/strategic-recommendations",
        "executive/key-questions-cheatsheet",
        "executive/presentation-materials",
        "executive/phoenix-rooivalk-litepaper",
        "executive/phoenix-rooivalk-technical-whitepaper",
      ],
    },
    {
      type: "category",
      label: "🔧 Technical Documentation",
      collapsed: false,
      items: [
        "technical/Technical_Architecture",
        "technical/system-architecture",
        "technical/blockchain-integration",
        "technical/Decentralized_AI",
        "technical/hardware-foundation",
        "technical/Defense_Integration",
        "technical/Defense_Technology_Deep_Dive",
        {
          type: "category",
          label: "Blockchain",
          collapsed: true,
          items: [
            "technical/blockchain/Blockchain_Architecture",
            "technical/blockchain/Blockchain_Architecture_Detailed",
            "technical/blockchain/blockchain-benefits",
            "technical/blockchain/blockchain-implementation-guide",
            "technical/blockchain/blockchain-implementation-phases",
            "technical/blockchain/blockchain-protocols-analysis",
            "technical/blockchain/Blockchain_Security_Compliance",
            "technical/blockchain/implementation-roadmap",
          ],
        },
        {
          type: "category",
          label: "Integration",
          collapsed: true,
          items: [
            "technical/integration/API_Documentation",
            "technical/integration/integration-guide",
          ],
        },
        {
          type: "category",
          label: "Mechanical",
          collapsed: true,
          items: [
            "technical/mechanical/Mechanical_Design_ADRs",
            "technical/mechanical/Mechanical_Design_Records",
          ],
        },
        {
          type: "category",
          label: "Performance",
          collapsed: true,
          items: ["technical/performance/performance-specifications"],
        },
      ],
    },
    {
      type: "category",
      label: "💼 Business Documentation",
      collapsed: false,
      items: [
        "business/market-analysis",
        "business/business-model",
        "business/competitive-analysis",
        "business/Emerging_Trends",
        "business/roi-analysis",
        "business/use-cases",
      ],
    },
    {
      type: "category",
      label: "⚖️ Legal Documentation",
      collapsed: false,
      items: ["legal/compliance-framework", "legal/legal-framework"],
    },
    {
      type: "category",
      label: "🚀 Operations Documentation",
      collapsed: false,
      items: [
        "operations/Manufacturing_Strategy",
        "operations/Operational_Resilience",
        "operations/implementation-plan",
        "operations/operations-manual",
        "operations/Operations_Modes",
        {
          type: "category",
          label: "Deployment",
          collapsed: true,
          items: ["operations/deployment/Deployment_Guide"],
        },
        {
          type: "category",
          label: "Maintenance",
          collapsed: true,
          items: ["operations/maintenance/Maintenance_Procedures"],
        },
        {
          type: "category",
          label: "Monitoring",
          collapsed: true,
          items: [
            "operations/monitoring/Operations_Log_Template",
            "operations/monitoring/Troubleshooting_Guide",
          ],
        },
        {
          type: "category",
          label: "Training",
          collapsed: true,
          items: ["operations/training/Training_Materials"],
        },
      ],
    },
    {
      type: "category",
      label: "📊 Visual Elements",
      collapsed: false,
      items: ["visual-elements/System_Architecture_Diagrams"],
    },
  ],
};

export default sidebars;
