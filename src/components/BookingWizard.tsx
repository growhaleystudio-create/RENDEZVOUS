import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr/CalendarBlank";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";
import { MapPinIcon } from "@phosphor-icons/react/dist/ssr/MapPin";
import { ShuffleIcon } from "@phosphor-icons/react/dist/ssr/Shuffle";
import { UserIcon } from "@phosphor-icons/react/dist/ssr/User";
import {
  buildCalendarEvent,
  firstOpenStep,
  formatBookingSummary,
  getDemoSlots,
  getEligibleBarbers,
  googleCalendarUrl,
  toIcs,
  validateBookingStep,
} from "../data/booking-demo.js";

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
  showcaseImage?: string;
  showcaseAlt?: string;
};

type Barber = {
  id: string;
  name: string;
  branchIds: string[];
  serviceIds: string[];
  specialties: string[];
  image?: string;
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

// Pola umum aplikasi booking: pilih → barber → waktu → tinjau (kontak + ringkasan jadi satu langkah).
const steps = ["Cabang", "Layanan", "Barber", "Waktu", "Tinjau"];
const stepTitles = ["Pilih cabang", "Pilih layanan", "Pilih barber", "Pilih tanggal dan waktu", "Tinjau dan isi kontak"];
// Subjudul percakapan di bawah judul langkah (pola wizard booking umum).
const stepSubtitles = [
  "Pilih cabang yang paling dekat denganmu.",
  "Pilih layanan yang ingin kamu lakukan.",
  "Daftar barber mengikuti cabang dan layanan yang kamu pilih.",
  "Pilih hari dan jam kunjunganmu.",
  "Data ini hanya ditampilkan di ringkasan; tidak dikirim ke cabang.",
];
const submitLabels = ["Lanjutkan", "Lanjutkan", "Lanjutkan", "Lanjutkan", "Buat ringkasan"];
const REVIEW_STEP = steps.length - 1;
const DATE_STRIP_DAYS = 14;

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

const toISODate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

// Deretan tanggal: hari ini + 13 hari berikutnya, dalam waktu lokal pengunjung.
function upcomingDates(days = DATE_STRIP_DAYS) {
  const today = new Date();
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
    return {
      iso: toISODate(date),
      weekday: new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(date),
      day: date.getDate(),
      month: new Intl.DateTimeFormat("id-ID", { month: "short" }).format(date),
    };
  });
}

const slotPeriods = [
  { label: "Pagi", test: (hour: number) => hour < 12 },
  { label: "Siang", test: (hour: number) => hour >= 12 && hour < 15 },
  { label: "Sore", test: (hour: number) => hour >= 15 },
];


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
  const dates = useMemo(() => upcomingDates(), []);

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
      const prefilled = {
        ...initialValues,
        branchId: branch?.id ?? "",
        serviceId: service?.id ?? "",
        barberId: canPreselectBarber ? barber.id : "",
      };
      setValues(prefilled);
      // Langsung ke langkah pertama yang belum terjawab, bukan mengulang dari Cabang.
      setCurrentStep(firstOpenStep(prefilled));
      return;
    }
  }, [barbers, branches, services]);

  const data = { branches, services, barbers };
  const eligibleBarbers = useMemo(
    () => getEligibleBarbers({ branchId: values.branchId, serviceId: values.serviceId, barbers }),
    [barbers, values.branchId, values.serviceId],
  );
  const demoSlots = getDemoSlots(values.date);
  const summary = formatBookingSummary(values, data);
  const selectedBranch = branches.find((branch) => branch.id === values.branchId);
  const selectedService = services.find((service) => service.id === values.serviceId);
  const calendarEvent = complete ? buildCalendarEvent(values, data) : null;

  function updateValue(field: keyof BookingValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function validate(step: number) {
    // Langkah Tinjau memeriksa kontak sekaligus semua pilihan sebelumnya.
    return step === REVIEW_STEP
      ? { ...validateBookingStep(5, values), ...validateBookingStep(4, values) }
      : validateBookingStep(step, values);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(currentStep);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (currentStep < REVIEW_STEP) {
      setCurrentStep((step) => step + 1);
      return;
    }
    setComplete(true);
  }

  function goToStep(step: number) {
    setErrors({});
    setCurrentStep(Math.max(0, Math.min(step, currentStep)));
  }

  function downloadCalendarFile() {
    if (!calendarEvent) return;
    const url = URL.createObjectURL(new Blob([toIcs(calendarEvent)], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `rendezvous-${values.date}.ics`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function fieldError(field: keyof BookingValues) {
    return errors[field] ? (
      <p className="booking-error" id={`${field}-error`} role="alert">{errors[field]}</p>
    ) : null;
  }

  const check = (
    <span className="booking-card__check" aria-hidden="true"><CheckIcon size={14} weight="bold" /></span>
  );

  return (
    <section className="booking-wizard" aria-label="Booking Rendezvous">
      <h1 className="visually-hidden">Rencanakan kunjunganmu.</h1>

      {complete ? (
        <section className="booking-confirmation" aria-live="polite" aria-labelledby="booking-confirmation-title">
          <div className="booking-confirmation__head">
            <span className="booking-confirmation__icon" aria-hidden="true"><CheckIcon size={28} weight="bold" /></span>
            <h2 id="booking-confirmation-title">Ringkasan booking siap</h2>
            <p>Ini hanya ringkasan pilihanmu. Permintaan belum dikirim dan jadwal belum dikonfirmasi.</p>
          </div>

          <article className="booking-receipt" aria-label="Rincian booking">
            <header className="booking-receipt__service">
              {selectedService?.showcaseImage && (
                <img alt="" className="booking-receipt__thumb" height="64" src={`/images/photography/${selectedService.showcaseImage}`} width="64" />
              )}
              <div>
                <strong>{summary.service}</strong>
                <span>dengan {summary.barber}</span>
              </div>
              <span className="booking-receipt__status">Belum dikonfirmasi</span>
            </header>
            <dl className="booking-receipt__rows">
              <div>
                <dt><CalendarBlankIcon size={18} aria-hidden="true" /><span>Waktu</span></dt>
                <dd>{formatDate(summary.date)}<span>Pukul {summary.slot}</span></dd>
              </div>
              <div>
                <dt><MapPinIcon size={18} aria-hidden="true" /><span>Cabang</span></dt>
                <dd>Rendezvous {summary.branch}{selectedBranch && <span>{selectedBranch.address}</span>}</dd>
              </div>
              <div>
                <dt><UserIcon size={18} aria-hidden="true" /><span>Atas nama</span></dt>
                <dd>{summary.name}<span>{summary.phone}</span></dd>
              </div>
            </dl>
            <dl className="booking-receipt__total">
              <dt>Harga</dt>
              <dd>{formatPrice.format(summary.price)}</dd>
            </dl>
          </article>

          {calendarEvent && (
            <div className="booking-confirmation__calendar">
              <div className="booking-confirmation__actions">
                <button className="button button--primary button--pill button--block" onClick={downloadCalendarFile} type="button">Tambah ke kalender</button>
                <a className="button button--secondary button--pill button--block" href={googleCalendarUrl(calendarEvent)} rel="noopener noreferrer" target="_blank">Google Calendar</a>
              </div>
              <p className="booking-confirmation__note">Pengingat H-1 dan 2 jam sebelumnya ikut tersimpan, dengan tanda belum dikonfirmasi.</p>
            </div>
          )}
        </section>
      ) : (
        <>
          <nav className="booking-stepper" aria-label="Langkah booking">
            <ol>
              {steps.map((step, index) => {
                const state = index < currentStep ? "is-done" : index === currentStep ? "is-current" : "is-upcoming";
                const marker = (
                  <span className="booking-stepper__marker" aria-hidden="true">
                    {index < currentStep ? <CheckIcon size={14} weight="bold" /> : index + 1}
                  </span>
                );
                return (
                  <li aria-current={index === currentStep ? "step" : undefined} className={state} key={step}>
                    {index < currentStep ? (
                      <button onClick={() => goToStep(index)} type="button">
                        {marker}
                        <span className="booking-stepper__label">{step}</span>
                      </button>
                    ) : (
                      <span className="booking-stepper__item">
                        {marker}
                        <span className="booking-stepper__label">{step}</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="booking-layout" data-step={currentStep}>
            {/* Baris 1: judul langkah. Baris 2: pilihan + ringkasan, jadi tepi atas keduanya sejajar. */}
            <header className="booking-step-header">
              <p className="booking-step-panel__count" aria-hidden="true">Langkah {currentStep + 1} dari {steps.length}</p>
              <h2>{stepTitles[currentStep]}</h2>
              <p className="booking-step-panel__subtitle" id="booking-step-subtitle">{stepSubtitles[currentStep]}</p>
            </header>
            <div className="booking-main">

            <form aria-label="Form booking" className="booking-form" data-step={currentStep} id="booking-form" onSubmit={handleSubmit}>
              <fieldset className="booking-step-panel" aria-describedby="booking-step-subtitle">
                <legend className="visually-hidden">{stepTitles[currentStep]}</legend>

                {currentStep === 0 && (
                  <>
                    <div className="booking-card-list">
                      {branches.map((branch) => (
                        <label className="booking-card" key={branch.id}>
                          <input
                            aria-describedby={errors.branchId ? "branchId-error" : undefined}
                            aria-invalid={Boolean(errors.branchId)}
                            aria-required="true"
                            checked={values.branchId === branch.id}
                            name="branchId"
                            onChange={() => {
                              updateValue("branchId", branch.id);
                              setValues((current) => ({ ...current, barberId: "" }));
                            }}
                            type="radio"
                            value={branch.id}
                          />
                          <span className="booking-card__body">
                            <strong>{branch.name}</strong>
                            <span>{branch.city} · {branch.hours}</span>
                          </span>
                          {check}
                        </label>
                      ))}
                    </div>
                    {fieldError("branchId")}
                  </>
                )}

                {currentStep === 1 && (
                  <>
                    <div className="booking-card-list">
                      {services.map((service) => (
                        <label className="booking-card booking-card--service" key={service.id}>
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
                          {service.showcaseImage ? (
                            <img
                              className="booking-card__thumb"
                              src={`/images/photography/${service.showcaseImage}`}
                              alt={service.showcaseAlt ?? ""}
                              width="96"
                              height="96"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <span className="booking-card__thumb" aria-hidden="true" />
                          )}
                          <span className="booking-card__body">
                            <strong>{service.name}</strong>
                            <span>{service.description}</span>
                          </span>
                          <span className="booking-card__price">{formatPrice.format(service.price)}</span>
                          {check}
                        </label>
                      ))}
                    </div>
                    {fieldError("serviceId")}
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="booking-card-list">
                      <label className="booking-card booking-card--person">
                        <input
                          checked={values.barberId === "any"}
                          aria-required="true"
                          name="barberId"
                          onChange={() => updateValue("barberId", "any")}
                          type="radio"
                          value="any"
                        />
                        <span className="booking-card__avatar booking-card__avatar--any" aria-hidden="true"><ShuffleIcon size={22} /></span>
                        <span className="booking-card__body">
                          <strong>Siapa saja</strong>
                          <span>Pilihan waktu paling banyak</span>
                        </span>
                        {check}
                      </label>
                      {eligibleBarbers.map((barber) => (
                        <label className="booking-card booking-card--person" key={barber.id}>
                          <input
                            checked={values.barberId === barber.id}
                            aria-required="true"
                            name="barberId"
                            onChange={() => updateValue("barberId", barber.id)}
                            type="radio"
                            value={barber.id}
                          />
                          {barber.image ? (
                            <img className="booking-card__avatar" src={barber.image} alt="" width="56" height="56" loading="lazy" />
                          ) : (
                            <span className="booking-card__avatar" aria-hidden="true" />
                          )}
                          <span className="booking-card__body">
                            <strong>{barber.name}</strong>
                            <span>{barber.specialties.join(" · ")}</span>
                          </span>
                          {check}
                        </label>
                      ))}
                    </div>
                    {eligibleBarbers.length === 0 && (
                      <p className="booking-empty">Pilih cabang dan layanan untuk melihat barber yang dapat dipilih.</p>
                    )}
                    {fieldError("barberId")}
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <p className="booking-field__label" id="booking-date-label">Tanggal</p>
                    <div className="booking-date-strip" role="radiogroup" aria-labelledby="booking-date-label">
                      {dates.map((date) => (
                        <label className="booking-date" key={date.iso}>
                          <input
                            aria-describedby={errors.date ? "date-error" : undefined}
                            aria-required="true"
                            checked={values.date === date.iso}
                            name="date"
                            onChange={() => {
                              updateValue("date", date.iso);
                              setValues((current) => ({ ...current, slot: "" }));
                            }}
                            type="radio"
                            value={date.iso}
                          />
                          <span>
                            <small>{date.weekday}</small>
                            <strong>{date.day}</strong>
                            <small>{date.month}</small>
                          </span>
                        </label>
                      ))}
                    </div>
                    {fieldError("date")}

                    <p className="booking-field__label">Waktu</p>
                    <p className="booking-step-panel__hint">Jadwal yang ditampilkan belum terhubung ke ketersediaan cabang.</p>
                    {demoSlots.length > 0 ? (
                      slotPeriods.map((period) => {
                        const slots = demoSlots.filter((slot: string) => period.test(Number(slot.slice(0, 2))));
                        if (slots.length === 0) return null;
                        return (
                          <div className="booking-time-group" key={period.label}>
                            <p className="booking-time-group__label">{period.label}</p>
                            <div className="booking-time-slots__grid">
                              {slots.map((slot: string) => (
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
                          </div>
                        );
                      })
                    ) : (
                      <p className="booking-empty">Pilih tanggal untuk menampilkan pilihan waktu.</p>
                    )}
                    {fieldError("slot")}
                  </>
                )}

                {currentStep === REVIEW_STEP && (
                  <>
                    {/* HP: ringkasan pilihan sebelum data kontak (desktop memakai kartu samping). */}
                    <dl className="booking-review-mobile">
                      <div><dt>Cabang</dt><dd>{summary.branch}</dd></div>
                      <div><dt>Layanan</dt><dd>{summary.service}{summary.barber ? ` · ${summary.barber}` : ""}</dd></div>
                      <div><dt>Waktu</dt><dd>{formatDate(summary.date)}, {summary.slot}</dd></div>
                      <div><dt>Harga</dt><dd>{formatPrice.format(summary.price)}</dd></div>
                    </dl>
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
                    {Object.entries(errors)
                      .filter(([field, message]) => message && !["name", "phone"].includes(field))
                      .map(([field, message]) => <p className="booking-error" key={field} role="alert">{message}</p>)}
                  </>
                )}
              </fieldset>

              <div className="booking-form__nav">
                {currentStep > 0 ? (
                  <button className="button button--secondary button--pill" onClick={() => goToStep(currentStep - 1)} type="button">
                    <ArrowLeftIcon size={18} weight="bold" aria-hidden="true" />
                    <span>Kembali</span>
                  </button>
                ) : (
                  <span aria-hidden="true" />
                )}
                <button className="button button--primary button--pill" type="submit">
                  <span>{submitLabels[currentStep]}</span>
                  <ArrowRightIcon size={18} weight="bold" aria-hidden="true" />
                </button>
              </div>
            </form>
            </div>

            <aside className="booking-summary-card" aria-label="Ringkasan booking">
              <div className="booking-summary-card__details">
                <div className="booking-summary-card__branch">
                  <strong>{selectedBranch ? `Rendezvous ${selectedBranch.name}` : "Rendezvous"}</strong>
                  <span>{selectedBranch ? selectedBranch.address : "Pilih cabang untuk memulai"}</span>
                </div>
                <dl className="booking-summary-card__lines">
                  {selectedService ? (
                    <div>
                      <dt>
                        {selectedService.name}
                        {summary.barber && <span>dengan {summary.barber === "Siapa saja" ? "siapa saja" : summary.barber}</span>}
                      </dt>
                    </div>
                  ) : (
                    <div className="is-empty"><dt>Belum ada layanan dipilih</dt></div>
                  )}
                  {values.date && (
                    <div>
                      <dt>{formatDate(values.date)}</dt>
                      <dd>{values.slot || "—"}</dd>
                    </div>
                  )}
                </dl>
              </div>
              <div className="booking-summary-card__footer">
                <dl className="booking-summary-card__total">
                  <dt>Harga</dt>
                  <dd>{summary.price ? formatPrice.format(summary.price) : "—"}</dd>
                </dl>
              </div>
            </aside>
          </div>
        </>
      )}
    </section>
  );
}
