import React, { type ComponentProps } from 'react'
import Img from '@theme-original/MDXComponents/Img'

// Offer the webp copy of a png in the docs, which src/plugins/webp-images.ts writes alongside it in the build.
// The webp files only exist after a production build, so `yarn start` keeps the plain <img>.
const OFFER_WEBP = process.env.NODE_ENV === 'production'

// Pngs bundled by webpack, optionally followed by a #fragment (as added by src/remark/remark-themed-image.ts)
const BUNDLED_PNG = /^([^?#]*\/assets\/images\/[^/?#]+\.png)(#.*)?$/i

export default function MDXImg(props: ComponentProps<typeof Img>): React.JSX.Element {
	const match = OFFER_WEBP && typeof props.src === 'string' ? BUNDLED_PNG.exec(props.src) : null
	if (!match) return <Img {...props} />

	return (
		<picture>
			<source srcSet={`${match[1]}.webp`} type="image/webp" />
			<Img {...props} />
		</picture>
	)
}
