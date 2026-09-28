import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { faqs, promo } from "../src/data/demo-content.js";

const bookingWizard = readFileSync(new URL("../src/components/BookingWizard.tsx", import.meta.url), "utf8");

test("homepage copy avoids unsupported timing, availability, and booking guarantees", () => {
  const allCopy = [promo.description, ...faqs.map(({ question, answer }) => `${question} ${answer}`)].join(" ");

  assert.equal(promo.description, "Pilih cabang, layanan, barber, dan waktu kunjungan yang kamu inginkan.");
  assert.doesNotMatch(allCopy, /satu menit|jadwal tercepat|tidak perlu menunggu|tombol Booking di atas/i);
  assert.ok(faqs.some(({ answer }) => answer.includes("Ketersediaan tetap perlu dipastikan ke cabang.")));
});

test("booking labels distinguish a local summary from a confirmed appointment", () => {
  assert.match(bookingWizard, /Jadwal yang ditampilkan belum terhubung ke ketersediaan cabang\./);
  assert.match(bookingWizard, /Permintaan belum dikirim dan jadwal belum dikonfirmasi\./);
  assert.match(bookingWizard, /Data ini hanya ditampilkan di ringkasan; tidak dikirim ke cabang\./);
  assert.match(bookingWizard, /const submitLabels = \["Lanjutkan", "Lanjutkan", "Lanjutkan", "Lanjutkan", "Buat ringkasan"\]/);
  assert.doesNotMatch(bookingWizard, /Booking selesai|Konfirmasi booking|Jam tersedia/);
});
