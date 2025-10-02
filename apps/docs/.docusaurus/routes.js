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
    component: ComponentCreator('/docs', 'c8f'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'b51'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'd9f'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', 'e35'),
                exact: true
              },
              {
                path: '/docs/business/business-model',
                component: ComponentCreator('/docs/business/business-model', 'fc2'),
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
                path: '/docs/executive/executive-summary',
                component: ComponentCreator('/docs/executive/executive-summary', '41b'),
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
                path: '/docs/executive/key-questions-cheatsheet',
                component: ComponentCreator('/docs/executive/key-questions-cheatsheet', '888'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/phoenix-rooivalk-pitch-deck',
                component: ComponentCreator('/docs/executive/phoenix-rooivalk-pitch-deck', '33d'),
                exact: true
              },
              {
                path: '/docs/executive/phoenix-rooivalk-technical-whitepaper',
                component: ComponentCreator('/docs/executive/phoenix-rooivalk-technical-whitepaper', '1e6'),
                exact: true
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
                path: '/docs/executive/system-overview',
                component: ComponentCreator('/docs/executive/system-overview', 'b1b'),
                exact: true
              },
              {
                path: '/docs/executive/system-overview-detailed',
                component: ComponentCreator('/docs/executive/system-overview-detailed', 'a78'),
                exact: true
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
                path: '/docs/operations/implementation-plan',
                component: ComponentCreator('/docs/operations/implementation-plan', '3da'),
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
                path: '/docs/operations/Operations_Modes',
                component: ComponentCreator('/docs/operations/Operations_Modes', '387'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/operations-manual',
                component: ComponentCreator('/docs/operations/operations-manual', '0d5'),
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
                path: '/docs/technical/ai-benefits',
                component: ComponentCreator('/docs/technical/ai-benefits', 'fd9'),
                exact: true
              },
              {
                path: '/docs/technical/architecture/Architecture_Decision_Records',
                component: ComponentCreator('/docs/technical/architecture/Architecture_Decision_Records', 'be1'),
                exact: true
              },
              {
                path: '/docs/technical/architecture/technical-architecture',
                component: ComponentCreator('/docs/technical/architecture/technical-architecture', '519'),
                exact: true
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
                path: '/docs/technical/blockchain/Blockchain_Security_Compliance',
                component: ComponentCreator('/docs/technical/blockchain/Blockchain_Security_Compliance', '98a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/blockchain-benefits',
                component: ComponentCreator('/docs/technical/blockchain/blockchain-benefits', '9b4'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/blockchain-implementation-guide',
                component: ComponentCreator('/docs/technical/blockchain/blockchain-implementation-guide', '3da'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/blockchain-implementation-phases',
                component: ComponentCreator('/docs/technical/blockchain/blockchain-implementation-phases', '9a5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/blockchain-protocols-analysis',
                component: ComponentCreator('/docs/technical/blockchain/blockchain-protocols-analysis', 'fa6'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/implementation-roadmap',
                component: ComponentCreator('/docs/technical/blockchain/implementation-roadmap', '609'),
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
                path: '/docs/technical/glossary',
                component: ComponentCreator('/docs/technical/glossary', 'f91'),
                exact: true
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
                path: '/docs/technical/integration/integration-guide',
                component: ComponentCreator('/docs/technical/integration/integration-guide', '1bf'),
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
                path: '/docs/technical/performance/performance-specifications',
                component: ComponentCreator('/docs/technical/performance/performance-specifications', '506'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/reusable-systems-architecture',
                component: ComponentCreator('/docs/technical/reusable-systems-architecture', 'def'),
                exact: true
              },
              {
                path: '/docs/technical/System_Architecture',
                component: ComponentCreator('/docs/technical/System_Architecture', 'e5d'),
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
                component: ComponentCreator('/docs/technical/Technical_Architecture_Synthesis', '399'),
                exact: true
              },
              {
                path: '/docs/technical/technical-analysis',
                component: ComponentCreator('/docs/technical/technical-analysis', '385'),
                exact: true
              },
              {
                path: '/docs/technical/ThreatSimulator_Enhancements',
                component: ComponentCreator('/docs/technical/ThreatSimulator_Enhancements', 'fc1'),
                exact: true
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
