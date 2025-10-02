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
        "executive/Key_Questions_Cheatsheet",
        "executive/Presentation_Materials",
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
        "business/Market_Analysis",
        "business/Business_Model",
        "business/Competitive_Analysis",
        "business/Emerging_Trends",
        "business/ROI_Analysis",
        "business/Use_Cases",
      ],
    },
    {
      type: "category",
      label: "⚖️ Legal Documentation",
      collapsed: false,
      items: ["legal/Compliance_Framework", "legal/Legal_Framework"],
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
