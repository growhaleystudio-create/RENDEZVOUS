import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { services } from "../src/data/demo-content.js";

const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const promo = html.match(/<section[^>]*id="promo"[\s\S]*?<\/section>/)?.[0] ?? "";
const css = readFileSync(new URL("../src/styles/promo.css", import.meta.url), "utf8");

test("promo stays minimal: one title, one photo, a starting price, one block CTA", () => {
  assert.match(promo, /<h2[^>]*class="promo-swiss__title"/);
  assert.equal((promo.match(/<img/g) ?? []).length, 1);
  assert.doesNotMatch(promo, /promo-specs|promo-steps/);
  const lowest = Math.min(...services.map(({ price }) => price)).toLocaleString("id-ID");
  assert.match(promo, new RegExp(`Rp\\s?${lowest.replace(".", "\\.")}`));
  assert.match(promo, /class="[^"]*\bbutton--primary\b[^"]*\bpromo-swiss__cta\b[^"]*prototype-link--inert[^"]*"/);
  assert.doesNotMatch(promo, /href="\/booking\//);
});

test("promo shares the footer background", () => {
  assert.match(css, /\.promo-swiss \{[^}]*background: var\(--ink\)/);
});

test("images no longer use the torn paper treatment", () => {
  assert.doesNotMatch(html, /paper-cutout|data-tear=/);
});
