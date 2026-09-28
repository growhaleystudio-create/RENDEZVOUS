# Campaign Editorial Implementation Plan

**Goal:** Apply the user's selected first mockup to the existing Rendezvous landing page, preserving its CMS-mapped content and booking simulation.

**Architecture:** Keep existing Astro pages, React interactions and data modules. Replace the first three compositions, introduce a focused campaign stylesheet, and carry the palette, typography and photo-led rhythm through remaining sections. Work in the existing landing folder: the repository has no commits and the user's active preview runs from it. Do not create an empty worktree or touch the separate CMS.

**Tech Stack:** Existing Astro, React, Tailwind, Phosphor icons; Anton headline, Times New Roman editorial and DM Sans UI typography. Existing Bodoni Moda retained on detail/booking pages.

## Approved visual target

`/Users/macbook/.codex/generated_images/01a0c72b-eb33-7210-a633-dcd1b9107f97/exec-91541253-7895-4481-81d8-8155db3da3c4.png`

At reference width 920px: 40px gutters, compact ruled header, 280px headline band, 69/31 photographic diptych, 35/55/10 philosophy spread, 46/54 services spread. Scale fluidly and stack in reading order on mobile. Omit the generated mock's unsupported establishment date; retain existing demo data values.

## Tasks

- [x] Generate and inspect individual campaign photos; save local originals and optimized WebP derivatives. No screenshot-as-page shortcut.
- [x] Update hero, navigation, layout, button and caption components plus design tokens. Add a focused `campaign.css` composition layer.
- [x] Replace philosophy and services with photo-led spreads. Preview three services with an explicit link to all six in the existing directory.
- [x] Carry photo-led rhythm into branches, barbers, lookbook, promo and journal without changing section IDs or slugs.
- [x] Run fresh build and behavior/content tests; retire obsolete CSS-offset assertions tied to the old hero. Compare the selected mock against browser captures at desktop, tablet and mobile widths; exercise navigation, filters, FAQ, voucher and booking; inspect console and overflow.
- [x] Write fresh `design-qa.md` with comparison evidence. Leave local preview running. No commit, push or deployment.
