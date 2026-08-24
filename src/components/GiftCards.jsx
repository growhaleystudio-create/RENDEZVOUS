'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '@/lib/sounds';

export default function GiftCards() {
  const [amount, setAmount] = useState(500000);
  const [customAmount, setCustomAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const presets = [
    { val: 250000, label: 'Rp 250rb' },
    { val: 500000, label: 'Rp 500rb' },
    { val: 750000, label: 'Rp 750rb' },
    { val: 1000000, label: 'Rp 1 Jt' },
  ];

  const handleSelectAmount = (val) => {
    soundManager.playClick();
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    if (val && !isNaN(val)) {
      setAmount(Number(val));
    }
  };

  const handleIssueGiftCard = (e) => {
    e.preventDefault();
    soundManager.playSuccessChime();
    setIsSuccess(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5E1E', '#D4AF37', '#FFFFFF', '#FFA726'],
      });
    } catch (err) {}
  };

  const displayAmount = amount > 0 ? `Rp ${amount.toLocaleString('id-ID')}` : 'Rp 500.000';
  const displayRecipient = recipient.trim() ? recipient.toUpperCase() : 'TAMU TERHORMAT';
  const displayMessage = message.trim()
    ? `“${message}”`
    : '“Nikmati pengalaman perawatan mewah berkelas di RendezVous Barbershop Indonesia.”';

  return (
    <section className="py-section giftcard-section" id="giftcards">
      <div className="container">
        {/* Centered Header */}
        <div className="section-header-centered section-header-reveal">
          <span className="badge-tag amber">VOUCHER EKSKLUSIF</span>
          <h2 className="section-title-huge">
            Kartu Hadiah Digital <em>& Akses VIP</em>
          </h2>
          <p className="section-subtitle">
            Berikan hadiah perawatan berkelas untuk orang terdekat, rekan kerja, atau diri Anda sendiri. Berlaku di 5 cabang Indonesia tanpa tanggal kadaluarsa.
          </p>
        </div>

        <div className="giftcard-portal-grid">
          {/* Form Controls */}
          <div className="gc-control-box">
            <h3 className="font-serif text-cream" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              Kustomisasi Voucher Hadiah
            </h3>
            <p className="text-muted" style={{ fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Pilih nominal dan sesuaikan pesan khusus secara real-time:
            </p>

            <label className="text-muted" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>
              PILIH NOMINAL VOUCHER (IDR)
            </label>
            <div className="gc-amount-presets">
              {presets.map((item) => (
                <button
                  key={item.val}
                  type="button"
                  className={`gc-amount-btn ${amount === item.val && !customAmount ? 'selected' : ''}`}
                  onClick={() => handleSelectAmount(item.val)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="text-muted" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>
                NOMINAL LAIN (Rp)
              </label>
              <input
                type="number"
                className="gc-form-input"
                id="gcCustomAmount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Atau masukkan nominal kustom (misal: 350000)"
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="text-muted" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>
                NAMA LENGKAP PENERIMA
              </label>
              <input
                type="text"
                className="gc-form-input"
                id="gcRecipientInput"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Contoh: Alexander Wright"
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label className="text-muted" style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '0.4rem' }}>
                PESAN KHUSUS / UCAPAN
              </label>
              <input
                type="text"
                className="gc-form-input"
                id="gcMessageInput"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Contoh: Selamat Ulang Tahun! Nikmati perawatan spesial ini."
              />
            </div>

            <button
              type="button"
              className="btn-primary"
              id="gcIssueBtn"
              style={{ width: '100%' }}
              onClick={handleIssueGiftCard}
            >
              <span>BUAT VOUCHER DIGITAL SEKARANG</span>
            </button>

            {isSuccess && (
              <div
                id="gcSuccessNotice"
                style={{
                  marginTop: '1rem',
                  padding: '0.9rem',
                  background: 'rgba(34,197,94,0.12)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  color: '#4ADE80',
                }}
              >
                <i className="fa-solid fa-circle-check"></i> Voucher Hadiah Digital Berhasil Dibuat! Tunjukkan kode{' '}
                <strong>#RDV-GIFT-2026</strong> saat pembayaran di kasir cabang manapun.
              </div>
            )}
          </div>

          {/* Live Visual Preview Card */}
          <div className="gc-visual-preview-card">
            <div className="gc-card-brand-row">
              <div>
                <div className="gc-brand-text">
                  RENDEZVOUS<span className="text-orange">.</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--orange-primary)', letterSpacing: '2px' }}>
                  INDONESIA GROOMING HAVEN
                </div>
              </div>
              <div className="gc-chip-icon"></div>
            </div>

            <div>
              <div className="gc-amount-display" id="gcPreviewAmount">
                {displayAmount}
              </div>
              <p id="gcPreviewMessage" style={{ fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--text-cream)', marginBottom: '0.75rem' }}>
                {displayMessage}
              </p>
            </div>

            <div className="gc-card-footer-row">
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '1px' }} id="gcPreviewRecipient">
                  UNTUK: {displayRecipient}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                  TANPA KADALUARSA • 5 CABANG INDONESIA
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--amber-gold)', fontWeight: 700 }}>
                RDV PASS
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
