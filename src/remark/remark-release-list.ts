import { readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import type { Root, RootContent } from 'mdast'
import type { VFile } from 'vfile'
import { compareVersions, extractReleaseNotes, formatReleaseDate, splitFrontMatter } from '../lib/release-notes'

/**
 * Remark plugin that lists the release notes pages beside a document, such as an API changelog.
 *
 * When a document has `release_list: true` in its frontmatter, this reads every sibling `v*.md` file, and appends an
 * entry for each to the document, newest version first. Each entry shows the title, the minimum Companion version
 * and release date, the summary of the release (the prose before its first `##`) and its `##` headings, linking
 * to the page. See src/lib/release-notes.ts for the conventions these pages follow.
 *
 * The pages are expected to be titled like `API 2.2 (Companion 5.1+)`, and to give their release date as `date:`.
 *
 * Entries are styled by the `release-entry` classes in src/css/release-list.css, shared with the What's New index.
 */

interface Release {
	file: string
	version: string
	name: string
	companion: string | null
	date: string | null
	notes: ReturnType<typeof extractReleaseNotes>
}

export default function remarkReleaseList() {
	return (tree: Root, vfile: VFile) => {
		const frontMatter = vfile.data?.frontMatter as Record<string, unknown> | undefined
		if (!frontMatter?.release_list) return

		const dir = dirname(vfile.path)
		const self = basename(vfile.path)

		const releases = readdirSync(dir)
			.filter((file) => /^v[\d.]+\.mdx?$/.test(file) && file !== self)
			.map((file) => readRelease(dir, file))
			.sort((a, b) => compareVersions(b.version, a.version))

		tree.children.push(...releases.map((release, i) => releaseEntry(release, i === 0)))
	}
}

function readRelease(dir: string, file: string): Release {
	const { frontMatter, body } = splitFrontMatter(readFileSync(join(dir, file), 'utf8'))

	const version = file.replace(/^v/, '').replace(/\.mdx?$/, '')
	const title = frontMatter.title ?? `API ${version}`
	// Split `API 2.2 (Companion 5.1+)` into the name and the companion version
	const titleMatch = title.match(/^(.*?)\s*\(Companion ([^)]+)\)\s*$/)

	return {
		file,
		version,
		name: titleMatch?.[1] ?? title,
		companion: titleMatch?.[2] ?? null,
		date: frontMatter.date ?? null,
		notes: extractReleaseNotes(body, file),
	}
}

/** An element in the output, as a mdast node which remark-rehype turns into the named html element */
function element(tagName: string, className: string | null, children: RootContent[]): RootContent {
	return {
		type: 'releaseListElement',
		data: { hName: tagName, hProperties: className ? { className: [className] } : {} },
		children,
	} as unknown as RootContent
}

function text(value: string): RootContent {
	return { type: 'text', value }
}

function link(url: string, children: RootContent[]): RootContent {
	return { type: 'link', url, children } as RootContent
}

function releaseEntry(release: Release, latest: boolean): RootContent {
	const { file, notes } = release

	const meta: RootContent[] = []
	if (latest) meta.push(element('span', 'badge badge--primary', [text('Latest')]))
	if (release.companion)
		meta.push(element('span', 'release-entry__companion', [text(`Companion ${release.companion}`)]))
	if (release.date) meta.push(element('time', null, [text(formatReleaseDate(release.date))]))

	return element('article', 'release-entry', [
		element('header', 'release-entry__header', [
			// A real heading, so the releases are listed in the table of contents of the page
			{ type: 'heading', depth: 2, children: [link(file, [text(release.name)])] } as RootContent,
			element('div', 'release-entry__meta', meta),
		]),
		...(notes.summary.length > 0 ? [element('div', 'release-entry__summary', notes.summary)] : []),
		...(notes.highlights.length > 0
			? [
					element(
						'ul',
						'release-entry__changes',
						notes.highlights.map((highlight) =>
							element('li', null, [link(`${file}#${highlight.anchor}`, [text(highlight.title)])])
						)
					),
				]
			: []),
		element('p', 'release-entry__more', [link(file, [text('Read the full changes →')])]),
	])
}
