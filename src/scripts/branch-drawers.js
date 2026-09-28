import { smoothTowards } from "./motion-tokens.js";

// Daftar cabang: satu laci terbuka dalam satu waktu, dan kartu foto yang mengikuti kursor saat hover.
export function setupBranchDrawers(
  root,
  {
    canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  } = {},
) {
  const drawers = [...root.querySelectorAll("details.branch-drawer")];
  const peek = canHover ? root.querySelector(".branch-peek") : null;

  let activeRow = null;
  const hidePeek = () => {
    activeRow = null;
    peek?.classList.remove("is-visible");
  };

  // Cadangan untuk browser yang belum mendukung <details name>.
  for (const drawer of drawers) {
    drawer.addEventListener("toggle", () => {
      if (!drawer.open) return;
      for (const other of drawers) if (other !== drawer) other.open = false;
      hidePeek();
    });
  }

  if (!peek) return;

  const stacks = [...peek.querySelectorAll(".branch-peek__stack")];
  let target = { x: 0, y: 0 };
  let current = { x: 0, y: 0 };
  let frame = 0;
  let previousTime = 0;

  const place = () => {
    peek.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
  };

  const follow = (time) => {
    const delta = Math.min(40, previousTime ? time - previousTime : 16.67);
    previousTime = time;
    current = { x: smoothTowards(current.x, target.x, delta), y: smoothTowards(current.y, target.y, delta) };
    place();
    const settled = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) < 0.5;
    frame = settled ? 0 : requestAnimationFrame(follow);
  };

  const showPeek = (row, event) => {
    if (row.querySelector("details")?.open) return hidePeek();
    if (activeRow !== row) {
      activeRow = row;
      // Setiap cabang punya tumpukan fotonya sendiri yang sudah dimuat: cukup ganti yang terlihat.
      for (const stack of stacks) stack.classList.toggle("is-active", stack.dataset.branch === row.dataset.branch);
    }
    target = { x: event.clientX + 24, y: event.clientY + 20 };
    if (!peek.classList.contains("is-visible") || reducedMotion) {
      current = { ...target };
      place();
      peek.classList.add("is-visible");
      return;
    }
    if (!frame) {
      previousTime = 0;
      frame = requestAnimationFrame(follow);
    }
  };

  for (const row of root.querySelectorAll(".branch-row--drawer")) {
    row.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      if (event.target.closest(".branch-row__actions, .branch-drawer__panel")) return hidePeek();
      showPeek(row, event);
    });
    row.addEventListener("pointerleave", hidePeek);
  }
  window.addEventListener("scroll", hidePeek, { passive: true });
}
