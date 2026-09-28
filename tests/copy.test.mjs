import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { barbers } from "../src/data/demo-content.js";

// Only the page's own content: header and footer are shared chrome.
const text = (path) =>
  (readFileSync(new URL(`../dist/${path}`, import.meta.url), "utf8").match(/<main[\s\S]*?<\/main>/)?.[0] ?? "")
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
const count = (haystack, pattern) => (haystack.match(pattern) ?? []).length;

test("homepage says each thing once", () => {
  const home = text("index.html");
  assert.ok(count(home, /Booking sekarang/g) <= 2, "only the hero and the booking block (plus the nav)");
  assert.ok(count(home, /ritual/gi) <= 1);
  assert.ok(count(home, /personal/gi) <= 1);
  assert.ok(count(home, /cabang, layanan, barber/gi) <= 1);
  assert.ok(count(home, /09\.00–20\.00/g) <= 1);
});

test("inner pages rely on the breadcrumb instead of a repeated brand eyebrow", () => {
  for (const path of ["services/index.html", "branches/index.html", "barbers/index.html", "journal/index.html", "services/signature-cut/index.html", "barbers/issa/index.html", "booking/index.html"]) {
    assert.doesNotMatch(text(path), /Rendezvous \/ /, `${path} still repeats "Rendezvous / …"`);
  }
});

test("every barber has distinct specialties and bio", () => {
  assert.equal(new Set(barbers.map(({ specialties }) => specialties.join())).size, barbers.length);
  assert.equal(new Set(barbers.map(({ bio }) => bio)).size, barbers.length);
});
