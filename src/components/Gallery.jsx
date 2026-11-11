import { useCallback, useEffect, useState } from "react";
import { gallery, galleryCategories } from "../data/templeData.js";

export function Lightbox({ items, index, onClose, onChange }) {
  const item = items[index];
  const move = useCallback(
    (d) => onChange((index + d + items.length) % items.length),
    [index, items.length, onChange],
  );
  useEffect(() => {
    const k = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [move, onClose]);
  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
    >
      <button className="lb-btn lb-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      <button
        className="lb-btn lb-prev"
        onClick={(e) => {
          e.stopPropagation();
          move(-1);
        }}
        aria-label="Previous image"
      >
        ‹
      </button>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={item.src} alt={item.alt} />
        <figcaption>
          {item.caption}
          <small>
            {index + 1} / {items.length}
          </small>
        </figcaption>
      </figure>
      <button
        className="lb-btn lb-next"
        onClick={(e) => {
          e.stopPropagation();
          move(1);
        }}
        aria-label="Next image"
      >
        ›
      </button>
    </div>
  );
}

export default function Gallery({ preview = false }) {
  const [cat, setCat] = useState("All");
  const [active, setActive] = useState(null);
  const base =
    cat === "All" ? gallery : gallery.filter((g) => g.category === cat);
  const items = preview
    ? gallery.filter((_, i) => i % 3 === 0).slice(0, 6)
    : base;
  return (
    <div>
      {!preview && (
        <div className="filters" role="group" aria-label="Filter gallery">
          {galleryCategories.map((c) => (
            <button
              key={c}
              className={c === cat ? "active" : ""}
              onClick={() => setCat(c)}
              aria-pressed={c === cat}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <ul className="masonry">
        {items.map((g, i) => (
          <li key={g.id}>
            <button
              onClick={() => setActive(i)}
              aria-label={`Open image: ${g.caption}`}
            >
              <img src={g.src} alt={g.alt} loading="lazy" />
              <span>{g.category}</span>
            </button>
          </li>
        ))}
      </ul>
      {active !== null && (
        <Lightbox
          items={items}
          index={active}
          onClose={() => setActive(null)}
          onChange={setActive}
        />
      )}
    </div>
  );
}
