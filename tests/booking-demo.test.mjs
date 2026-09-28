import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import { barbers, branches, services } from "../src/data/demo-content.js";

const rulesPath = fileURLToPath(new URL("../src/data/booking-demo.js", import.meta.url));

async function loadRules() {
  assert.ok(existsSync(rulesPath), "booking rules module must exist");
  return import(pathToFileURL(rulesPath));
}

test("eligible barbers are limited to the selected branch and service", async () => {
  const { getEligibleBarbers } = await loadRules();
  const eligible = getEligibleBarbers({
    branchId: "senopati",
    serviceId: "skin-fade",
    barbers,
  });

  assert.ok(eligible.some((barber) => barber.id === "issa"));
  assert.ok(eligible.some((barber) => barber.id === "raka"));
  assert.ok(eligible.every((barber) => barber.branchIds.includes("senopati")));
  assert.ok(eligible.every((barber) => barber.serviceIds.includes("skin-fade")));
  assert.ok(!eligible.some((barber) => barber.id === "cesar"));
});

test("barber step accepts an eligible barber or the siapa saja choice", async () => {
  const { validateBookingStep } = await loadRules();
  assert.deepEqual(validateBookingStep(2, { barberId: "any" }), {});
  assert.deepEqual(validateBookingStep(2, { barberId: "issa" }), {});
  assert.ok(validateBookingStep(2, { barberId: "" }).barberId);
});

test("booking steps return field-keyed errors for missing or malformed input", async () => {
  const { validateBookingStep } = await loadRules();

  assert.ok(validateBookingStep(0, {}).branchId);
  assert.ok(validateBookingStep(1, {}).serviceId);
  assert.ok(validateBookingStep(3, {}).date);
  assert.ok(validateBookingStep(3, { date: "2026-09-30" }).slot);
  assert.ok(validateBookingStep(4, { name: "  ", phone: "12" }).name);
  assert.ok(validateBookingStep(4, { name: "Rani", phone: "12" }).phone);
  assert.deepEqual(validateBookingStep(4, { name: " Rani ", phone: "+62 812 3456 7890" }), {});
  assert.ok(validateBookingStep(5, {}).branchId);
});

test("demo slots are stable for a valid ISO date and absent for invalid dates", async () => {
  const { getDemoSlots } = await loadRules();
  const first = getDemoSlots("2026-09-30");

  assert.ok(first.length > 0);
  assert.ok(first.every((slot) => /^\d{2}:\d{2}$/.test(slot)));
  assert.deepEqual(getDemoSlots("2026-09-30"), first);
  assert.deepEqual(getDemoSlots("2026-02-30"), []);
  assert.deepEqual(getDemoSlots("not-a-date"), []);
});

test("booking summary resolves current entities and sample price/duration", async () => {
  const { formatBookingSummary } = await loadRules();
  const summary = formatBookingSummary(
    {
      branchId: "senopati",
      serviceId: "signature-cut",
      barberId: "issa",
      date: "2026-09-30",
      slot: "10:00",
      name: "Rani",
      phone: "+62 812-3456-7890",
    },
    { branches, services, barbers },
  );

  assert.equal(summary.branch, "Senopati");
  assert.equal(summary.service, "Signature Cut");
  assert.equal(summary.barber, "Issa");
  assert.equal(summary.price, 180000);
  assert.equal(summary.durationMinutes, 40);
  assert.equal(summary.date, "2026-09-30");
  assert.equal(summary.slot, "10:00");
});

test("booking summary labels an unassigned barber as siapa saja", async () => {
  const { formatBookingSummary } = await loadRules();
  const summary = formatBookingSummary(
    { branchId: "dago", serviceId: "skin-fade", barberId: "any" },
    { branches, services, barbers },
  );

  assert.equal(summary.barber, "Siapa saja");
});
