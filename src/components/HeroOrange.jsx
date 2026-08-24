'use client';

import { soundManager } from '@/lib/sounds';

export default function HeroOrange({ onOpenBooking }) {
  return (
    <section className="hero-orange-section" id="hero">
      <div className="hero-orange-container">
        {/* Top Subtitle Badge */}
        <div className="hero-top-tag">
          <span className="hero-dot-black"></span>
          STANDAR KEMEWAHAN • EST. 2017 • INDONESIA
        </div>

        {/* Main Editorial Headline */}
        <h1 className="hero-brand-statement">
          Barbershop berkelas<br />
          spesialis potongan rambut<br />
          <span className="editorial-italic">pria modern dan gaya</span><br />
          <span className="editorial-italic">pendek berpresisi tinggi</span>
        </h1>

        {/* Subtitle Lead */}
        <p className="hero-orange-desc">
          Ambiens mewah yang konsisten, standar sterilisasi alat medis, dan master barber di 5 cabang Indonesia. Rasakan presisi skin fade, arsitektur gunting klasik, dan ritual cukur handuk hangat.
        </p>

        {/* Action Buttons (Pure Text, No Icons, 100% Clickable) */}
        <div className="hero-orange-actions" style={{ position: 'relative', zIndex: 100 }}>
          <button
            type="button"
            className="btn-black btn-magnetic"
            data-cursor="PESAN"
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playClick();
              if (onOpenBooking) onOpenBooking();
            }}
          >
            <span>PESAN JADWAL CUKUR</span>
          </button>

          <a
            href="#locations"
            className="btn-outline-black btn-magnetic"
            data-cursor="CABANG"
            onClick={() => soundManager.playClick()}
          >
            <span>5 CABANG DI INDONESIA</span>
          </a>
        </div>

        {/* Quick Trust Indicators (Desktop only, Hidden on Mobile) */}
        <div className="hero-orange-trust">
          <span className="trust-item">
            <i className="fa-solid fa-star"></i> Rating 4.98 (2.400+ Ulasan Puas)
          </span>
          <span className="trust-bullet">•</span>
          <span className="trust-item">Kursi Kulit Mewah Takara Belmont</span>
          <span className="trust-bullet">•</span>
          <span className="trust-item">Bar Kopi Espresso Italia Gratis</span>
        </div>
      </div>
    </section>
  );
}
