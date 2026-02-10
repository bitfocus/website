import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import type { Options as DocsPluginOptions } from '@docusaurus/plugin-content-docs'
import autoTocPlugin from './src/remark/autoTocPlugin.mjs'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

import versions from './versions.json' assert { type: 'json' }

const config: Config = {
	title: 'Bitfocus Companion',
	tagline: 'User Guide and Documentation',
	favicon: 'img/favicon.ico',

	// Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
	future: {
		v4: true, // Improve compatibility with the upcoming Docusaurus v4
	},

	// Set the production url of your site here
	url: 'https://companion.free/',
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: '/',

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: 'bitfocus', // Usually your GitHub org/user name.
	projectName: 'companion', // Usually your repo name.

	onBrokenLinks: 'throw',
	onBrokenAnchors: 'throw',

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	presets: [
		[
			'classic',
			{
				docs: {
					id: 'default',
					path: 'user-guide', // Must match the companion repository for links to work
					routeBasePath: '/user-guide',
					sidebarPath: './sidebars/user-guide.ts',
					// Versioning configuration - DISABLED for now
					// disableVersioning: true,
					// lastVersion: "current",
					versions: {
						current: { label: 'Beta', path: 'beta' },
						...Object.fromEntries(versions.map((v) => [v, { label: v, path: v }])),
						//   beta: {
						//     label: "Beta",
						//     path: "beta",
						//   },
					},
					exclude: ['9_whatsnew/**', 'whats-new/**'],

					editUrl: (url) => {
						if (url.version === 'v4.1') return null // Not editable, as it was manually imported

						const branch = url.version === 'current' ? 'main' : `stable-${url.version.slice(1)}`

						return `https://github.com/bitfocus/companion/tree/${branch}/docs/user-guide/${url.docPath}`
					},
				},
				blog: false, // Disable blog
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Preset.Options,
		],
	],
	plugins: [
		[
			'@docusaurus/plugin-content-docs',
			{
				id: 'whats-new',
				path: 'whats-new',
				routeBasePath: 'whats-new',
				sidebarPath: './sidebars/whats-new.ts',
				// Custom sidebar generator: filter out docs that set `hide_from_sidebar` in front matter.
				sidebarItemsGenerator: async (props) => {
					const filteredDocs = props.docs.filter((d) => !d.frontMatter?.hide_from_sidebar)
					return props.defaultSidebarItemsGenerator({
						...props,
						docs: filteredDocs,
					})
				},

				// disableVersioning: true,
				editUrl: (url) => {
					if (url.docPath === 'index.md') return null
					return `https://github.com/bitfocus/companion/tree/main/docs/user-guide/9_whatsnew/${url.docPath}`
				},
			} satisfies DocsPluginOptions,
		],
		[
			'@docusaurus/plugin-content-docs',
			{
				id: 'for-developers',
				path: 'for-developers',
				routeBasePath: 'for-developers',
				sidebarPath: './sidebars/for-developers.ts',
				beforeDefaultRemarkPlugins: [autoTocPlugin],
				// disableVersioning: true,
				editUrl: 'https://github.com/bitfocus/website/tree/main/',
			} satisfies DocsPluginOptions,
		],
		[
			'@docusaurus/plugin-content-docs',
			{
				id: 'satellite',
				path: 'satellite',
				routeBasePath: 'satellite',
				sidebarPath: './sidebars/satellite.ts',
				// disableVersioning: true,
				editUrl: 'https://github.com/bitfocus/website/tree/main/',
			} satisfies DocsPluginOptions,
		],
		(context, options) => {
			// plugin-umami
			const isProd = process.env.NODE_ENV === 'production' && process.env.CI

			return {
				name: 'plugin-umami',
				async contentLoaded({ actions }) {
					actions.setGlobalData(options)
				},
				injectHtmlTags() {
					if (!isProd) {
						return {}
					}

					return {
						headTags: [
							{
								tagName: 'link',
								attributes: {
									rel: 'preconnect',
									href: `https://analytics.companion.free`,
								},
							},
							{
								tagName: 'script',
								attributes: {
									async: true,
									defer: true,
									src: 'https://analytics.companion.free/script.js',
									'data-website-id': 'ab6f6d6e-2f8e-430c-893f-16c394264fdb', // TODO - should this be a github secret, so that it can be used to enable/disable this blob?
									'data-domains': 'companion.free', // Limit to only run on the public deployed site
									'data-do-not-track': 'true', // Respect Do Not Track settings
								},
							},
						],
					}
				},
			}
		},
	],

	themeConfig: {
		// Replace with your project's social card
		// image: "img/docusaurus-social-card.jpg",
		colorMode: {
			respectPrefersColorScheme: true,
		},
		algolia: {
			appId: 'KLX8B9ZFOL',
			apiKey: 'c45c0dfd856d8f36fb5701648ea6060a',
			indexName: 'Companion Documentation',
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
			title: 'Bitfocus Companion',
			logo: {
				alt: 'Bitfocus Companion Logo',
				src: 'img/companion-logo.png',
			},
			items: [
				{
					type: 'docSidebar',
					sidebarId: 'defaultSidebar',
					position: 'left',
					label: 'User Guide',
				},
				{
					type: 'docSidebar',
					sidebarId: 'defaultSidebar',
					docsPluginId: 'whats-new',
					position: 'left',
					label: "What's New",
				},
				{
					type: 'docSidebar',
					sidebarId: 'satelliteSidebar',
					docsPluginId: 'satellite',
					position: 'left',
					label: 'Satellite',
				},
				{
					type: 'docSidebar',
					sidebarId: 'developersSidebar',
					docsPluginId: 'for-developers',
					position: 'left',
					label: 'For Developers',
				},
				{
					type: 'docsVersionDropdown',
					position: 'right',
					dropdownActiveClassDisabled: true,
					showOnlyForPath: '/user-guide/', // Custom to control visibility
				},
				{
					href: 'https://bfoc.us/djzdpq4g9g',
					html: `<svg class="fontawesome" viewBox="0 0 640 640" fill="currentColor" aria-label="Download Companion" xmlns="http://www.w3.org/2000/svg">
							<!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
							<path d="M176 544C96.5 544 32 479.5 32 400C32 336.6 73 282.8 129.9 263.5C128.6 255.8 128 248 128 240C128 160.5 192.5 96 272 96C327.4 96 375.5 127.3 399.6 173.1C413.8 164.8 430.4 160 448 160C501 160 544 203 544 256C544 271.7 540.2 286.6 533.5 299.7C577.5 320 608 364.4 608 416C608 486.7 550.7 544 480 544L176 544zM409 377C418.4 367.6 418.4 352.4 409 343.1C399.6 333.8 384.4 333.7 375.1 343.1L344.1 374.1L344.1 272C344.1 258.7 333.4 248 320.1 248C306.8 248 296.1 258.7 296.1 272L296.1 374.1L265.1 343.1C255.7 333.7 240.5 333.7 231.2 343.1C221.9 352.5 221.8 367.7 231.2 377L303.2 449C312.6 458.4 327.8 458.4 337.1 449L409.1 377z"/>
							</svg>`,
					title: 'Download Companion',
					position: 'right',
				},
				{
					href: 'https://bfoc.us/4orxauukeg',
					title: 'Companion GitHub',
					html: `<svg class="fontawesome" viewBox="0 0 640 640" fill="currentColor" aria-label="Companion GitHub" xmlns="http://www.w3.org/2000/svg">
							<!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
							<path d="M237.9 461.4C237.9 463.4 235.6 465 232.7 465C229.4 465.3 227.1 463.7 227.1 461.4C227.1 459.4 229.4 457.8 232.3 457.8C235.3 457.5 237.9 459.1 237.9 461.4zM206.8 456.9C206.1 458.9 208.1 461.2 211.1 461.8C213.7 462.8 216.7 461.8 217.3 459.8C217.9 457.8 216 455.5 213 454.6C210.4 453.9 207.5 454.9 206.8 456.9zM251 455.2C248.1 455.9 246.1 457.8 246.4 460.1C246.7 462.1 249.3 463.4 252.3 462.7C255.2 462 257.2 460.1 256.9 458.1C256.6 456.2 253.9 454.9 251 455.2zM316.8 72C178.1 72 72 177.3 72 316C72 426.9 141.8 521.8 241.5 555.2C254.3 557.5 258.8 549.6 258.8 543.1C258.8 536.9 258.5 502.7 258.5 481.7C258.5 481.7 188.5 496.7 173.8 451.9C173.8 451.9 162.4 422.8 146 415.3C146 415.3 123.1 399.6 147.6 399.9C147.6 399.9 172.5 401.9 186.2 425.7C208.1 464.3 244.8 453.2 259.1 446.6C261.4 430.6 267.9 419.5 275.1 412.9C219.2 406.7 162.8 398.6 162.8 302.4C162.8 274.9 170.4 261.1 186.4 243.5C183.8 237 175.3 210.2 189 175.6C209.9 169.1 258 202.6 258 202.6C278 197 299.5 194.1 320.8 194.1C342.1 194.1 363.6 197 383.6 202.6C383.6 202.6 431.7 169 452.6 175.6C466.3 210.3 457.8 237 455.2 243.5C471.2 261.2 481 275 481 302.4C481 398.9 422.1 406.6 366.2 412.9C375.4 420.8 383.2 435.8 383.2 459.3C383.2 493 382.9 534.7 382.9 542.9C382.9 549.4 387.5 557.3 400.2 555C500.2 521.8 568 426.9 568 316C568 177.3 455.5 72 316.8 72zM169.2 416.9C167.9 417.9 168.2 420.2 169.9 422.1C171.5 423.7 173.8 424.4 175.1 423.1C176.4 422.1 176.1 419.8 174.4 417.9C172.8 416.3 170.5 415.6 169.2 416.9zM158.4 408.8C157.7 410.1 158.7 411.7 160.7 412.7C162.3 413.7 164.3 413.4 165 412C165.7 410.7 164.7 409.1 162.7 408.1C160.7 407.5 159.1 407.8 158.4 408.8zM190.8 444.4C189.2 445.7 189.8 448.7 192.1 450.6C194.4 452.9 197.3 453.2 198.6 451.6C199.9 450.3 199.3 447.3 197.3 445.4C195.1 443.1 192.1 442.8 190.8 444.4zM179.4 429.7C177.8 430.7 177.8 433.3 179.4 435.6C181 437.9 183.7 438.9 185 437.9C186.6 436.6 186.6 434 185 431.7C183.6 429.4 181 428.4 179.4 429.7z"/>
							</svg>`,
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Documentation',
					items: [
						{
							label: 'User Guide',
							to: `/user-guide/${versions[0]}`,
						},
						{
							label: "What's New",
							to: '/whats-new/',
						},
						{
							label: 'Satellite',
							to: '/satellite/',
						},
						{
							label: 'For Developers',
							to: '/for-developers/',
						},
					],
				},
				{
					title: 'Community',
					items: [
						{
							label: 'Slack',
							href: 'https://bfoc.us/bea2b02q12',
						},
						{
							label: 'Facebook Group',
							href: 'https://bfoc.us/nr4da457op',
						},
						{
							label: 'Donate',
							href: 'https://bfoc.us/42jn7eku7p',
						},
					],
				},
				{
					title: 'More',
					items: [
						{
							label: 'Bitfocus Website',
							href: 'https://bitfocus.io',
						},
						{
							label: 'GitHub',
							href: 'https://github.com/bitfocus/companion',
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
}

export default config
