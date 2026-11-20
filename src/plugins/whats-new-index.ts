import fs from 'node:fs/promises'
import path from 'node:path'
import type { LoadedContent as DocsLoadedContent } from '@docusaurus/plugin-content-docs'
import { toSidebarsProp } from '@docusaurus/plugin-content-docs/lib/props.js'
import type { LoadContext, Plugin } from '@docusaurus/types'
import GithubSlugger from 'github-slugger'
import type { Heading, Root, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

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
	highlights: { title: string; anchor: string }[]
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

// Headings which aren't worth listing as a highlight
const IGNORED_HIGHLIGHTS = /^and more$/i

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

	const tree = unified().use(remarkParse).use(remarkGfm).parse(body) as Root

	// Use the same slugger as docusaurus, so the anchors match the ids on the page
	const slugger = new GithubSlugger()
	const highlights: WhatsNewRelease['highlights'] = []
	let summary: RootContent[] | null = null

	tree.children.forEach((node, i) => {
		if (node.type !== 'heading') return

		const { text, id } = headingText(node)
		const anchor = id ?? slugger.slug(text)

		if (node.depth === 2) {
			summary ??= tree.children.slice(0, i)
			if (!IGNORED_HIGHLIGHTS.test(text)) highlights.push({ title: text, anchor })
		}
	})

	return {
		title,
		version,
		date: frontMatter.date ?? null,
		permalink: `${routeBase}${slug}`,
		summaryHtml: renderSummary(summary ?? tree.children),
		highlights,
	}
}

/** Text of a heading, and any explicit `{#custom-id}` it declares */
function headingText(node: Heading): { text: string; id: string | null } {
	const text = toString(node).trim()
	const match = text.match(/^(.*?)\s*\{#([^}]+)\}$/)
	return match ? { text: match[1], id: match[2] } : { text, id: null }
}

function renderSummary(nodes: RootContent[]): string {
	// Only keep the prose: a title, images, videos or admonitions don't belong in a summary
	const prose = nodes.filter((node) => node.type === 'paragraph' || node.type === 'list' || node.type === 'blockquote')

	const tree: Root = { type: 'root', children: prose }
	removeImages(tree)

	const processor = unified().use(remarkRehype).use(rehypeStringify)
	return String(processor.stringify(processor.runSync(tree)))
}

function removeImages(node: { children?: RootContent[] }): void {
	if (!node.children) return
	node.children = node.children.filter((child) => child.type !== 'image' && child.type !== 'imageReference')
	for (const child of node.children) removeImages(child as { children?: RootContent[] })
	// Drop any paragraphs which only held an image
	node.children = node.children.filter(
		(child) => !(child.type === 'paragraph' && child.children.every((c) => c.type === 'text' && !c.value.trim()))
	)
}

/** Read the simple `key: value` front matter these pages use */
function splitFrontMatter(source: string): { frontMatter: Record<string, string>; body: string } {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
	if (!match) return { frontMatter: {}, body: source }

	const frontMatter: Record<string, string> = {}
	for (const line of match[1].split(/\r?\n/)) {
		const kv = line.match(/^([\w-]+):\s*(.*)$/)
		if (kv) frontMatter[kv[1]] = kv[2].replace(/^(['"])(.*)\1$/, '$2')
	}

	return { frontMatter, body: source.slice(match[0].length) }
}

function compareVersions(a: string, b: string): number {
	const pa = a.split('.').map(Number)
	const pb = b.split('.').map(Number)
	for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
		const diff = (pa[i] ?? 0) - (pb[i] ?? 0)
		if (diff) return diff
	}
	return 0
}
