// Client-side script to annotate outbound links with Umami attributes.
// Runs in the browser; added via docusaurus.config.ts `clientModules`.
// `onRouteDidUpdate` is called by Docusaurus after every client-side navigation,
// covering both the initial render and subsequent SPA route changes.

function annotateAll() {
	document.querySelectorAll('a').forEach((a) => {
		if (a.host !== window.location.host && !a.getAttribute('data-umami-event')) {
			a.setAttribute('data-umami-event', `link:${a.href}`)
			a.setAttribute('data-umami-event-url', a.href)
		}
	})
}

// Called by Docusaurus after every route change (including initial load).
export function onRouteDidUpdate() {
	annotateAll()
}
