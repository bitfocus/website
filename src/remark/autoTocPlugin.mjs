/**
 * Remark plugin that auto-generates a table of contents from sibling markdown files.
 *
 * When a document has `auto_toc: true` in its frontmatter, this plugin reads
 * all sibling `.md` files in the same directory, extracts their titles and
 * headings, and appends an bulleted TOC to the document.
 *
 * If subdirectories exist, they will be listed with their files as the "content"
 *
 * auto_toc: number | boolean - if number, only include headers to that H# level. If `true`, go up to H3.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { dirname, basename, join } from 'node:path'

/** Parse YAML frontmatter from a markdown string (simple key: value only). */
function parseFrontmatter(content) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
	if (!match) return { frontmatter: {}, body: content }

	const frontmatter = {}
	for (const line of match[1].split('\n')) {
		const colonIdx = line.indexOf(':')
		if (colonIdx > 0) {
			frontmatter[line.slice(0, colonIdx).trim()] = line.slice(colonIdx + 1).trim()
		}
	}
	return { frontmatter, body: content.slice(match[0].length) }
}

/**
 * Slugify a heading string the same way github-slugger / Docusaurus does.
 * Handles inline code (backticks) and strips non-word characters.
 */
function slugify(text) {
	return text
		.toLowerCase()
		.replace(/`([^`]+)`/g, '$1') // unwrap inline code
		.replace(/<[!/a-zA-Z].*?>/g, '') // strip HTML tags
		.replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '') // keep letters, numbers, connector punctuation, spaces, hyphens
		.replace(/ /g, '-')
}

/** Extract markdown headings from the body, skipping fenced code blocks. */
function extractHeadings(body) {
	const headings = []
	let inCodeBlock = false

	for (const line of body.split('\n')) {
		if (line.trim().startsWith('```')) {
			inCodeBlock = !inCodeBlock
			continue
		}
		if (inCodeBlock) continue

		const match = line.match(/^(#{2,6})\s+(.+)$/)
		if (!match) continue

		let text = match[2].trim()
		let id = null

		// Check for an explicit heading id: {#some-id}
		const idMatch = text.match(/\s*\{#([^}]+)\}\s*$/)
		if (idMatch) {
			id = idMatch[1]
			text = text.slice(0, idMatch.index).trim()
		} else {
			id = slugify(text)
		}

		headings.push({ level: match[1].length, text, id })
	}
	return headings
}

/** Turn a plain-text heading into mdast inline nodes, handling `code` spans. */
function parseInlineContent(text) {
	const nodes = []
	const parts = text.split(/(`[^`]+`)/)
	for (const part of parts) {
		if (part.startsWith('`') && part.endsWith('`')) {
			nodes.push({ type: 'inlineCode', value: part.slice(1, -1) })
		} else if (part) {
			nodes.push({ type: 'text', value: part })
		}
	}
	return nodes
}

export default function autoTocPlugin() {
	return (tree, vfile) => {
		const auto_toc = vfile.data?.frontMatter?.auto_toc
		if (!auto_toc) return

		const depth = typeof auto_toc === 'number' ? auto_toc : 3
		const dir = dirname(vfile.path)
		const vfilename = basename(vfile.path)
		const files = readdirSync(dir).filter((f) => f.endsWith('.md') && !f.startsWith(vfilename))
		const subdirs = readdirSync(dir).filter((f) => existsSync(join(dir, f, '_category_.json')))

		const getPages = (fileList, dir) =>
			fileList.map((f) => {
				const content = readFileSync(join(dir, f), 'utf-8')
				const { frontmatter, body } = parseFrontmatter(content)
				return {
					slug: f.replace(/\.md$/, ''),
					title: frontmatter.sidebar_label?.replace('└─', '') || frontmatter.title || f.replace(/\.md$/, ''),
					sidebarPosition: parseInt(frontmatter.sidebar_position || '0', 10),
					headings: extractHeadings(body),
					files: [],
				}
			})

		let pages = getPages(files, dir)

		// TODO: handle directories inside the subdir
		const dirs = subdirs.map((d) => {
			const subdir = join(dir, d)
			const raw = readFileSync(join(subdir, '_category_.json'))
			const frontmatter = JSON.parse(raw)
			const indexfile = frontmatter.link?.id
			const subfiles = readdirSync(subdir).filter((f) => f.endsWith('.md') && !f.startsWith(indexfile))
			const subpages = getPages(subfiles, subdir)
			subpages.sort((a, b) => a.sidebarPosition - b.sidebarPosition)
			return {
				slug: d,
				title: '> ' + (frontmatter.label || d),
				sidebarPosition: frontmatter.position || 0,
				headings: [],
				files: subpages,
			}
		})

		pages = pages.concat(dirs)

		// Ascending sidebar_position → most-negative first → newest version on top
		pages.sort((a, b) => a.sidebarPosition - b.sidebarPosition)

		const nodes = []
		for (const page of pages) {
			// ### [Page Title](./slug)
			nodes.push({
				type: 'heading',
				depth: 3, // make page name h3
				data: {
					hProperties: {
						className: 'auto-toc-heading',
					},
				},
				children: [
					{
						type: 'link',
						url: `./${page.slug}`,
						children: [{ type: 'text', value: page.title }],
					},
				],
			})

			// Bullet list of each heading as a link
			if (page.headings.length > 0) {
				nodes.push({
					type: 'list',
					ordered: false,
					spread: false,
					children: page.headings
						.filter((h) => h.level <= depth)
						.map((h) => ({
							type: 'listItem',
							spread: false,
							children: [
								{
									type: 'paragraph',
									children: [
										{
											type: 'link',
											url: `./${page.slug}#${h.id}`,
											children: parseInlineContent(h.text),
										},
									],
								},
							],
						})),
				})
			}

			// Bullet list of each subdirectory file as a link
			if (page.files.length > 0) {
				for (const subfile of page.files) {
					nodes.push({
						type: 'text',
						// note: the "spaces" before are U+2800: unicode Braille Pattern Blank
						value: subfile === page.files.at(-1) ? '⠀⠀└── ' : '⠀⠀├── ',
					})
					nodes.push({
						type: 'link',
						url: `./${page.slug}/${subfile.slug}`,
						children: [{ type: 'text', value: subfile.title }],
					})
					nodes.push({ type: 'break' })
				}
			}
		}

		tree.children.push(...nodes)
	}
}
