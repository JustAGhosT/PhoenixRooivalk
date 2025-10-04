/* eslint-env node */
import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { resolve } from "path";
import { themes as prismThemes } from "prism-react-renderer";

// Node.js environment declarations
declare const process: {
  env: Record<string, string | undefined>;
};
declare const __dirname: string;

const envName =
  process.env.ENV_NAME ||
  process.env.DEPLOY_CONTEXT ||
  process.env.CONTEXT ||
  "local";
const envBranch =
  process.env.BRANCH ||
  process.env.GITHUB_HEAD_REF ||
  process.env.GITHUB_REF_NAME ||
  "";
const envBadge =
  envName === "production"
    ? "prod"
    : envBranch
      ? `${envName}:${envBranch}`
      : envName;
const envClass =
  envName === "production"
    ? "navbar-env-badge"
    : "navbar-env-badge navbar-env-badge--preview";

const marketingUrl =
  process.env.MARKETING_URL || "https://phoenixrooivalk.netlify.app";

const config: Config = {
  title: "PhoenixRooivalk Docs",
  favicon: "img/favicon.ico",
  url: "https://docs-phoenixrooivalk.netlify.app",
  baseUrl: "/",
  organizationName: "JustAGhosT",
  projectName: "PhoenixRooivalk",
  onBrokenLinks: "warn",
  markdown: {
    format: "md",
  },
  i18n: { defaultLocale: "en", locales: ["en"] },
  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "docs",
          sidebarPath: resolve(__dirname, "./sidebars.ts"),
          editUrl: undefined,
          remarkPlugins: [],
          rehypePlugins: [],
        },
        blog: false,
        theme: { customCss: resolve(__dirname, "./src/css/custom.css") },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    // Enhanced navbar with Phoenix Rooivalk branding
    navbar: {
      title: "Phoenix Rooivalk",
      logo: {
        alt: "Phoenix Rooivalk Logo",
        src: "img/logo.svg",
        srcDark: "img/logo.svg",
        width: 40,
        height: 40,
      },
      items: [
        {
          type: "doc",
          docId: "phoenix-rooivalk-documentation",
          position: "left",
          label: "Documentation",
        },
        {
          type: "dropdown",
          label: "Executive",
          position: "left",
          items: [
            {
              label: "Executive Summary",
              to: "/docs/executive/executive-summary",
            },
            {
              label: "Global Strategy",
              to: "/docs/executive/Global_Strategy",
            },
          ],
        },
        {
          type: "dropdown",
          label: "Technical",
          position: "left",
          items: [
            {
              label: "Technical Architecture",
              to: "/docs/technical/Technical_Architecture",
            },
            {
              label: "System Architecture",
              to: "/docs/technical/System_Architecture",
            },
          ],
        },
        {
          type: "dropdown",
          label: "Business",
          position: "left",
          items: [
            {
              label: "Market Analysis",
              to: "/docs/business/Market_Analysis",
            },
            {
              label: "Business Model",
              to: "/docs/business/business-model",
            },
          ],
        },
        {
          type: "dropdown",
          label: "Operations",
          position: "left",
          items: [
            {
              label: "Manufacturing Strategy",
              to: "/docs/operations/Manufacturing_Strategy",
            },
          ],
        },
        // Cross-link to marketing site
        ...(marketingUrl && marketingUrl !== "https://"
          ? [
              {
                href: marketingUrl,
                label: "Website",
                position: "right",
              } as const,
            ]
          : []),
        // GitHub repository links
        {
          type: "dropdown",
          label: "GitHub",
          position: "right",
          items: [
            {
              href: "https://github.com/JustAGhosT/PhoenixRooivalk",
              label: "PhoenixRooivalk",
            },
            {
              href: "https://github.com/justaghost/cognitive-mesh",
              label: "Cognitive Mesh",
            },
          ],
        },
        // Environment badge (build-time)
        {
          href: "https://github.com/JustAGhosT/PhoenixRooivalk/blob/main/ACCESS.md",
          label: "Request Access",
          position: "right",
        },
        ...(envBadge
          ? [
              {
                to: "#",
                label: envBadge,
                position: "right",
                className: envClass,
              } as const,
            ]
          : []),
      ],
    },
    // Enhanced footer
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [
            {
              label: "Executive Summary",
              to: "/docs/executive/executive-summary",
            },
            {
              label: "Technical Architecture",
              to: "/docs/technical/Technical_Architecture",
            },
            {
              label: "Market Analysis",
              to: "/docs/business/Market_Analysis",
            },
          ],
        },
        {
          title: "Resources",
          items: [
            {
              label: "GitHub Repository",
              href: "https://github.com/JustAGhosT/PhoenixRooivalk",
            },
            {
              label: "Request Access",
              href: "https://github.com/JustAGhosT/PhoenixRooivalk/blob/main/ACCESS.md",
            },
            {
              label: "Getting Started",
              to: "/docs",
            },
          ],
        },
        {
          title: "Operations",
          items: [
            {
              label: "Manufacturing Strategy",
              to: "/docs/operations/Manufacturing_Strategy",
            },
            {
              label: "System Architecture",
              to: "/docs/technical/System_Architecture",
            },
            {
              label: "Business Model",
              to: "/docs/business/business-model",
            },
          ],
        },
      ],
      copyright: `© 2025 Phoenix Rooivalk. All rights reserved. Built with ❤️ for global defense security.`,
    },
    // Enhanced color mode
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    // Enhanced prism theme
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["rust", "bash", "json", "yaml"],
    },
    // Enhanced announcement bar
    announcementBar: {
      id: "phoenix-rooivalk-announcement",
      content:
        "🚀 Phoenix Rooivalk: Revolutionary SAE Level 4 Autonomous Counter-UAS Defense Platform",
      backgroundColor: "rgb(249, 115, 22)",
      textColor: "rgb(15, 23, 42)",
      isCloseable: true,
    },
    // Enhanced table of contents
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
    // Enhanced docs
    docs: {
      sidebar: {
        hideable: true, // cspell:ignore hideable
        autoCollapseCategories: true,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
