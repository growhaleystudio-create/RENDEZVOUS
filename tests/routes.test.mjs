import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { articles, barbers, branches, services } from "../src/data/demo-content.js";

function readBuiltPage(path) {
  const file = fileURLToPath(new URL(`../dist/${path}`, import.meta.url));
  assert.ok(existsSync(file), `expected generated route ${path}`);
  return readFileSync(file, "utf8");
}

function assertDirectory(path, title, records) {
  const html = readBuiltPage(`${path}/index.html`);
  assert.match(html, new RegExp(`<h1[^>]*>${title}</h1>`));
  assert.match(html, /aria-label="Breadcrumb"/);
  for (const record of records) {
    assert.ok(html.includes(record.name ?? record.title), `directory ${path} should show ${record.name ?? record.title}`);
  }
}

function assertDetails(path, records) {
  for (const record of records) {
    const html = readBuiltPage(`${path}/${record.slug}/index.html`);
    assert.ok(html.includes(record.name ?? record.title), `${record.slug} should show its title`);
    assert.match(html, /aria-label="Breadcrumb"/);
    assert.doesNotMatch(html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " "), /prototype|\bdemo\b|contoh|simulasi|sintetis/i);
    assert.match(html, /prototype-link--inert/);
  }
}

test("public directories render navigation and links to every record", () => {
  assertDirectory("services", "Layanan", services);
  assertDirectory("branches", "Cabang", branches);
  assertDirectory("barbers", "Barber", barbers);
  assertDirectory("journal", "Jurnal", articles);
});

test("public detail pages reuse the shared records and provide booking actions", () => {
  assertDetails("services", services);
  assertDetails("branches", branches);
  assertDetails("barbers", barbers);
  assertDetails("journal", articles);
});

test("booking route starts with accessible branch selection and no prototype wording", () => {
  const html = readBuiltPage("booking/index.html");

  assert.match(html, /<h1[^>]*>Rencanakan kunjunganmu\.<\/h1>/);
  assert.match(html, /aria-label="Booking Rendezvous"/);
  assert.match(html, /name="branchId"/);
  assert.match(html, /aria-required="true"/);
  assert.match(html, /aria-current="step"/);
  assert.match(html, /Pilih cabang/);
  assert.doesNotMatch(html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " "), /prototype|\bdemo\b|contoh|simulasi/i);
});
