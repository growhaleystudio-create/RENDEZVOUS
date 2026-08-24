import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import ScissorsCanvas3D from '@/components/ScissorsCanvas3D';
import ScrollRevealProvider from '@/components/ScrollRevealProvider';

export const metadata = {
  title: 'RENDEZVOUS — Barbershop Mewah & Spesialis Gaya Rambut Modern di Indonesia',
  description: 'Ambiens mewah yang konsisten, standar sterilisasi alat medis, dan master barber di 5 cabang Indonesia. Sediakan waktu untuk diri Anda.',
  keywords: 'barbershop indonesia, barbershop jakarta, rendezvous barbers, luxury haircut, skin fade, straight razor shave',
  openGraph: {
    title: 'RENDEZVOUS — Indonesian Luxury Grooming Haven',
    description: 'Ambiens mewah yang konsisten, standar sterilisasi alat medis, dan master barber di 5 cabang Indonesia.',
    images: ['/images/hero.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          precedence="default"
        />
      </head>
      <body>
        <CustomCursor />
        <ScissorsCanvas3D />
        <ScrollRevealProvider>
          {children}
        </ScrollRevealProvider>
      </body>
    </html>
  );
}
