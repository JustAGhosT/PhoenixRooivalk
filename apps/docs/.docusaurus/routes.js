import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/contact',
    component: ComponentCreator('/contact', 'a03'),
    exact: true
  },
  {
    path: '/whitepaper',
    component: ComponentCreator('/whitepaper', '45a'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'adb'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'e2e'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '900'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', 'e35'),
                exact: true
              },
              {
                path: '/docs/business/Business_Model',
                component: ComponentCreator('/docs/business/Business_Model', 'e8d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/Competitive_Analysis',
                component: ComponentCreator('/docs/business/Competitive_Analysis', 'a6c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/Emerging_Trends',
                component: ComponentCreator('/docs/business/Emerging_Trends', '511'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/Market_Analysis',
                component: ComponentCreator('/docs/business/Market_Analysis', '484'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/ROI_Analysis',
                component: ComponentCreator('/docs/business/ROI_Analysis', '636'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/Use_Cases',
                component: ComponentCreator('/docs/business/Use_Cases', '956'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/Executive_Summary',
                component: ComponentCreator('/docs/executive/Executive_Summary', '8b4'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/Global_Strategy',
                component: ComponentCreator('/docs/executive/Global_Strategy', '05f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/Key_Questions_Cheatsheet',
                component: ComponentCreator('/docs/executive/Key_Questions_Cheatsheet', '3e2'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/Phoenix_Rooivalk_Pitch_Deck',
                component: ComponentCreator('/docs/executive/Phoenix_Rooivalk_Pitch_Deck', 'f4f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/Phoenix_Rooivalk_Technical_Whitepaper',
                component: ComponentCreator('/docs/executive/Phoenix_Rooivalk_Technical_Whitepaper', '6e5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/Presentation_Materials',
                component: ComponentCreator('/docs/executive/Presentation_Materials', '548'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/Strategic_Recommendations',
                component: ComponentCreator('/docs/executive/Strategic_Recommendations', 'db1'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/System_Overview',
                component: ComponentCreator('/docs/executive/System_Overview', '9a1'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/System_Overview_Detailed',
                component: ComponentCreator('/docs/executive/System_Overview_Detailed', '0db'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/Team_Status',
                component: ComponentCreator('/docs/executive/Team_Status', 'd97'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/legal/Compliance_Framework',
                component: ComponentCreator('/docs/legal/Compliance_Framework', '158'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/legal/Legal_Framework',
                component: ComponentCreator('/docs/legal/Legal_Framework', 'a8d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/deployment/Deployment_Guide',
                component: ComponentCreator('/docs/operations/deployment/Deployment_Guide', '4f3'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/Implementation_Plan',
                component: ComponentCreator('/docs/operations/Implementation_Plan', 'c25'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/maintenance/Maintenance_Procedures',
                component: ComponentCreator('/docs/operations/maintenance/Maintenance_Procedures', '499'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/Manufacturing_Strategy',
                component: ComponentCreator('/docs/operations/Manufacturing_Strategy', 'e46'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/monitoring/Operations_Log_Template',
                component: ComponentCreator('/docs/operations/monitoring/Operations_Log_Template', '967'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/monitoring/Troubleshooting_Guide',
                component: ComponentCreator('/docs/operations/monitoring/Troubleshooting_Guide', 'fbe'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/Operational_Resilience',
                component: ComponentCreator('/docs/operations/Operational_Resilience', 'fb9'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/Operations_Manual',
                component: ComponentCreator('/docs/operations/Operations_Manual', '379'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/Operations_Modes',
                component: ComponentCreator('/docs/operations/Operations_Modes', '387'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/training/Training_Materials',
                component: ComponentCreator('/docs/operations/training/Training_Materials', '835'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/AI_Benefits',
                component: ComponentCreator('/docs/technical/AI_Benefits', '2ef'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/architecture/Architecture_Decision_Records',
                component: ComponentCreator('/docs/technical/architecture/Architecture_Decision_Records', '4bb'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/architecture/Technical_Architecture',
                component: ComponentCreator('/docs/technical/architecture/Technical_Architecture', '894'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/Blockchain_Integration',
                component: ComponentCreator('/docs/technical/Blockchain_Integration', '58b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/Blockchain_Architecture',
                component: ComponentCreator('/docs/technical/blockchain/Blockchain_Architecture', '0a7'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/Blockchain_Architecture_Detailed',
                component: ComponentCreator('/docs/technical/blockchain/Blockchain_Architecture_Detailed', '84d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/Blockchain_Benefits',
                component: ComponentCreator('/docs/technical/blockchain/Blockchain_Benefits', '1bc'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/Blockchain_Implementation_Guide',
                component: ComponentCreator('/docs/technical/blockchain/Blockchain_Implementation_Guide', '25d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/Blockchain_Implementation_Phases',
                component: ComponentCreator('/docs/technical/blockchain/Blockchain_Implementation_Phases', '901'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/Blockchain_Protocols_Analysis',
                component: ComponentCreator('/docs/technical/blockchain/Blockchain_Protocols_Analysis', '9b6'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/Blockchain_Security_Compliance',
                component: ComponentCreator('/docs/technical/blockchain/Blockchain_Security_Compliance', '98a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/Implementation_Roadmap',
                component: ComponentCreator('/docs/technical/blockchain/Implementation_Roadmap', 'b44'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/Decentralized_AI',
                component: ComponentCreator('/docs/technical/Decentralized_AI', '074'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/Defense_Integration',
                component: ComponentCreator('/docs/technical/Defense_Integration', 'e46'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/Defense_Technology_Deep_Dive',
                component: ComponentCreator('/docs/technical/Defense_Technology_Deep_Dive', '42f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/Glossary',
                component: ComponentCreator('/docs/technical/Glossary', '234'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/Hardware_Foundation',
                component: ComponentCreator('/docs/technical/Hardware_Foundation', 'b3b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/integration/API_Documentation',
                component: ComponentCreator('/docs/technical/integration/API_Documentation', '5cd'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/integration/Integration_Guide',
                component: ComponentCreator('/docs/technical/integration/Integration_Guide', '4a0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/mechanical/Mechanical_Design_ADRs',
                component: ComponentCreator('/docs/technical/mechanical/Mechanical_Design_ADRs', '1d1'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/mechanical/Mechanical_Design_Records',
                component: ComponentCreator('/docs/technical/mechanical/Mechanical_Design_Records', '1bb'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/performance/Performance_Specifications',
                component: ComponentCreator('/docs/technical/performance/Performance_Specifications', 'cda'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/REUSABLE_SYSTEMS_ARCHITECTURE',
                component: ComponentCreator('/docs/technical/REUSABLE_SYSTEMS_ARCHITECTURE', '234'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/System_Architecture',
                component: ComponentCreator('/docs/technical/System_Architecture', 'e5d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/Technical_Analysis',
                component: ComponentCreator('/docs/technical/Technical_Analysis', 'a30'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/Technical_Architecture',
                component: ComponentCreator('/docs/technical/Technical_Architecture', '13e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/Technical_Architecture_Synthesis',
                component: ComponentCreator('/docs/technical/Technical_Architecture_Synthesis', '4b0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/ThreatSimulator_Enhancements',
                component: ComponentCreator('/docs/technical/ThreatSimulator_Enhancements', '5d4'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/visual-elements/System_Architecture_Diagrams',
                component: ComponentCreator('/docs/visual-elements/System_Architecture_Diagrams', '287'),
                exact: true,
                sidebar: "docs"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
