import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const pages = ["index.html", "services/index.html", "services/signature-cut/index.html", "branches/senopati/index.html", "barbers/issa/index.html", "journal/menemukan-potongan-yang-pas/index.html", "booking/index.html"];

test("type.css defines the five text roles", () => {
  const css = read("src/styles/type.css");
  for (const token of ["--text-label", "--text-caption", "--text-body", "--text-lead", "--text-item"]) {
    assert.match(css, new RegExp(`${token}:`), `${token} missing`);
  }
  assert.match(read("src/layouts/SiteLayout.astro"), /type\.css/);
});

test("every rendered button is primary or secondary, square, and uses no legacy variant", () => {
  for (const page of pages) {
    const html = read(`dist/${page}`);
    for (const [, classes] of html.matchAll(/class="([^"]*\bbutton\b[^"]*)"/g)) {
      const list = classes.split(/\s+/);
      if (!list.includes("button")) continue;
      assert.ok(list.includes("button--primary") || list.includes("button--secondary"), `${page}: "${classes}" has no variant`);
      assert.ok(!list.some((c) => /^button--(brand|outline|light|ink|lavender)$/.test(c)), `${page}: legacy variant in "${classes}"`);
    }
  }
  const css = read("src/styles/type.css");
  assert.match(css, /\.button \{[^}]*border-radius: 0/);
});

test("no stylesheet outside type.css restyles .button", () => {
  const dir = new URL("../src/styles/", import.meta.url);
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".css") && name !== "type.css")) {
    const css = read(`src/styles/${file}`);
    assert.doesNotMatch(css, /(^|[\s,}])\.button(--[a-z]+)?\s*(:hover|svg)?\s*\{/m, `${file} still styles .button`);
  }
});
