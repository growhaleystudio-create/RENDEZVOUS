'use client';

import { useEffect } from 'react';
import { soundManager } from '@/lib/sounds';

export default function FullscreenMenu({ isOpen, onClose, onOpenBooking }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const navItems = [
    { num: '01', title: 'BERANDA', href: '#hero' },
    { num: '02', title: 'FILOSOFI KAMI', href: '#philosophy' },
    { num: '03', title: 'LAYANAN & HARGA', href: '#services' },
    { num: '04', title: '5 CABANG INDONESIA', href: '#locations' },
    { num: '05', title: 'TIM MASTER BARBER', href: '#team' },
    { num: '06', title: 'VOUCHER HADIAH', href: '#giftcards' },
    { num: '07', title: 'TANYA JAWAB', href: '#faq' },
  ];

  const handleNavClick = (href) => {
    soundManager.playClick();
    onClose();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  return (
    <div
      className={`fullscreen-menu-overlay ${isOpen ? 'open' : ''}`}
      id="fullscreenMenu"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Header inside Fullscreen Overlay */}
      <div className="fs-menu-header">
        <div className="container fs-header-container">
          <a
            href="#hero"
            className="brand-logo fs-close-trigger"
            data-cursor="BERANDA"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
          >
            <svg className="rdv-scissors-icon" viewBox="0 0 160 85" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text
                x="80"
                y="24"
                textAnchor="middle"
                fontFamily="'Cinzel', 'Space Grotesk', serif"
                fontWeight="900"
                fontSize="24"
                letterSpacing="3"
                fill="#FFFFFF"
              >
                RENDEZ
              </text>
              <path d="M42 34 L118 64 M118 34 L42 64" stroke="#FF5E1E" strokeWidth="3" strokeLinecap="round" />
              <circle cx="36" cy="68" r="8" stroke="#FF5E1E" strokeWidth="3" fill="none" />
              <circle cx="124" cy="68" r="8" stroke="#FF5E1E" strokeWidth="3" fill="none" />
              <text
                x="80"
                y="66"
                textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontStyle="italic"
                fontWeight="700"
                fontSize="18"
                fill="#FFFFFF"
              >
                Vous
              </text>
            </svg>
            <div>
              <div className="brand-title" style={{ color: '#fff' }}>
                RENDEZVOUS<span className="orange-dot"></span>
              </div>
            </div>
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button
              className="btn-primary open-booking-modal"
              data-cursor="PESAN"
              onClick={() => {
                soundManager.playClick();
                onClose();
                onOpenBooking();
              }}
            >
              <span>RESERVASI</span>
            </button>

            <button
              className="fs-menu-close-btn"
              id="fsMenuCloseBtn"
              aria-label="Tutup Menu"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
            >
              <span>TUTUP ✕</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Fullscreen Menu Body Grid */}
      <div className="container fs-menu-container">
        <div className="fs-menu-grid">
          {/* Left: Streamlined Editorial Navigation Links */}
          <nav className="fs-nav-links-stack">
            {navItems.map((item) => (
              <a
                key={item.num}
                href={item.href}
                className="fs-nav-link"
                data-cursor={item.title}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
              >
                <span className="fs-nav-num">{item.num}</span>
                <span className="fs-nav-title">{item.title}</span>
              </a>
            ))}
          </nav>

          {/* Right: Compact Booking Card */}
          <div className="fs-hub-sidebar">
            <div className="fs-hub-card">
              <div className="fs-hub-card-label">RESERVASI EKSKLUSIF</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-cream)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                5 Lokasi di Indonesia: Senopati, Menteng, Dago, Seminyak, Graha Famili.
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.15rem' }}>
                WhatsApp Concierge: <a href="tel:+622157901234" style={{ color: 'var(--orange-primary)', fontWeight: 700 }}>+62 21-5790-1234</a>
              </p>
              <button
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                  onOpenBooking();
                }}
              >
                <span>PESAN JADWAL SEKARANG</span>
              </button>
            </div>

            <div className="fs-hub-footer">
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram">
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Facebook">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                © 2026 RENDEZVOUS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
