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
            <h3 className="font-serif text-cream gc-heading">
              Kustomisasi Voucher Hadiah
            </h3>
            <p className="text-muted gc-subheading">
              Pilih nominal dan sesuaikan pesan khusus secara real-time:
            </p>

            <div className="gc-form-group">
              <label className="gc-input-label">
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
            </div>

            <div className="gc-form-group">
              <label className="gc-input-label">
                NOMINAL LAIN (Rp)
              </label>
              <input
                type="number"
                className="gc-form-input"
                id="gcCustomAmount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="Atau masukkan nominal kustom"
              />
            </div>

            <div className="gc-form-group">
              <label className="gc-input-label">
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

            <div className="gc-form-group gc-form-group-last">
              <label className="gc-input-label">
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
              className="btn-primary gc-submit-btn"
              id="gcIssueBtn"
              style={{ width: '100%' }}
              onClick={handleIssueGiftCard}
            >
              <span>BUAT VOUCHER DIGITAL SEKARANG</span>
            </button>

            {isSuccess && (
              <div
                id="gcSuccessNotice"
                className="gc-success-alert"
              >
                <i className="fa-solid fa-circle-check"></i> Voucher Hadiah Digital Berhasil Dibuat! Tunjukkan kode{' '}
                <strong>#RDV-GIFT-2026</strong> saat pembayaran di kasir cabang manapun.
              </div>
            )}
          </div>

          {/* Live Visual Preview Card */}
          <div className="gc-visual-preview-card">
            <div className="gc-card-brand-row">
              <div className="gc-card-brand-col">
                <div className="gc-brand-text">
                  RENDEZVOUS<span className="text-orange">.</span>
                </div>
                <div className="gc-brand-tagline">
                  INDONESIA GROOMING HAVEN
                </div>
              </div>
              <div className="gc-chip-icon"></div>
            </div>

            <div className="gc-card-body">
              <div className="gc-amount-display" id="gcPreviewAmount">
                {displayAmount}
              </div>
              <p id="gcPreviewMessage" className="gc-preview-message">
                {displayMessage}
              </p>
            </div>

            <div className="gc-card-footer-row">
              <div className="gc-recipient-info">
                <div className="gc-recipient-label" id="gcPreviewRecipient">
                  UNTUK: {displayRecipient}
                </div>
                <div className="gc-recipient-sub">
                  TANPA KADALUARSA • 5 CABANG INDONESIA
                </div>
              </div>
              <div className="gc-pass-badge">
                RDV PASS
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
