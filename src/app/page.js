'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import FullscreenMenu from '@/components/FullscreenMenu';
import HeroOrange from '@/components/HeroOrange';
import Philosophy from '@/components/Philosophy';
import Services from '@/components/Services';
import Locations from '@/components/Locations';
import Team from '@/components/Team';
import Lookbook from '@/components/Lookbook';
import EditorialAppCallout from '@/components/EditorialAppCallout';
import Reviews from '@/components/Reviews';
import GiftCards from '@/components/GiftCards';
import Journal from '@/components/Journal';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);

  const handleOpenBooking = (service = null, location = null, barber = null) => {
    setSelectedService(service);
    setSelectedLocation(location);
    setSelectedBarber(barber);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Header */}
      <Header
        onOpenBooking={() => handleOpenBooking()}
        onToggleMenu={handleToggleMenu}
      />

      {/* Fullscreen 1-Screen Menu Overlay */}
      <FullscreenMenu
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main Content Wrapper */}
      <main className="main-curtain-wrapper" id="mainCurtainWrap">
        {/* Signature Bold Orange Hero */}
        <HeroOrange onOpenBooking={() => handleOpenBooking()} />

        {/* Philosophy & Experience Section */}
        <Philosophy />

        {/* Services & Pricing Menu */}
        <Services onOpenBooking={handleOpenBooking} />

        {/* 5 Toronto Locations (Showcase Grid + Interactive Map) */}
        <Locations onOpenBooking={handleOpenBooking} />

        {/* Master Barbers Showcase */}
        <Team onOpenBooking={handleOpenBooking} />

        {/* Digital Lookbook Archive */}
        <Lookbook onOpenBooking={handleOpenBooking} />

        {/* App Callout Manifesto */}
        <EditorialAppCallout onOpenBooking={() => handleOpenBooking()} />

        {/* Client Reviews Testimonials Marquee */}
        <Reviews />

        {/* Gift Cards & Digital Vouchers */}
        <GiftCards />

        {/* RDV Paper Journal */}
        <Journal />

        {/* FAQ Accordion */}
        <FAQ />
      </main>

      {/* Luxury Curtain Footer */}
      <Footer />

      {/* Interactive 5-Step Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        initialService={selectedService}
        initialLocation={selectedLocation}
        initialBarber={selectedBarber}
      />
    </>
  );
}
