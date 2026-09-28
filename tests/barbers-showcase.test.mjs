import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { barbers } from "../src/data/demo-content.js";

const homepagePath = new URL("../dist/index.html", import.meta.url);
const directoryPath = new URL("../dist/barbers/index.html", import.meta.url);

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

	test("homepage features four of six barbers without prototype disclaimers", () => {
	const html = readFileSync(homepagePath, "utf8");
	const section = html.match(/<section id="barbers"[\s\S]*?<\/section>/)?.[0] ?? "";
	const sectionText = section.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ");
	assert.equal((section.match(/class="barber-entry"/g) ?? []).length, 4);
	assert.doesNotMatch(sectionText, /04\s*\/\s*06/, "the large featured-barber counter should be removed");
	assert.doesNotMatch(sectionText, /sintetis|ilustrasi demo|prototype|\bdemo\b/i);
	assert.equal((section.match(/class="barber-signature"/g) ?? []).length, 4);
	assert.match(section, /Kenali semua 6 barber/);
	assert.doesNotMatch(section, /href="\/barbers\//);
});

test("signature reveal waits for intersection and starts only once", async () => {
	const revealUrl = new URL("../src/scripts/barber-signature-reveal.js", import.meta.url);
	assert.ok(existsSync(fileURLToPath(revealUrl)), "reveal helper must exist before behavior can be tested");
	const { observeBarberSignatures } = await import(revealUrl.href);
	let callback;
	class TestObserver {
		constructor(onEntries) {
			callback = onEntries;
			this.disconnected = false;
		}
		observe(target) {
			this.target = target;
		}
		disconnect() {
			this.disconnected = true;
		}
	}
	const section = { dataset: {} };
	const observer = observeBarberSignatures(section, {
		prefersReducedMotion: false,
		IntersectionObserverClass: TestObserver,
	});
	assert.equal(section.dataset.signatureState, "waiting");
	callback([{ isIntersecting: false, intersectionRatio: 0 }]);
	assert.equal(section.dataset.signatureState, "waiting");
	callback([{ isIntersecting: true, intersectionRatio: 0.25 }]);
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
		IntersectionObserverClass: class {
			constructor() {
				throw new Error("must not observe");
			}
		},
	});
	assert.equal(result, null);
	assert.equal(section.dataset.signatureState, undefined);
});

test("all signature cards begin writing together when the section enters", () => {
	const styles = readFileSync(new URL("../src/styles/campaign.css", import.meta.url), "utf8");
	const writingRule = styles.match(
		/#barbers\[data-signature-state="writing"\] \.barber-signature path\s*\{([^}]+)\}/,
	)?.[1] ?? "";
	assert.match(writingRule, /animation: barber-signature-write var\(--dur-draw\) var\(--ease-in-out\) var\(--dur-base\) both;/);
	assert.doesNotMatch(writingRule, /calc\(|signature-(?:card|path)-index/, "all cards and strokes must start together");
	assert.doesNotMatch(styles, /barber-signature[^{}]*:hover/, "signature reveal must not depend on hover");
});

test("barber signatures stay compact within each portrait", () => {
	const styles = readFileSync(new URL("../src/styles/campaign.css", import.meta.url), "utf8");
	assert.match(styles, /\.barber-signature\s*\{[^}]*width: min\(34%, 8rem\)/s);
});

test("directory and barber details reuse portraits without prototype disclaimers", () => {
	const directoryHtml = readFileSync(directoryPath, "utf8");
	assert.doesNotMatch(directoryHtml.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " "), /sintetis|prototype/i);
	for (const barber of barbers) {
		assert.ok(!directoryHtml.includes(`href="/barbers/${barber.slug}/"`));
		assert.ok(directoryHtml.includes(`src="${barber.image}"`));

		const detailPath = new URL(`../dist/barbers/${barber.slug}/index.html`, import.meta.url);
		const detailHtml = readFileSync(detailPath, "utf8");
		assert.ok(detailHtml.includes(`src="${barber.image}"`));
		assert.doesNotMatch(detailHtml.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " "), /sintetis|prototype/i);
	}
});
