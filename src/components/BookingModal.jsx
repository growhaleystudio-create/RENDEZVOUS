'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '@/lib/sounds';

export default function BookingModal({ isOpen, onClose, initialService, initialLocation, initialBarber }) {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState('Senopati Flagship (Jakarta Selatan)');
  const [barber, setBarber] = useState('Siapa Saja yang Tersedia (Paling Cepat)');
  const [service, setService] = useState('Signature Tailored Haircut (Rp 180.000)');
  const [date, setDate] = useState('2026-08-25');
  const [time, setTime] = useState('14:30');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsCompleted(false);
      if (initialLocation) setLocation(initialLocation);
      if (initialService) setService(initialService);
      if (initialBarber) setBarber(initialBarber);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, initialLocation, initialService, initialBarber]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const locations = [
    { title: 'Senopati Flagship', sub: 'Jl. Senopati No. 45 • SCBD Area', value: 'Senopati Flagship (Jakarta Selatan)', badge: 'FLAGSHIP' },
    { title: 'Menteng Heritage', sub: 'Jl. Teuku Cik Ditiro No. 22 • Jakarta Pusat', value: 'Menteng Heritage (Jakarta Pusat)' },
    { title: 'Dago Highlands', sub: 'Jl. Ir. H. Juanda No. 180 • Dago Atas Bandung', value: 'Dago Highlands (Bandung)' },
    { title: 'Seminyak Sanctuary', sub: 'Jl. Kayu Aya No. 88 • Seminyak Bali', value: 'Seminyak Sanctuary (Bali)' },
    { title: 'Graha Famili', sub: 'Jl. Mayjen Yono Suwoyo No. 12 • Surabaya Barat', value: 'Graha Famili (Surabaya)' },
  ];

  const barbersList = [
    { title: 'Siapa Saja yang Tersedia', sub: 'Slot paling fleksibel & tercepat', value: 'Siapa Saja yang Tersedia (Paling Cepat)', badge: 'REKOMENDASI' },
    { title: 'Issa R.', sub: 'Founder & Lead Master Barber (Queen St)', value: 'Issa R. (Founder)' },
    { title: 'Stas V.', sub: 'Senior Blade Specialist (King & Bathurst)', value: 'Stas V. (Senior Stylist)' },
    { title: 'Cesar M.', sub: 'Precision Fade & Scissor Specialist', value: 'Cesar M.' },
    { title: 'Hamo K.', sub: 'Modern Crop & Beard Sculpting', value: 'Hamo K.' },
  ];

  const servicesList = [
    { title: 'The RendezVous Signature Cut', sub: '40 Menit • Wash & Styling Termasuk', price: 'Rp 180.000', value: 'The RendezVous Signature Cut (Rp 180.000)' },
    { title: 'Skin Fade & Precision Taper', sub: '45 Menit • Zero-gap Ultra Bersih', price: 'Rp 220.000', value: 'Skin Fade & Precision Taper (Rp 220.000)' },
    { title: 'Royal Hot Towel Straight Razor Shave', sub: '35 Menit • Essential Oils & Cold Towel', price: 'Rp 160.000', value: 'Royal Hot Towel Straight Razor Shave (Rp 160.000)' },
    { title: 'Beard Architecture & Razor Lineup', sub: '30 Menit • Precision Lines & Argan Oil', price: 'Rp 130.000', value: 'Beard Architecture & Razor Lineup (Rp 130.000)' },
    { title: 'The RendezVous Royal Package', sub: '75 Menit • Haircut + Shave + Scalp Massage', price: 'Rp 350.000', value: 'The RendezVous Royal Package (Rp 350.000)' },
    { title: 'Junior Grooming (14 Tahun ke Bawah)', sub: '30 Menit • Gunting Presisi & Camilan Gratis', price: 'Rp 140.000', value: 'Junior Grooming (Rp 140.000)' },
  ];

  const times = ['10:00', '11:00', '12:00', '13:30', '14:30', '15:30', '16:30', '17:30', '18:30', '19:15'];

  const handleNext = () => {
    soundManager.playClick();
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Submit
      soundManager.playSuccessChime();
      setIsCompleted(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF5E1E', '#FFFFFF', '#D4AF37', '#FFA726'],
        });
      } catch (e) {}
    }
  };

  const handleBack = () => {
    soundManager.playClick();
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="booking-modal-backdrop open" id="bookingModal" role="dialog" aria-modal="true">
      <div className="booking-modal-container">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            <span className="modal-step-indicator" id="modalStepLabel">
              {isCompleted ? 'KONFIRMASI RESERVASI' : `LANGKAH ${step} DARI 5`}
            </span>
            <h3 className="modal-title">Reservasi Jadwal Cukur</h3>
          </div>
          <button
            className="modal-close-btn"
            id="closeBookingModal"
            aria-label="Tutup formulir"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {isCompleted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(34,197,94,0.15)',
                  color: '#4ADE80',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  margin: '0 auto 1.5rem',
                  border: '1px solid rgba(34,197,94,0.4)',
                }}
              >
                <i className="fa-solid fa-check"></i>
              </div>
              <h4 className="font-serif text-cream" style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>
                Reservasi Anda Dikonfirmasi!
              </h4>
              <p className="text-muted" style={{ fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 1.75rem', lineHeight: '1.6' }}>
                Terima kasih, <strong>{name || 'Tamu Terhormat'}</strong>. Rincian jadwal cukur Anda di cabang{' '}
                <strong>{location}</strong> pada <strong>{date} pukul {time}</strong> telah tercatat.
              </p>
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  textAlign: 'left',
                  marginBottom: '1.75rem',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ color: 'var(--orange-primary)', fontWeight: 700, marginBottom: '0.35rem' }}>
                  KODE BOOKING: #RDV-{Math.floor(100000 + Math.random() * 900000)}
                </div>
                <div style={{ color: 'var(--text-cream)' }}>Layanan: {service}</div>
                <div style={{ color: 'var(--text-muted)' }}>Barber: {barber}</div>
              </div>
              <button
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
              >
                <span>SELESAI & TUTUP</span>
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Location */}
              {step === 1 && (
                <div className="booking-step active">
                  <h4 className="font-serif text-cream" style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                    Pilih Cabang
                  </h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Pilih lokasi salon RendezVous terdekat dengan Anda:
                  </p>
                  <div className="modal-grid-options">
                    {locations.map((loc) => (
                      <div
                        key={loc.value}
                        className={`modal-option-card ${location === loc.value ? 'selected' : ''}`}
                        onClick={() => {
                          soundManager.playClick();
                          setLocation(loc.value);
                        }}
                      >
                        <div>
                          <div className="modal-option-title">{loc.title}</div>
                          <div className="modal-option-sub">{loc.sub}</div>
                        </div>
                        {loc.badge && (
                          <span className="badge-tag" style={{ margin: 0, padding: '0.2rem 0.6rem', fontSize: '0.65rem' }}>
                            {loc.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Barber */}
              {step === 2 && (
                <div className="booking-step active">
                  <h4 className="font-serif text-cream" style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                    Pilih Master Barber
                  </h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Pilih barber pilihan Anda atau barber yang tersedia paling cepat:
                  </p>
                  <div className="modal-grid-options">
                    {barbersList.map((b) => (
                      <div
                        key={b.value}
                        className={`modal-option-card ${barber === b.value ? 'selected' : ''}`}
                        onClick={() => {
                          soundManager.playClick();
                          setBarber(b.value);
                        }}
                      >
                        <div>
                          <div className="modal-option-title">{b.title}</div>
                          <div className="modal-option-sub">{b.sub}</div>
                        </div>
                        {b.badge && (
                          <span className="badge-tag" style={{ margin: 0, padding: '0.2rem 0.6rem', fontSize: '0.65rem' }}>
                            {b.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Service */}
              {step === 3 && (
                <div className="booking-step active">
                  <h4 className="font-serif text-cream" style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                    Pilih Layanan Perawatan
                  </h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Pilih paket haircut atau grooming ritual yang Anda butuhkan:
                  </p>
                  <div className="modal-grid-options">
                    {servicesList.map((s) => (
                      <div
                        key={s.value}
                        className={`modal-option-card ${service === s.value ? 'selected' : ''}`}
                        onClick={() => {
                          soundManager.playClick();
                          setService(s.value);
                        }}
                      >
                        <div>
                          <div className="modal-option-title">{s.title}</div>
                          <div className="modal-option-sub">{s.sub}</div>
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--orange-primary)', fontSize: '0.9rem' }}>
                          {s.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Date & Time */}
              {step === 4 && (
                <div className="booking-step active">
                  <h4 className="font-serif text-cream" style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                    Pilih Tanggal & Waktu Sesi
                  </h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Tentukan waktu kunjungan terbaik untuk Anda:
                  </p>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="text-muted" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem', display: 'block' }}>
                      PILIH TANGGAL
                    </label>
                    <input
                      type="date"
                      className="gc-form-input"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-muted" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '0.6rem', display: 'block' }}>
                      PILIH SLOT JAM YANG TERSEDIA
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem' }}>
                      {times.map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={`gc-amount-btn ${time === t ? 'active' : ''}`}
                          style={{ padding: '0.6rem 0.2rem', fontSize: '0.85rem' }}
                          onClick={() => {
                            soundManager.playClick();
                            setTime(t);
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Guest Details */}
              {step === 5 && (
                <div className="booking-step active">
                  <h4 className="font-serif text-cream" style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                    Detail Kontak & Konfirmasi
                  </h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Mohon lengkapi nama dan nomor WhatsApp untuk pengiriman konfirmasi jadwal:
                  </p>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="text-muted" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                      NAMA LENGKAP
                    </label>
                    <input
                      type="text"
                      className="gc-form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Alexander Wright"
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="text-muted" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                      NOMOR WHATSAPP / TELEPON
                    </label>
                    <input
                      type="tel"
                      className="gc-form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Contoh: 08123456789"
                    />
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 94, 30, 0.08)',
                      border: '1px solid rgba(255, 94, 30, 0.25)',
                      borderRadius: '12px',
                      padding: '1rem',
                      fontSize: '0.82rem',
                      lineHeight: '1.5',
                      color: 'var(--text-cream)',
                    }}
                  >
                    <strong>Ringkasan:</strong> {service} di {location} bersama {barber} pada {date} @ {time}.
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!isCompleted && (
          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '1.25rem 1.75rem', borderTop: '1px solid var(--border-light)' }}>
            {step > 1 ? (
              <button className="btn-secondary" onClick={handleBack}>
                <span>KEMBALI</span>
              </button>
            ) : (
              <div></div>
            )}
            <button className="btn-primary" onClick={handleNext}>
              <span>{step === 5 ? 'KONFIRMASI SEKARANG' : 'LANJUTKAN'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
