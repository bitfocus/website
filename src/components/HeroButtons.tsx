import type { ReactNode } from 'react'
import Link from '@docusaurus/Link'

import styles from './HeroButtons.module.css'

// Export raw class names so callers that need a custom link component
// (e.g. UserGuideLink) can apply the same styles manually.
export { styles as heroButtonStyles }

interface BaseButtonProps {
	children: ReactNode
	subtitle?: string
	className?: string
}

type LinkButtonProps = BaseButtonProps & ({ href: string; to?: never } | { to: string; href?: never })

export function PrimaryHeroButton({ children, subtitle, href, to, className }: LinkButtonProps): ReactNode {
	return (
		<Link
			className={`${styles.primaryButton} ${styles.heroButton}${className ? ` ${className}` : ''}`}
			{...(href ? { href, target: '_blank' } : { to })}
		>
			<span>{children}</span>
			{subtitle && <span className={styles.buttonSubtitle}>{subtitle}</span>}
		</Link>
	)
}

export function SecondaryHeroButton({ children, href, to, className }: LinkButtonProps): ReactNode {
	return (
		<Link
			className={`${styles.secondaryButton} ${styles.heroButton}${className ? ` ${className}` : ''}`}
			{...(href ? { href, target: '_blank' } : { to })}
		>
			{children}
		</Link>
	)
}

interface HeroButtonsProps {
	children: ReactNode
	/** Override or extend the wrapper's className */
	className?: string
}

export function HeroButtons({ children, className }: HeroButtonsProps): ReactNode {
	return <div className={`${styles.heroButtons}${className ? ` ${className}` : ''}`}>{children}</div>
}
