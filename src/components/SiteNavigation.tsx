import { useEffect, useState } from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { ListIcon } from "@phosphor-icons/react/dist/ssr/List";
import { XIcon } from "@phosphor-icons/react/dist/ssr/X";
import { isActivePrototypeHref } from "../utils/navigation.js";

type SiteNavigationProps = {
  bookingUrl: string;
  sectionPrefix: string;
};

export default function SiteNavigation({ bookingUrl, sectionPrefix }: SiteNavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { href: `${sectionPrefix}#services`, label: "Layanan" },
    { href: `${sectionPrefix}#branches`, label: "Cabang" },
    { href: `${sectionPrefix}#barbers`, label: "Barber" },
    { href: `${sectionPrefix}#lookbook`, label: "Lookbook" },
    { href: `${sectionPrefix}#articles`, label: "Jurnal" },
    { href: `${sectionPrefix}#faq`, label: "FAQ" },
  ];
  const renderNavLink = (link: { href: string; label: string }, onClick?: () => void) =>
    isActivePrototypeHref(link.href) ? (
      <a href={link.href} key={link.href} onClick={onClick}>{link.label}</a>
    ) : (
      <span className="prototype-link--inert" key={link.href}>{link.label}</span>
    );

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="site-header__inner mx-auto flex w-full items-center justify-between">
        <a className="site-brand" href="/" aria-label="Rendezvous — beranda">
          <span>Rendezvous</span>
          <small>Barbershop</small>
        </a>
        <button
          aria-controls="site-menu-panel"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          className="menu-trigger flex items-center gap-3"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? (
            <XIcon size={25} weight="regular" aria-hidden="true" />
          ) : (
            <ListIcon size={25} weight="regular" aria-hidden="true" />
          )}
          <span>{menuOpen ? "Tutup menu" : "Buka menu"}</span>
        </button>

        <nav aria-label="Navigasi utama" className="desktop-nav flex items-center gap-8">
          {navLinks.map((link) => (
            renderNavLink(link)
          ))}
          {isActivePrototypeHref(bookingUrl) ? <a className="button button--primary button--compact" href={bookingUrl}>
            <span>Booking<span className="site-header__booking-extra"> sekarang</span></span>
            <ArrowUpRightIcon size={18} weight="regular" aria-hidden="true" />
          </a> : <span className="button button--primary button--compact prototype-link--inert">
            <span>Booking<span className="site-header__booking-extra"> sekarang</span></span>
            <ArrowUpRightIcon size={18} weight="regular" aria-hidden="true" />
          </span>}
        </nav>

        <nav
          aria-label="Menu utama"
          className="menu-panel"
          hidden={!menuOpen}
          id="site-menu-panel"
        >
          {navLinks.map((link) => (
            renderNavLink(link, () => setMenuOpen(false))
          ))}
          {isActivePrototypeHref(bookingUrl) ? <a href={bookingUrl} onClick={() => setMenuOpen(false)}>
            Booking sekarang <ArrowUpRightIcon size={17} aria-hidden="true" />
          </a> : <span className="prototype-link--inert">
            Booking sekarang <ArrowUpRightIcon size={17} aria-hidden="true" />
          </span>}
        </nav>
      </div>
    </header>
  );
}
