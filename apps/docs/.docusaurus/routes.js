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
    component: ComponentCreator('/docs', '2b0'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '56e'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'ef0'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', 'e35'),
                exact: true
              },
              {
                path: '/docs/business/budget-timeline-templates',
                component: ComponentCreator('/docs/business/budget-timeline-templates', 'b8d'),
                exact: true
              },
              {
                path: '/docs/business/business-model',
                component: ComponentCreator('/docs/business/business-model', 'fc2'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/commercial-proposal-template',
                component: ComponentCreator('/docs/business/commercial-proposal-template', 'fbd'),
                exact: true
              },
              {
                path: '/docs/business/competitive-analysis',
                component: ComponentCreator('/docs/business/competitive-analysis', '8d1'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/competitive-differentiation-guide',
                component: ComponentCreator('/docs/business/competitive-differentiation-guide', '5d2'),
                exact: true
              },
              {
                path: '/docs/business/discovery-questionnaire',
                component: ComponentCreator('/docs/business/discovery-questionnaire', '147'),
                exact: true
              },
              {
                path: '/docs/business/dod-proposal-template',
                component: ComponentCreator('/docs/business/dod-proposal-template', '63f'),
                exact: true
              },
              {
                path: '/docs/business/Emerging_Trends',
                component: ComponentCreator('/docs/business/Emerging_Trends', '511'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/market-analysis',
                component: ComponentCreator('/docs/business/market-analysis', '144'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/presentation-video-script',
                component: ComponentCreator('/docs/business/presentation-video-script', 'f39'),
                exact: true
              },
              {
                path: '/docs/business/roi-analysis',
                component: ComponentCreator('/docs/business/roi-analysis', 'be1'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/technical-requirements-checklist',
                component: ComponentCreator('/docs/business/technical-requirements-checklist', 'a98'),
                exact: true
              },
              {
                path: '/docs/business/traction-metrics',
                component: ComponentCreator('/docs/business/traction-metrics', 'b2e'),
                exact: true
              },
              {
                path: '/docs/business/use-cases',
                component: ComponentCreator('/docs/business/use-cases', '5ec'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/design/icon-requirements',
                component: ComponentCreator('/docs/design/icon-requirements', '6c9'),
                exact: true
              },
              {
                path: '/docs/executive/executive-summary',
                component: ComponentCreator('/docs/executive/executive-summary', '41b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/global-strategy',
                component: ComponentCreator('/docs/executive/global-strategy', '83d'),
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
                path: '/docs/executive/phoenix-rooivalk-litepaper',
                component: ComponentCreator('/docs/executive/phoenix-rooivalk-litepaper', '361'),
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
                component: ComponentCreator('/docs/executive/phoenix-rooivalk-technical-whitepaper', 'a68'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/presentation-materials',
                component: ComponentCreator('/docs/executive/presentation-materials', '0c1'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/strategic-recommendations',
                component: ComponentCreator('/docs/executive/strategic-recommendations', 'c74'),
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
                path: '/docs/executive/team-status',
                component: ComponentCreator('/docs/executive/team-status', 'd1a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/legal/compliance-framework',
                component: ComponentCreator('/docs/legal/compliance-framework', '606'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/legal/legal-framework',
                component: ComponentCreator('/docs/legal/legal-framework', '2af'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/customer-onboarding-guide',
                component: ComponentCreator('/docs/operations/customer-onboarding-guide', 'eda'),
                exact: true
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
                path: '/docs/research/experimental-counter-drone-effectors-transform-warfare',
                component: ComponentCreator('/docs/research/experimental-counter-drone-effectors-transform-warfare', '34c'),
                exact: true
              },
              {
                path: '/docs/technical/ai-benefits',
                component: ComponentCreator('/docs/technical/ai-benefits', 'fd9'),
                exact: true
              },
              {
                path: '/docs/technical/architecture/architecture-decision-records',
                component: ComponentCreator('/docs/technical/architecture/architecture-decision-records', 'c4b'),
                exact: true
              },
              {
                path: '/docs/technical/architecture/technical-architecture',
                component: ComponentCreator('/docs/technical/architecture/technical-architecture', '519'),
                exact: true
              },
              {
                path: '/docs/technical/blockchain-integration',
                component: ComponentCreator('/docs/technical/blockchain-integration', 'b51'),
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
                path: '/docs/technical/hardware-foundation',
                component: ComponentCreator('/docs/technical/hardware-foundation', 'f77'),
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
                path: '/docs/technical/system-architecture',
                component: ComponentCreator('/docs/technical/system-architecture', '403'),
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
