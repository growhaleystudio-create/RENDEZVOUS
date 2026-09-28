const SAMPLE_SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

function hasValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validISODate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function getEligibleBarbers({ branchId, serviceId, barbers }) {
  if (!branchId || !serviceId || !Array.isArray(barbers)) return [];
  return barbers.filter(
    (barber) =>
      barber.branchIds.includes(branchId) && barber.serviceIds.includes(serviceId),
  );
}

export function getDemoSlots(date) {
  if (!validISODate(date)) return [];
  return [...SAMPLE_SLOTS];
}

export function validateBookingStep(step, values = {}) {
  const errors = {};

  if (step === 0) {
    if (!hasValue(values.branchId)) errors.branchId = "Pilih cabang terlebih dahulu.";
  } else if (step === 1) {
    if (!hasValue(values.serviceId)) errors.serviceId = "Pilih layanan terlebih dahulu.";
  } else if (step === 2) {
    if (!hasValue(values.barberId)) errors.barberId = "Pilih barber atau siapa saja.";
  } else if (step === 3) {
    const slots = getDemoSlots(values.date);
    if (slots.length === 0) {
      errors.date = "Pilih tanggal yang valid.";
    } else if (!slots.includes(values.slot)) {
      errors.slot = "Pilih salah satu jam yang tersedia.";
    }
  } else if (step === 4) {
    if (!hasValue(values.name)) errors.name = "Masukkan nama kamu.";
    const phoneDigits = typeof values.phone === "string" ? values.phone.replace(/\D/g, "") : "";
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      errors.phone = "Masukkan nomor telepon yang valid.";
    }
  } else if (step === 5) {
    for (const field of ["branchId", "serviceId", "barberId", "date", "slot", "name", "phone"]) {
      if (!hasValue(values[field])) errors[field] = "Lengkapi pilihan ini sebelum meninjau booking.";
    }
    if (values.date && !validISODate(values.date)) errors.date = "Pilih tanggal yang valid.";
    if (values.date && validISODate(values.date) && !getDemoSlots(values.date).includes(values.slot)) {
      errors.slot = "Pilih salah satu jam yang tersedia.";
    }
    if (values.phone && !/^\d{8,15}$/.test(values.phone.replace(/\D/g, ""))) {
      errors.phone = "Masukkan nomor telepon yang valid.";
    }
  }

  return errors;
}

export function formatBookingSummary(values, data) {
  const branch = data.branches.find(({ id }) => id === values.branchId);
  const service = data.services.find(({ id }) => id === values.serviceId);
  const barber = values.barberId === "any"
    ? null
    : data.barbers.find(({ id }) => id === values.barberId);

  return {
    branch: branch?.name ?? "",
    service: service?.name ?? "",
    barber: values.barberId === "any" ? "Siapa saja" : barber?.name ?? "",
    date: values.date ?? "",
    slot: values.slot ?? "",
    price: service?.price ?? 0,
    durationMinutes: service?.durationMinutes ?? 0,
    name: values.name?.trim() ?? "",
    phone: values.phone?.trim() ?? "",
  };
}

// ─── Setelah booking: kalender, booking ulang, pilihan terakhir (tanpa backend) ───

// Selama booking belum terkirim ke sistem cabang, acara kalender ditandai belum dikonfirmasi.
const UNCONFIRMED_SUFFIX = " (belum dikonfirmasi)";
// Jam cabang mengikuti zona waktu kotanya; Bali memakai WITA (UTC+8), sisanya WIB (UTC+7).
const UTC_OFFSET_HOURS_BY_CITY = { Bali: 8 };

export function branchUtcOffsetHours(city) {
  return UTC_OFFSET_HOURS_BY_CITY[city] ?? 7;
}

const pad = (value) => String(value).padStart(2, "0");
const utcStamp = (date) =>
  `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`;

export function buildCalendarEvent(values, data, { confirmed = false } = {}) {
  const branch = data.branches.find(({ id }) => id === values.branchId);
  const service = data.services.find(({ id }) => id === values.serviceId);
  if (!branch || !service || !validISODate(values.date) || !/^\d{2}:\d{2}$/.test(values.slot ?? "")) return null;
  const barber = values.barberId === "any" ? null : data.barbers.find(({ id }) => id === values.barberId);
  const [hour, minute] = values.slot.split(":").map(Number);
  const start = new Date(`${values.date}T00:00:00.000Z`);
  start.setUTCHours(hour - branchUtcOffsetHours(branch.city), minute);
  const end = new Date(start.getTime() + service.durationMinutes * 60_000);
  const withWhom = barber ? ` dengan ${barber.name}` : "";
  const note = confirmed
    ? "Sampai jumpa di kursi."
    : "Jadwal ini belum dikonfirmasi cabang. Hubungi cabang untuk memastikan sebelum datang.";
  return {
    uid: `${values.date}-${values.slot.replace(":", "")}-${branch.id}-${service.id}@rendezvous`,
    title: `${service.name} di Rendezvous ${branch.name}${withWhom}${confirmed ? "" : UNCONFIRMED_SUFFIX}`,
    description: `${service.name}, ${service.durationMinutes} menit. ${note}`,
    location: branch.address,
    start,
    end,
  };
}

const icsText = (value) => String(value).replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

// File .ics dengan dua pengingat bawaan: H-1 dan 2 jam sebelum jadwal.
export function toIcs(event, now = new Date()) {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rendezvous//Booking//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.uid}`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART:${utcStamp(event.start)}`,
    `DTEND:${utcStamp(event.end)}`,
    `SUMMARY:${icsText(event.title)}`,
    `DESCRIPTION:${icsText(event.description)}`,
    `LOCATION:${icsText(event.location)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Besok potong rambut di Rendezvous",
    "TRIGGER:-P1D",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:2 jam lagi potong rambut di Rendezvous",
    "TRIGGER:-PT2H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n") + "\r\n";
}

export function googleCalendarUrl(event) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${utcStamp(event.start)}/${utcStamp(event.end)}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

// Link yang membuka wizard dengan cabang, layanan, dan barber sudah terisi.
export function rebookQuery(values) {
  const params = new URLSearchParams();
  if (values.branchId) params.set("branch", values.branchId);
  if (values.serviceId) params.set("service", values.serviceId);
  if (values.barberId && values.barberId !== "any") params.set("barber", values.barberId);
  const query = params.toString();
  return query ? `?${query}` : "";
}

// Langkah pertama yang masih perlu diisi: tidak mengulang langkah yang sudah terjawab.
export function firstOpenStep(values) {
  if (!values.branchId) return 0;
  if (!values.serviceId) return 1;
  if (!values.barberId) return 2;
  return 3;
}

export const LAST_CHOICE_KEY = "rendezvous:last-booking-choice";

export function saveLastChoice(storage, values) {
  try {
    storage?.setItem(LAST_CHOICE_KEY, JSON.stringify({
      branchId: values.branchId, serviceId: values.serviceId, barberId: values.barberId,
    }));
  } catch {
    // Penyimpanan bisa ditolak (mode privat); pilihan terakhir hanya kemudahan.
  }
}

// Pilihan terakhir hanya dipakai kalau cabang, layanan, dan barbernya masih ada dan masih cocok.
export function readLastChoice(storage, data) {
  let saved;
  try {
    saved = JSON.parse(storage?.getItem(LAST_CHOICE_KEY) ?? "null");
  } catch {
    return null;
  }
  if (!saved || typeof saved !== "object") return null;
  const branch = data.branches.find(({ id }) => id === saved.branchId);
  const service = data.services.find(({ id }) => id === saved.serviceId);
  if (!branch || !service) return null;
  if (saved.barberId !== "any") {
    const barber = data.barbers.find(({ id }) => id === saved.barberId);
    if (!barber || !barber.branchIds.includes(branch.id) || !barber.serviceIds.includes(service.id)) return null;
  }
  return { branchId: branch.id, serviceId: service.id, barberId: saved.barberId };
}
