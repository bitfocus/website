import GithubSlugger from 'github-slugger'
import type { Heading, Root, RootContent } from 'mdast'
import { toString } from 'mdast-util-to-string'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

// Shared parsing for release notes pages (What's New, and the API changelogs), which are listed on an index page as a
// summary and the headline changes.
//
// The convention for these pages is:
//
//   ---
//   title: Companion v5.1.0
//   date: 2026-10-11
//   ---
//
//   One or two paragraphs summarising the release. This is the summary shown on the index page.
//
//   ## A headline change
//
// The summary is the prose before the first `##`, and each `##` heading is a highlight.

export interface ReleaseHighlight {
	title: string
	anchor: string
}

export interface ReleaseNotes {
	/** Prose before the first `##`, without any images */
	summary: RootContent[]
	highlights: ReleaseHighlight[]
}

// Headings which aren't worth listing as a highlight
const IGNORED_HIGHLIGHTS = /^and more$/i

/**
 * @param body The markdown of the page, without front matter
 * @param pageUrl Url of the page, which links to its own sections (`#some-heading`) are rewritten to point at, as the
 *   summary is shown on another page
 */
export function extractReleaseNotes(body: string, pageUrl: string): ReleaseNotes {
	const tree = unified().use(remarkParse).use(remarkGfm).parse(body) as Root

	// Use the same slugger as docusaurus, so the anchors match the ids on the page
	const slugger = new GithubSlugger()
	const highlights: ReleaseHighlight[] = []
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

	// Only keep the prose: a title, images, videos or admonitions don't belong in a summary
	const prose: Root = {
		type: 'root',
		children: (summary ?? tree.children).filter(
			(node) => node.type === 'paragraph' || node.type === 'list' || node.type === 'blockquote'
		),
	}
	removeImages(prose)
	rebaseAnchorLinks(prose, pageUrl)

	return { summary: prose.children, highlights }
}

/** Text of a heading, and any explicit `{#custom-id}` it declares */
function headingText(node: Heading): { text: string; id: string | null } {
	const text = toString(node).trim()
	const match = text.match(/^(.*?)\s*\{#([^}]+)\}$/)
	return match ? { text: match[1], id: match[2] } : { text, id: null }
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

function rebaseAnchorLinks(node: { type: string; url?: string; children?: RootContent[] }, pageUrl: string): void {
	if (node.type === 'link' && node.url?.startsWith('#')) node.url = pageUrl + node.url
	for (const child of node.children ?? []) rebaseAnchorLinks(child, pageUrl)
}

/** Read the simple `key: value` front matter these pages use */
export function splitFrontMatter(source: string): { frontMatter: Record<string, string>; body: string } {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
	if (!match) return { frontMatter: {}, body: source }

	const frontMatter: Record<string, string> = {}
	for (const line of match[1].split(/\r?\n/)) {
		const kv = line.match(/^([\w-]+):\s*(.*)$/)
		if (kv) frontMatter[kv[1]] = kv[2].replace(/^(['"])(.*)\1$/, '$2')
	}

	return { frontMatter, body: source.slice(match[0].length) }
}

/** Compare dotted version numbers, such as `1.10` and `1.5` */
export function compareVersions(a: string, b: string): number {
	const pa = a.split('.').map(Number)
	const pb = b.split('.').map(Number)
	for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
		const diff = (pa[i] ?? 0) - (pb[i] ?? 0)
		if (diff) return diff
	}
	return 0
}

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** Format a `YYYY-MM-DD` date for display, such as `11 October 2026` */
export function formatReleaseDate(date: string): string {
	const parsed = new Date(date)
	return isNaN(parsed.getTime()) ? date : dateFormat.format(parsed)
}
