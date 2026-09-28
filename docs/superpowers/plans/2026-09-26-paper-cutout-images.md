> **Dibatalkan (26 September 2026):** efek guntingan kertas sobek sudah diterapkan lalu dicabut atas permintaan pemilik. Gambar kembali ke bentuk semula. Dokumen ini disimpan sebagai catatan saja.

# Paper Cutout Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every in-content image look like a photo printed on torn white paper, slightly tilted, with a soft shadow, per `docs/superpowers/specs/2026-09-26-paper-cutout-images-design.md`.

**Architecture:** A `.paper-cutout` class is added to each existing image wrapper, so current layout classes stay in place. The white paper is a `::before` layer masked by four repeating torn-edge SVG strips plus a centre rectangle. The photo sits inset on top of it, and the wrapper carries tilt (`--tilt`) and a `drop-shadow` that follows the torn outline. The torn strips are generated once by a Node script into `src/styles/paper-tears.css`.

**Tech Stack:** Astro 7, React 19 (Lookbook), plain CSS (no Tailwind utilities), `node --test`.

## Global Constraints

- Tilt range: −2…2 degrees. Values are fixed per image, never random at runtime.
- `data-tear` is always 1–4.
- Hero (`#top`) and Promo (`#promo`) are never cutouts. The booking page is untouched.
- No new JavaScript at runtime and no new raster assets.
- Hover lift only on clickable cutouts (`a.paper-cutout`). `prefers-reduced-motion: reduce` disables the transitions.
- Git is currently blocked by the unaccepted Xcode license, so commit steps are deferred until `sudo xcodebuild -license` has been run.

## File Structure

- Create `scripts/generate-paper-tears.mjs`: deterministic generator for the 4 torn-edge variants.
- Create `src/styles/paper-tears.css`: generated output (per-variant mask custom properties).
- Create `src/styles/paper-cutout.css`: hand-written paper, mask, tilt, shadow, hover, and per-section adjustments.
- Create `src/components/PaperCutout.astro`: wrapper that renders `figure` / `a` / `div` with `paper-cutout`, `data-tear`, and `--tilt`.
- Modify `src/layouts/SiteLayout.astro`: import both CSS files after `campaign.css`.
- Modify the sections and pages listed in Task 2 and Task 3.
- Create `tests/paper-cutout.test.mjs`.

---

### Task 1: Paper cutout foundation (generator, CSS, component)

**Files:**
- Create: `scripts/generate-paper-tears.mjs`, `src/styles/paper-tears.css` (generated), `src/styles/paper-cutout.css`, `src/components/PaperCutout.astro`
- Modify: `src/layouts/SiteLayout.astro`
- Test: `tests/paper-cutout.test.mjs`

**Interfaces:**
- Produces: CSS class `.paper-cutout`; attributes `data-tear="1..4"` and `style="--tilt: Ndeg"`; component `<PaperCutout as? href? tear? tilt? class? ...rest>`; CSS custom properties `--cut-inset` and `--paper-cut`.

- [ ] **Step 1: Write the failing test** (`tests/paper-cutout.test.mjs`)

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("paper cutout styles define the torn mask, tilt, shadow, and reduced motion", () => {
  assert.ok(existsSync(new URL("../src/styles/paper-tears.css", import.meta.url)));
  const tears = read("src/styles/paper-tears.css");
  for (const n of [1, 2, 3, 4]) assert.match(tears, new RegExp(`\\[data-tear="${n}"\\]`));
  const css = read("src/styles/paper-cutout.css");
  assert.match(css, /-webkit-mask-image:/);
  assert.match(css, /mask-composite: add/);
  assert.match(css, /rotate\(var\(--tilt, 0deg\)\)/);
  assert.match(css, /drop-shadow/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(read("src/layouts/SiteLayout.astro"), /paper-cutout\.css/);
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `node --test tests/paper-cutout.test.mjs`
Expected: FAIL (`paper-tears.css` missing).

- [ ] **Step 3: Write the generator** (`scripts/generate-paper-tears.mjs`)

```js
// Menghasilkan src/styles/paper-tears.css: 4 pola pinggiran sobek yang bisa diulang tanpa sambungan.
import { writeFileSync } from "node:fs";

const W = 120;
const H = 16;
const SEEDS = [11, 23, 37, 53];
const SHIFTS = [0, 37, 71, 19];

function rng(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function tearPath(seed) {
  const r = rng(seed);
  const k1 = r() < 0.5 ? 1 : 2;
  const k2 = 3 + Math.floor(r() * 3);
  const p1 = r() * Math.PI * 2;
  const p2 = r() * Math.PI * 2;
  const wave = (x) => 7.5 + 2.2 * Math.sin((2 * Math.PI * k1 * x) / W + p1) + 1.1 * Math.sin((2 * Math.PI * k2 * x) / W + p2);
  const clamp = (y) => Math.max(1, Math.min(13, y));
  const points = [[0, wave(0)]];
  for (let x = 1.5 + r() * 1.7; x < W - 1; x += 1.5 + r() * 1.7) {
    points.push([x, clamp(wave(x) + (r() * 3.2 - 1.6))]);
  }
  points.push([W, wave(0)]);
  return `M0 ${H} ${points.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")} L${W} ${H} Z`;
}

// Strip atas: bagian buram di bawah garis sobek. Sisi lain memakai transformasi path yang sama.
const ORIENTATIONS = {
  t: { w: W, h: H, m: "1 0 0 1 0 0" },
  b: { w: W, h: H, m: `1 0 0 -1 0 ${H}` },
  l: { w: H, h: W, m: "0 1 1 0 0 0" },
  r: { w: H, h: W, m: `0 1 -1 0 ${H} 0` },
};

const toUrl = (svg) => `url("data:image/svg+xml,${svg.replaceAll("<", "%3C").replaceAll(">", "%3E").replaceAll("#", "%23")}")`;

const blocks = SEEDS.map((seed, index) => {
  const d = tearPath(seed);
  const vars = Object.entries(ORIENTATIONS).map(([side, { w, h, m }]) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' preserveAspectRatio='none'><path transform='matrix(${m})' d='${d}'/></svg>`;
    return `  --tear-${side}: ${toUrl(svg)};`;
  });
  const selector = index === 0 ? `.paper-cutout,\n.paper-cutout[data-tear="1"]` : `.paper-cutout[data-tear="${index + 1}"]`;
  return `${selector} {\n${vars.join("\n")}\n  --tear-shift: ${SHIFTS[index]};\n}`;
});

writeFileSync(
  new URL("../src/styles/paper-tears.css", import.meta.url),
  `/* Dihasilkan oleh scripts/generate-paper-tears.mjs. Jangan diedit manual. */\n${blocks.join("\n\n")}\n`,
);
```

- [ ] **Step 4: Run the generator**

Run: `node scripts/generate-paper-tears.mjs && grep -c "data-tear" src/styles/paper-tears.css`
Expected: `4`

- [ ] **Step 5: Write `src/styles/paper-cutout.css`**

```css
/* Guntingan kertas sobek untuk gambar di dalam konten. Pola sobek: paper-tears.css (hasil generate). */
:root {
  --paper-cut: #fbfaf6;
  --cut-inset: clamp(8px, 1vw, 14px);
  --tear-h: var(--cut-inset);
  --tear-w: calc(var(--cut-inset) * 7.5);
  --cut-shadow: drop-shadow(0 1px 1px rgb(17 17 17 / 0.16)) drop-shadow(0 8px 14px rgb(17 17 17 / 0.12));
  --cut-shadow-lifted: drop-shadow(0 2px 2px rgb(17 17 17 / 0.16)) drop-shadow(0 16px 24px rgb(17 17 17 / 0.16));
  --paper-grain: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .4 0 0 0 0 .37 0 0 0 0 .3 0 0 0 .07 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.paper-cutout {
  --shift: calc(var(--tear-shift, 0) * var(--cut-inset) / 16);
  position: relative;
  isolation: isolate;
  display: block;
  margin: 0;
  padding: var(--cut-inset);
  background: transparent !important;
  border-radius: 0 !important;
  overflow: visible !important;
  transform: rotate(var(--tilt, 0deg));
  filter: var(--cut-shadow);
  transition: transform 240ms cubic-bezier(0.2, 0.65, 0.3, 1), filter 240ms ease;
}

.paper-cutout::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--paper-grain), var(--paper-cut);
  background-size: 180px 180px, auto;
  -webkit-mask-image: var(--tear-t), var(--tear-b), var(--tear-l), var(--tear-r), linear-gradient(#000 0 0);
  mask-image: var(--tear-t), var(--tear-b), var(--tear-l), var(--tear-r), linear-gradient(#000 0 0);
  -webkit-mask-size: var(--tear-w) var(--tear-h), var(--tear-w) var(--tear-h), var(--tear-h) var(--tear-w), var(--tear-h) var(--tear-w), calc(100% - 2 * var(--tear-h) + 2px) calc(100% - 2 * var(--tear-h) + 2px);
  mask-size: var(--tear-w) var(--tear-h), var(--tear-w) var(--tear-h), var(--tear-h) var(--tear-w), var(--tear-h) var(--tear-w), calc(100% - 2 * var(--tear-h) + 2px) calc(100% - 2 * var(--tear-h) + 2px);
  -webkit-mask-position: var(--shift) 0, calc(var(--shift) * -2) 100%, 0 calc(var(--shift) * 3), 100% calc(var(--shift) * -1), center;
  mask-position: var(--shift) 0, calc(var(--shift) * -2) 100%, 0 calc(var(--shift) * 3), 100% calc(var(--shift) * -1), center;
  -webkit-mask-repeat: repeat-x, repeat-x, repeat-y, repeat-y, no-repeat;
  mask-repeat: repeat-x, repeat-x, repeat-y, repeat-y, no-repeat;
  mask-composite: add;
}

.paper-cutout > img {
  display: block;
  width: 100%;
}

a.paper-cutout:hover,
a.paper-cutout:focus-visible {
  transform: translateY(-2px) rotate(0deg);
  filter: var(--cut-shadow-lifted);
}

/* Zoom foto lama diganti efek "diangkat" di atas. */
.paper-cutout.paper-cutout:hover img {
  transform: none;
}

/* Philosophy & Services: foto absolute mengisi tinggi kolom. */
.campaign-philosophy__photo.paper-cutout img,
.campaign-services__photo.paper-cutout img {
  top: var(--cut-inset);
  left: var(--cut-inset);
  width: calc(100% - 2 * var(--cut-inset));
  height: calc(100% - 2 * var(--cut-inset));
}

.campaign-services__photo.paper-cutout {
  padding-bottom: calc(var(--cut-inset) + 2.6rem);
}

.campaign-services__photo.paper-cutout img {
  height: calc(100% - 2 * var(--cut-inset) - 2.6rem);
}

.campaign-services__photo.paper-cutout figcaption {
  left: calc(var(--cut-inset) + 0.2rem);
  bottom: calc(var(--cut-inset) * 0.8);
  color: var(--ink);
}

/* Overlay tetap di dalam area foto. */
.paper-cutout .barber-signature {
  top: calc(var(--cut-inset) + 0.75rem);
  left: calc(var(--cut-inset) + 0.7rem);
}

.paper-cutout.barber-entry__image > span {
  left: calc(var(--cut-inset) + 0.6rem);
  bottom: calc(var(--cut-inset) + 0.6rem);
}

.paper-cutout .lookbook-card__caption {
  inset: auto var(--cut-inset) var(--cut-inset);
}

/* Di dalam rail yang di-scroll: bayangan lebih ringan, ruang untuk bayangan. */
.lookbook-rail {
  padding-block: 0.5rem 1rem;
}

.lookbook-rail .paper-cutout {
  filter: drop-shadow(0 4px 6px rgb(17 17 17 / 0.12));
}

.journal-detail__image {
  margin-block: 2.5rem;
}

.journal-detail__image img {
  max-height: 44rem;
  object-fit: cover;
}

@media (max-width: 767px) {
  .campaign-philosophy__photo.paper-cutout img,
  .campaign-services__photo.paper-cutout img {
    width: 100%;
    height: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .paper-cutout {
    transition: none;
  }
}
```

- [ ] **Step 6: Write `src/components/PaperCutout.astro`**

```astro
---
interface Props {
  as?: "figure" | "a" | "div";
  href?: string;
  tear?: number;
  tilt?: number;
  class?: string;
  [attribute: string]: unknown;
}

const { as: Tag = "figure", tear = 1, tilt = 0, class: className, ...rest } = Astro.props;
const safeTear = ((((Math.round(tear) - 1) % 4) + 4) % 4) + 1;
const safeTilt = Math.max(-2, Math.min(2, tilt));
---

<Tag class:list={["paper-cutout", className]} data-tear={safeTear} style={`--tilt: ${safeTilt}deg`} {...rest}>
	<slot />
</Tag>
```

- [ ] **Step 7: Import the CSS in `src/layouts/SiteLayout.astro`** after `import "../styles/campaign.css";`

```astro
import "../styles/paper-tears.css";
import "../styles/paper-cutout.css";
```

- [ ] **Step 8: Run the test and the build**

Run: `node --test tests/paper-cutout.test.mjs && npx astro build`
Expected: PASS, build complete.

- [ ] **Step 9: Commit** (deferred while git is blocked)

```bash
git add scripts/generate-paper-tears.mjs src/styles/paper-tears.css src/styles/paper-cutout.css src/components/PaperCutout.astro src/layouts/SiteLayout.astro tests/paper-cutout.test.mjs
git commit -m "feat: add paper cutout image treatment"
```

---

### Task 2: Apply to homepage sections and Lookbook

**Files:**
- Modify: `src/components/sections/PhilosophySection.astro`, `ServicesSection.astro`, `BranchesSection.astro`, `BarbersSection.astro`, `ArticlesSection.astro`, `src/components/LookbookGallery.tsx`
- Test: `tests/paper-cutout.test.mjs`

**Interfaces:**
- Consumes: `PaperCutout` (Task 1) and the `.paper-cutout` class plus `data-tear` attribute.

- [ ] **Step 1: Add the failing homepage test**

```js
const home = () => read("dist/index.html");
const section = (html, id) => html.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?</section>`))?.[0] ?? "";
const count = (html) => (html.match(/class="[^"]*\bpaper-cutout\b/g) ?? []).length;

test("homepage content images are paper cutouts; hero and promo are not", () => {
  const html = home();
  for (const [id, min] of [["philosophy", 1], ["services", 1], ["branches", 1], ["barbers", 4], ["lookbook", 6], ["articles", 3]]) {
    assert.ok(count(section(html, id)) >= min, `${id} needs ${min} cutouts`);
  }
  assert.equal(count(section(html, "top")), 0);
  assert.equal(count(section(html, "promo")), 0);
  for (const [, tear] of html.matchAll(/data-tear="(\d+)"/g)) assert.ok(tear >= 1 && tear <= 4);
  for (const [, tilt] of html.matchAll(/--tilt: ?(-?[\d.]+)deg/g)) assert.ok(Math.abs(Number(tilt)) <= 2);
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx astro build && node --test tests/paper-cutout.test.mjs`
Expected: FAIL ("philosophy needs 1 cutouts").

- [ ] **Step 3: Philosophy.** Replace the `<figure class="campaign-philosophy__photo">…</figure>` with:

```astro
  <PaperCutout class="campaign-philosophy__photo" tilt={-1.5} tear={1}>
    <img src="/images/photography/barber-client.webp" alt="Barber mengeringkan rambut klien di dalam salon." width="1800" height="2700" loading="lazy" />
  </PaperCutout>
```

Add to the frontmatter: `import PaperCutout from "../PaperCutout.astro";`

- [ ] **Step 4: Services.** Replace `<figure class="campaign-services__photo">` and its closing `</figure>` with `<PaperCutout class="campaign-services__photo" tilt={1.2} tear={2}>` … `</PaperCutout>`, keeping the `img` and `figcaption` inside. Add the import `import PaperCutout from "../PaperCutout.astro";`.

- [ ] **Step 5: Branches.** Replace `<figure class="campaign-space-photo">` … `</figure>` with `<PaperCutout class="campaign-space-photo" tilt={-0.6} tear={3}>` … `</PaperCutout>`, and add the import.

- [ ] **Step 6: Barbers.** Add the import and a tilt list in the frontmatter:

```astro
import PaperCutout from "../PaperCutout.astro";
const barberTilts = [-1, 1.2, -0.8, 1.5];
```

Change the map to `featuredBarbers.map((barber, index) => (`, then replace the `<a class="barber-entry__image" …>` … `</a>` with:

```astro
						<PaperCutout as="a" class="barber-entry__image" href={`/barbers/${barber.slug}/`} aria-label={`Lihat profil ${barber.name}`} tear={index + 1} tilt={barberTilts[index]}>
							<img src={barber.image} alt={barber.imageAlt} width="1122" height="1402" loading="lazy" />
							<BarberSignature paths={barber.signaturePaths} />
						</PaperCutout>
```

- [ ] **Step 7: Articles.** Add the import plus `const articleTilts = [-1, 1, -0.6];`, then replace `<a href={`/journal/${article.slug}/`} class="article-entry__image">…</a>` with:

```astro
						<PaperCutout as="a" href={`/journal/${article.slug}/`} class="article-entry__image" tear={index + 2} tilt={articleTilts[index % 3]}>
							<img src={article.image} alt={`Gambar untuk artikel ${article.title}`} loading="lazy" />
						</PaperCutout>
```

- [ ] **Step 8: Lookbook.** In `LookbookGallery.tsx`, change the card anchor to:

```tsx
              <a
                className="lookbook-card paper-cutout"
                data-tear={(index % 4) + 1}
                href={`/services/${service?.slug ?? "signature-cut"}/`}
              >
```

- [ ] **Step 9: Run tests**

Run: `npx astro build && npm test`
Expected: all pass.

- [ ] **Step 10: Commit** (deferred)

```bash
git add src/components tests/paper-cutout.test.mjs
git commit -m "feat: apply paper cutouts to homepage images"
```

---

### Task 3: Apply to inner pages

**Files:**
- Modify: `src/pages/barbers/index.astro`, `src/pages/barbers/[slug].astro`, `src/pages/journal/index.astro`, `src/pages/journal/[slug].astro`
- Test: `tests/paper-cutout.test.mjs`

- [ ] **Step 1: Add the failing test**

```js
test("barber and journal pages use paper cutouts", () => {
  for (const path of ["barbers/index.html", "barbers/issa/index.html", "journal/index.html", "journal/menemukan-potongan-yang-pas/index.html"]) {
    assert.ok(count(read(`dist/${path}`)) >= 1, `${path} needs a cutout`);
  }
  assert.equal(count(read("dist/booking/index.html")), 0);
});
```

- [ ] **Step 2: Run it and confirm it fails.**

Run: `node --test tests/paper-cutout.test.mjs`. Expected: FAIL on `barbers/index.html`.

- [ ] **Step 3: Barbers index.** Import `PaperCutout`, then replace the `<a class="barber-entry__image" …>` with:

```astro
							<PaperCutout as="a" class="barber-entry__image" href={`/barbers/${barber.slug}/`} tear={index + 1} tilt={index % 2 === 0 ? -1 : 1}>
								<img src={barber.image} alt={barber.imageAlt} loading="lazy" />
								<span>0{index + 1}</span>
							</PaperCutout>
```

- [ ] **Step 4: Barber detail.** Import it, then replace `<div class="detail-page__portrait">…</div>` with:

```astro
					<PaperCutout class="detail-page__portrait" tilt={-0.8} tear={2}>
						<img src={barber.image} alt={barber.imageAlt} />
					</PaperCutout>
```

- [ ] **Step 5: Journal index.** Import it, then replace the image anchor with:

```astro
							<PaperCutout as="a" href={`/journal/${article.slug}/`} class="article-entry__image" tear={index + 1} tilt={index % 2 === 0 ? -1 : 1}>
								<img src={article.image} alt={`Gambar untuk artikel ${article.title}`} loading="lazy" />
							</PaperCutout>
```

- [ ] **Step 6: Journal detail.** Import it, then replace the `<img …>` with:

```astro
				<PaperCutout class="journal-detail__image" tilt={0.8} tear={3}>
					<img src={article.image} alt={`Gambar untuk artikel ${article.title}`} />
				</PaperCutout>
```

- [ ] **Step 7: Run tests.** Run `npx astro build && npm test`. Expected: all pass.

- [ ] **Step 8: Commit** (deferred)

```bash
git add src/pages tests/paper-cutout.test.mjs
git commit -m "feat: apply paper cutouts to barber and journal pages"
```

---

### Task 4: Visual verification

- [ ] Open `http://localhost:4321/` in the browser pane at 1440, 820, and 390px. Check that tears are visible on all four sides of each cutout, the photo keeps a white rim, signatures and captions are not cut off, the Lookbook rail scrolls smoothly with untilted cards, hero and promo are unchanged, and `document.documentElement.scrollWidth === innerWidth`.
- [ ] Check `/barbers/`, `/barbers/issa/`, `/journal/`, and one journal article.
- [ ] Check hover lift on a barber card and keyboard focus outline.
- [ ] Fix anything found, rebuild, and rerun `npm test`.
