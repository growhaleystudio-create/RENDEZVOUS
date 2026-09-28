import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const promoStyles = readFileSync(new URL("../src/styles/promo.css", import.meta.url), "utf8");

// The promo copy now rises with the shared reveal system (see motion-system.test.mjs).
test("promo photo uses a progressive native scroll timeline with reduced-motion fallback", () => {
	assert.match(promoStyles, /@supports\s*\(animation-timeline:\s*view\(\)\)/);
	assert.match(promoStyles, /animation-timeline:\s*view\(\)/);
	assert.match(promoStyles, /animation-range:\s*entry 0% exit 100%/);
	assert.match(promoStyles, /@media\s*\(prefers-reduced-motion:\s*no-preference\)/);
	assert.match(promoStyles, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});
