'use client';

import { useEffect } from 'react';

export default function ScrollRevealProvider({ children }) {
  useEffect(() => {
    // Select all section titles, subtitles, badges, statements, cards, and custom data-reveal elements
    const elementsToReveal = document.querySelectorAll(
      '[data-reveal], .section-header-centered, .section-title-huge, .section-subtitle, .badge-tag, .philosophy-statement, .feature-card, .statement-editorial-inner, .service-card, .location-card, .location-flagship-card, .locations-map-view, .barber-card, .lookbook-item, .editorial-manifesto-grid, .testimonial-card, .gc-control-box, .gc-visual-preview-card, .paper-card, .faq-item, .footer-statement-block, .hero-top-tag, .hero-brand-statement, .hero-orange-desc, .hero-orange-actions, .hero-orange-trust'
    );

    // Add reveal base class to elements if not already present
    elementsToReveal.forEach((el, index) => {
      if (!el.classList.contains('reveal-init')) {
        el.classList.add('reveal-init');
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            // Once revealed, keep it visible for smooth experience
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elementsToReveal.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}
