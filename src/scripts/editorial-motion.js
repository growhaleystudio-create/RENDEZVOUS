import { MOTION, smoothTowards } from "./motion-tokens.js";

export function heroProgress(top, height) {
  return Math.max(0, Math.min(1, -top / Math.max(1, height)));
}

// Elemen yang ikut reveal saat scroll. Kartu & foto layanan terpisah supaya bisa di-stagger.
export const REVEAL_SELECTORS = [
  ".campaign-home .campaign-philosophy__copy", ".campaign-home .campaign-philosophy__photo",
  ".campaign-home .campaign-services__header", ".campaign-home .campaign-service-card",
  ".campaign-home .campaign-service-pair__photo", ".campaign-home .section-heading",
  ".campaign-home .editorial-rail-heading", ".campaign-home .campaign-space-photo",
  ".campaign-home .branch-row--drawer", ".campaign-home .barbers-showcase-header",
  ".campaign-home .barber-entry", ".campaign-home .article-entry", ".campaign-home .faq-item",
  ".campaign-home .motion-gallery", ".campaign-home .promo-swiss__body",
  ".site-footer__top", ".site-footer__wordmark",
];

const MAX_STAGGER_STEPS = 6;
// An element plays once its top reaches the reading area: 80% down the viewport.
export const REVEAL_ROOT_MARGIN = "0px 0px -20% 0px";
// Safety net for content near the page end that can never reach that line.
export const REVEAL_FALLBACK_RATIO = 0.9;

export function initEditorialMotion(doc = document, win = window) {
  const preference = win.matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches) return () => {};
  const hero = doc.querySelector(".campaign-hero");
  if (!hero || !win.IntersectionObserver) return () => {};

  const animations = new Set();
  let stopped = false;

  /*
   * Reveal: content that starts below the fold waits (hidden, lowered) and plays only once it
   * is actually in the reading area. Content already on screen at load is never touched.
   * Elements arriving in the same frame (a row of cards) are staggered in document order.
   */
  const reveal = (elements) => {
    elements
      .filter((element) => element.dataset.reveal === "pending")
      .forEach((element, index) => {
        observer.unobserve(element);
        fallbackObserver.unobserve(element);
        delete element.dataset.reveal;
        element.dataset.motionEntered = "true";
        if (!element.animate || stopped) return;
        const animation = element.animate(
          [
            { opacity: 0, translate: `0 ${MOTION.revealDistancePx}px` },
            { opacity: 1, translate: "0 0" },
          ],
          {
            duration: MOTION.revealMs,
            easing: MOTION.easeReveal,
            delay: Math.min(index, MAX_STAGGER_STEPS) * MOTION.staggerMs,
            fill: "backwards",
          },
        );
        animations.add(animation);
        animation.onfinish = animation.oncancel = () => animations.delete(animation);
      });
  };
  const onEntries = (entries) => reveal(entries.filter(({ isIntersecting }) => isIntersecting).map(({ target }) => target));
  const observer = new win.IntersectionObserver(onEntries, { threshold: 0, rootMargin: REVEAL_ROOT_MARGIN });
  const fallbackObserver = new win.IntersectionObserver(
    (entries) => reveal(entries.filter(({ intersectionRatio }) => intersectionRatio >= REVEAL_FALLBACK_RATIO).map(({ target }) => target)),
    { threshold: REVEAL_FALLBACK_RATIO },
  );
  const viewportHeight = win.innerHeight ?? 0;
  const scrollTop = win.scrollY ?? 0;
  const maxScroll = Math.max(0, (doc.documentElement?.scrollHeight ?? 0) - viewportHeight);
  // The furthest document position the reading line (80% down) can ever reach.
  const lastReachableTop = maxScroll + viewportHeight * 0.8;
  doc.querySelectorAll(REVEAL_SELECTORS.join(",")).forEach((element) => {
    const top = element.getBoundingClientRect().top;
    if (top <= viewportHeight) return;
    element.dataset.reveal = "pending";
    observer.observe(element);
    // Only content that can never cross the reading line needs the fallback.
    if (top + scrollTop > lastReachableTop) fallbackObserver.observe(element);
  });

  // Hero parallax: time-based smoothing toward scroll progress, transform-only in CSS.
  let frame = 0;
  let previousTime = 0;
  let target = 0;
  let current = 0;
  const render = () => hero.style.setProperty("--hero-progress", current.toFixed(4));
  const tick = (time) => {
    frame = 0;
    const delta = Math.min(40, previousTime ? time - previousTime : 16.67);
    previousTime = time;
    current = smoothTowards(current, target, delta);
    if (Math.abs(target - current) < 0.0005) current = target;
    render();
    if (current !== target) frame = win.requestAnimationFrame(tick);
  };
  const update = () => {
    if (stopped || doc.hidden) return;
    const rect = hero.getBoundingClientRect();
    target = heroProgress(rect.top, rect.height);
    // Deep anchors/restoration initialize at the correct point, never replay the hero.
    if (rect.bottom <= 0) { current = target; render(); return; }
    if (!frame) { previousTime = 0; frame = win.requestAnimationFrame(tick); }
  };
  const rect = hero.getBoundingClientRect();
  current = target = heroProgress(rect.top, rect.height);
  render();
  hero.dataset.editorialMotion = "active";

  const settleAll = () => {
    animations.forEach((animation) => animation.finish());
    doc.querySelectorAll('[data-reveal="pending"]').forEach((element) => delete element.dataset.reveal);
  };
  // Keyboard focus must never land on content that is still lowered or mid-rise.
  const onFocus = (event) => {
    const pending = event.target?.closest?.("[data-reveal]");
    if (pending) delete pending.dataset.reveal;
    animations.forEach((animation) => {
      if (animation.effect?.target?.contains?.(event.target)) animation.finish();
    });
  };
  const onVisibility = () => {
    if (doc.hidden) { win.cancelAnimationFrame(frame); frame = 0; }
    else update();
  };
  const cleanup = () => {
    if (stopped) return;
    stopped = true;
    observer.disconnect();
    fallbackObserver.disconnect();
    settleAll();
    win.cancelAnimationFrame(frame);
    win.removeEventListener("scroll", update);
    win.removeEventListener("resize", update);
    win.removeEventListener("pagehide", cleanup);
    doc.removeEventListener("focusin", onFocus);
    doc.removeEventListener("visibilitychange", onVisibility);
    preference.removeEventListener("change", onPreference);
    hero.style.removeProperty("--hero-progress");
    delete hero.dataset.editorialMotion;
  };
  const onPreference = (event) => { if (event.matches) cleanup(); };
  win.addEventListener("scroll", update, { passive: true });
  win.addEventListener("resize", update, { passive: true });
  win.addEventListener("pagehide", cleanup);
  doc.addEventListener("focusin", onFocus);
  doc.addEventListener("visibilitychange", onVisibility);
  preference.addEventListener("change", onPreference);
  return cleanup;
}
