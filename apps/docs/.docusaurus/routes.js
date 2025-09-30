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
    component: ComponentCreator('/docs', 'e7b'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'e62'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '385'),
            routes: [
              {
                path: '/docs/adr/l0-adoption-strategy',
                component: ComponentCreator('/docs/adr/l0-adoption-strategy', '348'),
                exact: true
              },
              {
                path: '/docs/adr/layered-strategy-l1-l2-l3',
                component: ComponentCreator('/docs/adr/layered-strategy-l1-l2-l3', '619'),
                exact: true
              },
              {
                path: '/docs/adr/solana-memo-vs-contract',
                component: ComponentCreator('/docs/adr/solana-memo-vs-contract', 'a21'),
                exact: true
              },
              {
                path: '/docs/adr/solana-vs-others',
                component: ComponentCreator('/docs/adr/solana-vs-others', 'c76'),
                exact: true
              },
              {
                path: '/docs/ai_benefits',
                component: ComponentCreator('/docs/ai_benefits', 'f25'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/ai_blockchain_benefits',
                component: ComponentCreator('/docs/ai_blockchain_benefits', 'a53'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/architecture/c2',
                component: ComponentCreator('/docs/architecture/c2', '302'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/architecture/comms',
                component: ComponentCreator('/docs/architecture/comms', '751'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/architecture/overview',
                component: ComponentCreator('/docs/architecture/overview', '304'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/architecture/safety',
                component: ComponentCreator('/docs/architecture/safety', 'd12'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/blockchain_benefits',
                component: ComponentCreator('/docs/blockchain_benefits', '5f5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/blockchain_integration',
                component: ComponentCreator('/docs/blockchain_integration', '685'),
                exact: true
              },
              {
                path: '/docs/blockchain/',
                component: ComponentCreator('/docs/blockchain/', '018'),
                exact: true
              },
              {
                path: '/docs/blockchain/appendices/glossary',
                component: ComponentCreator('/docs/blockchain/appendices/glossary', 'be9'),
                exact: true
              },
              {
                path: '/docs/blockchain/appendices/research-papers',
                component: ComponentCreator('/docs/blockchain/appendices/research-papers', '4f4'),
                exact: true
              },
              {
                path: '/docs/blockchain/appendices/technical-reference/api-documentation',
                component: ComponentCreator('/docs/blockchain/appendices/technical-reference/api-documentation', '77b'),
                exact: true
              },
              {
                path: '/docs/blockchain/appendices/technical-reference/code-examples',
                component: ComponentCreator('/docs/blockchain/appendices/technical-reference/code-examples', '7d0'),
                exact: true
              },
              {
                path: '/docs/blockchain/appendices/technical-reference/smart-contracts',
                component: ComponentCreator('/docs/blockchain/appendices/technical-reference/smart-contracts', 'e05'),
                exact: true
              },
              {
                path: '/docs/blockchain/appendices/vendor-comparisons',
                component: ComponentCreator('/docs/blockchain/appendices/vendor-comparisons', '97a'),
                exact: true
              },
              {
                path: '/docs/blockchain/cost-analysis/',
                component: ComponentCreator('/docs/blockchain/cost-analysis/', '483'),
                exact: true
              },
              {
                path: '/docs/blockchain/cost-analysis/budget-breakdown',
                component: ComponentCreator('/docs/blockchain/cost-analysis/budget-breakdown', '463'),
                exact: true
              },
              {
                path: '/docs/blockchain/cost-analysis/cost-optimization',
                component: ComponentCreator('/docs/blockchain/cost-analysis/cost-optimization', '231'),
                exact: true
              },
              {
                path: '/docs/blockchain/cost-analysis/operational-costs',
                component: ComponentCreator('/docs/blockchain/cost-analysis/operational-costs', 'ae7'),
                exact: true
              },
              {
                path: '/docs/blockchain/cost-analysis/roi-analysis',
                component: ComponentCreator('/docs/blockchain/cost-analysis/roi-analysis', '52f'),
                exact: true
              },
              {
                path: '/docs/blockchain/deployment/',
                component: ComponentCreator('/docs/blockchain/deployment/', '0ca'),
                exact: true
              },
              {
                path: '/docs/blockchain/deployment/ci-cd-pipeline',
                component: ComponentCreator('/docs/blockchain/deployment/ci-cd-pipeline', '9cd'),
                exact: true
              },
              {
                path: '/docs/blockchain/deployment/deployment-guide',
                component: ComponentCreator('/docs/blockchain/deployment/deployment-guide', 'a21'),
                exact: true
              },
              {
                path: '/docs/blockchain/deployment/infrastructure/aws-architecture',
                component: ComponentCreator('/docs/blockchain/deployment/infrastructure/aws-architecture', '0e4'),
                exact: true
              },
              {
                path: '/docs/blockchain/deployment/infrastructure/kubernetes-manifests',
                component: ComponentCreator('/docs/blockchain/deployment/infrastructure/kubernetes-manifests', 'ac8'),
                exact: true
              },
              {
                path: '/docs/blockchain/deployment/infrastructure/terraform-configs',
                component: ComponentCreator('/docs/blockchain/deployment/infrastructure/terraform-configs', 'b4f'),
                exact: true
              },
              {
                path: '/docs/blockchain/deployment/production-checklist',
                component: ComponentCreator('/docs/blockchain/deployment/production-checklist', 'ddc'),
                exact: true
              },
              {
                path: '/docs/blockchain/executive-summary/',
                component: ComponentCreator('/docs/blockchain/executive-summary/', '434'),
                exact: true
              },
              {
                path: '/docs/blockchain/executive-summary/',
                component: ComponentCreator('/docs/blockchain/executive-summary/', '406'),
                exact: true
              },
              {
                path: '/docs/blockchain/executive-summary/implementation-roadmap',
                component: ComponentCreator('/docs/blockchain/executive-summary/implementation-roadmap', '153'),
                exact: true
              },
              {
                path: '/docs/blockchain/executive-summary/key-findings',
                component: ComponentCreator('/docs/blockchain/executive-summary/key-findings', '7e1'),
                exact: true
              },
              {
                path: '/docs/blockchain/implementation/',
                component: ComponentCreator('/docs/blockchain/implementation/', '79f'),
                exact: true
              },
              {
                path: '/docs/blockchain/implementation/phase-1-authentication/implementation-code',
                component: ComponentCreator('/docs/blockchain/implementation/phase-1-authentication/implementation-code', '767'),
                exact: true
              },
              {
                path: '/docs/blockchain/implementation/phase-1-authentication/puf-integration',
                component: ComponentCreator('/docs/blockchain/implementation/phase-1-authentication/puf-integration', '913'),
                exact: true
              },
              {
                path: '/docs/blockchain/implementation/phase-1-authentication/requirements',
                component: ComponentCreator('/docs/blockchain/implementation/phase-1-authentication/requirements', '25e'),
                exact: true
              },
              {
                path: '/docs/blockchain/implementation/phase-2-data-logging/ai-integration',
                component: ComponentCreator('/docs/blockchain/implementation/phase-2-data-logging/ai-integration', '797'),
                exact: true
              },
              {
                path: '/docs/blockchain/implementation/phase-2-data-logging/tamper-resistant-design',
                component: ComponentCreator('/docs/blockchain/implementation/phase-2-data-logging/tamper-resistant-design', '482'),
                exact: true
              },
              {
                path: '/docs/blockchain/implementation/phase-2-data-logging/threat-intelligence',
                component: ComponentCreator('/docs/blockchain/implementation/phase-2-data-logging/threat-intelligence', 'c19'),
                exact: true
              },
              {
                path: '/docs/blockchain/implementation/phase-3-swarm-coordination/consensus-algorithms',
                component: ComponentCreator('/docs/blockchain/implementation/phase-3-swarm-coordination/consensus-algorithms', 'dd8'),
                exact: true
              },
              {
                path: '/docs/blockchain/implementation/phase-3-swarm-coordination/contested-operations',
                component: ComponentCreator('/docs/blockchain/implementation/phase-3-swarm-coordination/contested-operations', '5fb'),
                exact: true
              },
              {
                path: '/docs/blockchain/implementation/phase-3-swarm-coordination/formation-control',
                component: ComponentCreator('/docs/blockchain/implementation/phase-3-swarm-coordination/formation-control', '838'),
                exact: true
              },
              {
                path: '/docs/blockchain/implementation/phase-4-system-integration/api-specifications',
                component: ComponentCreator('/docs/blockchain/implementation/phase-4-system-integration/api-specifications', '8a5'),
                exact: true
              },
              {
                path: '/docs/blockchain/implementation/phase-4-system-integration/correlation-engine',
                component: ComponentCreator('/docs/blockchain/implementation/phase-4-system-integration/correlation-engine', '7ad'),
                exact: true
              },
              {
                path: '/docs/blockchain/implementation/phase-4-system-integration/vendor-adapters',
                component: ComponentCreator('/docs/blockchain/implementation/phase-4-system-integration/vendor-adapters', 'f30'),
                exact: true
              },
              {
                path: '/docs/blockchain/implementation/phase-5-production/deployment-guide',
                component: ComponentCreator('/docs/blockchain/implementation/phase-5-production/deployment-guide', '335'),
                exact: true
              },
              {
                path: '/docs/blockchain/implementation/phase-5-production/monitoring-setup',
                component: ComponentCreator('/docs/blockchain/implementation/phase-5-production/monitoring-setup', 'd95'),
                exact: true
              },
              {
                path: '/docs/blockchain/implementation/phase-5-production/operations-playbook',
                component: ComponentCreator('/docs/blockchain/implementation/phase-5-production/operations-playbook', '292'),
                exact: true
              },
              {
                path: '/docs/blockchain/market-analysis/competitive-landscape',
                component: ComponentCreator('/docs/blockchain/market-analysis/competitive-landscape', '999'),
                exact: true
              },
              {
                path: '/docs/blockchain/market-analysis/investment-trends',
                component: ComponentCreator('/docs/blockchain/market-analysis/investment-trends', 'eef'),
                exact: true
              },
              {
                path: '/docs/blockchain/market-analysis/market-overview',
                component: ComponentCreator('/docs/blockchain/market-analysis/market-overview', 'e0b'),
                exact: true
              },
              {
                path: '/docs/blockchain/market-analysis/regulatory-environment',
                component: ComponentCreator('/docs/blockchain/market-analysis/regulatory-environment', 'bb0'),
                exact: true
              },
              {
                path: '/docs/blockchain/operations/',
                component: ComponentCreator('/docs/blockchain/operations/', 'e2d'),
                exact: true
              },
              {
                path: '/docs/blockchain/operations/incident-response',
                component: ComponentCreator('/docs/blockchain/operations/incident-response', '5f2'),
                exact: true
              },
              {
                path: '/docs/blockchain/operations/maintenance-guide',
                component: ComponentCreator('/docs/blockchain/operations/maintenance-guide', '2b7'),
                exact: true
              },
              {
                path: '/docs/blockchain/operations/standard-procedures',
                component: ComponentCreator('/docs/blockchain/operations/standard-procedures', '14c'),
                exact: true
              },
              {
                path: '/docs/blockchain/operations/training-materials',
                component: ComponentCreator('/docs/blockchain/operations/training-materials', 'c6f'),
                exact: true
              },
              {
                path: '/docs/blockchain/risk-management/',
                component: ComponentCreator('/docs/blockchain/risk-management/', '5de'),
                exact: true
              },
              {
                path: '/docs/blockchain/risk-management/contingency-plans',
                component: ComponentCreator('/docs/blockchain/risk-management/contingency-plans', '14c'),
                exact: true
              },
              {
                path: '/docs/blockchain/risk-management/mitigation-strategies',
                component: ComponentCreator('/docs/blockchain/risk-management/mitigation-strategies', '3b7'),
                exact: true
              },
              {
                path: '/docs/blockchain/risk-management/operational-risks',
                component: ComponentCreator('/docs/blockchain/risk-management/operational-risks', '3a2'),
                exact: true
              },
              {
                path: '/docs/blockchain/risk-management/technical-risks',
                component: ComponentCreator('/docs/blockchain/risk-management/technical-risks', 'dc4'),
                exact: true
              },
              {
                path: '/docs/blockchain/security/',
                component: ComponentCreator('/docs/blockchain/security/', '246'),
                exact: true
              },
              {
                path: '/docs/blockchain/security/byzantine-fault-tolerance',
                component: ComponentCreator('/docs/blockchain/security/byzantine-fault-tolerance', 'e9f'),
                exact: true
              },
              {
                path: '/docs/blockchain/security/quantum-resistance',
                component: ComponentCreator('/docs/blockchain/security/quantum-resistance', '3f5'),
                exact: true
              },
              {
                path: '/docs/blockchain/security/security-audits',
                component: ComponentCreator('/docs/blockchain/security/security-audits', '150'),
                exact: true
              },
              {
                path: '/docs/blockchain/security/threat-model',
                component: ComponentCreator('/docs/blockchain/security/threat-model', '820'),
                exact: true
              },
              {
                path: '/docs/blockchain/technical-architecture/',
                component: ComponentCreator('/docs/blockchain/technical-architecture/', '936'),
                exact: true
              },
              {
                path: '/docs/blockchain/technical-architecture/blockchain-architecture',
                component: ComponentCreator('/docs/blockchain/technical-architecture/blockchain-architecture', '580'),
                exact: true
              },
              {
                path: '/docs/blockchain/technical-architecture/blockchain-protocols/hyperledger-fabric',
                component: ComponentCreator('/docs/blockchain/technical-architecture/blockchain-protocols/hyperledger-fabric', 'cd8'),
                exact: true
              },
              {
                path: '/docs/blockchain/technical-architecture/blockchain-protocols/level-0-architecture',
                component: ComponentCreator('/docs/blockchain/technical-architecture/blockchain-protocols/level-0-architecture', '955'),
                exact: true
              },
              {
                path: '/docs/blockchain/technical-architecture/blockchain-protocols/polkadot-integration',
                component: ComponentCreator('/docs/blockchain/technical-architecture/blockchain-protocols/polkadot-integration', '15d'),
                exact: true
              },
              {
                path: '/docs/blockchain/technical-architecture/blockchain-protocols/protocol-comparison',
                component: ComponentCreator('/docs/blockchain/technical-architecture/blockchain-protocols/protocol-comparison', '3cd'),
                exact: true
              },
              {
                path: '/docs/blockchain/technical-architecture/blockchain-protocols/solana-poc',
                component: ComponentCreator('/docs/blockchain/technical-architecture/blockchain-protocols/solana-poc', '3e3'),
                exact: true
              },
              {
                path: '/docs/blockchain/technical-architecture/hybrid-architecture',
                component: ComponentCreator('/docs/blockchain/technical-architecture/hybrid-architecture', '95a'),
                exact: true
              },
              {
                path: '/docs/blockchain/technical-architecture/performance-metrics',
                component: ComponentCreator('/docs/blockchain/technical-architecture/performance-metrics', '9f4'),
                exact: true
              },
              {
                path: '/docs/blockchain/technical-architecture/system-requirements',
                component: ComponentCreator('/docs/blockchain/technical-architecture/system-requirements', 'aff'),
                exact: true
              },
              {
                path: '/docs/blockchain/testing/',
                component: ComponentCreator('/docs/blockchain/testing/', 'cca'),
                exact: true
              },
              {
                path: '/docs/blockchain/testing/field-trials',
                component: ComponentCreator('/docs/blockchain/testing/field-trials', '6f1'),
                exact: true
              },
              {
                path: '/docs/blockchain/testing/performance-benchmarks',
                component: ComponentCreator('/docs/blockchain/testing/performance-benchmarks', '56f'),
                exact: true
              },
              {
                path: '/docs/blockchain/testing/security-testing',
                component: ComponentCreator('/docs/blockchain/testing/security-testing', 'f73'),
                exact: true
              },
              {
                path: '/docs/blockchain/testing/test-strategy',
                component: ComponentCreator('/docs/blockchain/testing/test-strategy', 'a73'),
                exact: true
              },
              {
                path: '/docs/civilian_use_cases',
                component: ComponentCreator('/docs/civilian_use_cases', '52f'),
                exact: true
              },
              {
                path: '/docs/competitor_analysis',
                component: ComponentCreator('/docs/competitor_analysis', '8cb'),
                exact: true
              },
              {
                path: '/docs/DOCUMENTATION_FINALIZATION_PLAN',
                component: ComponentCreator('/docs/DOCUMENTATION_FINALIZATION_PLAN', '568'),
                exact: true
              },
              {
                path: '/docs/emerging_trends_opportunities',
                component: ComponentCreator('/docs/emerging_trends_opportunities', '4ef'),
                exact: true
              },
              {
                path: '/docs/executive_summary',
                component: ComponentCreator('/docs/executive_summary', '27b'),
                exact: true
              },
              {
                path: '/docs/financial_projections',
                component: ComponentCreator('/docs/financial_projections', '10b'),
                exact: true
              },
              {
                path: '/docs/glossary',
                component: ComponentCreator('/docs/glossary', '12d'),
                exact: true
              },
              {
                path: '/docs/implementation_plan',
                component: ComponentCreator('/docs/implementation_plan', 'cfe'),
                exact: true
              },
              {
                path: '/docs/legal/compliance',
                component: ComponentCreator('/docs/legal/compliance', '9d5'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/legal/countermeasure-policy',
                component: ComponentCreator('/docs/legal/countermeasure-policy', '65d'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/legal/responsible-use',
                component: ComponentCreator('/docs/legal/responsible-use', 'cbb'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/marketing_and_risk_analysis',
                component: ComponentCreator('/docs/marketing_and_risk_analysis', '27a'),
                exact: true
              },
              {
                path: '/docs/mechanical/',
                component: ComponentCreator('/docs/mechanical/', '537'),
                exact: true
              },
              {
                path: '/docs/mechanical/docs/ADR/ADR-0001-ducted-vs-open',
                component: ComponentCreator('/docs/mechanical/docs/ADR/ADR-0001-ducted-vs-open', '74a'),
                exact: true
              },
              {
                path: '/docs/mechanical/docs/ADR/ADR-0002-single-vs-coax',
                component: ComponentCreator('/docs/mechanical/docs/ADR/ADR-0002-single-vs-coax', '802'),
                exact: true
              },
              {
                path: '/docs/mechanical/docs/ADR/ADR-0003-blade-count',
                component: ComponentCreator('/docs/mechanical/docs/ADR/ADR-0003-blade-count', 'a14'),
                exact: true
              },
              {
                path: '/docs/mechanical/docs/ADR/ADR-0004-powerplant-classes',
                component: ComponentCreator('/docs/mechanical/docs/ADR/ADR-0004-powerplant-classes', '2db'),
                exact: true
              },
              {
                path: '/docs/mechanical/docs/ADR/ADR-0005-variant-strategy',
                component: ComponentCreator('/docs/mechanical/docs/ADR/ADR-0005-variant-strategy', '4c5'),
                exact: true
              },
              {
                path: '/docs/mechanical/docs/ENGINEER_BRIEF',
                component: ComponentCreator('/docs/mechanical/docs/ENGINEER_BRIEF', 'a4b'),
                exact: true
              },
              {
                path: '/docs/operations/deployment',
                component: ComponentCreator('/docs/operations/deployment', '2df'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/modes',
                component: ComponentCreator('/docs/operations/modes', 'ad2'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/operations/observability',
                component: ComponentCreator('/docs/operations/observability', '337'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/ops/operations_log_template',
                component: ComponentCreator('/docs/ops/operations_log_template', 'e6c'),
                exact: true
              },
              {
                path: '/docs/overview',
                component: ComponentCreator('/docs/overview', 'f1b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/phoenix_rooivalk_whitepaper',
                component: ComponentCreator('/docs/phoenix_rooivalk_whitepaper', 'e11'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/docs/technical_analysis',
                component: ComponentCreator('/docs/technical_analysis', 'cb5'),
                exact: true
              },
              {
                path: '/docs/technical_overview',
                component: ComponentCreator('/docs/technical_overview', 'a6b'),
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
