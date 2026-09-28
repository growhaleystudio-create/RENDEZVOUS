export function filterLookbookItems(items, serviceId) {
  if (serviceId === "all") return items;
  return items.filter((item) => item.serviceId === serviceId);
}

export function getLookbookScrollProgress(scrollLeft, maxScroll) {
  if (!Number.isFinite(scrollLeft) || !Number.isFinite(maxScroll) || maxScroll <= 0) {
    return 0;
  }

  return Math.round(Math.max(0, Math.min(1, scrollLeft / maxScroll)) * 100);
}

export function getLookbookScrollLeft(progress, maxScroll) {
  if (!Number.isFinite(progress) || !Number.isFinite(maxScroll) || maxScroll <= 0) {
    return 0;
  }

  const boundedProgress = Math.max(0, Math.min(100, progress));
  return (boundedProgress / 100) * maxScroll;
}
