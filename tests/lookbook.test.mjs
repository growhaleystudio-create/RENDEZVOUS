import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { lookbookItems } from "../src/data/demo-content.js";

const filterPath = fileURLToPath(new URL("../src/data/lookbook.js", import.meta.url));

async function loadFilter() {
  assert.ok(existsSync(filterPath), "lookbook filter module must exist");
  return import(pathToFileURL(filterPath));
}

test("the all lookbook filter returns every item in its original order", async () => {
  const { filterLookbookItems } = await loadFilter();
  assert.deepEqual(filterLookbookItems(lookbookItems, "all"), lookbookItems);
});

test("a service filter returns only matching inspiration items without mutating the source", async () => {
  const { filterLookbookItems } = await loadFilter();
  const originalItems = structuredClone(lookbookItems);
  const filtered = filterLookbookItems(lookbookItems, "skin-fade");

  assert.ok(filtered.length > 0);
  assert.ok(filtered.every((item) => item.serviceId === "skin-fade"));
  assert.deepEqual(lookbookItems, originalItems);
});

test("an unknown lookbook filter produces an empty result", async () => {
  const { filterLookbookItems } = await loadFilter();
  assert.deepEqual(filterLookbookItems(lookbookItems, "unknown-service"), []);
});

test("lookbook rail progress maps scroll position to a bounded percentage", async () => {
  const { getLookbookScrollProgress } = await loadFilter();

  assert.equal(getLookbookScrollProgress(250, 1000), 25);
  assert.equal(getLookbookScrollProgress(-100, 1000), 0);
  assert.equal(getLookbookScrollProgress(1200, 1000), 100);
  assert.equal(getLookbookScrollProgress(0, 0), 0);
});

test("lookbook rail progress maps a percentage back to a scroll position", async () => {
  const { getLookbookScrollLeft } = await loadFilter();

  assert.equal(getLookbookScrollLeft(25, 1000), 250);
  assert.equal(getLookbookScrollLeft(-10, 1000), 0);
  assert.equal(getLookbookScrollLeft(120, 1000), 1000);
  assert.equal(getLookbookScrollLeft(50, 0), 0);
});
