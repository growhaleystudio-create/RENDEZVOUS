'use client';

import { soundManager } from '@/lib/sounds';

export default function Footer() {
  return (
    <footer className="curtain-reveal-footer" id="curtainFooter">
      <img
        src="/images/hero.jpg"
        alt="Suasana Barbershop Mewah RendezVous"
        className="footer-curtain-bg"
        loading="lazy"
      />

      <div className="footer-curtain-content">
        <div className="container">
          {/* Giant Cinematic Manifesto Heading */}
          <div className="footer-statement-block">
            <h2 className="footer-giant-statement">
              Meet your best self
              <span className="statement-italic-line">at Rendezvous</span>
            </h2>
          </div>

          {/* Grid Links & Contact */}
          <div className="footer-curtain-grid">
            {/* Col 1 */}
            <div>
              <div className="footer-brand-title">
                RENDEZVOUS<span style={{ color: '#FF5E1E' }}>.</span>
              </div>
              <p className="footer-bio">
                Destinasi terdepan di Indonesia untuk gaya rambut pria modern, presisi skin fade, dan ritual perawatan berkelas. Didirikan tahun 2017.
              </p>
              <div className="social-links">
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                  aria-label="Instagram"
                  onClick={() => soundManager.playClick()}
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                  aria-label="Facebook"
                  onClick={() => soundManager.playClick()}
                >
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                  aria-label="LinkedIn"
                  onClick={() => soundManager.playClick()}
                >
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-btn"
                  aria-label="YouTube"
                  onClick={() => soundManager.playClick()}
                >
                  <i className="fa-brands fa-youtube"></i>
                </a>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="footer-heading">Navigasi Utama</h4>
              <ul className="footer-links-list">
                <li>
                  <a href="#hero" onClick={() => soundManager.playClick()}>
                    Beranda
                  </a>
                </li>
                <li>
                  <a href="#philosophy" onClick={() => soundManager.playClick()}>
                    Pengalaman & Filosofi
                  </a>
                </li>
                <li>
                  <a href="#services" onClick={() => soundManager.playClick()}>
                    Layanan & Daftar Harga
                  </a>
                </li>
                <li>
                  <a href="#locations" onClick={() => soundManager.playClick()}>
                    5 Cabang Indonesia
                  </a>
                </li>
                <li>
                  <a href="#team" onClick={() => soundManager.playClick()}>
                    Tim Master Barber
                  </a>
                </li>
                <li>
                  <a href="#lookbook" onClick={() => soundManager.playClick()}>
                    Arsip Lookbook
                  </a>
                </li>
                <li>
                  <a href="#giftcards" onClick={() => soundManager.playClick()}>
                    Voucher Hadiah Digital
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="footer-heading">Cabang di Indonesia</h4>
              <ul className="footer-links-list">
                <li>
                  <a href="#locations" onClick={() => soundManager.playClick()}>
                    Senopati (Jakarta Selatan Flagship)
                  </a>
                </li>
                <li>
                  <a href="#locations" onClick={() => soundManager.playClick()}>
                    Menteng (Jakarta Pusat)
                  </a>
                </li>
                <li>
                  <a href="#locations" onClick={() => soundManager.playClick()}>
                    Dago Highlands (Bandung)
                  </a>
                </li>
                <li>
                  <a href="#locations" onClick={() => soundManager.playClick()}>
                    Seminyak Sanctuary (Bali)
                  </a>
                </li>
                <li>
                  <a href="#locations" onClick={() => soundManager.playClick()}>
                    Graha Famili (Surabaya Barat)
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="footer-heading">Layanan Pelanggan</h4>
              <ul className="footer-links-list">
                <li>
                  <span className="text-muted">Concierge WhatsApp 24/7:</span>
                  <br />
                  <a href="tel:+622157901234" className="text-orange">
                    +62 21-5790-1234
                  </a>
                </li>
                <li>
                  <span className="text-muted">Informasi Umum:</span>
                  <br />
                  <a href="mailto:info@rendezvousbarber.id">info@rendezvousbarber.id</a>
                </li>
                <li>
                  <span className="text-muted">Karir & Rekrutmen:</span>
                  <br />
                  <a href="mailto:careers@rendezvousbarber.id">careers@rendezvousbarber.id</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <div>© 2026 RendezVous Barbershop Indonesia. Hak cipta dilindungi undang-undang.</div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="#">Kebijakan Privasi</a>
              <a href="#">Syarat & Ketentuan</a>
              <a href="#">Standar Higienis</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
