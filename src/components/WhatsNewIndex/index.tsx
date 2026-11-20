import type { ReactNode } from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import { DocsSidebarProvider } from '@docusaurus/plugin-content-docs/client'
import type { PropSidebar } from '@docusaurus/plugin-content-docs'
import { HtmlClassNameProvider, ThemeClassNames } from '@docusaurus/theme-common'
import DocRootLayout from '@theme/DocRoot/Layout'
import Heading from '@theme/Heading'
import Layout from '@theme/Layout'
import type { WhatsNewRelease } from '../../plugins/whats-new-index'

import styles from './styles.module.css'

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

function formatDate(date: string): string {
	const parsed = new Date(date)
	return isNaN(parsed.getTime()) ? date : dateFormat.format(parsed)
}

function Release({ release, latest }: { release: WhatsNewRelease; latest: boolean }): ReactNode {
	return (
		<article className={styles.release}>
			<header className={styles.releaseHeader}>
				<Heading as="h2" className={styles.releaseTitle}>
					<Link to={release.permalink}>{release.title}</Link>
				</Heading>
				<div className={styles.releaseMeta}>
					{latest && <span className="badge badge--primary">Latest</span>}
					{release.date && <time dateTime={release.date}>{formatDate(release.date)}</time>}
				</div>
			</header>

			{release.summaryHtml && (
				<div className={styles.summary} dangerouslySetInnerHTML={{ __html: release.summaryHtml }} />
			)}

			{release.highlights.length > 0 && (
				<ul className={styles.highlights}>
					{release.highlights.map((highlight) => (
						<li key={highlight.anchor}>
							<Link to={`${release.permalink}#${highlight.anchor}`}>{highlight.title}</Link>
						</li>
					))}
				</ul>
			)}

			<Link to={release.permalink} className={styles.readMore}>
				Read the full release notes <span aria-hidden="true">→</span>
			</Link>
		</article>
	)
}

interface WhatsNewIndexProps {
	releases: WhatsNewRelease[]
	sidebar: PropSidebar
	sidebarName: string
}

export default function WhatsNewIndex({ releases, sidebar, sidebarName }: WhatsNewIndexProps): ReactNode {
	// Mirror the wrappers the docs plugin puts around a doc page, so this shows the release sidebar like the pages do
	return (
		<HtmlClassNameProvider className={clsx(ThemeClassNames.wrapper.docsPages, ThemeClassNames.page.docsDocPage)}>
			<Layout title="What's New" description="Release notes for every version of Bitfocus Companion">
				<DocsSidebarProvider name={sidebarName} items={sidebar}>
					<DocRootLayout>
						<main className={styles.page}>
							<header className={styles.pageHeader}>
								<Heading as="h1">What's New in Companion</Heading>
								<p>The highlights of each Companion release, newest first.</p>
							</header>

							{releases.map((release, i) => (
								<Release key={release.permalink} release={release} latest={i === 0} />
							))}
						</main>
					</DocRootLayout>
				</DocsSidebarProvider>
			</Layout>
		</HtmlClassNameProvider>
	)
}
