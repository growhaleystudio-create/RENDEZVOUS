'use client';

export default function Philosophy() {
  return (
    <>
      {/* Marquee Ticker */}
      <div className="marquee-container" aria-hidden="true">
        <div className="marquee-content">
          <div className="marquee-item">
            <span>PRESISI TAILORED SKIN FADES</span>
            <span className="marquee-separator"></span>
            <span>RITUAL CUKUR PISAU LIPAT HANDUK HANGAT</span>
            <span className="marquee-separator"></span>
            <span>PERAWATAN KULIT KEPALA RESTORATIF</span>
            <span className="marquee-separator"></span>
            <span>ARSITEKTUR JENGGOT & KUMIS</span>
            <span className="marquee-separator"></span>
            <span>ESPRESSO ITALIA COMPLIMENTARY</span>
            <span className="marquee-separator"></span>
            <span>5 CABANG EKSKLUSIF DI INDONESIA</span>
            <span className="marquee-separator"></span>
          </div>
          <div className="marquee-item">
            <span>PRESISI TAILORED SKIN FADES</span>
            <span className="marquee-separator"></span>
            <span>RITUAL CUKUR PISAU LIPAT HANDUK HANGAT</span>
            <span className="marquee-separator"></span>
            <span>PERAWATAN KULIT KEPALA RESTORATIF</span>
            <span className="marquee-separator"></span>
            <span>ARSITEKTUR JENGGOT & KUMIS</span>
            <span className="marquee-separator"></span>
            <span>ESPRESSO ITALIA COMPLIMENTARY</span>
            <span className="marquee-separator"></span>
            <span>5 CABANG EKSKLUSIF DI INDONESIA</span>
            <span className="marquee-separator"></span>
          </div>
        </div>
      </div>

      {/* Philosophy & The Experience Section (Side-by-Side 2-Column Luxury Grid) */}
      <section className="py-section philosophy-section" id="philosophy">
        <div className="container">
          <div className="philosophy-grid">
            <div className="philosophy-text-stack">
              <span className="badge-tag amber">FILOSOFI KAMI</span>
              <h2 className="section-title-huge">
                Sediakan Waktu untuk Diri Anda. <em>Ini Bukan Sekadar Potong Rambut.</em>
              </h2>
              <p className="philosophy-statement">
                Tempat perlindungan di tengah hiruk-pikuk kota untuk melambat sejenak, menikmati kopi espresso segar, dan mempercayakan penampilan Anda kepada para master barber terbaik.
              </p>

              <div className="features-list">
                <div className="feature-card">
                  <div className="feature-icon-box">
                    <i className="fa-solid fa-scissors"></i>
                  </div>
                  <div>
                    <h3 className="feature-title">Pengrajin Master & Potongan Rambut Modern</h3>
                    <p className="feature-desc">
                      Barber kami adalah seniman spesialis fade pendek modern, textured crop, dan perapian jenggot yang disesuaikan secara presisi dengan kontur wajah Anda.
                    </p>
                  </div>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-box">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div>
                    <h3 className="feature-title">Protokol Sterilisasi & Higienis Personal</h3>
                    <p className="feature-desc">
                      Setiap pelanggan mendapatkan set peralatan yang disterilkan secara individual sebelum digunakan, menjamin standar kebersihan dan keamanan mutlak.
                    </p>
                  </div>
                </div>

                <div className="feature-card">
                  <div className="feature-icon-box">
                    <i className="fa-solid fa-mug-hot"></i>
                  </div>
                  <div>
                    <h3 className="feature-title">Bar Hospitality & Kopi Gratis</h3>
                    <p className="feature-desc">
                      Nikmati racikan espresso Italia asli, cappuccino, teh artisan, atau air mineral dingin di setiap sesi kunjungan Anda. Santai dan segarkan pikiran.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping Visual Media Stack */}
            <div className="philosophy-visual-stack">
              <div className="main-visual-frame">
                <img
                  src="/images/craft.jpg"
                  alt="Presisi Cukur Master Barber RendezVous"
                  loading="lazy"
                />
              </div>
              <div className="overlap-visual-card">
                <img
                  src="/images/shave.jpg"
                  alt="Perawatan Cukur Handuk Hangat Tradisional"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Giant Typographic Editorial Statement (White Canvas Manifesto) */}
      <section className="editorial-giant-statement-section white-canvas" aria-label="Manifesto">
        <div className="container">
          <div className="statement-editorial-inner">
            <h2 className="giant-statement-text">
              <span className="statement-line-upright">When you look good,</span>
              <span className="statement-line-italic">you feel good</span>
            </h2>
          </div>
        </div>
      </section>
    </>
  );
}
