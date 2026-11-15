import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import type { Plugin } from '@docusaurus/types'
import sharp, { type WebpOptions } from 'sharp'

// Write a lossless webp copy alongside every png that the docs pull in, for src/theme/MDXComponents/Img to offer to
// browsers through a <picture>. For screenshots, lossless webp is less than half the size of the png without changing
// any pixels, while lossy webp saves little more and blurs text.
//
// This runs after the build, on the hashed files webpack wrote to build/assets/images/, as `<name>.png.webp`.
// Every png gets one, even in the rare case where it isn't smaller, as the <picture> assumes it exists.
// Jpegs are left alone: a lossless webp of a jpeg is several times larger than the jpeg.
//
// Encoding is slow, so the results are cached by the hash of the png in node_modules/.cache/webp-images, which CI
// keeps between builds. Bump CACHE_VERSION when changing the encoding options to throw the cache away.

const CACHE_VERSION = 1
const WEBP_OPTIONS: WebpOptions = { lossless: true, effort: 6 }

const IMAGES_DIR = 'assets/images'

export default function webpImagesPlugin(): Plugin {
	return {
		name: 'webp-images',
		async postBuild({ outDir, siteDir }) {
			const cacheDir = path.join(siteDir, 'node_modules/.cache/webp-images')
			await fs.mkdir(cacheDir, { recursive: true })

			const imagesDir = path.join(outDir, IMAGES_DIR)
			const pngs = (await fs.readdir(imagesDir).catch(() => [])).filter((f) => /\.png$/i.test(f))

			let encoded = 0
			const usedCacheFiles = new Set<string>()
			const pending = new Map<string, Promise<Buffer>>()

			await runWithConcurrency(pngs, os.availableParallelism(), async (file) => {
				const src = path.join(imagesDir, file)
				const png = await fs.readFile(src)

				const hash = crypto.createHash('sha256').update(png).digest('hex')
				const cacheFile = `v${CACHE_VERSION}-${hash}.webp`
				const cachePath = path.join(cacheDir, cacheFile)
				usedCacheFiles.add(cacheFile)

				// The same png can be in the build more than once (eg in several versions of the docs), so share the work
				let webp = pending.get(hash)
				if (!webp) {
					webp = (async () => {
						const cached = await fs.readFile(cachePath).catch(() => null)
						if (cached) return cached

						const encodedWebp = await sharp(png).webp(WEBP_OPTIONS).toBuffer()
						// Write to a temporary file first, so an interrupted build can't leave a truncated file in the cache
						const tmpPath = `${cachePath}.${crypto.randomUUID()}.tmp`
						await fs.writeFile(tmpPath, encodedWebp)
						await fs.rename(tmpPath, cachePath)
						encoded++
						return encodedWebp
					})()
					pending.set(hash, webp)
				}

				await fs.writeFile(`${src}.webp`, await webp)
			})

			// Drop cache entries this build didn't use, so the cache doesn't grow forever as screenshots are updated
			for (const file of await fs.readdir(cacheDir)) {
				if (!usedCacheFiles.has(file)) await fs.rm(path.join(cacheDir, file), { force: true })
			}

			console.log(`[webp-images] Wrote ${pngs.length} webp images (${encoded} newly encoded)`)
		},
	}
}

async function runWithConcurrency<T>(items: T[], limit: number, fn: (item: T) => Promise<void>): Promise<void> {
	let next = 0
	const worker = async () => {
		while (next < items.length) await fn(items[next++])
	}
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
}
