import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Bitfocus Companion",
  tagline: "User Guide and Documentation",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://bitfocus.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/website/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "bitfocus", // Usually your GitHub org/user name.
  projectName: "companion", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenAnchors: "warn", // TODO - this should be throw, but docs are a little broken currently

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          id: "default",
          path: "docs", // Must be docs to match the companion repository for links to work :(
          routeBasePath: "/user-guide",
          sidebarPath: "./sidebars/user-guide.ts",
          editUrl: "https://github.com/bitfocus/companion/tree/main/docs/",
          // Versioning configuration - DISABLED for now
          disableVersioning: true,
          // lastVersion: "beta",
          // versions: {
          //   beta: {
          //     label: "Beta",
          //     path: "beta",
          //   },
          // },
        },
        blog: false, // Disable blog
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "for-developers",
        path: "for-developers",
        routeBasePath: "for-developers",
        sidebarPath: "./sidebars/for-developers.ts",
        // disableVersioning: true,
        editUrl: "https://github.com/bitfocus/website/tree/main/",
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Bitfocus Companion",
      logo: {
        alt: "Bitfocus Companion Logo",
        src: "img/companion-logo.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "defaultSidebar",
          position: "left",
          label: "User Guide",
        },
        {
          type: "docSidebar",
          sidebarId: "developersSidebar",
          docsPluginId: "for-developers",
          position: "left",
          label: "For Developers",
        },
        // Version dropdown - disabled until versioning is needed
        // {
        //   type: "docsVersionDropdown",
        //   position: "right",
        //   dropdownActiveClassDisabled: true,
        // },
        {
          href: "https://bfoc.us/djzdpq4g9g",
          label: "Download",
          position: "right",
        },
        {
          href: "https://bfoc.us/4orxauukeg",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Documentation",
          items: [
            {
              label: "User Guide",
              to: "/user-guide/",
            },
            {
              label: "For Developers",
              to: "/for-developers/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Slack",
              href: "https://bfoc.us/bea2b02q12",
            },
            {
              label: "Facebook Group",
              href: "https://bfoc.us/nr4da457op",
            },
            {
              label: "Donate",
              href: "https://bfoc.us/42jn7eku7p",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Bitfocus Website",
              href: "https://bitfocus.io",
            },
            {
              label: "GitHub",
              href: "https://github.com/bitfocus/companion",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Companion. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
