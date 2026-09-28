# Rendezvous Editorial Landing Page — Implementation Plan

> Written for an agentic coding worker. Execute tasks in order, keep each change scoped to the landing project, and verify each checkpoint before continuing.

## Goal

Expand the current three-section Astro prototype into a complete public Rendezvous landing-page prototype that mirrors the CMS public content architecture and demonstrates a non-persistent booking journey. Preserve the approved Swiss editorial direction and use only a local static snapshot of demo content.

## Architecture

- `src/data/demo-content.js` is the landing project’s static, CMS-shaped content source. It exports `siteSettings`, `homepage`, `services`, `branches`, `barbers`, `lookbookItems`, `promo`, `testimonials`, `voucher`, `articles`, `faqs`, and `policies`.
- `src/data/booking-demo.js` contains pure booking rules and formatting helpers; it has no browser, network, persistence, or CMS dependency.
- Astro renders the homepage, directories, and detail routes at build time from the static data. Shared visual patterns live in small Astro components under `src/components/` and `src/components/sections/`.
- React is limited to the existing responsive navigation and interactions that need client state: lookbook filters, voucher preview, and the booking wizard. FAQ uses native `<details>` disclosure elements.
- `src/styles/global.css` remains the sole source for global type, color, layout, and spacing tokens. Section and route styles should consume these tokens.
- `design-qa.md` is the final evidence log for this expanded implementation; the existing report is historical and must not be treated as verification.

### Data and UI interfaces

- `demo-content.js` exports named values. Service records have `id`, `slug`, `name`, `description`, `benefits`, `price`, `durationMinutes`, and `demoLabel`. Branch records have `id`, `slug`, `name`, `city`, `address`, `hours`, `phone`, `serviceIds`, and `demoLabel`. Barber records have `id`, `slug`, `name`, `branchIds`, `serviceIds`, `specialties`, `bio`, `image`, and `demoLabel`. Article records have `id`, `slug`, `title`, `category`, `excerpt`, `body`, `image`, and `demoLabel`. Lookbook records identify their image, alt text, associated service, and demo label.
- Homepage order and IDs are exactly `top`, `philosophy`, `services`, `branches`, `barbers`, `lookbook`, `promo`, `testimonials`, `voucher`, `articles`, and `faq`; the footer follows these sections.
- `booking-demo.js` exports `getEligibleBarbers({ branchId, serviceId, barbers })`, `validateBookingStep(step, values)`, `getDemoSlots(date)`, and `formatBookingSummary(values, data)`. Validation returns field-keyed messages (or an empty object); the summary resolves selected entities from the passed data rather than duplicating labels/prices.
- `BookingWizard` receives the static `branches`, `services`, and `barbers` arrays and owns transient form/step state. Completion is an in-page prototype confirmation only.

## Tech Stack

- Astro 7 static pages and dynamic route generation (`getStaticPaths`)
- React 19 islands only for stateful controls
- Tailwind CSS 4 already configured through the existing Vite integration, plus the existing global CSS token layer
- Existing Phosphor React icon package, Bodoni Moda / DM Sans typography, editorial image assets, and Node’s built-in test runner
- No new dependency or backend integration

## Global Constraints

- Do not modify `/Users/macbook/Documents/Growhaley Dummy Barbershop`; use the already-reviewed CMS content model only as reference.
- Do not add API calls, CMS imports, a database, production booking, payment, WhatsApp, authentication, persistence, or deployment behavior.
- Preserve user changes and do not stage, commit, or push. This repository has no initial commit and existing project files are untracked.
- Mark illustrative addresses, opening hours, profiles, articles, imagery, slots, and voucher interactions as demo/prototype. Never display draft testimonials, the seeded rating, or other unverified numeric claims as real social proof.
- Keep the optional `PUBLIC_BOOKING_URL` override if needed, but default every booking CTA to this project’s `/booking/` route.
- Use semantic HTML, visible focus, useful alt text, labelled fields, keyboard access, reduced-motion support, and no horizontal overflow at mobile widths.
- Follow test-first checkpoints: add the focused failing test, run it and observe the expected failure, implement the smallest change, rerun the test to green, then run the relevant build/test suite.
- Do not call work complete until production build, automated tests, and visual/browser checks at desktop and mobile sizes have been completed and recorded in `design-qa.md`.

## Tasks

### 1. Add and test the landing-local CMS-shaped demo dataset

**Files:** `src/data/demo-content.js`, `tests/content.test.mjs`

1. Add tests for the named exports, required fields, stable slugs/IDs, branch-service-barber relationships, the exact homepage section order, and demo disclaimers. Assert that testimonials contain no published quote/rating content and are explicitly presented as unpublished.
2. Run `node --test tests/content.test.mjs`; confirm it fails because the module is not present.
3. Implement only the static records needed by the approved spec, using the reviewed CMS seed as illustrative input. Keep all example details visibly marked demo and use no draft review/score/claim as real content.
4. Run `node --test tests/content.test.mjs`; expect every dataset and integrity assertion to pass.

### 2. Standardize public navigation and build every homepage section

**Files:** `src/pages/index.astro`, `src/components/SiteNavigation.tsx`, `src/components/EditorialHero.astro`, `src/components/ServiceRibbon.astro`, `src/components/BookingStory.astro`, `src/components/EditorialButton.astro`, `src/components/sections/SectionHeading.astro`, `src/components/sections/PhilosophySection.astro`, `src/components/sections/ServicesSection.astro`, `src/components/sections/BranchesSection.astro`, `src/components/sections/BarbersSection.astro`, `src/components/sections/LookbookSection.astro`, `src/components/sections/PromoSection.astro`, `src/components/sections/TestimonialsSection.astro`, `src/components/sections/VoucherSection.astro`, `src/components/sections/ArticlesSection.astro`, `src/components/sections/FaqSection.astro`, `src/components/SiteFooter.astro`, `src/layouts/SiteLayout.astro`, `tests/homepage.test.mjs`

1. Update homepage tests first to assert the new section IDs and order, Indonesian document language, working section links, booking links to `/booking/`, and prototype disclosure. Add assertions that unpublished testimonials are not rendered as quotes or scores.
2. Run `npm run build && npm test`; confirm the revised tests fail against the current three-section homepage.
3. Build the homepage from `demo-content.js`. Keep the supplied hero composition and existing local images; express the remaining Swiss editorial pattern with a consistent section heading, grid/rule alignment, editorial lists, and restrained accent. Update navigation labels/anchors and route all booking CTAs to `/booking/` unless `PUBLIC_BOOKING_URL` is explicitly set.
4. Render all 11 public sections in the approved order, followed by contact/policy links and a site-wide prototype note. Use native details/summary for FAQ. Ensure testimonials section explicitly says reviews are not published yet.
5. Run `npm run build && npm test`; expect the generated homepage and existing tests to pass with assertions updated to the new routes/IA.

### 3. Generate public service, branch, barber, and journal directories and detail routes

**Files:** `src/components/Breadcrumb.astro`, `src/pages/services/index.astro`, `src/pages/services/[slug].astro`, `src/pages/branches/index.astro`, `src/pages/branches/[slug].astro`, `src/pages/barbers/index.astro`, `src/pages/barbers/[slug].astro`, `src/pages/journal/index.astro`, `src/pages/journal/[slug].astro`, `tests/routes.test.mjs`

1. Add route-output tests for each directory and each known static detail slug. Assert headings, breadcrumb/back links, demo labels, and at least one clear booking action in each detail page.
2. Run `npm run build && node --test tests/routes.test.mjs`; confirm failures because the static routes do not yet exist.
3. Implement directory pages and `getStaticPaths` detail pages using the shared demo records. Reuse the global editorial tokens, include parent-directory navigation, use descriptive image alt text, and clearly label illustrative records.
4. Run `npm run build && node --test tests/routes.test.mjs`; expect all requested route files and content checks to pass.

### 4. Add the lookbook and voucher preview interactions

**Files:** `src/data/lookbook.js`, `src/components/LookbookGallery.tsx`, `src/components/VoucherPreview.tsx`, `src/components/sections/LookbookSection.astro`, `src/components/sections/VoucherSection.astro`, `tests/lookbook.test.mjs`, `tests/routes.test.mjs`

1. Add pure lookbook-filter tests for “all” and each service filter, including an empty result. Run `node --test tests/lookbook.test.mjs` and confirm the missing module causes the expected failure.
2. Implement a pure filter helper and run the test again; expect filter tests to pass.
3. Connect the filter to keyboard-operable labelled buttons/tabs with an announced result count and descriptive image links. Keep the interaction useful without client JavaScript by rendering the full gallery initially.
4. Implement a selectable voucher amount/preview with an explicit no-issuance, no-redemption, and no-payment disclosure. Do not introduce real monetary balance behavior.
5. Run `npm run build && npm test`; expect all route, gallery-content, and existing homepage assertions to pass.

### 5. Implement and unit-test booking rules before the booking wizard

**Files:** `src/data/booking-demo.js`, `tests/booking-demo.test.mjs`

1. Add failing unit tests for eligible-barber relationship filtering (including “siapa saja”), branch/service/date/contact/review step validation, sample slots, and summary resolution/price/duration formatting. Keep tests independent of any persistence layer.
2. Run `node --test tests/booking-demo.test.mjs`; confirm the missing module produces the expected failure.
3. Implement the pure helpers with deterministic demo slots and Indonesian field errors; prevent a barber from appearing where the selected branch/service relationship does not match.
4. Run `node --test tests/booking-demo.test.mjs`; expect all relationship, validation, slots, and summary tests to pass.

### 6. Build the accessible, transient `/booking/` React journey

**Files:** `src/components/BookingWizard.tsx`, `src/components/booking/BookingStepIndicator.tsx`, `src/pages/booking/index.astro`, `src/layouts/SiteLayout.astro`, `tests/routes.test.mjs`

1. Add route tests for the booking page shell, initial branch step, labelled controls, prototype disclaimer, and the absence of any production booking endpoint reference. Confirm they fail before implementation.
2. Build the seven-step branch → service → barber → date/time → contact → review → confirmation wizard with transient component state. Include “siapa saja”, validate at the field, allow back navigation without discarding prior choices, and announce the current step.
3. Use demo-only slots. The confirmation must explicitly say the request was not saved, sent, or booked with Rendezvous. Do not store submitted name/phone in local storage, cookies, URL, or server state.
4. Run `npm run build && npm test`; expect unit and generated-route tests to pass.

### 7. Apply responsive editorial tokens and clean up copy/accessibility

**Files:** `src/styles/global.css`, `src/components/**/*.astro`, `src/components/**/*.tsx`, `src/pages/**/*.astro`, `tests/homepage.test.mjs`, `tests/routes.test.mjs`

1. Add focused output assertions for page landmarks, heading hierarchy, navigation labels, prototype notices, image alt text, and form error/step semantics; run `npm run build && npm test` and record any expected failures before correction.
2. Consolidate spacing, type, color, grid, and content-width values into existing global CSS tokens. Align section headings and page gutters; retain asymmetry only inside the shared grid. Use consistent button and metadata patterns without turning every section into a card.
3. Review all visible copy for clear Indonesian/English consistency, truthful demo language, understandable CTA labels, and removal of CMS/admin terminology from public pages.
4. Rerun `npm run build && npm test`; expect no missing-alt, section-order, copy-integrity, or generated-route assertion failures.

### 8. Run fresh visual and interaction QA and update the report

**Files:** `design-qa.md` (replace/update with current run evidence only)

1. Check the running Astro server status; reuse `http://localhost:4321/` if available and start Astro in documented background mode only if it is not running.
2. Inspect the homepage and all directory/detail/booking routes in a browser at desktop `1836×1414` and mobile `390×844`. Verify no horizontal overflow, coherent editorial hierarchy, image crops, readable demo disclosures, and usable mobile navigation.
3. Exercise keyboard and pointer interactions: navigation/menu; section anchors; directory/detail/booking links; gallery filters and empty state; voucher amount preview; native FAQ disclosures; booking required-field errors, back/forward, barber filtering, demo slot, review, and explicit no-save confirmation. Check browser console for runtime errors.
4. Run `npm run build && npm test` once more after visual corrections.
5. Replace stale evidence in `design-qa.md` with the actual date, viewport sizes, routes, interactions tested, observed issues/fixes, and any remaining limitation. Do not mark an unverified interaction as passed.

## Final verification commands

Run from `/Users/macbook/Documents/Rendezvous Landing Page`:

```sh
npm run build
npm test
```

Expected result: Astro static build exits successfully; Node’s test runner reports all dataset, booking-rule, homepage, and route assertions passing with zero failures. Browser checks are manual and must be recorded separately in `design-qa.md`.
