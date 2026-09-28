import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { services } from "../src/data/demo-content.js";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const visibleText = (html) => html
  .replace(/<script[\s\S]*?<\/script>/g, " ")
  .replace(/<style[\s\S]*?<\/style>/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ");
const serviceDuration = /\b\d+\s*menit\b/i;

test("homepage service cards show prices without haircut durations", () => {
  const html = read("dist/index.html");
  const section = html.match(/<section id="services"[\s\S]*?<\/section>/)?.[0] ?? "";
  const text = visibleText(section);

  assert.ok(section, "homepage services section must exist");
  assert.match(text, /Rp/);
  assert.doesNotMatch(text, serviceDuration);
});

test("service directory and details show prices without haircut durations", () => {
  const directory = visibleText(read("dist/services/index.html"));
  assert.match(directory, /Rp/);
  assert.doesNotMatch(directory, serviceDuration);

  for (const service of services) {
    const detail = visibleText(read(`dist/services/${service.slug}/index.html`));
    assert.match(detail, /Rp/, `${service.slug} should still show its price`);
    assert.doesNotMatch(detail, serviceDuration, `${service.slug} should not show duration`);
  }
});

test("booking choices and review show price, not service duration", () => {
  const source = read("src/components/BookingWizard.tsx");

  assert.doesNotMatch(source, /\{service\.durationMinutes\}\s*menit/);
  assert.doesNotMatch(source, /summary\.durationMinutes/);
  assert.doesNotMatch(source, /Harga\s*\/\s*durasi/);
  assert.match(source, /<dt>Harga<\/dt>/);
  assert.match(source, /formatPrice\.format\(service\.price\)/);
  assert.match(source, /formatPrice\.format\(summary\.price\)/);
  assert.ok(services.every((service) => service.durationMinutes > 0), "booking data keeps durations internally");
});
