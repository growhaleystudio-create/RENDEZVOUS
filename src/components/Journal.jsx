'use client';

import { soundManager } from '@/lib/sounds';

export default function Journal() {
  const articles = [
    {
      category: 'GAYA & TEKNIK',
      readTime: '4 MENIT BACA',
      title: 'Skin Fade vs. Taper: Mana Potongan yang Paling Cocok untuk Wajah Anda?',
      excerpt: 'Bingung memilih antara skin fade atau taper? Master barber Rendezvous mengupas tuntas perbedaan garis potongan, kemudahan perawatan harian, dan kesesuaian bentuk wajah.',
    },
    {
      category: 'KESEHATAN RAMBUT',
      readTime: '3 MENIT BACA',
      title: 'Terapi Kulit Kepala Mendalam: Kunci Menjaga Folikel Rambut Tetap Kuat',
      excerpt: 'Mengapa eksfoliasi kulit kepala sangat penting untuk pria perkotaan? Pelajari bagaimana minyak tea tree dan pijatan titik saraf menjaga rambut tebal dan bebas ketombe.',
    },
    {
      category: 'PERAWATAN JENGGOT',
      readTime: '5 MENIT BACA',
      title: 'Panduan Merawat Jenggot Profesional untuk Pria Eksekutif',
      excerpt: 'Cara menumbuhkan dan merapikan jenggot agar terlihat rapi dan elegan di lingkungan bisnis. Aturan geometris garis leher, gradasi panjang, dan hidrasi harian.',
    },
  ];

  return (
    <section className="py-section paper-section" id="paper">
      <div className="container">
        {/* Centered Header */}
        <div className="section-header-centered section-header-reveal">
          <span className="badge-tag amber">JURNAL & ARTIKEL</span>
          <h2 className="section-title-huge">
            RDV <em>Paper</em>
          </h2>
          <p className="section-subtitle">
            Wawasan mendalam tentang arsitektur rambut pria, perawatan jenggot, dan gaya hidup modern.
          </p>
        </div>

        <div className="paper-grid">
          {articles.map((art, idx) => (
            <div key={idx} className="paper-card" data-cursor="BACA" onClick={() => soundManager.playClick()}>
              <div className="paper-meta">
                <span>{art.category}</span>
                <span>{art.readTime}</span>
              </div>
              <h3 className="paper-title">{art.title}</h3>
              <p className="paper-excerpt">{art.excerpt}</p>
              <div className="paper-read-link">
                <span>BACA SELENGKAPNYA</span>
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
