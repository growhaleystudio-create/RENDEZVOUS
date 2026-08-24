'use client';

import { soundManager } from '@/lib/sounds';

export default function Team({ onOpenBooking }) {
  const barbers = [
    {
      id: 'issa',
      name: 'Issa',
      role: 'FOUNDER • MASTER BARBER',
      image: '/images/barber_issa.jpg',
      specialty: 'Presisi Skin Taper • Textured Crop Architecture • Pengalaman 12+ Tahun',
      bookingName: 'Issa (Master Barber)',
    },
    {
      id: 'stas',
      name: 'Stas',
      role: 'SPESIALIS FADE',
      image: '/images/barber_stas.jpg',
      specialty: 'Skin Fade Tajam • High Contrast Graduation • Pengalaman 8+ Tahun',
      bookingName: 'Stas (Fade Specialist)',
    },
    {
      id: 'cesar',
      name: 'Cesar',
      role: 'MASTER CUKUR & JENGGOT',
      image: '/images/barber_cesar.jpg',
      specialty: 'Ritual Cukur Handuk Hangat • Arsitektur Bentuk Wajah • Pengalaman 9+ Tahun',
      bookingName: 'Cesar (Beard Master)',
    },
    {
      id: 'hamo',
      name: 'Hamo',
      role: 'SENIOR STYLIST',
      image: '/images/barber_hamo.jpg',
      specialty: 'Potongan Gunting Eksekutif • Terapi Relaksasi Kulit Kepala • Pengalaman 7+ Tahun',
      bookingName: 'Hamo (Senior Stylist)',
    },
  ];

  return (
    <section className="py-section team-section" id="team">
      <div className="container">
        {/* Centered Header */}
        <div className="section-header-centered section-header-reveal">
          <span className="badge-tag">PENGRAJIN BLADE</span>
          <h2 className="section-title-huge">
            Kenali <em>Tim Master Barber</em> Kami
          </h2>
          <p className="section-subtitle">
            Para profesional berdedikasi dengan jam terbang ribuan jam, memadukan teknik gunting klasik dengan tren modern.
          </p>
        </div>

        <div className="team-grid">
          {barbers.map((barber) => (
            <div key={barber.id} className="barber-card">
              <div className="barber-photo-box">
                <img src={barber.image} alt={`${barber.name} - ${barber.role}`} loading="lazy" />
                <span className="barber-badge-role">{barber.role}</span>
              </div>
              <div className="barber-info">
                <h3 className="barber-name">{barber.name}</h3>
                <p className="barber-specialty">{barber.specialty}</p>
                <button
                  className="barber-book-cta"
                  onClick={() => {
                    soundManager.playClick();
                    onOpenBooking(null, null, barber.bookingName);
                  }}
                >
                  <span>{`PESAN DENGAN ${barber.name.toUpperCase()}`}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
