import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const PROTOTYPE_WORDING = /prototype|\bdemo\b|contoh|simulasi|sintetis/i;

const contentPath = fileURLToPath(
  new URL("../src/data/demo-content.js", import.meta.url),
);

async function loadContent() {
  assert.ok(existsSync(contentPath), "demo-content.js must exist");
  return import(pathToFileURL(contentPath));
}

test("exports CMS-shaped homepage collections and approved section order", async () => {
  const content = await loadContent();

  for (const name of [
    "siteSettings",
    "homepage",
    "services",
    "branches",
    "barbers",
    "lookbookItems",
    "promo",
    "testimonials",
    "voucher",
    "articles",
    "faqs",
    "policies",
  ]) {
    assert.ok(name in content, `missing ${name} export`);
  }

  assert.deepEqual(content.homepage.sectionOrder, [
    "top",
    "philosophy",
    "services",
    "branches",
    "barbers",
    "lookbook",
    "promo",
    "testimonials",
    "articles",
    "faq",
  ]);
});

test("service, branch, and barber records have unique stable identifiers and clean public copy", async () => {
  const { services, branches, barbers } = await loadContent();

  for (const [label, records] of Object.entries({ services, branches, barbers })) {
    assert.ok(records.length > 0, `${label} should not be empty`);
    assert.equal(new Set(records.map(({ id }) => id)).size, records.length);
    assert.equal(new Set(records.map(({ slug }) => slug)).size, records.length);
    for (const record of records) {
      assert.ok(record.id, `${label} record needs an id`);
      assert.match(record.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      assert.equal("demoLabel" in record, false);
    }
  }

  for (const service of services) {
    assert.ok(service.name);
    assert.ok(service.description);
    assert.ok(Array.isArray(service.benefits));
    assert.ok(service.price > 0);
    assert.ok(service.durationMinutes > 0);
  }

  for (const branch of branches) {
    assert.ok(branch.name);
    assert.ok(branch.city);
    assert.doesNotMatch(`${branch.address} ${branch.hours} ${branch.phone}`, PROTOTYPE_WORDING);
    assert.ok(branch.serviceIds.length > 0);
  }

  for (const barber of barbers) {
    assert.ok(barber.name);
    assert.ok(barber.bio);
    assert.doesNotMatch(`${barber.bio} ${barber.imageAlt}`, PROTOTYPE_WORDING);
    assert.ok(barber.branchIds.length > 0);
    assert.ok(barber.specialties.length > 0);
  }
});

test("relationships resolve and public-facing content reads as final copy", async () => {
  const { services, branches, barbers, lookbookItems, articles, faqs, voucher } =
    await loadContent();
  const serviceIds = new Set(services.map(({ id }) => id));
  const branchIds = new Set(branches.map(({ id }) => id));

  for (const branch of branches) {
    for (const serviceId of branch.serviceIds) {
      assert.ok(serviceIds.has(serviceId), `${branch.id} references ${serviceId}`);
    }
  }

  for (const barber of barbers) {
    for (const branchId of barber.branchIds) {
      assert.ok(branchIds.has(branchId), `${barber.id} references ${branchId}`);
    }
    for (const serviceId of barber.serviceIds) {
      assert.ok(serviceIds.has(serviceId), `${barber.id} references ${serviceId}`);
    }
  }

  for (const item of lookbookItems) {
    assert.ok(serviceIds.has(item.serviceId));
    assert.ok(item.image.startsWith("/images/"));
    assert.ok(item.alt.length >= 12);
    assert.doesNotMatch(item.alt, PROTOTYPE_WORDING);
  }

  for (const article of articles) {
    assert.ok(article.category && article.excerpt && article.body);
    assert.doesNotMatch(article.body, PROTOTYPE_WORDING);
  }

  assert.ok(faqs.length >= 4);
  for (const faq of faqs) assert.doesNotMatch(faq.answer, PROTOTYPE_WORDING);
  assert.doesNotMatch(voucher.disclaimer, PROTOTYPE_WORDING);
});

test("draft reviews and unverified claims are never modelled as published proof", async () => {
  const { testimonials } = await loadContent();

  assert.equal(testimonials.published, false);
  assert.deepEqual(testimonials.items, []);
  assert.match(testimonials.notice, /ulasan/i);
  assert.doesNotMatch(testimonials.notice, PROTOTYPE_WORDING);
  assert.equal("rating" in testimonials, false);
  assert.equal("claim" in testimonials, false);
});
