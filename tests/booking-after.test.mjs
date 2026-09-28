import assert from "node:assert/strict";
import test from "node:test";
import * as data from "../src/data/demo-content.js";
import {
  buildCalendarEvent, firstOpenStep, googleCalendarUrl, LAST_CHOICE_KEY,
  readLastChoice, rebookQuery, saveLastChoice, toIcs,
} from "../src/data/booking-demo.js";

const booking = { branchId: "senopati", serviceId: "signature-cut", barberId: "issa", date: "2026-10-02", slot: "14:00" };

test("calendar event uses the branch's local time and the service duration", () => {
  const jakarta = buildCalendarEvent(booking, data);
  assert.equal(jakarta.start.toISOString(), "2026-10-02T07:00:00.000Z", "14:00 WIB = 07:00 UTC");
  assert.equal(jakarta.end.getTime() - jakarta.start.getTime(), 40 * 60_000);
  const bali = buildCalendarEvent({ ...booking, branchId: "seminyak", barberId: "hamo" }, data);
  assert.equal(bali.start.toISOString(), "2026-10-02T06:00:00.000Z", "14:00 WITA = 06:00 UTC");
  assert.equal(buildCalendarEvent({ ...booking, slot: "" }, data), null);
});

test("an unconfirmed booking is never presented as a confirmed appointment", () => {
  const unconfirmed = buildCalendarEvent(booking, data);
  assert.match(unconfirmed.title, /\(belum dikonfirmasi\)$/);
  assert.match(unconfirmed.description, /belum dikonfirmasi cabang/);
  const confirmed = buildCalendarEvent(booking, data, { confirmed: true });
  assert.doesNotMatch(confirmed.title, /belum dikonfirmasi/);
});

test(".ics carries the event and reminders the day before and two hours before", () => {
  const ics = toIcs(buildCalendarEvent(booking, data), new Date("2026-09-28T00:00:00Z"));
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /DTSTART:20261002T070000Z\r\n/);
  assert.match(ics, /DTEND:20261002T074000Z\r\n/);
  assert.match(ics, /TRIGGER:-P1D\r\n/);
  assert.match(ics, /TRIGGER:-PT2H\r\n/);
  assert.match(ics, /LOCATION:Area Senopati\\, Jakarta\r\n/, "commas are escaped");
  assert.match(ics, /END:VCALENDAR\r\n$/);
});

test("Google Calendar link is prefilled with the same event", () => {
  const url = new URL(googleCalendarUrl(buildCalendarEvent(booking, data)));
  assert.equal(url.origin, "https://calendar.google.com");
  assert.equal(url.searchParams.get("dates"), "20261002T070000Z/20261002T074000Z");
  assert.match(url.searchParams.get("text"), /Signature Cut di Rendezvous Senopati dengan Issa/);
});

test("rebooking opens the wizard at the first step still to answer", () => {
  assert.equal(rebookQuery(booking), "?branch=senopati&service=signature-cut&barber=issa");
  assert.equal(rebookQuery({ ...booking, barberId: "any" }), "?branch=senopati&service=signature-cut");
  assert.equal(firstOpenStep({ branchId: "senopati", serviceId: "signature-cut", barberId: "issa" }), 3, "straight to Jadwal");
  assert.equal(firstOpenStep({ branchId: "senopati", serviceId: "signature-cut" }), 2);
  assert.equal(firstOpenStep({}), 0);
});

test("the last choice is remembered only while it is still bookable", () => {
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  saveLastChoice(storage, booking);
  assert.deepEqual(readLastChoice(storage, data), { branchId: "senopati", serviceId: "signature-cut", barberId: "issa" });
  store.set(LAST_CHOICE_KEY, JSON.stringify({ branchId: "dago", serviceId: "signature-cut", barberId: "issa" }));
  assert.equal(readLastChoice(storage, data), null, "Issa does not work at Dago");
  store.set(LAST_CHOICE_KEY, "{broken");
  assert.equal(readLastChoice(storage, data), null);
  const blocked = { getItem: () => { throw new Error("denied"); }, setItem: () => { throw new Error("denied"); } };
  assert.doesNotThrow(() => saveLastChoice(blocked, booking));
  assert.equal(readLastChoice(blocked, data), null);
});
