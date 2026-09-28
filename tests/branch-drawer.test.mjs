import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { branches } from "../src/data/demo-content.js";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const section = (html, id) => html.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?</section>`))?.[0] ?? "";

test("every branch has five distinct local photos with alt text", () => {
  for (const branch of branches) {
    assert.equal(branch.photos.length, 5, `${branch.id} needs 5 photos`);
    assert.equal(new Set(branch.photos.map(({ src }) => src)).size, 5);
    for (const photo of branch.photos) {
      assert.ok(existsSync(new URL(`../public${photo.src}`, import.meta.url)), `${photo.src} must exist`);
      assert.doesNotMatch(photo.alt, /Rendezvous|Senopati|Menteng|Dago|Seminyak|Graha Famili/i);
    }
  }
});

function assertDrawers(html, label) {
  const drawers = html.match(/<details[^>]*class="branch-drawer"[\s\S]*?<\/details>/g) ?? [];
  assert.equal(drawers.length, branches.length, `${label} renders one drawer per branch`);
  for (const drawer of drawers) {
    assert.match(drawer, /name="branches"/);
    const summary = drawer.match(/<summary[\s\S]*?<\/summary>/)?.[0] ?? "";
    assert.ok(summary, `${label} drawer needs a summary`);
    assert.doesNotMatch(summary, /<a\s/, "links must stay outside the summary");
    assert.match(summary, /Lihat foto referensi interior, bukan foto cabang/);
    assert.doesNotMatch(summary, /Lihat foto cabang/);
    assert.equal((drawer.match(/<img[^>]*loading="lazy"/g) ?? []).length, 5);
  }
  assert.match(html, /class="branch-peek"[^>]*aria-hidden="true"/);
  assert.ok((html.match(/class="branch-row__actions"/g) ?? []).length >= branches.length);
}

test("homepage branch list opens into a photo drawer with a hover peek", () => {
  assertDrawers(section(read("dist/index.html"), "branches"), "homepage");
});

test("branches directory reuses the same drawer list", () => {
  assertDrawers(read("dist/branches/index.html"), "/branches/");
});

test("drawer styles respect reduced motion", () => {
  const css = read("src/styles/branch-drawer.css");
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /::details-content/);
});
