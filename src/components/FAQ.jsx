'use client';

import { useState } from 'react';
import { soundManager } from '@/lib/sounds';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Apakah cuci rambut sudah termasuk dalam harga potong rambut?',
      a: 'Tentu saja! Jika Anda menginginkannya dan sesuai dengan rekomendasi barber, rambut Anda akan dicuci bersih menggunakan sampo botanikal hangat tanpa biaya tambahan apapun.',
    },
    {
      q: 'Apakah saya perlu reservasi jadwal atau bisa langsung datang (walk-in)?',
      a: 'Kami sangat menyarankan reservasi online melalui situs ini atau WhatsApp untuk memastikan Anda tidak perlu menunggu dan bisa memilih master barber favorit. Namun, kami tetap menerima walk-in sesuai ketersediaan kursi di seluruh cabang Toronto.',
    },
    {
      q: 'Apakah sajian kopi espresso Italia benar-benar gratis?',
      a: 'Ya, 100% complimentary! Barista bar kami siap menyajikan espresso Italia premium, cappuccino, atau teh artisan hangat untuk menemani sesi relaksasi Anda.',
    },
    {
      q: 'Bagaimana kebijakan pembatalan atau perubahan jadwal reservasi?',
      a: 'Kami memahami jadwal Anda dapat berubah. Anda dapat membatalkan atau mengubah jadwal tanpa biaya hingga 2 jam sebelum waktu sesi Anda melalui SMS atau kontak cabang kami.',
    },
    {
      q: 'Apa itu protokol set alat higienis personal yang digunakan di Rendezvous?',
      a: 'Setiap gunting, mata pisau, dan sisir melewati proses pembersihan autoklaf berstandar medis dan dikemas dalam segel steril individual yang baru dibuka tepat di depan Anda saat sesi dimulai.',
    },
    {
      q: 'Apakah voucher hadiah digital memiliki masa kadaluarsa?',
      a: 'Tidak! Voucher dan Gift Pass RendezVous berlaku selamanya tanpa batas waktu dan dapat digunakan di kelima cabang Toronto untuk semua jenis layanan atau produk perawatan.',
    },
  ];

  const handleToggle = (index) => {
    soundManager.playClick();
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-section faq-section" id="faq">
      <div className="container">
        {/* Centered Header */}
        <div className="section-header-centered section-header-reveal">
          <span className="badge-tag">TANYA JAWAB</span>
          <h2 className="section-title-huge">
            Pertanyaan Umum <em>& Kebijakan</em>
          </h2>
          <p className="section-subtitle">
            Segala hal yang perlu Anda ketahui mengenai reservasi, fasilitas gratis, dan kebijakan salon kami.
          </p>
        </div>

        <div className="faq-wrapper">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className={`faq-item ${isOpen ? 'active' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <div className="faq-icon">
                    <i className="fa-solid fa-chevron-down"></i>
                  </div>
                </button>
                <div className="faq-answer" style={{ maxHeight: isOpen ? '250px' : '0' }}>
                  <p>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
