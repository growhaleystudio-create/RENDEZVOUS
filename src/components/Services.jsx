'use client';

import { useState } from 'react';
import { soundManager } from '@/lib/sounds';

export default function Services({ onOpenBooking }) {
  const [filter, setFilter] = useState('all');

  const services = [
    {
      id: 'signature-cut',
      category: 'haircut',
      name: 'The RendezVous Signature Cut',
      price: 'Rp 180.000',
      duration: '40 MENIT',
      badge: 'Paling Populer',
      desc: 'Potongan rambut presisi khusus gaya rambut pendek modern. Sudah mencakup konsultasi wajah, cuci rambut hangat, perapian leher dengan pisau cukur, dan styling produk premium.',
      features: [
        'Arsitektur gunting & clipper berpresisi tinggi',
        'Cukur garis tepi leher dengan busa hangat',
        'Termasuk sajian espresso Italia / air mineral',
      ],
      footerNote: 'Termasuk cuci rambut',
    },
    {
      id: 'skin-fade',
      category: 'haircut',
      name: 'Skin Fade & Precision Taper',
      price: 'Rp 220.000',
      duration: '45 MENIT',
      badge: 'Spesialis Fade',
      desc: 'Gradasi fade mulus (low, mid, atau high) yang disesuaikan dengan bentuk kepala menggunakan foil shaver untuk hasil bersih tanpa bayangan rambut.',
      features: [
        'Finishing foil shaver untuk hasil zero-gap ekstra halus',
        'Penataan garis pelipis dan batas rambut presisi',
        'Aplikasi styling matte texturizing dust atau clay',
      ],
      footerNote: 'Hasil zero-gap ultra bersih',
    },
    {
      id: 'hot-towel-shave',
      category: 'shave',
      name: 'Royal Hot Towel Straight Razor Shave',
      price: 'Rp 160.000',
      duration: '35 MENIT',
      badge: 'Ritual Klasik',
      desc: 'Ritual cukur pisau lipat tradisional dengan 3 lapis handuk hangat beraroma eucalyptus, busa krim hangat, cukuran pisau baja Jepang, dan aftershave dingin.',
      features: [
        'Handuk uap hangat minyak esensial organik',
        'Cukuran halus pisau lipat baja Jepang',
        'Handuk dingin penutup pori-pori & balsem penyejuk',
      ],
      footerNote: 'Ritual cukur tradisional',
    },
    {
      id: 'beard-architecture',
      category: 'shave',
      name: 'Beard Architecture & Razor Lineup',
      price: 'Rp 130.000',
      duration: '30 MENIT',
      badge: 'Arsitektur Jenggot',
      desc: 'Pembentukan struktur jenggot, gradasi panjang yang rapi, garis pipi tajam dengan pisau cukur, handuk uap hangat, dan pijat minyak sandalwood.',
      features: [
        'Garis pipi dan leher simetris geometris',
        'Detail kumis dan gradasi rambut liar',
        'Pijat nutrisi minyak argan & jojoba',
      ],
      footerNote: 'Presisi garis simetris',
    },
    {
      id: 'royal-package',
      category: 'package',
      name: 'The RendezVous Royal Package',
      price: 'Rp 350.000',
      duration: '75 MENIT',
      badge: 'Paket Terbaik',
      desc: 'Kombinasi Signature Cut + Royal Hot Towel Shave + Pijat relaksasi kepala & bahu singkat. Pengalaman grooming pria paling paripurna di Indonesia.',
      features: [
        'Potongan Signature + Cukur Pisau Lipat Lengkap',
        'Pijat kulit kepala restoratif 10 menit',
        'Double espresso / minuman pilihan',
      ],
      footerNote: 'Hemat Rp 50.000 dibanding satuan',
    },
    {
      id: 'junior-grooming',
      category: 'kids',
      name: 'Junior Grooming (14 Tahun ke Bawah)',
      price: 'Rp 140.000',
      duration: '30 MENIT',
      badge: 'Anak & Remaja',
      desc: 'Pengalaman potong rambut yang sabar dan berkualitas tinggi khusus untuk pria muda usia 14 tahun ke bawah. Suasana santai dengan hasil potongan rapi.',
      features: [
        'Gaya rambut modern anak dan remaja',
        'Gunting presisi dan clipper bersuara halus',
        'Jus atau camilan manis gratis',
      ],
      footerNote: 'Usia 14 tahun ke bawah',
    },
  ];

  const filteredServices =
    filter === 'all' ? services : services.filter((s) => s.category === filter);

  return (
    <section className="py-section services-section" id="services">
      <div className="container">
        {/* Centered Header */}
        <div className="section-header-centered section-header-reveal">
          <span className="badge-tag amber">MENU PERAWATAN</span>
          <h2 className="section-title-huge">
            Layanan Eksklusif & <em>Daftar Harga</em>
          </h2>
          <p className="section-subtitle">
            Setiap layanan sudah mencakup konsultasi bentuk wajah, cuci rambut dengan sampo hangat, cukur bulu leher, dan minuman gratis.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="services-filter-bar">
          <button
            className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setFilter('all');
            }}
          >
            Semua Layanan
          </button>
          <button
            className={`filter-pill ${filter === 'haircut' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setFilter('haircut');
            }}
          >
            Potongan Rambut
          </button>
          <button
            className={`filter-pill ${filter === 'shave' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setFilter('shave');
            }}
          >
            Cukur & Jenggot
          </button>
          <button
            className={`filter-pill ${filter === 'package' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setFilter('package');
            }}
          >
            Paket Kombinasi VIP
          </button>
          <button
            className={`filter-pill ${filter === 'kids' ? 'active' : ''}`}
            onClick={() => {
              soundManager.playClick();
              setFilter('kids');
            }}
          >
            Anak-Anak
          </button>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {filteredServices.map((service) => (
            <div key={service.id} className="service-card" data-category={service.category}>
              <div>
                <div className="service-header">
                  <h3 className="service-name">{service.name}</h3>
                  <div className="service-price">{service.price}</div>
                </div>
                <div className="service-meta">
                  <span><i className="fa-regular fa-clock"></i> {service.duration}</span>
                  <span>•</span>
                  <span>{service.badge}</span>
                </div>
                <p className="service-desc">{service.desc}</p>
                <ul className="service-features-list">
                  {service.features.map((feat, idx) => (
                    <li key={idx}>
                      <i className="fa-solid fa-check"></i> {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="service-card-footer">
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                  {service.footerNote}
                </span>
                <button
                  className="service-book-btn"
                  onClick={() => {
                    soundManager.playClick();
                    onOpenBooking(service.name);
                  }}
                >
                  PESAN LAYANAN
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
