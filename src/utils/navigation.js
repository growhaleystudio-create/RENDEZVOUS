// Prototipe: hanya homepage, booking, email, dan telepon yang aktif; halaman lain masih ditampilkan tanpa link.
export function isActivePrototypeHref(href) {
  return (
    typeof href === "string" &&
    (href === "/" ||
      href.startsWith("/#") ||
      href.startsWith("#") ||
      href === "/booking/" ||
      href.startsWith("/booking/?") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:"))
  );
}
