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
    component: ComponentCreator('/docs', '2f8'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'e0f'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '18e'),
            routes: [
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
                path: '/docs/overview',
                component: ComponentCreator('/docs/overview', 'f1b'),
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
