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
