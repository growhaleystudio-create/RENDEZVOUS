export function observeBarberSignatures(
	section,
	{ prefersReducedMotion = false, IntersectionObserverClass = globalThis.IntersectionObserver } = {},
) {
	if (!section || prefersReducedMotion || typeof IntersectionObserverClass !== "function") return null;

	section.dataset.signatureState = "waiting";
	const observer = new IntersectionObserverClass((entries) => {
		const entered = entries.some(
			({ isIntersecting, intersectionRatio = 0 }) => isIntersecting && intersectionRatio >= 0.2,
		);
		if (!entered) return;

		section.dataset.signatureState = "writing";
		observer.disconnect();
	}, { threshold: 0.2 });

	observer.observe(section);
	return observer;
}
