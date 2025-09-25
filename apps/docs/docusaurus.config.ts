import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const envName = process.env.ENV_NAME || process.env.DEPLOY_CONTEXT || process.env.CONTEXT || 'local';
const envBranch = process.env.BRANCH || process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || '';
const envBadge = envName === 'production' ? 'prod' : envBranch ? `${envName}:${envBranch}` : envName;
const envClass = envName === 'production' ? 'navbar-env-badge' : 'navbar-env-badge navbar-env-badge--preview';

const marketingUrl = process.env.MARKETING_URL || 'https://';

const config: Config = {
  title: 'PhoenixRooivalk Docs',
  favicon: 'img/favicon.ico',
  url: 'https://phoenixrooivalk.netlify.app',
  baseUrl: '/',
  organizationName: 'JustAGhosT',
  projectName: 'PhoenixRooivalk',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: { defaultLocale: 'en', locales: ['en'] },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: undefined,
        },
        blog: false,
        theme: { customCss: require.resolve('./src/css/custom.css') },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'PhoenixRooivalk',
      items: [
        // Docs entry now lives under /docs
        { type: 'doc', docId: 'overview', position: 'left', label: 'Overview' },
        // Cross-link to marketing site (set MARKETING_URL env to your marketing domain)
        ...(marketingUrl && marketingUrl !== 'https://'
          ? [{ href: marketingUrl, label: 'Website', position: 'left' } as const]
          : []),
        // Environment badge (build-time)
        {
          href: 'https://github.com/JustAGhosT/PhoenixRooivalk/blob/main/ACCESS.md',
          label: 'Request Access',
          position: 'right',
        },
        ...(envBadge ? [{
          to: '#',
          label: envBadge,
          position: 'right',
          className: envClass,
        } as const] : []),
        {
          href: 'https://github.com/JustAGhosT/PhoenixRooivalk',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
