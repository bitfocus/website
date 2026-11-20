import fs from 'node:fs/promises'
import path from 'node:path'
import type { LoadedContent as DocsLoadedContent } from '@docusaurus/plugin-content-docs'
import { toSidebarsProp } from '@docusaurus/plugin-content-docs/lib/props.js'
import type { LoadContext, Plugin } from '@docusaurus/types'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { compareVersions, extractReleaseNotes, splitFrontMatter, type ReleaseHighlight } from '../lib/release-notes'

// Builds the /whats-new/ landing page: a blog-style list of every release, newest first.
//
// Each release page in whats-new/ is expected to look like:
//
//   ---
//   title: Companion v5.1.0
//   date: 2026-10-11
//   ...
//   ---
//
//   One or two paragraphs summarising the release. This is shown on the landing page.
//
//   ## A headline feature
//
// The landing page shows the title, date, the summary (everything before the first `##`), and the `##` headings
// as a list of highlights, linking to the full page.

export interface WhatsNewRelease {
	title: string
	version: string
	date: string | null
	permalink: string
	summaryHtml: string
	highlights: ReleaseHighlight[]
}

interface Options {
	/** Directory holding the release pages, relative to the site */
	path: string
	/** Route the docs plugin serves these pages under */
	routeBasePath: string
	/** Id of the docs plugin instance serving the release pages, whose sidebar the landing page shows */
	docsPluginId: string
	/** Sidebar of that docs plugin to show */
	sidebarId: string
}

export default function whatsNewIndexPlugin(context: LoadContext, rawOptions: unknown): Plugin {
	const options = rawOptions as Options
	const dir = path.join(context.siteDir, options.path)
	const routeBase = `${context.baseUrl}${options.routeBasePath}/`.replace(/\/+/g, '/')

	return {
		name: 'whats-new-index',

		getPathsToWatch() {
			return [path.join(dir, '*.md')]
		},

		async loadContent(): Promise<WhatsNewRelease[]> {
			const files = (await fs.readdir(dir)).filter((f) => /^v[\d-]+\.mdx?$/.test(f))

			const releases = await Promise.all(
				files.map(async (file) => parseRelease(file, await fs.readFile(path.join(dir, file), 'utf8'), routeBase))
			)

			return releases.sort((a, b) => compareVersions(b.version, a.version))
		},

		// The route is added once every plugin has loaded, as it shows the sidebar of the docs plugin
		async allContentLoaded({ allContent, actions }) {
			const releases = allContent['whats-new-index']?.default as WhatsNewRelease[]

			const docsContent = allContent['docusaurus-plugin-content-docs']?.[options.docsPluginId] as
				DocsLoadedContent | undefined
			const docsVersion = docsContent?.loadedVersions[0]
			if (!docsVersion) throw new Error(`whats-new-index: docs plugin "${options.docsPluginId}" not found`)

			const sidebar = toSidebarsProp(docsVersion)[options.sidebarId]
			if (!sidebar) throw new Error(`whats-new-index: sidebar "${options.sidebarId}" not found`)

			actions.addRoute({
				path: routeBase,
				exact: true,
				component: '@site/src/components/WhatsNewIndex',
				modules: {
					releases: await actions.createData('releases.json', JSON.stringify(releases)),
					sidebar: await actions.createData('sidebar.json', JSON.stringify(sidebar)),
				},
				props: { sidebarName: options.sidebarId },
			})
		},
	}
}

function parseRelease(file: string, source: string, routeBase: string): WhatsNewRelease {
	const { frontMatter, body } = splitFrontMatter(source)

	const baseName = file.replace(/\.mdx?$/, '')
	const title = frontMatter.title ?? baseName
	const version = title.match(/v?(\d+\.\d+\.\d+)/)?.[1] ?? baseName.replace(/^v/, '').replace(/-/g, '.')
	const slug = frontMatter.slug?.replace(/^\//, '') ?? baseName

	const permalink = `${routeBase}${slug}`
	const { summary, highlights } = extractReleaseNotes(body, permalink)

	const processor = unified().use(remarkRehype).use(rehypeStringify)
	const summaryHtml = String(processor.stringify(processor.runSync({ type: 'root', children: summary })))

	return {
		title,
		version,
		date: frontMatter.date ?? null,
		permalink,
		summaryHtml,
		highlights,
	}
}
