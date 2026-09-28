import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { services } from "../src/data/demo-content.js";

const html = readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const campaignStyles = readFileSync(new URL("../src/styles/campaign.css", import.meta.url), "utf8");
const globalStyles = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf8");
const promoStyles = readFileSync(new URL("../src/styles/promo.css", import.meta.url), "utf8");
const pageText = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const sectionOrder = [
  "top",
  "philosophy",
  "services",
  "branches",
  "barbers",
  "lookbook",
  "promo",
  "articles",
  "faq",
];

test("homepage presents the editorial identity, navigation, and no prototype wording", () => {
  assert.match(html, /<html lang="id">/);
  assert.match(html, /aria-label="Navigasi utama"/);
  assert.match(pageText, /Rendezvous/);
  assert.doesNotMatch(pageText, /prototype|\bdemo\b|contoh|simulasi|sintetis/i);
  assert.match(html, /class="button button--primary[^"]* prototype-link--inert"/);
});

test("footer keeps contact and remaining navigation while omitting the removed lower band and services group", () => {
  const footer = html.match(/<footer class="site-footer"[\s\S]*?<\/footer>/)?.[0] ?? "";
  assert.match(footer, /aria-label="Navigasi footer"/);
  assert.equal((footer.match(/class="site-footer__link-group"/g) ?? []).length, 2);
  assert.match(footer, /<h2>Jelajahi<\/h2>/);
  assert.match(footer, /<h2>Lainnya<\/h2>/);
  assert.match(globalStyles, /\.site-footer__navigation\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s);
  assert.doesNotMatch(globalStyles, /site-footer__(?:action|action-inner|cta|bottom|description|policies|copyright|policy-disclosures)/);
  assert.doesNotMatch(footer, /<h2>Layanan<\/h2>/);
  assert.doesNotMatch(footer, /site-footer__(?:action|cta|bottom|policies|policy-disclosures)/);
  assert.doesNotMatch(footer, /id="policy-(?:privacy|terms|hygiene)"/);
  assert.match(footer, /aria-label="Kirim email ke hello@example\.com"/);
  assert.match(footer, /aria-label="Telepon \+62 812-3456-7890"/);
  assert.match(footer, /class="site-footer__wordmark" aria-hidden="true">Rendezvous<\/p>/);
});

test("homepage renders all CMS-mapped sections in the approved order", () => {
  const positions = sectionOrder.map((id) => html.indexOf(`id="${id}"`));
  assert.ok(positions.every((position) => position >= 0), "all approved section IDs must render");
  assert.deepEqual(positions, [...positions].sort((a, b) => a - b));

  for (const id of ["services", "branches", "barbers", "lookbook", "articles", "faq"]) {
    assert.ok(html.includes(`href="#${id}"`), `missing in-page link to #${id}`);
  }
  for (const path of ["/services/", "/branches/", "/barbers/", "/journal/", "/booking/"]) {
    assert.ok(!html.includes(`href="${path}`), `homepage should not link to ${path}`);
  }
});

test("hero introduces the editorial brand and guides visitors to booking", () => {
  assert.match(pageText, /A good cut\. A better day\./i);
  assert.match(pageText, /Barbershop untuk potongan yang dibuat sesuai kamu, bukan tren\./);
  assert.match(html, /class="button button--primary campaign-hero__cta prototype-link--inert"[^>]*>\s*<span>Booking sekarang/);
});

test("homepage shows every bookable service with its service type as the headline", () => {
  const section = html.match(/<section id="services"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(section, "services section should render");
  assert.equal(services.length, 6);

  for (const service of services) {
    assert.ok(section.includes(service.showcaseTitle.replaceAll("&", "&amp;")), `${service.name} should remain visible`);
    assert.ok(!section.includes(`href="/services/${service.slug}/"`), `${service.name} should not navigate away`);
  }

  assert.match(section, /<h3[^>]*>\s*<span[^>]*>Potong Rambut<\/span>/);
  assert.doesNotMatch(section, /<h3[^>]*>\s*<a[^>]*>Skin Fade<\/a>/);
});

test("booking invitation uses a full-width centered landscape photo above the CTA copy", () => {
  const promo = html.match(/<section id="promo"[\s\S]*?<\/section>/)?.[0] ?? "";
  const photoRule = promoStyles.match(/\.promo-swiss__photo\s*\{[^}]*\}/)?.[0] ?? "";
  const mediaRule = promoStyles.match(/\.promo-swiss__media\s*\{[^}]*\}/)?.[0] ?? "";
  const bodyRule = promoStyles.match(/\.promo-swiss__body\s*\{[^}]*\}/)?.[0] ?? "";
  assert.match(promo, /src="\/images\/photography\/barbers-chair-team\.jpg"/);
  assert.match(promo, /alt="Kursi barber menghadap ke depan dengan enam barber berdiri di belakangnya\."/);
  assert.match(promo, /width="1536" height="1024"/);
  assert.match(promo, /<\/div><div class="promo-swiss__media"><img class="promo-swiss__photo"/);
  assert.match(promo, /<div class="editorial-shell">\s*<div class="promo-swiss__body"/);
  assert.match(photoRule, /width:\s*100%/);
  assert.match(photoRule, /height:\s*100%/);
  assert.match(photoRule, /object-position:\s*center/);
  assert.doesNotMatch(photoRule, /padding:/);
  assert.match(mediaRule, /aspect-ratio:\s*3\s*\/\s*2/);
  assert.match(mediaRule, /overflow:\s*hidden/);
  assert.doesNotMatch(bodyRule, /grid-column:/);
});

test("testimonials stay hidden until real reviews are published", () => {
  assert.doesNotMatch(html, /id="testimonials"/);
  assert.doesNotMatch(pageText, /Pelanggan Contoh|Kutipan fiktif|4\.9\s*\/\s*5/i);
});

test("editorial imagery is local, descriptive, and paired with CMS-mapped content", () => {
  assert.match(html, /src="\/images\/photography\/[^"]+\.webp"/);
  assert.match(html, /alt="[^"]{12,}"/);
  assert.match(html, /id="services"/);
  assert.match(html, /id="lookbook"/);
});

test("branch photo attribution and sample price note are omitted from the page", () => {
  assert.doesNotMatch(pageText, /Ruang referensi|Photo: Nathon Oski|Harga & durasi contoh/i);
});

test("showcase uses a horizontal rail with an accessible progress control", () => {
  assert.match(html, /class="lookbook-rail"/);
  assert.doesNotMatch(html, /class="lookbook-rail-control__indicator"/);
  assert.match(html, /<input[^>]*type="range"[^>]*style="--range-progress:0%"/);
  assert.match(campaignStyles, /linear-gradient\(to right, var\(--ink\) 0%, var\(--ink\) var\(--range-progress\), var\(--rule\) var\(--range-progress\), var\(--rule\) 100%\)/);
  assert.match(html, /aria-label="Posisi galeri inspirasi gaya"/);
  assert.ok((html.match(/class="editorial-rail-heading"/g) ?? []).length >= 1);
});
