export function isActivePrototypeHref(href) {
  return (
    typeof href === "string" &&
    (href === "/" || href.startsWith("/#") || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:"))
  );
}
