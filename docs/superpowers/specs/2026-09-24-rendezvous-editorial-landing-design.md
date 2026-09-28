# Rendezvous Editorial Landing Page Design

## Goal

Expand the separate Astro landing-page prototype into a complete, navigable public Rendezvous experience that mirrors the CMS content structure and demonstrates a booking journey. Keep all landing-page content as a static, CMS-shaped demo snapshot; do not connect it to the CMS or to production services.

## Context and current state

- The landing project is Astro 7 with React, TypeScript, Tailwind CSS 4, and Phosphor icons.
- The current homepage has an editorial hero, a three-step booking ribbon, and a booking-story section. Its editorial imagery, navigation, typography, palette, responsive CSS, and prior visual QA report are already present.
- The CMS preview provides the content model and section order: homepage, philosophy, services, branches, barbers, lookbook, promo, testimonials/claims, voucher, articles, FAQ, policy links, and site settings.
- CMS seed values such as branch contact details, demo barber profiles, review quotes, and ratings are explicitly illustrative. Testimonials and numeric claims are draft-only in the CMS seed and must not be represented as verified public facts.
- The supplied visual reference is the 2026-09-24 editorial landing screenshot. Its key traits are a broad white canvas, large display typography, asymmetric but aligned imagery, restrained color, and substantial whitespace.

## Design direction

Use an editorial Swiss system rather than copying unrelated Dribbble concepts literally. Keep a consistent column grid and alignment while varying section composition. Use the existing display/sans pairing and local editorial imagery where appropriate; use near-black and paper-white as the base, with the existing Rendezvous accent used sparingly. Reuse a consistent section header pattern: small section number/kicker, clear headline, concise supporting copy, then content. Prefer ruled editorial lists and image-led layouts over wrapping every item in a rounded card. Reserve pill treatment for the primary booking action.

The hero should retain the current reference-led collage and oversized editorial headline. The full page should vary density intentionally: spacious hero/manifesto; scannable service menu; practical branch and barber directories; image-led lookbook and journal; compact FAQ; and a clear booking flow. Keep the booking experience visually related but more utilitarian than the marketing sections.

## Information architecture and routes

### Homepage `/`

Render these sections in the CMS default order, with section IDs matching the CMS IDs for anchor navigation:

1. `top` — hero, brand statement, short intro, primary booking CTA.
2. `philosophy` — philosophy, manifesto, and three values.
3. `services` — service menu with description, benefits, price, and duration; link to service detail and preselect service in booking.
4. `branches` — branch directory preview with city, sample hours, and branch detail/booking actions.
5. `barbers` — barber profile preview with specialties, branch association, and booking action.
6. `lookbook` — filterable style gallery linked to a service.
7. `promo` — promotional copy and booking CTA.
8. `testimonials` — visible demo section that explicitly says there are no published reviews yet; do not show draft quotations or unverified ratings as real social proof.
9. `voucher` — gift-card preview with selectable demo amount and clear no-payment/no-redemption disclaimer.
10. `articles` — journal preview with category, excerpt, and detail link.
11. `faq` — accessible expandable questions.
12. Footer — contact and policy links, site identity, and prototype disclaimer.

The header navigation should expose the primary public destinations and a persistent, clearly named booking action. Internal links use the CMS section IDs (`#services`, `#branches`, `#barbers`, `#lookbook`, `#promo`, `#testimonials`, `#voucher`, `#articles`, `#faq`) so the landing structure remains easy to compare with the CMS preview.

### Public detail routes

- `/services/` and `/services/[slug]/`
- `/branches/` and `/branches/[slug]/`
- `/barbers/` and `/barbers/[slug]/`
- `/journal/` and `/journal/[slug]/`
- `/booking/`

Directory/detail pages reuse the homepage data and layout tokens, include breadcrumbs/back links, and keep the booking action visible. Do not create admin/CMS routes in this project.

## Static demo data and content integrity

- Create a landing-local data module shaped after the CMS entities: site settings, homepage content/section order, services, branches, barbers, lookbook items, promo, testimonials/claims, voucher, articles, FAQ, and policies.
- Do not import runtime code from the CMS repo and do not add an API, database, shared storage, or publish bridge.
- Clearly label placeholder branch addresses/hours, barber profiles, article copy, lookbook imagery, and any other illustrative data as prototype/demo content. Do not present the CMS seed's fictional reviews, rating, or claim as verified.
- The booking UI is a simulation only. Its slots are labelled sample slots, customer input stays in transient page state, and confirmation states that no booking was saved, sent, or made with Rendezvous.
- Voucher controls are a visual interaction preview only; they do not issue, redeem, or charge a monetary balance.
- Keep `PUBLIC_BOOKING_URL` as an optional external override if already supported, but default CTAs to the landing project's local `/booking/` demo route.

## Booking journey

Provide a React-powered, keyboard-accessible wizard at `/booking/`:

1. Choose branch.
2. Choose service.
3. Choose a specific barber or “siapa saja”, limited to the demo data's branch/service relationships.
4. Choose a demo date and sample time.
5. Enter name and phone; validate required values and show errors beside fields.
6. Review branch, service, barber, time, price, and duration.
7. Submit into an on-page confirmation state with an explicit prototype/no-save disclaimer.

The user can move backward to edit selections, and the current step is announced and visually evident. No live availability, conflict prevention, real customer data retention, payment, messaging, or booking-management link is implied.

## Shared UI and accessibility

- Continue the existing `SiteLayout`, `SiteNavigation`, and editorial button system; introduce small reusable components only where they standardize recurring patterns (section heading, metadata row, service row, image tile, breadcrumb, FAQ item).
- Use the existing Phosphor icon package; do not draw icons with text or CSS.
- Maintain visible keyboard focus, semantic headings and lists, descriptive alt text, proper form labels/errors, keyboard-operated menu/accordion, and reduced-motion support.
- At narrow widths, collapse the editorial grid into a readable vertical order; prevent horizontal overflow and keep booking CTA usable.
- Maintain a single spacing/type/color token source in `global.css` instead of page-specific arbitrary values.

## Non-goals

- No CMS repo edits or automatic content synchronization.
- No deployment, push, production booking, payment, WhatsApp, authentication, API, or persistent customer storage.
- No claims that demo addresses, hours, profiles, testimonials, availability, policies, or vouchers are live/official.
- No broad CMS redesign or unrelated site features.

## Acceptance criteria

- The homepage renders every CMS-mapped public section in the specified order, with working anchor navigation.
- Every listed public route has coherent static content and usable links back to booking or its parent directory.
- The booking simulation completes from branch selection to an explicitly non-persistent confirmation, with validation and back navigation.
- Demo-only claims and data are clearly labelled; draft testimonials/ratings are never framed as real.
- Layout follows the approved Swiss editorial direction on desktop and mobile, preserving the existing hero reference while making added sections visually consistent.
- Focused route/content tests, production build, and browser checks for menu, filters, voucher preview, FAQ, booking validation, and confirmation pass.
- Update `design-qa.md` with fresh desktop and mobile visual review; do not rely on the prior report as verification for the expanded page.
