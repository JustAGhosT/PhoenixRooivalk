import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Overview',
      collapsed: false,
      items: ['overview'],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [],
    },
    {
      type: 'category',
      label: 'Operations',
      items: [],
    },
    {
      type: 'category',
      label: 'Legal & Governance',
      items: [
        {
          type: 'link',
          label: 'Request Access',
          href: 'https://github.com/JustAGhosT/PhoenixRooivalk/blob/main/ACCESS.md',
        },
      ],
    }
  ],
};

export default sidebars;
