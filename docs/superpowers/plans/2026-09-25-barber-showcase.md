# Barber Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage barber section as a responsive Swiss editorial portrait showcase with six consistent synthetic demo portraits and sequentially drawn SVG signatures.

**Architecture:** Keep the Astro static-content model and current routes. Assign one generated portrait and one authored illustrative SVG path set to each existing barber record; feature the first four on the homepage, while directory and detail routes reuse all six portraits. Use a small native Intersection Observer helper and CSS `stroke-dashoffset` animation, with static visible signatures for reduced motion and JavaScript failure.

**Tech Stack:** Astro 7, JavaScript modules, CSS, built-in ImageGen, Node's built-in test runner, current browser preview. No new runtime dependency.

## Global Constraints

- “Treat the six portraits as synthetic prototype imagery, not photographs or likenesses of actual Rendezvous staff.”
- “No generated photo or signature is to be described as authentic staff imagery or a genuine signature.”
- “Keep section numbering, section order, barber slugs, CMS-shaped fields, booking links, and existing global editorial tokens intact.”
- “Under `prefers-reduced-motion`, show all marks immediately without drawing animation.”
- “At tablet and mobile widths, preserve editorial order and readable captions; use a horizontally scrollable portrait rail with a visible native scrollbar or explicit controls.”

---

## File Map

**Create**

- `public/images/barbers/issa.png`, `stas.png`, `cesar.png`, `hamo.png`, `adit.png`, `raka.png` — individually generated monochrome demo portraits.
- `src/data/barber-signatures.js` — six illustrative SVG path sets keyed by the existing barber IDs.
- `src/components/BarberSignature.astro` — accessible decorative SVG renderer for a signature path set.
- `src/scripts/barber-signature-reveal.js` — one-shot, reduced-motion-aware viewport trigger.
- `tests/barbers-showcase.test.mjs` — data, built-markup, and reveal-trigger regression coverage.

**Modify**

- `src/data/demo-content.js` — point each barber to its generated portrait, accurate alt text, and signature paths.
- `src/components/sections/BarbersSection.astro` — approved editorial header, four featured records, image overlays, accessible rail, and demo disclosure.
- `src/pages/barbers/index.astro` — keep all six portraits and clarify synthetic demo imagery.
- `src/pages/barbers/[slug].astro` — keep portrait consistency and replace obsolete stock-photo copy.
- `src/styles/campaign.css` — homepage portrait grid, responsive rail, signature line-draw choreography, focus and reduced-motion styles.
- `docs/campaign-assets.md` — document the six generated demo assets and their limits.
- `design-qa.md` — append fresh comparison evidence for this section after browser review.

---

### Task 1: Generate and inspect the six portrait assets

**Files:** Create the six PNG assets under `public/images/barbers/`.

- [x] Use the built-in image generator once per barber, with the supplied barber showcase screenshot as a composition/style reference. Keep each prompt distinct: one adult barber per image; chest-up documentary portrait; believable skin and fabric texture; relaxed expression; soft natural light; restrained grayscale; open upper-left area for a separate vector mark; no lettering, logo, tools, watermark, or signature in the photo.
- [x] Inspect every result at full size for facial anatomy, hands/ears where visible, hairline, eyes, skin texture, clothing folds, image crop, duplicated-looking people, and any generated text/artifacts. Reject or iterate any image that reads as synthetic or malformed.
- [x] Copy only the selected result for each ID to `public/images/barbers/<id>.png`; do not overwrite existing files. Keep the generated originals outside the repository if a result is rejected.
- [x] Confirm exactly six files exist and run `file public/images/barbers/*.png` plus `sips -g pixelWidth -g pixelHeight public/images/barbers/*.png`; each must be a valid portrait image before changing application code.

### Task 2: Add failing content and asset tests

**Files:** Create `tests/barbers-showcase.test.mjs`.

- [x] Write the regression tests before changing content or components:

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { barbers } from "../src/data/demo-content.js";

test("each demo barber has a local portrait and a drawable illustrative signature", () => {
  assert.equal(barbers.length, 6);
  for (const barber of barbers) {
    assert.match(barber.image, new RegExp(`^/images/barbers/${barber.id}\\.png$`));
    assert.ok(existsSync(fileURLToPath(new URL(`../public${barber.image}`, import.meta.url))));
    assert.ok(barber.imageAlt.length >= 24);
    assert.ok(barber.signaturePaths.length > 0);
    assert.ok(barber.signaturePaths.every((path) => typeof path === "string" && path.length > 20));
  }
});

test("homepage features four of six barbers and identifies synthetic demo portraits", () => {
  const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
  const section = html.match(/<section id="barbers"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal((section.match(/class="barber-entry"/g) ?? []).length, 4);
  assert.match(section, /04\s*\/\s*06/);
  assert.match(section, /sintetis|ilustratif|demo/i);
  assert.equal((section.match(/class="barber-signature"/g) ?? []).length, 4);
});

test("signature reveal waits for intersection and starts only once", async () => {
  const revealUrl = new URL("../src/scripts/barber-signature-reveal.js", import.meta.url);
  assert.ok(existsSync(fileURLToPath(revealUrl)), "reveal helper must exist before behavior can be tested");
  const { observeBarberSignatures } = await import(revealUrl.href);
  let callback;
  class TestObserver {
    constructor(onEntries) { callback = onEntries; this.disconnected = false; }
    observe(target) { this.target = target; }
    disconnect() { this.disconnected = true; }
  }
  const section = { dataset: {} };
  const observer = observeBarberSignatures(section, {
    prefersReducedMotion: false,
    IntersectionObserverClass: TestObserver,
  });
  assert.equal(section.dataset.signatureState, "waiting");
  callback([{ isIntersecting: false }]);
  assert.equal(section.dataset.signatureState, "waiting");
  callback([{ isIntersecting: true }]);
  assert.equal(section.dataset.signatureState, "writing");
  assert.equal(observer.disconnected, true);
});

test("reduced-motion users receive static signatures without an observer", async () => {
  const revealUrl = new URL("../src/scripts/barber-signature-reveal.js", import.meta.url);
  assert.ok(existsSync(fileURLToPath(revealUrl)), "reveal helper must exist before behavior can be tested");
  const { observeBarberSignatures } = await import(revealUrl.href);
  const section = { dataset: {} };
  const result = observeBarberSignatures(section, {
    prefersReducedMotion: true,
    IntersectionObserverClass: class { constructor() { throw new Error("must not observe"); } },
  });
  assert.equal(result, null);
  assert.equal(section.dataset.signatureState, undefined);
});
```

- [x] Run `npm run build && node --test tests/barbers-showcase.test.mjs` and confirm the new tests fail because the barber records and rendered section do not yet have the requested portraits/signatures/showcase.

### Task 3: Connect the existing barber data to portraits and signature vectors

**Files:** Create `src/data/barber-signatures.js`; modify `src/data/demo-content.js`.

- [x] Export `barberSignaturePaths` as an object with the six stable IDs (`issa`, `stas`, `cesar`, `hamo`, `adit`, `raka`) as keys and non-empty arrays of custom `d` path strings as values. Use separate path strokes for disconnected handwriting marks; do not claim the shapes reproduce real staff signatures.
- [x] Import `barberSignaturePaths` in `demo-content.js`; point `barberPhotos` at `/images/barbers/<id>.png`, write accurate alt descriptions after inspecting each final image, and add `signaturePaths: barberSignaturePaths[id]` to each mapped barber record.
- [x] Run `node --test tests/barbers-showcase.test.mjs`; the local-asset and signature-data test must pass, while the built-markup and reveal tests remain red until their tasks are implemented.

### Task 4: Build the approved editorial showcase and responsive rail

**Files:** Create `src/components/BarberSignature.astro`; modify `src/components/sections/BarbersSection.astro` and `src/styles/campaign.css`.

- [x] Render the `#barbers` section with a ruled header, the existing title, four featured barber entries, and the current all-six directory link. Keep each profile link and specialty text.
- [x] Follow-up (26 September): remove only the large `04 / 06` header counter and its responsive styles; retain the title, featured cards, and directory link.
- [x] In each image link, render the assigned image and `<BarberSignature paths={barber.signaturePaths} />`. The component outputs a decorative `<svg class="barber-signature" aria-hidden="true" focusable="false">` whose paths use `pathLength="1"`; no card/path index or stagger is needed.
- [x] Replace the homepage disclosure with concise Indonesian copy that makes clear these are synthetic demo portraits/profiles and not verified Rendezvous staff information.
- [x] Style four unrounded portrait panels in one desktop row, neutral monochrome presentation, name/specialty captions below, visible keyboard focus, and a horizontally scrollable single-row rail with a visible scrollbar and keyboard focus at tablet/mobile sizes.
- [x] Run `npm run build && node --test tests/barbers-showcase.test.mjs`; confirm the homepage count/markup tests pass.

### Task 5: Draw signatures on section entry and honor reduced motion

**Files:** Create `src/scripts/barber-signature-reveal.js`; modify `src/components/sections/BarbersSection.astro` and `src/styles/campaign.css`.

- [x] Export `observeBarberSignatures(section, { prefersReducedMotion, IntersectionObserverClass = globalThis.IntersectionObserver } = {})`. If the section is absent, reduced motion is requested, or the observer is unavailable, return `null` without hiding content. Otherwise set `data-signature-state="waiting"`, observe once at threshold `0.2`, set state to `writing` on the first intersecting entry, and disconnect immediately.
- [x] Initialize the helper from the Astro client script using `window.matchMedia("(prefers-reduced-motion: reduce)").matches`. Keep paths visible by default so JavaScript failure leaves a usable static section.
- [x] In `campaign.css`, under `@media (prefers-reduced-motion: no-preference)`, hide path strokes only while state is `waiting`; on `writing`, draw every stroke with `stroke-dasharray: 1` / `stroke-dashoffset: 1` to `0`, `forwards`, easing `cubic-bezier(0.4, 0, 0.2, 1)`, in `1200ms`. All cards and paths begin together on section entry, with no hover or stagger. Under `prefers-reduced-motion: reduce`, disable the drawing animation and render every path fully visible.
- [x] Run `node --test tests/barbers-showcase.test.mjs`; both observer tests pass. In-browser, confirm marks stay static before entry and write once in order when the section enters.
- [ ] Emulate reduced motion in the browser and verify all marks remain visible without drawing animation. The helper test and CSS rule pass, but browser emulation was not performed.

### Task 6: Reuse the same portraits and accurate demo copy on barber routes

**Files:** Modify `src/pages/barbers/index.astro`, `src/pages/barbers/[slug].astro`, `docs/campaign-assets.md`, and `tests/barbers-showcase.test.mjs`.

- [x] First extend `tests/barbers-showcase.test.mjs` to assert that the directory links every barber slug and each built detail page contains that barber's assigned `image` URL plus synthetic-demo disclosure. Run `npm run build && node --test tests/barbers-showcase.test.mjs`; confirm the assertions fail on the stale stock-photo disclosure before changing route copy.
- [x] Keep all six existing profile links and slugs in the directory; update its disclosure from “foto stok editorial” to synthetic prototype portraits/profiles.
- [x] Keep each detail route bound to `barber.image`; replace stock-photo language with a concise note that the portrait/profile is synthetic demo content, not a verified Rendezvous staff likeness. Do not change booking query links, services, branch data, or schedules.
- [x] Update `docs/campaign-assets.md` with the six generated local paths and their synthetic-demo purpose; leave existing Unsplash credits unchanged for assets still in use elsewhere.
- [x] Run `npm run build && npm test`; all tests must pass.

### Task 7: Browser review and handoff evidence

**Files:** Modify project-root `design-qa.md`.

- [x] Reuse the Astro preview and open the homepage barber section in the user's existing in-app browser.
- [x] Review desktop composition and mobile/tablet rail; check portrait crop, signature position/draw timing, copy, focus, keyboard rail scrolling, page-level overflow, and browser console. Reduced-motion emulation remains open.
- [ ] Capture the supplied reference and implementation at matching content scale and compare them together. The browser policy blocked the combined comparison input; record the source, available inline capture states, and blocker in `design-qa.md`.
- [x] Record the resolved signature-stagger issue and set `final result: blocked` because the required visual comparison could not be completed.
- [x] Leave the local preview running; do not commit, push, or publish.
