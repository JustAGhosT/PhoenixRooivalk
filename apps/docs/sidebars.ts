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
        "executive/System_Overview",
        "executive/System_Overview_Detailed",
        "executive/Key_Questions_Cheatsheet",
        "executive/Presentation_Materials",
        "executive/Phoenix_Rooivalk_Pitch_Deck",
        "executive/Phoenix_Rooivalk_Technical_Whitepaper",
      ],
    },
    {
      type: "category",
      label: "🔧 Technical Documentation",
      collapsed: false,
      items: [
        "technical/Technical_Architecture",
        "technical/System_Architecture",
        "technical/Technical_Architecture_Synthesis",
        "technical/Blockchain_Integration",
        "technical/Decentralized_AI",
        "technical/Hardware_Foundation",
        "technical/Defense_Integration",
        "technical/Defense_Technology_Deep_Dive",
        "technical/Technical_Analysis",
        "technical/AI_Benefits",
        "technical/Glossary",
        "technical/REUSABLE_SYSTEMS_ARCHITECTURE",
        "technical/ThreatSimulator_Enhancements",
        {
          type: "category",
          label: "Architecture",
          collapsed: true,
          items: [
            "technical/architecture/Technical_Architecture",
            "technical/architecture/Architecture_Decision_Records",
          ],
        },
        {
          type: "category",
          label: "Blockchain",
          collapsed: true,
          items: [
            "technical/blockchain/Blockchain_Architecture",
            "technical/blockchain/Blockchain_Architecture_Detailed",
            "technical/blockchain/Blockchain_Benefits",
            "technical/blockchain/Blockchain_Implementation_Guide",
            "technical/blockchain/Blockchain_Implementation_Phases",
            "technical/blockchain/Blockchain_Protocols_Analysis",
            "technical/blockchain/Blockchain_Security_Compliance",
            "technical/blockchain/Implementation_Roadmap",
          ],
        },
        {
          type: "category",
          label: "Integration",
          collapsed: true,
          items: [
            "technical/integration/API_Documentation",
            "technical/integration/Integration_Guide",
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
          items: [
            "technical/performance/Performance_Specifications",
          ],
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
      items: [
        "legal/Compliance_Framework",
        "legal/Legal_Framework",
      ],
    },
    {
      type: "category",
      label: "🚀 Operations Documentation",
      collapsed: false,
      items: [
        "operations/Manufacturing_Strategy",
        "operations/Operational_Resilience",
        "operations/Implementation_Plan",
        "operations/Operations_Manual",
        "operations/Operations_Modes",
        {
          type: "category",
          label: "Deployment",
          collapsed: true,
          items: [
            "operations/deployment/Deployment_Guide",
          ],
        },
        {
          type: "category",
          label: "Maintenance",
          collapsed: true,
          items: [
            "operations/maintenance/Maintenance_Procedures",
          ],
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
          items: [
            "operations/training/Training_Materials",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "📊 Visual Elements",
      collapsed: false,
      items: [
        "visual-elements/System_Architecture_Diagrams",
      ],
    },
  ],
};

export default sidebars;
