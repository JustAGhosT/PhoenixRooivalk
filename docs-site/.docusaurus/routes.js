import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '7bc'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '29c'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '3a4'),
            routes: [
              {
                path: '/architecture/c2',
                component: ComponentCreator('/architecture/c2', '11e'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/architecture/comms',
                component: ComponentCreator('/architecture/comms', '520'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/architecture/overview',
                component: ComponentCreator('/architecture/overview', 'f3c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/architecture/safety',
                component: ComponentCreator('/architecture/safety', '90b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/legal/compliance',
                component: ComponentCreator('/legal/compliance', '261'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/legal/countermeasure-policy',
                component: ComponentCreator('/legal/countermeasure-policy', 'f5c'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/legal/responsible-use',
                component: ComponentCreator('/legal/responsible-use', 'a7b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/operations/deployment',
                component: ComponentCreator('/operations/deployment', 'a07'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/operations/modes',
                component: ComponentCreator('/operations/modes', '38b'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/operations/observability',
                component: ComponentCreator('/operations/observability', '57a'),
                exact: true,
                sidebar: "docs"
              },
              {
                path: '/overview',
                component: ComponentCreator('/overview', 'a64'),
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
    path: '*',
    component: ComponentCreator('*'),
  },
];
