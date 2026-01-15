import React from 'react'
import Link from '@docusaurus/Link'
import { useLatestVersion } from '@docusaurus/plugin-content-docs/client'
import BrowserOnly from '@docusaurus/BrowserOnly'

// Code modified from Google AI advice and attributed to: https://github.com/facebook/docusaurus/issues/7402#issuecomment-1124447048

/**
 * Link to version documents (User Guide) from non-version documents (For Developers)
 * @param to - the relative path to the file *within* /user-guide, e.g., "getting-started/Installation"
 * @param children - the elements between <UserGuideLink to=''> and </UserGuideLink>
 * @returns a React <Link> component
 */
function UserGuideLink({ children, to, ...props }) {
	return (
		<BrowserOnly fallback={<span>{children}</span>}>
			{() => {
				const latestVersion = useLatestVersion()

				// latestVersion.path is the string '/user-guide/vxx' where vxx is the current version
				const versionPath = latestVersion.path + (latestVersion.path.endsWith('/') ? '' : '/')
				const basepath = new URL(versionPath, window.location.origin)
				const latestDocUrl = new URL(to, basepath).href

				return (
					<Link {...props} to={latestDocUrl}>
						{children}
					</Link>
				)
			}}
		</BrowserOnly>
	)
}

export default UserGuideLink
