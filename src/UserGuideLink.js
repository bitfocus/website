import React from 'react'
import Link from '@docusaurus/Link'
import { useLatestVersion } from '@docusaurus/plugin-content-docs/client'
import BrowserOnly from '@docusaurus/BrowserOnly'

// Code modified from Google AI advice and attributed to: https://github.com/facebook/docusaurus/issues/7402#issuecomment-1124447048

function buildVersionUrl(latestVersionPath, to) {
	// latestVersion.path is the string '/user-guide/vxx' where vxx is the current version
	const versionPath = latestVersionPath + (latestVersionPath.endsWith('/') ? '' : '/')
	const basepath = new URL(versionPath, window.location.origin)
	return new URL(to, basepath).href
}
/**
 * Link to version documents (User Guide) from non-version documents (For Developers)
 * @param to - the relative path to the file *within* /user-guide, e.g., "getting-started/Installation"
 * @param children - the elements between <UserGuideLink to=''> and </UserGuideLink>
 * @returns a React <Link> component
 */
function UserGuideLink({ children, to, ...props }) {
	return (
		<BrowserOnly
			fallback={
				<Link {...props} to={buildVersionUrl('/user-guide/beta', to)}>
					{children}
				</Link>
			}
		>
			{() => {
				const latestVersion = useLatestVersion()

				return (
					<Link {...props} to={buildVersionUrl(latestVersion.path, to)}>
						{children}
					</Link>
				)
			}}
		</BrowserOnly>
	)
}

export default UserGuideLink
