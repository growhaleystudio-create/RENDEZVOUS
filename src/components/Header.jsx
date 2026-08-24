'use client';

import { useState, useEffect } from 'react';
import { soundManager } from '@/lib/sounds';

export default function Header({ onToggleMenu }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      setIsScrolled(scrollY > 140);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : 'header-hidden'}`} id="siteHeader">
      <div className="container">
        <div className="nav-wrapper">
          {/* Brand Logo */}
          <a
            href="#hero"
            className="brand-logo"
            data-cursor="RDV"
            onClick={() => soundManager.playClick()}
          >
            <svg
              className="rdv-scissors-icon"
              viewBox="0 0 160 85"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Logo Rendezvous Barbershop"
            >
              <text
                x="80"
                y="24"
                textAnchor="middle"
                fontFamily="'Cinzel', 'Space Grotesk', serif"
                fontWeight="900"
                fontSize="24"
                letterSpacing="3"
                fill="currentColor"
              >
                RENDEZ
              </text>
              <path d="M42 34 L118 64 M118 34 L42 64" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <circle cx="36" cy="68" r="8" stroke="currentColor" strokeWidth="3" fill="none" />
              <circle cx="124" cy="68" r="8" stroke="currentColor" strokeWidth="3" fill="none" />
              <text
                x="80"
                y="66"
                textAnchor="middle"
                fontFamily="'Playfair Display', Georgia, serif"
                fontStyle="italic"
                fontWeight="700"
                fontSize="18"
                fill="currentColor"
              >
                Vous
              </text>
            </svg>
            <div>
              <div className="brand-title">
                RENDEZVOUS<span className="orange-dot"></span>
              </div>
            </div>
          </a>

          {/* Header Actions (Burger Menu only, Reservasi removed as requested) */}
          <div className="header-actions">
            <button
              className="burger-menu-btn"
              id="burgerMenuBtn"
              aria-label="Buka Menu Navigasi"
              data-cursor="MENU"
              onClick={() => {
                soundManager.playClick();
                onToggleMenu();
              }}
            >
              <div className="burger-icon-lines">
                <span className="b-line b-line-1"></span>
                <span className="b-line b-line-2"></span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
