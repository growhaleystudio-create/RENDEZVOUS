'use client';

import { useState } from 'react';
import { soundManager } from '@/lib/sounds';

export default function Locations({ onOpenBooking }) {
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('showcase'); // 'showcase' | 'map'
  const [selectedMapPin, setSelectedMapPin] = useState('senopati');

  const locationsData = [
    {
      id: 'senopati',
      district: 'jaksel',
      name: 'Senopati Flagship',
      badge: 'FLAGSHIP JAKARTA SELATAN',
      image: '/images/loc_queen.jpg',
      address: 'Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan • SCBD Area',
      phone: '+62 21-5790-1234',
      hours: 'Sen - Sab: 09:00 – 21:00 | Min: 10:00 – 20:00',
      amenities: ['8 Kursi Master Takara', 'Valet Parking Gratis', 'Bar Kopi Espresso Italia', 'VIP Private Lounge'],
      mapsUrl: 'https://maps.google.com',
      isFlagship: true,
      pinPos: { top: '48%', left: '26%' },
    },
    {
      id: 'menteng',
      district: 'jakpus',
      name: 'Menteng Heritage',
      badge: 'JAKARTA PUSAT',
      image: '/images/loc_scarborough.jpg',
      address: 'Jl. Teuku Cik Ditiro No. 22, Menteng, Jakarta Pusat',
      phone: '+62 21-3190-5678',
      hours: 'Sen - Sab: 09:00 – 20:00 | Min: 10:00 – 18:00',
      note: 'Dekat Stasiun Cikini & Area Parkir Luas',
      mapsUrl: 'https://maps.google.com',
      isFlagship: false,
      pinPos: { top: '32%', left: '32%' },
    },
    {
      id: 'dago',
      district: 'bandung',
      name: 'Dago Highlands',
      badge: 'BANDUNG',
      image: '/images/loc_yonge.jpg',
      address: 'Jl. Ir. H. Juanda No. 180, Dago Atas, Bandung',
      phone: '+62 22-250-9876',
      hours: 'Sen - Jum: 09:00 – 20:00 | Sab - Min: 08:30 – 21:00',
      note: 'Ambiens Sejuk dengan Barista Bar Terbuka',
      mapsUrl: 'https://maps.google.com',
      isFlagship: false,
      pinPos: { top: '56%', left: '44%' },
    },
    {
      id: 'seminyak',
      district: 'bali',
      name: 'Seminyak Sanctuary',
      badge: 'BALI',
      image: '/images/loc_king.jpg',
      address: 'Jl. Kayu Aya No. 88, Seminyak, Badung, Bali',
      phone: '+62 361-730-8888',
      hours: 'Sen - Sab: 09:30 – 21:00 | Min: 10:00 – 20:00',
      note: 'Tropical Luxury Lounge & Treatment Room',
      mapsUrl: 'https://maps.google.com',
      isFlagship: false,
      pinPos: { top: '64%', left: '68%' },
    },
    {
      id: 'graha',
      district: 'surabaya',
      name: 'Graha Famili',
      badge: 'SURABAYA',
      image: '/images/loc_mutual.jpg',
      address: 'Jl. Mayjen Yono Suwoyo No. 12, Graha Famili, Surabaya Barat',
      phone: '+62 31-734-1122',
      hours: 'Sen - Sab: 09:00 – 21:00 | Min: 09:30 – 20:00',
      note: 'Akses Drive-inSCBD Barat & Lounge Eksklusif',
      mapsUrl: 'https://maps.google.com',
      isFlagship: false,
      pinPos: { top: '50%', left: '56%' },
    },
  ];

  const flagshipLoc = locationsData[0];
  const quadLocs = locationsData.slice(1);

  const filteredQuadLocs =
    filter === 'all'
      ? quadLocs
      : quadLocs.filter((l) => l.district === filter);

  const showFlagship = filter === 'all' || filter === 'jaksel';

  const currentPinLoc = locationsData.find((l) => l.id === selectedMapPin) || flagshipLoc;

  return (
    <section className="py-section locations-section" id="locations">
      <div className="container">
        {/* Centered Header */}
        <div className="section-header-centered section-header-reveal">
          <span className="badge-tag amber">CABANG KAMI</span>
          <h2 className="section-title-huge">
            5 Cabang Eksklusif <em>di Indonesia</em>
          </h2>
          <p className="section-subtitle">
            Ambiens mewah yang konsisten, protokol alat steril medis, dan master barber di setiap kota utama Indonesia. Menerima walk-in sesuai ketersediaan; reservasi sangat disarankan.
          </p>
        </div>

        {/* Controls & View Bar */}
        <div className="locations-controls-bar">
          <div className="locations-filter-tabs">
            <button
              className={`loc-tab-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setFilter('all');
              }}
            >
              Semua 5 Cabang
            </button>
            <button
              className={`loc-tab-btn ${filter === 'jaksel' ? 'active' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setFilter('jaksel');
              }}
            >
              Jakarta Selatan (Senopati)
            </button>
            <button
              className={`loc-tab-btn ${filter === 'jakpus' ? 'active' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setFilter('jakpus');
              }}
            >
              Jakarta Pusat (Menteng)
            </button>
            <button
              className={`loc-tab-btn ${filter === 'bandung' ? 'active' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setFilter('bandung');
              }}
            >
              Bandung (Dago)
            </button>
            <button
              className={`loc-tab-btn ${filter === 'bali' ? 'active' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setFilter('bali');
              }}
            >
              Bali (Seminyak)
            </button>
            <button
              className={`loc-tab-btn ${filter === 'surabaya' ? 'active' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setFilter('surabaya');
              }}
            >
              Surabaya (Graha Famili)
            </button>
          </div>

          <div className="view-switcher-group">
            <button
              className={`view-toggle-btn ${view === 'showcase' ? 'active' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setView('showcase');
              }}
            >
              <i className="fa-solid fa-grip"></i> TAMPILAN GRID
            </button>
            <button
              className={`view-toggle-btn ${view === 'map' ? 'active' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setView('map');
              }}
            >
              <i className="fa-solid fa-map-location-dot"></i> PETA INTERAKTIF
            </button>
          </div>
        </div>

        {/* VIEW 1: Showcase Grid (1 Hero Flagship + 4 Symmetrical District Cards) */}
        {view === 'showcase' && (
          <div className="locations-showcase-wrap" id="locationsShowcaseView">
            {showFlagship && (
              <div className="location-flagship-card" data-district="jaksel">
                <div className="flagship-photo-wrap">
                  <img src={flagshipLoc.image} alt={flagshipLoc.name} loading="lazy" />
                  <div className="flagship-photo-badge">{flagshipLoc.badge}</div>
                </div>
                <div className="flagship-details-wrap">
                  <div className="flagship-header">
                    <div className="live-status-pill open">
                      <span className="live-dot open"></span> BUKA SEKARANG • Tutup 21:00
                    </div>
                    <h3 className="flagship-title">{flagshipLoc.name}</h3>
                    <p className="flagship-sub">{flagshipLoc.address}</p>
                  </div>

                  <div className="flagship-amenities-row">
                    <div className="amenity-item"><i className="fa-solid fa-chair"></i> 8 Kursi Master Takara</div>
                    <div className="amenity-item"><i className="fa-solid fa-car"></i> Valet Parking Gratis</div>
                    <div className="amenity-item"><i className="fa-solid fa-mug-saucer"></i> Bar Kopi Espresso Italia</div>
                    <div className="amenity-item"><i className="fa-solid fa-crown"></i> VIP Private Lounge</div>
                  </div>

                  <div className="location-info-list" style={{ margin: '0 0 1.75rem' }}>
                    <div className="loc-info-item">
                      <i className="fa-solid fa-phone"></i>
                      <a href={`tel:${flagshipLoc.phone}`}>{flagshipLoc.phone}</a>
                    </div>
                    <div className="loc-info-item">
                      <i className="fa-regular fa-clock"></i>
                      <span>{flagshipLoc.hours}</span>
                    </div>
                  </div>

                  <div className="location-actions">
                    <button
                      className="btn-primary"
                      onClick={() => {
                        soundManager.playClick();
                        onOpenBooking(null, flagshipLoc.name);
                      }}
                    >
                      PESAN DI SENOPATI
                    </button>
                    <a
                      href={flagshipLoc.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      PETUNJUK ARAH
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 4 District Cards */}
            <div className="locations-quad-grid">
              {filteredQuadLocs.map((loc) => (
                <div key={loc.id} className="location-card" data-district={loc.district}>
                  <div className="loc-card-media">
                    <img src={loc.image} alt={loc.name} loading="lazy" />
                    <div className="loc-card-district-badge">{loc.badge}</div>
                  </div>
                  <div className="loc-card-body">
                    <div>
                      <div className="live-status-pill open">
                        <span className="live-dot open"></span> BUKA SEKARANG
                      </div>
                      <h3 className="loc-card-title">{loc.name}</h3>
                      <div className="location-info-list">
                        <div className="loc-info-item">
                          <i className="fa-solid fa-location-dot"></i>
                          <span>{loc.address}</span>
                        </div>
                        <div className="loc-info-item">
                          <i className="fa-solid fa-phone"></i>
                          <a href={`tel:${loc.phone}`}>{loc.phone}</a>
                        </div>
                        <div className="loc-info-item">
                          <i className="fa-regular fa-clock"></i>
                          <span>{loc.hours}</span>
                        </div>
                        {loc.note && (
                          <div className="loc-info-item">
                            <i className="fa-solid fa-circle-check"></i>
                            <span>{loc.note}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="location-actions">
                      <button
                        className="btn-primary"
                        onClick={() => {
                          soundManager.playClick();
                          onOpenBooking(null, loc.name);
                        }}
                      >
                        {`PESAN ${loc.name.toUpperCase()}`}
                      </button>
                      <a
                        href={loc.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                      >
                        PETA
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: Interactive SVG Map */}
        {view === 'map' && (
          <div className="locations-map-view" style={{ display: 'block' }} id="locationsMapView">
            <div className="map-hub-container">
              <div className="interactive-toronto-canvas">
                <div className="map-grid-bg"></div>

                {locationsData.map((loc) => (
                  <div
                    key={loc.id}
                    className={`map-pin ${selectedMapPin === loc.id ? 'active' : ''}`}
                    style={{ top: loc.pinPos.top, left: loc.pinPos.left }}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedMapPin(loc.id);
                    }}
                  >
                    <div className="pin-beacon"></div>
                    <div className="pin-title">{loc.name}</div>
                  </div>
                ))}

                <div className="lake-ontario-watermark">
                  RENDEZVOUS INDONESIA • FLAGSHIP NETWORK
                </div>
              </div>

              {/* Dynamic Shop Card */}
              <div className="map-shop-previews-stack">
                <div className="map-shop-preview-card active">
                  <span className="badge-tag">{currentPinLoc.badge}</span>
                  <h3 className="font-serif text-cream" style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>
                    {currentPinLoc.name}
                  </h3>
                  <p className="text-muted" style={{ fontSize: '0.88rem', marginBottom: '1rem' }}>
                    {currentPinLoc.address}
                  </p>
                  <div className="live-status-pill open" style={{ marginBottom: '1.25rem' }}>
                    <span className="live-dot open"></span> BUKA SEKARANG
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      className="btn-primary"
                      style={{ flex: 1 }}
                      onClick={() => {
                        soundManager.playClick();
                        onOpenBooking(null, currentPinLoc.name);
                      }}
                    >
                      PESAN SEKARANG
                    </button>
                    <a
                      href={currentPinLoc.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: '0.75rem 1rem' }}
                    >
                      PETA
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
