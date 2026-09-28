import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { articles, branches, lookbookItems, services } from "../src/data/demo-content.js";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const photoExists = (file) => existsSync(new URL(`../public/images/photography/${file}`, import.meta.url));

test("each service photograph depicts its service rather than an unrelated barber portrait", () => {
  const expected = new Map([
    ["signature-cut", "haircut-action.webp"],
    ["skin-fade", "skin-fade-detail.webp"],
    ["hot-towel", "hot-towel-service.webp"],
    ["beard", "portrait-hero.webp"],
    ["royal", "hair-and-beard-service.webp"],
    ["junior", "junior-haircut.webp"],
  ]);
  for (const service of services) {
    assert.equal(service.showcaseImage, expected.get(service.id), service.id);
    assert.ok(photoExists(service.showcaseImage), service.showcaseImage);
    assert.ok(service.showcaseAlt.length > 24, service.id);
  }
});

test("lookbook cards show six distinct finished hairstyles", () => {
  const expected = [
    "look-short-crop.webp",
    "hero-finished-cut.webp",
    "look-textured-quiff-closeup.webp",
    "skin-fade-detail.webp",
    "look-slick-back.webp",
    "look-natural-texture.webp",
  ];
  assert.deepEqual(lookbookItems.map(({ image }) => image.split("/").at(-1)), expected);
  for (const file of expected) assert.ok(photoExists(file), file);
  for (const item of lookbookItems) {
    assert.doesNotMatch(item.alt, /barber (memotong|menata|berdiri|mencukur)/i);
  }
});

test("branch galleries use interiors without claiming stock photos are a specific branch", () => {
  for (const branch of branches) {
    assert.equal(branch.photos.length, 5);
    for (const photo of branch.photos) {
      const file = photo.src.split("/").at(-1);
      assert.match(file, /^interior-[\w-]+\.webp$/);
      assert.ok(photoExists(file), file);
      assert.doesNotMatch(photo.alt, /Rendezvous|Senopati|Menteng|Dago|Seminyak|Graha Famili/i);
    }
  }
});

test("hero, approach, and journal imagery reflect their subject", () => {
  assert.match(read("src/components/EditorialHero.astro"), /hero-finished-cut\.webp/);
  assert.match(read("src/components/sections/PhilosophySection.astro"), /barber-consultation\.webp/);
  assert.match(read("src/components/sections/BranchesSection.astro"), /interior-brick-studio\.webp/);

  assert.deepEqual(articles.map(({ image }) => image.split("/").at(-1)), [
    "barber-result-review.webp",
    "grooming-mirror.webp",
    "hair-texture-portrait.webp",
  ]);
  for (const article of articles) {
    assert.ok(photoExists(article.image.split("/").at(-1)));
    assert.ok(article.imageAlt.length > 24);
  }
});
