import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  formatBookingSummary,
  getDemoSlots,
  getEligibleBarbers,
  validateBookingStep,
} from "../data/booking-demo.js";
import BookingStepIndicator from "./booking/BookingStepIndicator";

type Branch = {
  id: string;
  name: string;
  city: string;
  address: string;
  hours: string;
};

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
};

type Barber = {
  id: string;
  name: string;
  branchIds: string[];
  serviceIds: string[];
  specialties: string[];
};

type BookingValues = {
  branchId: string;
  serviceId: string;
  barberId: string;
  date: string;
  slot: string;
  name: string;
  phone: string;
};

type BookingWizardProps = {
  branches: Branch[];
  services: Service[];
  barbers: Barber[];
};

const steps = ["Cabang", "Layanan", "Barber", "Jadwal", "Kontak", "Tinjau"];
const submitLabels = ["Pilih layanan", "Pilih barber", "Pilih jadwal", "Isi data kontak", "Tinjau pilihan", "Buat ringkasan"];
const initialValues: BookingValues = {
  branchId: "",
  serviceId: "",
  barberId: "",
  date: "",
  slot: "",
  name: "",
  phone: "",
};

const formatPrice = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function getTodayISODate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function formatDate(date: string) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export default function BookingWizard({ branches, services, barbers }: BookingWizardProps) {
  const [values, setValues] = useState<BookingValues>(initialValues);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const branchId = params.get("branch") ?? "";
    const serviceId = params.get("service") ?? "";
    const barberId = params.get("barber") ?? "";
    const branch = branches.find((item) => item.id === branchId);
    const service = services.find((item) => item.id === serviceId);
    const barber = barbers.find((item) => item.id === barberId);
    const canPreselectBarber =
      barber &&
      branch &&
      barber.branchIds.includes(branch.id) &&
      (!service || barber.serviceIds.includes(service.id));

    if (branch || service || canPreselectBarber) {
      setValues((current) => ({
        ...current,
        branchId: branch?.id ?? current.branchId,
        serviceId: service?.id ?? current.serviceId,
        barberId: canPreselectBarber ? barber.id : current.barberId,
      }));
    }
  }, [barbers, branches, services]);

  const eligibleBarbers = useMemo(
    () => getEligibleBarbers({ branchId: values.branchId, serviceId: values.serviceId, barbers }),
    [barbers, values.branchId, values.serviceId],
  );
  const demoSlots = getDemoSlots(values.date);
  const summary = formatBookingSummary(values, { branches, services, barbers });

  function updateValue(field: keyof BookingValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateBookingStep(currentStep, values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
      return;
    }
    setComplete(true);
  }

  function goBack() {
    setErrors({});
    setCurrentStep((step) => Math.max(0, step - 1));
  }

  function restart() {
    setValues(initialValues);
    setErrors({});
    setCurrentStep(0);
    setComplete(false);
  }

  function fieldError(field: keyof BookingValues) {
    return errors[field] ? (
      <p className="booking-error" id={`${field}-error`} role="alert">{errors[field]}</p>
    ) : null;
  }

  return (
    <section className="booking-wizard" aria-label="Booking Rendezvous">
      <div className="booking-wizard__intro">
        <h1>Rencanakan kunjunganmu.</h1>
      </div>

      {complete ? (
        <section className="booking-confirmation" aria-live="polite" aria-labelledby="booking-confirmation-title">
          <p className="section-heading__eyebrow">Ringkasan pilihan</p>
          <h2 id="booking-confirmation-title">Pilihanmu siap, {values.name.trim()}.</h2>
          <p>Ini hanya ringkasan pilihanmu. Permintaan belum dikirim dan jadwal belum dikonfirmasi.</p>
          <p>{formatDate(summary.date)}, pukul {summary.slot}, di {summary.branch}.</p>
          <button className="button button--primary" onClick={restart} type="button">Buat ringkasan lain</button>
        </section>
      ) : (
        <>
          <BookingStepIndicator steps={steps} currentStep={currentStep} />
          <p className="visually-hidden" aria-live="polite">
            Langkah {currentStep + 1} dari {steps.length}: {steps[currentStep]}
          </p>
          <form
            aria-label="Form booking"
            className="booking-form"
            data-step={currentStep}
            onSubmit={handleSubmit}
          >
            {currentStep === 0 && (
              <fieldset className="booking-step-panel">
                <legend>Pilih cabang</legend>
                <label className="booking-field" htmlFor="booking-branch">
                  <span className="visually-hidden">Cabang</span>
                  <select
                    aria-describedby={errors.branchId ? "branchId-error" : undefined}
                    aria-invalid={Boolean(errors.branchId)}
                    aria-required="true"
                    id="booking-branch"
                    name="branchId"
                    onChange={(event) => updateValue("branchId", event.currentTarget.value)}
                    value={values.branchId}
                  >
                    <option value="">Pilih…</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>{branch.name} — {branch.city}</option>
                    ))}
                  </select>
                  {fieldError("branchId")}
                </label>
              </fieldset>
            )}

            {currentStep === 1 && (
              <fieldset className="booking-step-panel">
                <legend>Pilih layanan</legend>
                <div className="booking-choice-list">
                  {services.map((service) => (
                    <label className="booking-choice" key={service.id}>
                      <input
                        aria-describedby={errors.serviceId ? "serviceId-error" : undefined}
                        aria-invalid={Boolean(errors.serviceId)}
                        aria-required="true"
                        checked={values.serviceId === service.id}
                        name="serviceId"
                        onChange={() => {
                          updateValue("serviceId", service.id);
                          setValues((current) => ({ ...current, barberId: "" }));
                        }}
                        type="radio"
                        value={service.id}
                      />
                      <span className="booking-choice__main">
                        <strong>{service.name}</strong>
                        <span>{service.description}</span>
                      </span>
                      <span className="booking-choice__meta">
                        <strong>{formatPrice.format(service.price)}</strong>
                      </span>
                    </label>
                  ))}
                </div>
                {fieldError("serviceId")}
              </fieldset>
            )}

            {currentStep === 2 && (
              <fieldset className="booking-step-panel">
                <legend>Pilih barber</legend>
                <p className="booking-step-panel__hint">Daftar barber mengikuti cabang dan layanan yang kamu pilih.</p>
                <div className="booking-choice-list">
                  <label className="booking-choice">
                    <input
                      checked={values.barberId === "any"}
                      aria-required="true"
                      name="barberId"
                      onChange={() => updateValue("barberId", "any")}
                      type="radio"
                      value="any"
                    />
                    <span className="booking-choice__main"><strong>Siapa saja</strong><span>Pilih opsi ini jika kamu tidak punya preferensi barber.</span></span>
                  </label>
                  {eligibleBarbers.map((barber) => (
                    <label className="booking-choice" key={barber.id}>
                      <input
                        checked={values.barberId === barber.id}
                        aria-required="true"
                        name="barberId"
                        onChange={() => updateValue("barberId", barber.id)}
                        type="radio"
                        value={barber.id}
                      />
                      <span className="booking-choice__main">
                        <strong>{barber.name}</strong>
                        <span>{barber.specialties.join(" · ")}</span>
                      </span>
                    </label>
                  ))}
                </div>
                {eligibleBarbers.length === 0 && (
                  <p className="booking-empty">Pilih cabang dan layanan untuk melihat barber yang dapat dipilih.</p>
                )}
                {fieldError("barberId")}
              </fieldset>
            )}

            {currentStep === 3 && (
              <fieldset className="booking-step-panel">
                <legend>Pilih tanggal dan waktu</legend>
                <label className="booking-field" htmlFor="booking-date">
                  <span>Tanggal kunjungan</span>
                  <input
                    aria-describedby={errors.date ? "date-error" : undefined}
                    aria-invalid={Boolean(errors.date)}
                    aria-required="true"
                    id="booking-date"
                    min={getTodayISODate()}
                    name="date"
                    onChange={(event) => {
                      updateValue("date", event.currentTarget.value);
                      setValues((current) => ({ ...current, slot: "" }));
                    }}
                    type="date"
                    value={values.date}
                  />
                  {fieldError("date")}
                </label>
                <div className="booking-time-slots">
                  <p className="booking-field__label">Pilihan waktu</p>
                  <p className="booking-step-panel__hint">Jadwal yang ditampilkan belum terhubung ke ketersediaan cabang.</p>
                  {demoSlots.length > 0 ? (
                    <div className="booking-time-slots__grid">
                      {demoSlots.map((slot) => (
                        <label className="booking-time-slot" key={slot}>
                          <input
                            checked={values.slot === slot}
                            aria-required="true"
                            name="slot"
                            onChange={() => updateValue("slot", slot)}
                            type="radio"
                            value={slot}
                          />
                          <span>{slot}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="booking-empty">Pilih tanggal untuk menampilkan pilihan waktu.</p>
                  )}
                  {fieldError("slot")}
                </div>
              </fieldset>
            )}

            {currentStep === 4 && (
              <fieldset className="booking-step-panel">
                <legend>Data kontak</legend>
                <p className="booking-step-panel__hint">Data ini hanya ditampilkan di ringkasan; tidak dikirim ke cabang.</p>
                <label className="booking-field" htmlFor="booking-name">
                  <span>Nama</span>
                  <input
                    aria-describedby={errors.name ? "name-error" : undefined}
                    aria-invalid={Boolean(errors.name)}
                    aria-required="true"
                    autoComplete="name"
                    id="booking-name"
                    name="name"
                    onChange={(event) => updateValue("name", event.currentTarget.value)}
                    type="text"
                    value={values.name}
                  />
                  {fieldError("name")}
                </label>
                <label className="booking-field" htmlFor="booking-phone">
                  <span>Nomor telepon</span>
                  <input
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    aria-invalid={Boolean(errors.phone)}
                    aria-required="true"
                    autoComplete="tel"
                    id="booking-phone"
                    inputMode="tel"
                    name="phone"
                    onChange={(event) => updateValue("phone", event.currentTarget.value)}
                    type="tel"
                    value={values.phone}
                  />
                  {fieldError("phone")}
                </label>
              </fieldset>
            )}

            {currentStep === 5 && (
              <fieldset className="booking-step-panel">
                <legend>Tinjau pilihanmu</legend>
                <p className="booking-step-panel__hint">Pastikan semuanya sudah sesuai.</p>
                <dl className="booking-summary" aria-label="Ringkasan pilihan kunjungan">
                  <div><dt>Cabang</dt><dd>{summary.branch}</dd></div>
                  <div><dt>Layanan</dt><dd>{summary.service}</dd></div>
                  <div><dt>Barber</dt><dd>{summary.barber}</dd></div>
                  <div><dt>Tanggal</dt><dd>{formatDate(summary.date)}</dd></div>
                  <div><dt>Waktu</dt><dd>{summary.slot}</dd></div>
                  <div><dt>Harga</dt><dd>{formatPrice.format(summary.price)}</dd></div>
                  <div><dt>Nama</dt><dd>{summary.name}</dd></div>
                  <div><dt>Telepon</dt><dd>{summary.phone}</dd></div>
                </dl>
                {Object.entries(errors).map(([field, message]) => (
                  message ? <p className="booking-error" key={field} role="alert">{message}</p> : null
                ))}
              </fieldset>
            )}

            <div className="booking-form__actions">
              {currentStep > 0 && <button className="button button--secondary" onClick={goBack} type="button">Kembali</button>}
              <button className="button button--primary" type="submit">
                {submitLabels[currentStep]}
              </button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}
