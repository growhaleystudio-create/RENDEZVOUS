# Signature Editorial Implementation Plan

> **For agentic workers:** Use executing-plans to implement inline, as approved by the user.

**Goal:** Add the approved Signature Editorial motion without changing content, navigation, or layout.

**Architecture:** Homepage-only CSS and one native scroll controller. Web Animations reveal content from its visible default; an event-driven animation frame eases the hero photo composition toward native scroll progress.

**Tech Stack:** Astro, CSS, IntersectionObserver, Web Animations, native requestAnimationFrame.

## Global constraints
- Preserve existing promo, signature, gallery controls and disabled route links.
- No dependencies, no scroll interception, no publishing.
- Reduced motion and no JavaScript must leave all content readable.

## Tasks
- [x] Added tests for clamped hero progress and reduced-motion initialization; verified failure before implementation.
- [x] Added native controller with once-only reveals, cancel-on-focus, reduced-motion cleanup, and a settling hero frame loop.
- [x] Added homepage-only tokens and hero framing CSS; headline wrappers preserve original wording and line layout. Gallery reveal uses a stable wrapper outside the hydrated component.
- [x] Build: 26 pages. Tests: 64 passing. Browser: hero progress changed from 0 to 0.4928 during native scroll; direct services and barbers anchors rendered, signatures entered writing state; 1440px desktop and 390px mobile inspected; no browser console errors.

Reduced-motion initialization and preference-change cleanup are unit tested, not browser-emulated (no emulation capability available in this session). No commit, push or deployment performed.
