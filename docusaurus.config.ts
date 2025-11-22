import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import type { Options as DocsPluginOptions } from "@docusaurus/plugin-content-docs";

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
  url: "https://companion.free/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

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
          path: "user-guide", // Must match the companion repository for links to work
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
          exclude: ["9_whatsnew/**", "whats-new/**"],
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
        id: "whats-new",
        path: "whats-new",
        routeBasePath: "whats-new",
        sidebarPath: "./sidebars/whats-new.ts",
        // Custom sidebar generator: filter out docs that set `hide_from_sidebar` in front matter.
        sidebarItemsGenerator: async (props) => {
          const filteredDocs = props.docs.filter(
            (d) => !d.frontMatter?.hide_from_sidebar
          );
          return props.defaultSidebarItemsGenerator({
            ...props,
            docs: filteredDocs,
          });
        },

        // disableVersioning: true,
        editUrl: (url) => {
          if (url.docPath === "index.md") return null;
          return `https://github.com/bitfocus/companion/tree/main/docs/user-guide/9_whatsnew/${url.docPath}`;
        },
      } satisfies DocsPluginOptions,
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "for-developers",
        path: "for-developers",
        routeBasePath: "for-developers",
        sidebarPath: "./sidebars/for-developers.ts",
        // disableVersioning: true,
        editUrl: "https://github.com/bitfocus/website/tree/main/",
      } satisfies DocsPluginOptions,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    algolia: {
      appId: "KLX8B9ZFOL",
      apiKey: "c45c0dfd856d8f36fb5701648ea6060a",
      indexName: "Companion Documentation",
      // // Optional: see doc section below
      // contextualSearch: true,
      // // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
      // externalUrlRegex: 'external\\.com|domain\\.com',
      // // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
      // replaceSearchResultPathname: {
      //   from: '/docs/', // or as RegExp: /\/docs\//
      //   to: '/',
      // },
      // // Optional: Algolia search parameters
      // searchParameters: {},
      // // Optional: path for search page that enabled by default (`false` to disable it)
      // searchPagePath: 'search',
      // // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      // insights: false,
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
          sidebarId: "defaultSidebar",
          docsPluginId: "whats-new",
          position: "left",
          label: "What's New",
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
              label: "What's New",
              to: "/whats-new/",
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
