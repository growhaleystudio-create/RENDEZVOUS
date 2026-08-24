'use client';

import { soundManager } from '@/lib/sounds';

export default function Lookbook({ onOpenBooking }) {
  const looks = [
    {
      id: 1,
      image: '/images/lookbook.jpg',
      category: 'GAYA KLASIK • 40 MENIT',
      title: 'The Executive Low Taper',
      service: 'Skin Fade & Precision Taper',
      price: 'Rp 220rb',
    },
    {
      id: 2,
      image: '/images/craft.jpg',
      category: 'ARSITEKTUR MODERN',
      title: 'Textured French Crop',
      service: 'The RendezVous Signature Cut',
      price: 'Rp 180rb',
    },
    {
      id: 3,
      image: '/images/shave.jpg',
      category: 'RITUAL TRADISIONAL',
      title: 'Hot Towel Razor Shave',
      service: 'Royal Hot Towel Straight Razor Shave',
      price: 'Rp 160rb',
    },
    {
      id: 4,
      image: '/images/loc_king.jpg',
      category: 'ARSITEKTUR JENGGOT',
      title: 'Defined Beard Architecture',
      service: 'Beard Architecture & Razor Lineup',
      price: 'Rp 130rb',
    },
    {
      id: 5,
      image: '/images/loc_yonge.jpg',
      category: 'RITUAL LENGKAP • 75 MENIT',
      title: 'The Full RendezVous',
      service: 'The RendezVous Royal Package',
      price: 'Rp 350rb',
    },
    {
      id: 6,
      image: '/images/hero.jpg',
      category: 'ZERO SHADOW BLENDING',
      title: 'Foil Skin Fade & Part',
      service: 'Skin Fade & Precision Taper',
      price: 'Rp 220rb',
    },
  ];

  return (
    <section className="py-section lookbook-section" id="lookbook">
      <div className="container">
        {/* Centered Header */}
        <div className="section-header-centered section-header-reveal">
          <span className="badge-tag amber">GALERI GAYA</span>
          <h2 className="section-title-huge">
            Arsip Lookbook <em>Gaya Rambut</em>
          </h2>
          <p className="section-subtitle">
            Kurasi potongan rambut presisi dan transformasi jenggot pria modern. Klik gaya pilihan Anda untuk langsung memesan jadwal.
          </p>
        </div>

        <div className="lookbook-grid">
          {looks.map((item) => (
            <div key={item.id} className="lookbook-item" data-cursor="LIHAT">
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="lookbook-overlay">
                <div className="lookbook-category">{item.category}</div>
                <h3 className="lookbook-title">{item.title}</h3>
                <button
                  className="book-style-direct-btn"
                  onClick={() => {
                    soundManager.playClick();
                    if (onOpenBooking) onOpenBooking(item.service);
                  }}
                >
                  {`PILIH GAYA INI (${item.price})`}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
