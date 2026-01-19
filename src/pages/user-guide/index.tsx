import React from 'react'
import { useLatestVersion } from '@docusaurus/plugin-content-docs/client'
import BrowserOnly from '@docusaurus/BrowserOnly'
import { Redirect } from '@docusaurus/router'
import Layout from '@theme/Layout'
import Heading from '@theme/Heading'

function buildVersionUrl(latestVersionPath) {
	// latestVersion.path is the string '/user-guide/vxx' where vxx is the current version
	const versionPath = latestVersionPath + (latestVersionPath.endsWith('/') ? '' : '/')
	const basepath = new URL(versionPath, window.location.origin)
	return new URL('.', basepath).pathname
}

export default function UserGuideRedirect() {
	return (
		<BrowserOnly
			fallback={
				<Layout title="User Guide" description="Companion User Guide">
					<main className="container container--fluid margin-vert--lg">
						<div className="row" style={{ justifyContent: 'center' }}>
							<div className="col col--8">
								<article>
									<header>
										<Heading as="h1">User Guide</Heading>
									</header>
									<p>Oops! You shouldn't have found this page!</p>
									<p>You can pick a Companion version in the top right to view some docs</p>
								</article>
							</div>
						</div>
					</main>
				</Layout>
			}
		>
			{() => {
				const latestVersion = useLatestVersion('default')
				const redirectUrl = buildVersionUrl(latestVersion.path)

				return <Redirect to={redirectUrl} />
			}}
		</BrowserOnly>
	)
}
