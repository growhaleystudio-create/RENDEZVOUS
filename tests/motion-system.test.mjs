import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { branches } from "../src/data/demo-content.js";
import { MOTION, smoothTowards } from "../src/scripts/motion-tokens.js";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const motionCss = read("src/styles/motion.css");
const styleFiles = readdirSync(new URL("../src/styles/", import.meta.url)).filter((name) => name.endsWith(".css"));

test("CSS and JS motion tokens agree", () => {
  const token = (name) => motionCss.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim();
  assert.equal(token("ease-out"), MOTION.easeOut);
  assert.equal(token("ease-reveal"), MOTION.easeReveal);
  assert.equal(token("dur-reveal"), `${MOTION.revealMs}ms`);
  assert.equal(token("stagger"), `${MOTION.staggerMs}ms`);
  assert.equal(token("reveal-distance"), `${MOTION.revealDistancePx}px`);
});

test("no stylesheet invents its own duration or curve", () => {
  for (const file of styleFiles.filter((name) => name !== "motion.css")) {
    const css = read(`src/styles/${file}`).replace(/\/\*[\s\S]*?\*\//g, "").replace(/0\.01ms/g, "");
    assert.doesNotMatch(css, /\d+ms/, `${file} has a literal duration — use a --dur-* token`);
    assert.doesNotMatch(css, /cubic-bezier|(?<![-\w])ease(?:-in|-out|-in-out)?(?![-\w])/, `${file} has a literal easing — use an --ease-* token`);
  }
});

test("hero photos never pop when motion starts and scroll parallax is transform-only", () => {
  const hero = read("src/styles/editorial-motion.css");
  assert.doesNotMatch(hero, /data-editorial-motion="active"\][^{]*img/, "base scale must apply from first paint");
  assert.doesNotMatch(hero, /clip-path:[^;]*--hero-progress/, "no per-frame clip-path on scroll");
});

test("one reveal system: the promo-specific reveal is gone", () => {
  assert.equal(existsSync(new URL("../src/scripts/promo-motion-reveal.js", import.meta.url)), false);
  assert.doesNotMatch(read("dist/index.html"), /data-motion-state/);
  assert.match(read("src/scripts/editorial-motion.js"), /promo-swiss__body/);
});

test("branch peek swaps prebuilt stacks instead of image sources", () => {
  const html = read("dist/index.html");
  assert.equal((html.match(/class="branch-peek__stack"/g) ?? []).length, branches.length);
  assert.doesNotMatch(html, /data-photos=/);
  const script = read("src/scripts/branch-drawers.js");
  assert.doesNotMatch(script, /\.src\s*=/);
  assert.match(script, /smoothTowards/);
});

test("smoothing is frame-rate independent", () => {
  const oneFrame = smoothTowards(0, 100, 16);
  const twoHalfFrames = smoothTowards(smoothTowards(0, 100, 8), 100, 8);
  assert.ok(Math.abs(oneFrame - twoHalfFrames) < 1e-9, "60Hz and 120Hz must travel the same distance");
});

test("photo hover lives in one place", () => {
  for (const file of styleFiles.filter((name) => name !== "motion.css")) {
    const css = read(`src/styles/${file}`);
    assert.doesNotMatch(css, /(barber-entry__image|article-entry__image|lookbook-card|campaign-service-pair__photo)[^{]*:hover[^{]*\{[^}]*scale\(/, `${file} still defines a photo hover zoom`);
  }
});
