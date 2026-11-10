// Fails if any tracked file references a forbidden host, to stop links to retired sites creeping back in.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const FORBIDDEN = [
	{
		pattern: /user\.bitfocus\.io/i,
		hint: 'user.bitfocus.io is retired; link to the relevant page on this site or bitfocus.io instead',
	},
]

// Directories synced from bitfocus/companion; fixes there must be made upstream
const SYNCED = ['user-guide/', 'versioned_docs/', 'whats-new/']

const IGNORED = new Set(['yarn.lock', 'scripts/check-forbidden-links.mjs'])

const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
	.split('\0')
	.filter((file) => file && !IGNORED.has(file))

let failures = 0
for (const file of files) {
	let content
	try {
		content = readFileSync(file, 'utf8')
	} catch {
		continue // deleted in the working tree, or unreadable
	}
	if (content.includes('\0')) continue // binary

	const lines = content.split('\n')
	for (let i = 0; i < lines.length; i++) {
		for (const { pattern, hint } of FORBIDDEN) {
			if (pattern.test(lines[i])) {
				failures++
				const synced = SYNCED.some((dir) => file.startsWith(dir))
				console.error(`${file}:${i + 1}: ${hint}${synced ? ' (synced content: fix this in bitfocus/companion)' : ''}`)
				console.error(`    ${lines[i].trim()}`)
			}
		}
	}
}

if (failures > 0) {
	console.error(`\nFound ${failures} forbidden link(s)`)
	process.exit(1)
}
console.log('No forbidden links found')
