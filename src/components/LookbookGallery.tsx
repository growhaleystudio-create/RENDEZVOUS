import { ArrowUpRight } from "@phosphor-icons/react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import {
  getLookbookScrollLeft,
  getLookbookScrollProgress,
} from "../data/lookbook.js";
import { isActivePrototypeHref } from "../utils/navigation.js";

type LookbookItem = {
  id: string;
  title: string;
  serviceId: string;
  image: string;
  alt: string;
};

type Service = { id: string; name: string; slug: string };

type LookbookGalleryProps = {
  items: LookbookItem[];
  services: Service[];
};

export default function LookbookGallery({ items, services }: LookbookGalleryProps) {
  const railRef = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const rangeStyle = { "--range-progress": `${progress}%` } as CSSProperties;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const updateProgress = () => {
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      setHasOverflow(maxScroll > 1);
      setProgress(getLookbookScrollProgress(rail.scrollLeft, maxScroll));
    };

    rail.addEventListener("scroll", updateProgress, { passive: true });
    const observer = new ResizeObserver(updateProgress);
    observer.observe(rail);
    rail.querySelectorAll("img").forEach((image) => {
      image.addEventListener("load", updateProgress);
    });
    updateProgress();

    return () => {
      rail.removeEventListener("scroll", updateProgress);
      observer.disconnect();
      rail.querySelectorAll("img").forEach((image) => {
        image.removeEventListener("load", updateProgress);
      });
    };
  }, [items.length]);

  return (
    <div className="lookbook-gallery">
      <ul className="lookbook-rail" aria-label="Inspirasi potongan rambut" ref={railRef}>
        {items.map((item, index) => {
          const service = services.find(({ id }) => id === item.serviceId);
          const href = `/services/${service?.slug ?? "signature-cut"}/`;
          const content = (
            <>
              <img className="lookbook-card__image" src={item.image} alt={item.alt} loading="lazy" />
              <div className="lookbook-card__caption">
                <span className="lookbook-card__title">{item.title}</span>
                <span className="lookbook-card__index">{String(index + 1).padStart(2, "0")}</span>
                <ArrowUpRight size={20} weight="regular" aria-hidden="true" />
              </div>
            </>
          );
          return (
            <li className="lookbook-rail__item" key={item.id}>
              {isActivePrototypeHref(href) ? (
                <a className="lookbook-card" href={href}>{content}</a>
              ) : (
                <div className="lookbook-card prototype-link--inert">{content}</div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="lookbook-rail-control">
        <label className="lookbook-rail-control__range">
          <span className="visually-hidden">Posisi galeri inspirasi gaya</span>
          <input
            aria-label="Posisi galeri inspirasi gaya"
            type="range"
            min="0"
            max="100"
            step="1"
            value={progress}
            style={rangeStyle}
            disabled={!hasOverflow}
            onChange={(event) => {
              const rail = railRef.current;
              if (!rail) return;
              const maxScroll = rail.scrollWidth - rail.clientWidth;
              const nextProgress = Number(event.currentTarget.value);
              setProgress(nextProgress);
              rail.scrollLeft = getLookbookScrollLeft(nextProgress, maxScroll);
            }}
          />
        </label>
      </div>
    </div>
  );
}
