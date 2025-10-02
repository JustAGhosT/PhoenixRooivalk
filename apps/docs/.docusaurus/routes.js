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
    component: ComponentCreator('/docs', '4d3'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '790'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '6e3'),
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
                path: '/docs/business/Market_Analysis',
                component: ComponentCreator('/docs/business/Market_Analysis', '484'),
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
                path: '/docs/executive/Strategic_Recommendations',
                component: ComponentCreator('/docs/executive/Strategic_Recommendations', 'db1'),
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
                path: '/docs/operations/Manufacturing_Strategy',
                component: ComponentCreator('/docs/operations/Manufacturing_Strategy', 'e46'),
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
                path: '/docs/technical/Blockchain_Integration',
                component: ComponentCreator('/docs/technical/Blockchain_Integration', '58b'),
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
                path: '/docs/technical/Hardware_Foundation',
                component: ComponentCreator('/docs/technical/Hardware_Foundation', 'b3b'),
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
