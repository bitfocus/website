import type { ReactNode } from 'react'
import Link from '@docusaurus/Link'
import Heading from '@theme/Heading'

import landingStyles from '../pages/landing.module.css'

interface BenefitProps {
	icon: ReactNode
	title: string
	children: ReactNode
}

export function Benefit({ icon, title, children }: BenefitProps): ReactNode {
	return (
		<div
			style={{
				textAlign: 'center',
				flex: '1 1 300px',
				maxWidth: '400px',
			}}
		>
			<div style={{ marginBottom: '1rem' }}>{icon}</div>
			<h3
				style={{
					fontSize: '0.875rem',
					fontWeight: 500,
					color: 'var(--ifm-heading-color)',
					marginBottom: '0.5rem',
				}}
			>
				{title}
			</h3>
			<p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{children}</p>
		</div>
	)
}

interface BenefitsSectionProps {
	children: ReactNode
}

export function BenefitsSection({ children }: BenefitsSectionProps): ReactNode {
	return (
		<section className={landingStyles.benefitsSection}>
			<div className={landingStyles.sectionContainer}>
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: '2.5rem',
						justifyContent: 'center',
					}}
				>
					{children}
				</div>
			</div>
		</section>
	)
}

interface GitHubSectionProps {
	appName?: string
	githubHref?: string
}

export function GitHubSection({
	appName = 'Companion',
	githubHref = 'https://l.companion.free/q/cEm4EqPps',
}: GitHubSectionProps): ReactNode {
	return (
		<section className={landingStyles.githubSection}>
			<div className={landingStyles.sectionContainer}>
				<Link href={githubHref} target="_blank">
					<img
						alt="github"
						src="/img/github_logo.png"
						width={120}
						height={32}
						style={{
							opacity: 0.5,
							margin: '0 auto',
							transition: 'opacity 0.2s',
						}}
						onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
						onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
					/>
				</Link>
				<Heading
					as="h3"
					className={landingStyles.githubTitle}
					style={{
						fontSize: '1.25rem',
						marginBottom: '2rem',
						marginTop: '1rem',
					}}
				>
					Open Source on GitHub
				</Heading>
				<p
					className={landingStyles.githubDescription}
					style={{ fontSize: '1rem', maxWidth: '42rem', margin: '0 auto' }}
				>
					{appName} is completely open source and welcomes contributions from the community. Whether you're fixing bugs,
					adding features, or creating new device modules, your contributions help make {appName} better for everyone.
				</p>
			</div>
		</section>
	)
}
