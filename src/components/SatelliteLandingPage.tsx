import type { ReactNode } from 'react'
import Link from '@docusaurus/Link'
import { HeroButtons, PrimaryHeroButton, SecondaryHeroButton } from './HeroButtons'
import { BenefitsSection, Benefit, GitHubSection } from './SharedSections'

import styles from './SatelliteLandingPage.module.css'

export default function SatelliteLandingPage(): ReactNode {
	return (
		<div className={styles.page}>
			{/* Hero */}
			<section className={styles.hero}>
				<img alt="Companion" width="96" height="96" src="/img/satellite-logo.png" />
				<h1 className={styles.heroTitle}>Companion Satellite</h1>
				<p className={styles.heroSubtitle}>
					Distribute your physical Stream Deck controllers and other USB surfaces across multiple computers — all
					controlled from a single central Companion instance, without installing Companion at each workstation.
				</p>
				<HeroButtons>
					<PrimaryHeroButton href="https://user.bitfocus.io/download" subtitle="Win / Mac / Linux / Pi">
						Download
					</PrimaryHeroButton>
					{/* <SecondaryHeroButton to="./getting-started">Getting Started</SecondaryHeroButton> */}
					<SecondaryHeroButton href="https://l.companion.free/q/RJlGvBszs">GitHub</SecondaryHeroButton>
					<SecondaryHeroButton href="https://l.companion.free/q/apxyeOnyk">Sponsor</SecondaryHeroButton>
				</HeroButtons>
			</section>

			<hr className={styles.divider} />

			{/* What is it */}
			<section className={styles.section}>
				<h2 className={styles.sectionHeading}>What is Companion Satellite?</h2>
				<p className={styles.prose}>
					Companion Satellite is a small, lightweight application that connects your local USB surfaces — Stream Decks
					and other supported control surfaces — to a <Link href="/">Bitfocus Companion</Link> server running on another
					machine over the network.
				</p>
				<p className={styles.prose}>
					The computers don't need to be on the same subnet or VLAN. As long as a TCP connection can be established —
					whether over a local network or a VPN — Satellite will work. Each connected surface shows up in Companion just
					like a locally attached device, and can be configured the same way.
				</p>
			</section>

			<hr className={styles.divider} />

			{/* Key features */}
			<BenefitsSection>
				<Benefit
					title="Surfaces appear as local"
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							style={{ width: '2.5rem', height: '2.5rem', margin: '0 auto' }}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3"
							/>
						</svg>
					}
				>
					Each surface shows up in Companion as its own satellite device, indistinguishable from a locally-connected
					surface. Assign pages, configure buttons, and set up feedbacks exactly as you normally would.
				</Benefit>
				<Benefit
					title="Works over any TCP network"
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							style={{ width: '2.5rem', height: '2.5rem', margin: '0 auto' }}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253M3.284 14.253A8.959 8.959 0 0 1 3 12c0-1.064.174-2.086.494-3.038"
							/>
						</svg>
					}
				>
					Satellite connects over TCP — same LAN, across VLANs, or through a VPN. No multicast or broadcast required. If
					the machines can reach each other, Satellite works.
				</Benefit>
				{/* <Benefit
					title="Automatic discovery via mDNS"
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							style={{ width: '2.5rem', height: '2.5rem', margin: '0 auto' }}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>
					}
				>
					If mDNS is available on your network, Companion will automatically discover Satellite instances and offer to
					configure them for you — no manual IP entry needed in many setups.
				</Benefit> */}
				<Benefit
					title="Web configuration UI"
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							style={{ width: '2.5rem', height: '2.5rem', margin: '0 auto' }}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
							/>
							<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
						</svg>
					}
				>
					Satellite includes a built-in web interface at <code>http://satellite-ip:9999</code>. Configure your target
					Companion host, manage surface plugins, and monitor connected surfaces — all from a browser.
				</Benefit>
				<Benefit
					title="Wide surface support"
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							style={{ width: '2.5rem', height: '2.5rem', margin: '0 auto' }}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z"
							/>
						</svg>
					}
				>
					Works with Elgato Stream Decks and any other USB surface types supported by Companion. Enable or disable
					specific surface plugins through the web UI to control which device types Satellite scans for.
				</Benefit>
				{/* 
				<Benefit
					title="One Companion, many workstations"
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							style={{ width: '2.5rem', height: '2.5rem', margin: '0 auto' }}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3M12 3v4.5m0 0-1.5-1.5M12 7.5l1.5-1.5"
							/>
						</svg>
					}
				>
					No need to install Companion at every seat. Satellite is a lightweight agent — install it once per machine and
					let your central Companion instance do the rest.
				</Benefit> */}

				<Benefit
					title="Run it everywhere"
					icon={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							style={{ width: '2.5rem', height: '2.5rem', margin: '0 auto' }}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3"
							/>
						</svg>
					}
				>
					A native desktop app for Windows, macOS, and Linux; a prebuilt Raspberry Pi image; or a headless systemd
					service for any x64/arm64 Debian system. Deploy Satellite wherever you need it.
				</Benefit>
			</BenefitsSection>

			{/* Open Source on GitHub */}
			<GitHubSection appName="Companion Satellite" githubHref="https://l.companion.free/q/RJlGvBszs" />
		</div>
	)
}
