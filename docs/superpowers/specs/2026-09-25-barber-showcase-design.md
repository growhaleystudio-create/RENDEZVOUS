# Barber Showcase — Design Spec

## Goal

Redesign the homepage `#barbers` section into an image-led, Swiss editorial showcase based on the supplied four-portrait reference. Keep its content aligned with the landing page's CMS-shaped barber data and the existing `/barbers/` directory and profile routes.

## Context

- The homepage currently renders three barber entries; the demo data contains six barber profiles.
- Barber names, specialties, branches, and availability are illustrative prototype data, not verified Rendezvous staff information.
- Existing homepage photography is Unsplash stock. The requested direction is six natural-looking, monochrome editorial demo portraits, reused consistently in the showcase, directory, and profile pages.
- The supplied reference uses a large editorial heading, a compact right-aligned count, four portrait panels in a single row, and handwritten marks over the photos.

## Approved direction

### Layout and hierarchy

- Retain the section identity and CMS anchor `#barbers`; do not copy the unrelated reference brand name.
- Use a spacious, ruled header with `Di tangan yang tepat.`; omit the separate large featured-profile counter.
- Place four tall portrait panels side by side on desktop. Keep the photographic grid squarely aligned and avoid wrapping each entry in a rounded card.
- Overlay each featured profile's illustrative signature near the top-left of the image. Place the barber's name and short specialty line in a restrained caption beneath the portrait.
- Keep a clear directory link after the row so visitors can reach all six profiles. The remaining two stay available in the directory, not squeezed into the featured row.
- Keep section numbering, section order, barber slugs, CMS-shaped fields, booking links, and existing global editorial tokens intact.

### Portraits and signatures

- Create six distinct portrait assets, one per demo barber, so homepage, directory, and profile routes show the same person for each profile.
- Generate each portrait as a separate image asset. Aim for credible documentary photography: relaxed, unforced expression; believable skin texture and anatomy; natural studio/barbershop light; simple real-world wardrobe and background; consistent black-and-white tonal treatment and crop.
- Avoid glossy beauty retouching, dramatic AI-cinematic lighting, over-sharpening, text/logos, tools intersecting faces, duplicate-looking subjects, and any visible signature baked into the photograph.
- Treat the six portraits as synthetic prototype imagery, not photographs or likenesses of actual Rendezvous staff. Say so in the section's existing demo disclosure/copy.
- Draw a separate lightweight SVG name-mark for each demo profile. These are illustrative graphic flourishes, not actual or verified barber signatures. Keep them as vectors so their strokes can animate cleanly.

### Scroll motion and interaction

- When the section enters the viewport, draw the four visible SVG marks in sequence with a restrained pen-stroke animation; do not animate while the user scrolls horizontally or make the portrait cards themselves slide.
- Trigger once per page visit, with a small stagger between marks. If the section is already visible at load, reveal promptly.
- Under `prefers-reduced-motion`, show all marks immediately without drawing animation. Signatures must remain decorative (`aria-hidden`) and cannot be the only way to identify a barber.
- Retain usable portrait/profile links, clear focus states, and the existing link to `/barbers/`.

### Responsive behavior

- At wide desktop widths, show all four featured portraits in one row.
- At tablet and mobile widths, preserve editorial order and readable captions; use a horizontally scrollable portrait rail with a visible native scrollbar or explicit controls, rather than shrinking four photos into unreadable columns.
- Prevent page-level horizontal overflow. Any rail must support touch, keyboard navigation, and reduced-motion settings.

## Out of scope

- No CMS or booking model changes, new barber facts, branch availability claims, or additional homepage sections.
- No generated photo or signature is to be described as authentic staff imagery or a genuine signature.
- No change to testimonials, lookbook, or other sections.

## Acceptance criteria

- Homepage shows four featured profiles; all six remain reachable through the existing directory link.
- Each profile uses the same assigned portrait across homepage, directory, and detail route; assets have meaningful, accurate alt text.
- Desktop, tablet, and mobile layouts match the editorial direction without broken crops or page overflow.
- Four featured SVG signatures draw once in staggered order when scrolled into view; reduced-motion users see them without animation.
- Screen readers can identify each barber without relying on the signature; portrait and directory links remain keyboard accessible.
- The prototype disclosure clearly identifies portrait/profile content as illustrative and not verified Rendezvous staff information.
- Inspect every generated image and the rendered desktop/mobile section in-browser; run focused tests and a production build before calling the work complete.
