import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { articles, barbers, branches, services } from "../src/data/demo-content.js";

const routeFiles = [
  "index.html",
  "booking/index.html",
  "services/index.html",
  "branches/index.html",
  "barbers/index.html",
  "journal/index.html",
  ...services.map(({ slug }) => `services/${slug}/index.html`),
  ...branches.map(({ slug }) => `branches/${slug}/index.html`),
  ...barbers.map(({ slug }) => `barbers/${slug}/index.html`),
  ...articles.map(({ slug }) => `journal/${slug}/index.html`),
];

function readBuiltPage(path) {
  const file = fileURLToPath(new URL(`../dist/${path}`, import.meta.url));
  assert.ok(existsSync(file), `expected generated route ${path}`);
  return readFileSync(file, "utf8");
}

test("live entry points stay on the homepage, except working email and phone links", () => {
  for (const path of routeFiles) {
    const html = readBuiltPage(path);
    const anchors = [...html.matchAll(/<a\b[^>]*>/g)].map(([anchor]) => anchor);

    for (const anchor of anchors) {
      const href = anchor.match(/\bhref="([^"]*)"/)?.[1] ?? "";
      assert.ok(
        href === "/" || href.startsWith("/#") || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:"),
        `${path} has an active link outside the homepage/contact: ${anchor}`,
      );
    }

    assert.ok(anchors.some((anchor) => /href="mailto:/.test(anchor)), `${path} should keep email contact active`);
    assert.ok(anchors.some((anchor) => /href="tel:/.test(anchor)), `${path} should keep phone contact active`);
  }
});
