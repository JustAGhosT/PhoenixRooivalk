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
    component: ComponentCreator('/docs', '932'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '7aa'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '6df'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', 'e35'),
                exact: true
              },
              {
                path: '/docs/business/budget-timeline-templates',
                component: ComponentCreator('/docs/business/budget-timeline-templates', '9d7'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/business-model',
                component: ComponentCreator('/docs/business/business-model', '113'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/commercial-proposal-template',
                component: ComponentCreator('/docs/business/commercial-proposal-template', '576'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/competitive-analysis',
                component: ComponentCreator('/docs/business/competitive-analysis', 'b17'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/competitive-differentiation-guide',
                component: ComponentCreator('/docs/business/competitive-differentiation-guide', '3f8'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/discovery-questionnaire',
                component: ComponentCreator('/docs/business/discovery-questionnaire', 'd0e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/dod-proposal-template',
                component: ComponentCreator('/docs/business/dod-proposal-template', '3de'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/emerging-trends',
                component: ComponentCreator('/docs/business/emerging-trends', 'f95'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/investment-teaser',
                component: ComponentCreator('/docs/business/investment-teaser', 'd89'),
                exact: true
              },
              {
                path: '/docs/business/market-analysis',
                component: ComponentCreator('/docs/business/market-analysis', '414'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/presentation-video-script',
                component: ComponentCreator('/docs/business/presentation-video-script', '2c0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/roi-analysis',
                component: ComponentCreator('/docs/business/roi-analysis', 'cb3'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/technical-requirements-checklist',
                component: ComponentCreator('/docs/business/technical-requirements-checklist', 'de0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/traction-metrics',
                component: ComponentCreator('/docs/business/traction-metrics', 'ab5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/business/use-cases',
                component: ComponentCreator('/docs/business/use-cases', '0c7'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/design/icon-requirements',
                component: ComponentCreator('/docs/design/icon-requirements', 'fc9'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/executive-summary',
                component: ComponentCreator('/docs/executive/executive-summary', '2f6'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/global-strategy',
                component: ComponentCreator('/docs/executive/global-strategy', 'e2c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/key-questions-cheatsheet',
                component: ComponentCreator('/docs/executive/key-questions-cheatsheet', '283'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/phoenix-rooivalk-litepaper',
                component: ComponentCreator('/docs/executive/phoenix-rooivalk-litepaper', '9bb'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/phoenix-rooivalk-pitch-deck',
                component: ComponentCreator('/docs/executive/phoenix-rooivalk-pitch-deck', '418'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/phoenix-rooivalk-technical-whitepaper',
                component: ComponentCreator('/docs/executive/phoenix-rooivalk-technical-whitepaper', 'e3c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/presentation-materials',
                component: ComponentCreator('/docs/executive/presentation-materials', '805'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/strategic-recommendations',
                component: ComponentCreator('/docs/executive/strategic-recommendations', 'bcb'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/system-overview',
                component: ComponentCreator('/docs/executive/system-overview', '327'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/system-overview-detailed',
                component: ComponentCreator('/docs/executive/system-overview-detailed', 'fcf'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/executive/team-status',
                component: ComponentCreator('/docs/executive/team-status', '4d0'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/legal/compliance-framework',
                component: ComponentCreator('/docs/legal/compliance-framework', 'be7'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/legal/legal-framework',
                component: ComponentCreator('/docs/legal/legal-framework', '666'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/customer-onboarding-guide',
                component: ComponentCreator('/docs/operations/customer-onboarding-guide', '156'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/deployment/deployment-guide',
                component: ComponentCreator('/docs/operations/deployment/deployment-guide', '951'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/implementation-plan',
                component: ComponentCreator('/docs/operations/implementation-plan', '5de'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/maintenance/maintenance-procedures',
                component: ComponentCreator('/docs/operations/maintenance/maintenance-procedures', '7cf'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/manufacturing-strategy',
                component: ComponentCreator('/docs/operations/manufacturing-strategy', 'b3a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/monitoring/operations-log-template',
                component: ComponentCreator('/docs/operations/monitoring/operations-log-template', 'e64'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/monitoring/troubleshooting-guide',
                component: ComponentCreator('/docs/operations/monitoring/troubleshooting-guide', '2d9'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/operational-resilience',
                component: ComponentCreator('/docs/operations/operational-resilience', 'd33'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/operations-manual',
                component: ComponentCreator('/docs/operations/operations-manual', '224'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/operations-modes',
                component: ComponentCreator('/docs/operations/operations-modes', 'df5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/training/training-materials',
                component: ComponentCreator('/docs/operations/training/training-materials', 'ed9'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/research/experimental-counter-drone-effectors-transform-warfare',
                component: ComponentCreator('/docs/research/experimental-counter-drone-effectors-transform-warfare', '2c2'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/research/inst-airframe-design-and-aerodynamics-modified',
                component: ComponentCreator('/docs/research/inst-airframe-design-and-aerodynamics-modified', '384'),
                exact: true
              },
              {
                path: '/docs/research/inst-avionics-autonomy-and-navigation-modified',
                component: ComponentCreator('/docs/research/inst-avionics-autonomy-and-navigation-modified', '3d4'),
                exact: true
              },
              {
                path: '/docs/research/inst-business-and-economics-modified',
                component: ComponentCreator('/docs/research/inst-business-and-economics-modified', 'cdd'),
                exact: true
              },
              {
                path: '/docs/research/inst-combined-prompt-modified',
                component: ComponentCreator('/docs/research/inst-combined-prompt-modified', 'bd0'),
                exact: true
              },
              {
                path: '/docs/research/inst-communications-and-ground-segment',
                component: ComponentCreator('/docs/research/inst-communications-and-ground-segment', '9e2'),
                exact: true
              },
              {
                path: '/docs/research/inst-cross-cutting-concerns-modified',
                component: ComponentCreator('/docs/research/inst-cross-cutting-concerns-modified', '679'),
                exact: true
              },
              {
                path: '/docs/research/inst-forward-looking-modified',
                component: ComponentCreator('/docs/research/inst-forward-looking-modified', '0c8'),
                exact: true
              },
              {
                path: '/docs/research/inst-maintenance-sustainment-manufacturing-payload-environment-and-operations-modified',
                component: ComponentCreator('/docs/research/inst-maintenance-sustainment-manufacturing-payload-environment-and-operations-modified', '214'),
                exact: true
              },
              {
                path: '/docs/research/inst-motor-specification-and-performance-modified',
                component: ComponentCreator('/docs/research/inst-motor-specification-and-performance-modified', '1e0'),
                exact: true
              },
              {
                path: '/docs/research/inst-power-electronics-and-esc',
                component: ComponentCreator('/docs/research/inst-power-electronics-and-esc', 'caa'),
                exact: true
              },
              {
                path: '/docs/research/inst-power-storage-and-management',
                component: ComponentCreator('/docs/research/inst-power-storage-and-management', '6a3'),
                exact: true
              },
              {
                path: '/docs/research/inst-propulsion-systems-complete',
                component: ComponentCreator('/docs/research/inst-propulsion-systems-complete', 'f74'),
                exact: true
              },
              {
                path: '/docs/research/inst-safety-reliability-certification-regulatory-standards-modified',
                component: ComponentCreator('/docs/research/inst-safety-reliability-certification-regulatory-standards-modified', '844'),
                exact: true
              },
              {
                path: '/docs/research/resp-airframe-design-and-aerodynamics-claude',
                component: ComponentCreator('/docs/research/resp-airframe-design-and-aerodynamics-claude', 'af0'),
                exact: true
              },
              {
                path: '/docs/research/sensor-technologies-comprehensive-analysis',
                component: ComponentCreator('/docs/research/sensor-technologies-comprehensive-analysis', '977'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/ai-benefits',
                component: ComponentCreator('/docs/technical/ai-benefits', 'fdd'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/architecture/architecture-decision-records',
                component: ComponentCreator('/docs/technical/architecture/architecture-decision-records', '53c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/architecture/technical-architecture',
                component: ComponentCreator('/docs/technical/architecture/technical-architecture', '79f'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain-integration',
                component: ComponentCreator('/docs/technical/blockchain-integration', '729'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/blockchain-architecture',
                component: ComponentCreator('/docs/technical/blockchain/blockchain-architecture', '0ac'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/blockchain-architecture-detailed',
                component: ComponentCreator('/docs/technical/blockchain/blockchain-architecture-detailed', 'a18'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/blockchain-benefits',
                component: ComponentCreator('/docs/technical/blockchain/blockchain-benefits', '603'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/blockchain-implementation-guide',
                component: ComponentCreator('/docs/technical/blockchain/blockchain-implementation-guide', 'd7e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/blockchain-implementation-phases',
                component: ComponentCreator('/docs/technical/blockchain/blockchain-implementation-phases', 'c59'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/blockchain-protocols-analysis',
                component: ComponentCreator('/docs/technical/blockchain/blockchain-protocols-analysis', '96d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/blockchain-security-compliance',
                component: ComponentCreator('/docs/technical/blockchain/blockchain-security-compliance', '882'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/blockchain/implementation-roadmap',
                component: ComponentCreator('/docs/technical/blockchain/implementation-roadmap', 'bea'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/decentralized-ai',
                component: ComponentCreator('/docs/technical/decentralized-ai', '875'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/defense-integration',
                component: ComponentCreator('/docs/technical/defense-integration', '844'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/defense-technology-deep-dive',
                component: ComponentCreator('/docs/technical/defense-technology-deep-dive', '5d7'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/glossary',
                component: ComponentCreator('/docs/technical/glossary', '307'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/hardware-foundation',
                component: ComponentCreator('/docs/technical/hardware-foundation', '63b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/integration/api-documentation',
                component: ComponentCreator('/docs/technical/integration/api-documentation', '0c6'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/integration/integration-guide',
                component: ComponentCreator('/docs/technical/integration/integration-guide', '642'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/mechanical/mechanical-design-adrs',
                component: ComponentCreator('/docs/technical/mechanical/mechanical-design-adrs', '53c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/mechanical/mechanical-design-records',
                component: ComponentCreator('/docs/technical/mechanical/mechanical-design-records', '8ec'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/performance/performance-specifications',
                component: ComponentCreator('/docs/technical/performance/performance-specifications', '466'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/reusable-systems-architecture',
                component: ComponentCreator('/docs/technical/reusable-systems-architecture', 'eae'),
                exact: true
              },
              {
                path: '/docs/technical/system-architecture',
                component: ComponentCreator('/docs/technical/system-architecture', 'c68'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/technical-analysis',
                component: ComponentCreator('/docs/technical/technical-analysis', '021'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/technical-architecture',
                component: ComponentCreator('/docs/technical/technical-architecture', '1a1'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/technical-architecture-synthesis',
                component: ComponentCreator('/docs/technical/technical-architecture-synthesis', '12b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical/threatsimulator-enhancements',
                component: ComponentCreator('/docs/technical/threatsimulator-enhancements', 'b56'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/visual-elements/system-architecture-diagrams',
                component: ComponentCreator('/docs/visual-elements/system-architecture-diagrams', 'cb0'),
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
