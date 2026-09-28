// Satu sumber nilai gerak untuk JavaScript. Harus sama dengan token di src/styles/motion.css.
export const MOTION = {
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  // Reveal pakai cubic-out: gerakan tersebar sepanjang durasi, tidak habis di 250ms pertama.
  easeReveal: "cubic-bezier(0.33, 1, 0.68, 1)",
  revealMs: 1000,
  staggerMs: 120,
  revealDistancePx: 40,
  smoothingMs: 90,
};

// Penghalusan berbasis waktu: terasa sama di layar 60Hz maupun 120Hz.
export function smoothTowards(current, target, deltaMs, tauMs = MOTION.smoothingMs) {
  return current + (target - current) * (1 - Math.exp(-Math.max(0, deltaMs) / tauMs));
}
