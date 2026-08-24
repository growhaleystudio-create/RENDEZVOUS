'use client';

export default function Reviews() {
  const reviews = [
    {
      author: 'Zoheb',
      location: 'Yonge & Wellington',
      quote: '“Sudah tiga kali berkunjung ke Rendezvous Wellington dan pelayanannya selalu luar biasa. Hamo adalah barber yang hebat, tekniknya kelas atas dan hospitality-nya terbaik di Toronto.”',
    },
    {
      author: 'Evan M.',
      location: 'Queen St West',
      quote: '“Pengalaman yang luar biasa, Stas benar-benar salah satu barber terbaik di kota! Interior mewah dengan sajian espresso gratis, kursi Takara yang sangat nyaman, dan staf yang ramah.”',
    },
    {
      author: 'Andres K.',
      location: 'Scarborough Flagship',
      quote: '“Barbershop TERBAIK di seluruh GTA. Potongan rambutnya rapi sempurna, protokol alat sterilnya sangat profesional, Cesar sangat ramah dan teliti. Sangat direkomendasikan 10/10.”',
    },
    {
      author: 'Paul R.',
      location: 'King St & Bathurst',
      quote: '“Rendezvous di King West adalah tempat yang luar biasa. Suasana nyaman, percakapan hangat, dan hasil skin fade presisi setiap kali saya berkunjung.”',
    },
    {
      author: 'Edson V.',
      location: 'Yonge & Wellington',
      quote: '“Issa adalah yang terbaik! Sangat profesional, detail luar biasa, dan efisien. Pasti akan selalu kembali ke sini.”',
    },
  ];

  return (
    <section className="py-section testimonials-section" id="reviews">
      <div className="container">
        {/* Centered Header */}
        <div className="section-header-centered section-header-reveal">
          <span className="badge-tag">REPUTASI</span>
          <h2 className="section-title-huge">
            Kata Pelanggan <em>Setia Kami</em>
          </h2>
          <p className="section-subtitle">
            Lebih dari 2.400 ulasan bintang lima di Google dari para eksekutif, kreator, dan pria berkelas di seluruh Toronto.
          </p>
        </div>
      </div>

      {/* Infinite Scroll Testimonial Marquee */}
      <div className="testimonials-carousel-container">
        <div className="testimonials-track">
          {reviews.concat(reviews).map((r, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-quote">{r.quote}</p>
              <div className="testimonial-author">
                <span className="author-name">{r.author}</span>
                <span className="author-location">
                  <i className="fa-solid fa-location-dot"></i> {r.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
