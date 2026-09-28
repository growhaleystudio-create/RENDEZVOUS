# Design QA — Layanan Editorial / 27 September 2026

final result: passed

## Reference and comparison

- Source visual truth: `/var/folders/84/4_41vxjs6m98th6kq15ktcs80000gn/T/TemporaryItems/NSIRD_screencaptureui_xXzhVF/Screenshot 2026-09-27 at 17.54.15.png`, 762 × 646 px. It was supplied as a layout reference, not as a 762px CSS breakpoint specification.
- Implementation: `http://localhost:4321/#services`; the 1280 × 1000 CSS-px browser capture was emitted inline in the same comparison input as the source image. The browser tool does not expose a local file path for its screenshot. Both images were compared together; no pixel-exact scaling claim is made because the source is a reduced design image with four cards while the product requires six.
- State: dark service section at its top, no hover. Focused-region review of the first two text/photo pairs and the staggered second row used the same browser capture, where headings, prices, borders, images, and arrows are legible.

## Findings and fidelity surfaces

- No remaining P0/P1/P2 issue in this scoped section. The desktop composition follows the reference's dark ground, four alternating columns, short outlined text cards, portrait photography, and staggered rows; a third row intentionally exposes all six services instead of hiding items in a carousel.
- Typography: the existing campaign Anton headline retains Rendezvous identity; individual service types are the card headlines, with package names demoted to small labels. Text remains readable at desktop and 390/320px mobile widths.
- Spacing and layout: two service pairs per desktop row, one pair per tablet row, and stacked photo-plus-copy cards below 640px. The cards use shorter homepage-specific copy to preserve the reference's airy photo-to-text proportion. The 320px check found a page-width overflow in the existing header; shortening its booking label at that breakpoint removed it. Final document width measured 320px at 320px and 390px at 390px.
- Color and imagery: near-black background, off-white text, thin muted blue-gray outlines, and six local barber photos. The photos are editorial stock already in the project, not generated portraits or claims about actual Rendezvous staff. The last two photos show barbers rather than a literal package or child haircut; this is acceptable prototype imagery but should be replaced if exact service-specific photography becomes available.
- Copy and behavior: all six service types, prices, durations, descriptions, and detail routes render. The Signature Cut card was clicked in the browser and opened its correct detail page with the booking action. No carousel arrows or hidden items. Browser console check returned no warnings or errors.

## Comparison history

1. Initial render had text cards about three-quarters as tall as the portraits, visually denser than the reference. Homepage-only descriptions were shortened and the pair height fixed; the revised desktop capture shows compact cards and clearer alternating negative space.
2. The first decorative barcode icon looked like a tiny scanning frame. It was removed rather than leaving a misleading approximation; card numbering and outlining still provide the reference's editorial treatment.
3. The 320px responsive pass found an unrelated header booking label causing 41px page overflow. The smallest breakpoint now shortens that label to “Booking”; the final browser measurement shows no horizontal page overflow.

## Verification

- `npm run build`: 26 pages generated.
- `npm test`: 51/51 passing, including the new all-six-services homepage check.
- Browser: desktop 1280 × 1000, mobile 390 × 844 and 320 × 720; all six images loaded at their natural widths; all six cards present; correct detail route opened; no console warnings/errors.

## Follow-up polish

- P3: commission or source exact service-specific photographs for the package and children's cut when this prototype becomes production content.

---

# Design QA — Barber Showcase / 25 September 2026

final result: blocked

## Scope and comparison setup

- Source visual truth: `/var/folders/84/4_41vxjs6m98th6kq15ktcs80000gn/T/TemporaryItems/NSIRD_screencaptureui_3Lk96K/Screenshot 2026-09-25 at 15.22.06.png` (1836 × 1414 px, as reported when attached).
- Implementation: `http://localhost:4321/#barbers`.
- In-app-browser captures were reviewed at 1440 × 1000, 820 × 1000, and 390 × 844 CSS px, DPR 1. The browser exposed the captures inline in the task, not as saved image paths.
- The implementation was captured both before section entry (`waiting`, signatures static) and after entry (`writing`). The desktop capture showed four portraits in a row; tablet and mobile showed a horizontal rail with the next portrait peeking in. At 390 px the document width remained 390 px; the rail itself was scrollable.
- Full-view and focused-region source-versus-implementation comparison were not completed. The browser security policy blocked creation of a combined comparison input. Separate image views are not being treated as a comparison, and no alternate capture route was attempted.

## Latest feedback and post-fix evidence

- The user-provided screenshot `/var/folders/84/4_41vxjs6m98th6kq15ktcs80000gn/T/TemporaryItems/NSIRD_screencaptureui_qdtOha/Screenshot 2026-09-25 at 17.14.38.png` (2674 × 906 px before attachment resizing) showed signatures too large and appearing to require per-card hover.
- Root cause: the writing state was triggered by section intersection, but CSS delayed later cards by 1.32 s each (0 / 1.32 / 2.64 / 3.96 s). There was no hover-triggered signature rule; the long stagger made later marks look unavailable.
- Fix: cap the mark at 8rem and 34% of its portrait; remove card and path delays so every signature stroke starts together on the section's one-shot `writing` transition.
- At 1440 × 1000 CSS px / DPR 1, all four portrait frames measured 320 px and each signature measured 109 px (34%). Both paths per signature reported animation delay `0s`, animation name `barber-signature-write`, and no portrait was hovered. At the default 669 × 800 CSS px / DPR 2 preview, the 522 px portrait frame held a 128 px signature (25%); all delays were `0s`, state was `writing`, and no card was hovered. After the requested slowdown, a fresh section-entry run measured all four paths at the same `0.729` dash offset after 250 ms, with a `1.2s` duration and no hover.
- Follow-up on 26 September: removed only the large `04 / 06` header counter. The title, four featured barber cards, and all-six directory link remain; the live preview reports zero counter elements and all four cards.
- Browser console query returned no errors or warnings. The default viewport was restored and the barber section remains open in the local preview.

## Findings

- **[Blocker] Required visual comparison is unavailable.** There is no matched source-plus-render implementation capture, so this report cannot reliably identify or rule out P0/P1/P2 visual drift in type, proportions, crop, palette, or copy hierarchy. **Next step:** provide a supported combined comparison capture (or another approved workflow) so the visual pass can be completed.
- No P0/P1/P2 functional or responsive issue was observed in the independent implementation checks below. This is not a visual-fidelity pass.

## Fidelity surfaces — implementation observations, not source comparisons

- **Typography:** title, barber names, and specialties rendered at all checked widths. Font metrics and exact wrapping versus the reference remain unverified.
- **Spacing and layout:** four-column desktop presentation and single-row tablet/mobile rail rendered without page-level horizontal overflow at the measured widths. Exact margins, card proportions, and source rhythm remain unverified.
- **Colors and tokens:** the showcase and portraits render in a restrained monochrome treatment. Pixel-level palette comparison remains unverified.
- **Image quality:** all featured local portraits loaded at 1122 × 1402 px. They are synthetic prototype portraits and are disclosed as illustrative, not actual staff. Exact crop/tonality comparison remains unverified.
- **Copy and content:** the section explicitly says its portraits, profiles, and signatures are demo illustrations, not representations of real Rendezvous staff.
- **Interaction and accessibility:** keyboard focus and ArrowRight rail movement worked; no page-level overflow was measured. All portrait signatures now start together on the section's `writing` transition, without hover or card/path stagger. The requested slower draw is `1200ms` with a standard ease-in-out curve; live browser measurements confirm synchronized progress. Reduced-motion behavior is covered by a unit test and CSS rule, but was not emulated in the browser.

## Iteration history

1. The first signature timing used a 140 ms card stagger while each stroke animation lasted about 720 ms, which allowed signatures to overlap.
2. The delay was changed to `cardIndex * 1320ms + pathIndex * 480ms`; a regression test now verifies the cards take turns, and browser inspection showed the writing state begins on section entry.
3. The 17:14 user screenshot identified the marks as oversized and the long stagger as hover-like. The mark was reduced; card and path-index delays were removed. Post-fix browser measurements confirm every path has `0s` delay and starts with section entry while all cards are unhovered.
4. The requested component behavior and sizing fix passed focused and full test runs. The user then asked to slow the writing motion; duration is now `1200ms` (`cubic-bezier(0.4, 0, 0.2, 1)`), with all four signatures verified moving in sync at 250 ms. No further visual comparison was judged against the source because the required combined comparison was blocked. The report's overall result therefore remains blocked for that separate fidelity check.

## Implementation checklist

- [x] Build the page and run the complete automated test suite.
- [x] Inspect desktop, tablet, and mobile implementation states; check image loading, keyboard rail movement, overflow, signature entry, and browser console.
- [x] Confirm compact signature sizing and all strokes starting together at section entry with no hover.
- [x] Slow the synchronized signature draw to 1200 ms and verify live progress in the browser.
- [x] Document synthetic portrait/signature disclosure and reduced-motion implementation coverage.
- [ ] Compare the source screenshot and rendered implementation together at matched scale; blocked by browser security policy.
- [ ] Emulate reduced motion in the browser.

## Follow-up

The local preview remains at `http://localhost:4321/#barbers`. The prior campaign and showcase/testimonial QA sections below are preserved as historical reports and do not change this scoped `blocked` result.

---

# Focused QA — Showcase & Testimonials / 25 September 2026

result: updated and verified at the available narrow preview viewport; desktop visual capture was not available during this pass.

## Reference and implementation

- References: the user-provided editorial carousel image at /var/folders/84/4_41vxjs6m98th6kq15ktcs80000gn/T/TemporaryItems/NSIRD_screencaptureui_DJgqW4/Screenshot 2026-09-25 at 11.14.39.png (784 × 496 px), and the scroll-indicator treatment at /var/folders/84/4_41vxjs6m98th6kq15ktcs80000gn/T/TemporaryItems/NSIRD_screencaptureui_uqRDry/Screenshot 2026-09-25 at 14.54.58.png (784 × 496 px).
- Local preview: http://localhost:4321/, observed at 669 × 800 px in the Codex in-app browser. The viewport differs from the reference image, so this is a structural adaptation rather than a pixel-matched comparison.
- Showcase: two-part editorial header, ruled divider, horizontal snap rail using the existing real stock barber photographs, on-image labels, and an accessible range control synchronized with horizontal scrolling.
- Testimonials: same editorial split-header and rule system. Because no reviews are published, the section shows a clear zero-review status card instead of fabricated quotes, identities, or unrelated stock portraits.
- Responsive observation: at 669 px the header stacks, 2 full cards plus a partial next card are visible, and the range control remains available. The rail was moved to both ends through its range control and keyboard Home/End; the visible position followed.
- Indicator: the fine gray track fills black from left to right as the carousel moves, with the dot at the current position and the uppercase caption inline at right. Verified in the 669 px preview; no matched-size desktop capture was available.
- Drag regression found and fixed: the range and cards changed, but the separate decorative marker stayed put because its CSS offset was set on the input rather than the sibling marker's shared wrapper. Replaced it with the range's own filled track and thumb; live range drag moved to 49%, and manual rail scrolling moved to 57%, with cards and fill visibly following in both cases.
- Requested copy removed: the branch photo caption/credit and the services footer's sample price-and-duration note. The branch introduction still identifies its photos and branch details as demo material.
- Prototype copy keeps the photography identified as editorial demo material. Section IDs/order and their CMS-shaped content data remain unchanged.

## Verification

- Fresh npm run build: passed, 26 static pages generated.
- Fresh npm test: passed, 25/25.
- Three pre-existing assertions were stale after the previously approved voucher-section removal and asset migration. Updated only the test expectations to match the active section order and /images/photography/*.webp assets; the voucher demo data itself remains.

---

# Design QA — Campaign Editorial / 25 September 2026

final result: passed

## Current approved scope and comparison

The user selected option 1 (Campaign Editorial). This report supersedes the earlier art-collage audit archived below. Source: `/Users/macbook/.codex/generated_images/01a0c72b-eb33-7210-a633-dcd1b9107f97/exec-91541253-7895-4481-81d8-8155db3da3c4.png`, 920 × 1708 pixels.

Implementation: http://localhost:4321/. Source and browser screenshot were emitted together at a 920px-wide viewport. The viewport was 920 × 1708 CSS px / DPR 1; the screenshot tool returned a vertically capped visible capture, so the philosophy/services and lower sections were inspected separately by scrolling. Browser screenshots are recorded inline in the task, not persisted to disk. No full-height pixel-identical claim is made.

## Fidelity surfaces

- Typography: Anton for the condensed two-line campaign headline, Times New Roman for the lighter editorial serif, DM Sans for UI. Bodoni Moda remains on existing detail/booking layouts. Headline and intro are separate grid columns on desktop and stack on mobile.
- Layout and spacing: compact ruled navigation; 69/31 photo diptych; asymmetrical philosophy and services spreads; portrait-led barbers/lookbook; image-first promo; staggered journal. At 480px and below the hero becomes one full-width landscape portrait to avoid clipping the lettering baked into the photo. No decorative image is used to replace live UI.
- Palette: warm ivory, near-black, muted brick-red actions. The dark promo action uses a light keyboard-focus outline. Controls retain readable labels and visible focus styles.
- Assets: nine generated campaign images inspected individually, with local original PNG and optimized WebP derivatives. Six distinct barber images loaded successfully in the directory. Photos are illustrative demo assets, not verified real staff portraits. No invented establishment year from the mock is rendered.
- Content/IA: all 11 homepage section IDs and ordering retained; directories and detail slugs retained. Homepage previews three services and three barbers with explicit links to all six. Philosophy introduction renders the existing data field after reviewer feedback. Existing booking demo disclosures and unpublished-testimonial state remain.
- Behavior: menu open/Escape/section navigation, Skin Fade filter (1 result) and reset (6), voucher Rp 500.000, FAQ expansion, services directory/detail/preselected booking, complete mobile booking with required-field error, back navigation retaining contact input, review and non-persistent confirmation verified in the browser.

## Responsive and runtime evidence

Inspected at 1440, 920, 768, 390 and 320px widths. Document width matched viewport at the measured 920/768/390/320 widths. Hero and controls visually clear at 1440; mobile services and booking review were inspected at 390. FAQ was rechecked at 920 and 390 after a nested-grid specificity correction. The 320px headline scales without horizontal overflow.

Fresh build: 26 static pages. Fresh tests: 21/21 passed. The retired test only asserted obsolete CSS offsets for the removed collage. Console check after interaction testing returned no warnings or errors. Local preview remains running; no commit, push or publication performed.

## Comparison history and remaining differences

1. Initial campaign comparison found excessive header/section height and a serif title wrapping to three lines. Header sizing, serif metrics and intrinsic image sizing were corrected.
2. Small-screen portrait cropping clipped embedded lettering. The mobile portrait is now shown at its complete landscape ratio.
3. Source review found hardcoded philosophy text bypassing the data field. Restored the original data binding and maintained photo height independently of text length.
4. Lower-page visual inspection found the shared heading grid squeezing the FAQ title. Restored its single-column internal heading layout and visually rechecked.
5. Intentional P3 adaptations: original data descriptions/prices make service rows taller than the mock; original philosophy copy is shorter; regenerated people/photos are directionally matched rather than identical. Desktop retains a menu button for access to every section. No unresolved blocking visual or functional findings were observed in the checked scope. Live CMS synchronization and real booking persistence are outside this local prototype.

---

# Archived QA — previous art-collage design (superseded)

final result: passed

## Comparison setup

- **Source visual truth:** `/var/folders/84/4_41vxjs6m98th6kq15ktcs80000gn/T/TemporaryItems/NSIRD_screencaptureui_SwortI/Screenshot 2026-09-24 at 14.43.36.png` — 1836 × 1414 px.
- **Implementation capture URL:** `http://localhost:4321/` — captured in the selected Codex In-app Browser at 1836 × 1414 CSS px, device pixel ratio 1 (1836 × 1414 output pixels). The source and implementation images were emitted together for a matched-size comparison; the browser capture was reviewed inline and is not persisted as a separate image file.
- **Compared state:** homepage at scroll position 0, light theme, navigation closed, demo content rendered.
- **Responsive checks:** 1440 × 900, 1280 × 720, 1024 × 768, and 390 × 844 CSS px. All measured document widths matched their viewports. On mobile the booking CTA ends at y=830.4 in an 844 px viewport; the Astro dev toolbar is disabled for this project preview.
- **Interaction checks:** navigation opens and closes with Escape; Signature Cut filter shows 5 items and Semua gaya restores 6; voucher preview updates to Rp 500.000; FAQ disclosure expands; booking validation reports a missing branch; the demo journey reaches the review and confirmation screens without persisting or sending data.
- **Runtime:** browser console returned no warnings or errors. `npm run build` generated 26 static pages; `npm test` passed 22 tests.

## Findings

- No actionable P0, P1, or P2 findings remain.
- **P3 / intentional adaptation — imagery and copy:** the reference uses unrelated abstract/art imagery and English labels. This prototype uses local barber/editorial imagery and Rendezvous-specific Indonesian copy, with explicit demo disclosures. It keeps the reference's open editorial structure rather than reproducing the original subject matter.
- **P3 / intentional adaptation — brand accents:** the prototype retains a broad white canvas, high-contrast display type, asymmetrical image collage, sparse editorial copy, horizontal values ribbon, and dark following section. Lavender booking actions and muted brick-red accents adapt that structure to the Rendezvous identity.

## Required fidelity surfaces

- **Typography:** Bodoni Moda provides the high-contrast oversized display face; DM Sans is used for navigation and body copy. The large title retains the three-line hierarchy and italic overlay. In the final desktop capture, its text bounds do not intersect the intro or CTA.
- **Spacing and layout:** the page keeps the generous white space, asymmetric four-image collage, hero copy column, three-item horizontal ribbon, and charcoal next section. The former absolute-position collision is corrected at both reference and medium-desktop widths. At 390 px the copy, tools image, and CTA remain separated, with no horizontal overflow.
- **Colors and tokens:** paper white and near-black dominate. Lavender is reserved for booking actions; muted brick red accents eyebrow labels and details. Existing shared CSS tokens continue to drive these values.
- **Image quality and assets:** hero and content imagery are local files with descriptive alternatives and `object-fit: cover`; the barber imagery is an intentional product-specific substitution for the reference artwork. UI icons use the Phosphor icon set.
- **Copy and content:** Indonesian descriptions explain what visitors can do and consistently label prices, profiles, availability, voucher amounts, and booking as demo data. The testimonials area states that no reviews are published; it does not fabricate ratings or customer quotes.
- **States, accessibility, and behavior:** the menu exposes expanded state and closes with Escape; filters expose pressed state and update results; the booking flow uses labeled controls, required-state and field errors, a review summary, and a clear non-persistence confirmation. Core browser interactions completed successfully.

## Focused region comparison

The same-size homepage captures were reviewed together at the reference viewport. The hero was also checked with measured text and control bounds because the main risk was a headline/CTA collision. Focused region crops were not required after those bounds and the full-size hero were both clear; the page has no dense micro-controls in the source visual.

## Comparison history

1. A previous QA report claimed the title and intro were clear. That claim was inaccurate and is superseded by this report.
2. Fresh browser measurements at 1280 × 720 showed the CTA at x=675.5–884.5, y=567.2–621.6 intersecting the visible “DAY.” text at x=467.5–756.2, y=494.3–713.3. The booking message and headline competed for the same space.
3. The hero intro now moves into the open right-hand column for 1024–1440 px widths; the large-desktop intro is repositioned lower and slightly right. At 1280 × 720 the revised copy and CTA no longer intersect any title line.
4. At the matched 1836 × 1414 viewport, the accent text ends at y=620.6 and the intro paragraph begins at y=625.4; the CTA also clears the lower title line horizontally. The image collage, values ribbon, and transition to the charcoal section remain legible.
5. The mobile CTA initially fell 10 px below the fold and was covered by Astro's debug toolbar. The mobile image and intro were moved up together to preserve their gap, and the project-scoped toolbar was disabled. The final 390 × 844 capture places the entire CTA above the fold with 13.6 px clearance.

## Implementation checklist

- [x] Compare the source and rendered homepage at 1836 × 1414 and DPR 1.
- [x] Inspect typography, layout rhythm, palette, imagery, icons, copy, and demo disclosures.
- [x] Check 1440, 1280, 1024, and 390 px responsive widths for overlap and horizontal overflow.
- [x] Exercise menu, lookbook filter, voucher preview, FAQ, booking validation, and the complete local booking simulation.
- [x] Confirm browser console is clean and verify the static build and test suite.

## Follow-up polish

- P3 only: if a later iteration wants closer visual matching beyond the approved structural reference, source or commission artwork with the reference's abstract-art treatment. Current barber imagery is intentional for this product prototype.
