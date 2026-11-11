import { useCallback, useEffect, useRef, useState } from "react";

// Images live in /public/images/deity — add more files here to add more slides.
const slides = [
  { src: "/images/deity/1.jpg", pos: "center 16%", alt: "Sree Rama adorned with gold ornaments and flower garlands" },
  { src: "/images/deity/2.webp", pos: "center 30%", alt: "Deities decorated with flower garlands on a golden seat" },
  { src: "/images/deity/3.jpg", pos: "center 30%", alt: "Deities adorned with garlands on a golden pedestal" },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export default function HeroCarousel({ interval = 5000 }) {
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [held, setHeld] = useState(false); // paused while hovered / focused
  const touchX = useRef(null);

  const go = useCallback((k) => setIndex(((k % n) + n) % n), [n]);

  useEffect(() => {
    if (!playing || held) return undefined;
    const id = setTimeout(() => go(index + 1), interval);
    return () => clearTimeout(id);
  }, [index, playing, held, go, interval]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") go(index - 1);
    if (e.key === "ArrowRight") go(index + 1);
  };
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    touchX.current = null;
  };

  return (
    <div
      className="hero-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Photographs of the temple deities"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      onKeyDown={onKeyDown}
    >
      <div className="bn-frame">
        <div className="bn-side left" aria-hidden="true"><i /></div>

        <div
          className="bn-view"
          aria-live={playing && !held ? "off" : "polite"}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {slides.map((s, i) => (
            <div
              key={s.src}
              className={`hc-slide ${i === index ? "active" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              aria-hidden={i !== index}
            >
              <img
                src={s.src}
                alt={s.alt}
                width="900"
                height="400"
                style={{ objectPosition: s.pos }}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}

          <button type="button" className="hc-btn hc-prev" onClick={() => go(index - 1)} aria-label="Previous photograph">‹</button>
          <button type="button" className="hc-btn hc-next" onClick={() => go(index + 1)} aria-label="Next photograph">›</button>

          <div className="hc-bar">
            <div className="hc-dots">
              {slides.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  className={i === index ? "active" : ""}
                  onClick={() => go(i)}
                  aria-label={`Show photograph ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                />
              ))}
            </div>
            <button
              type="button"
              className="hc-btn hc-play"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            >
              {playing ? "❚❚" : "▶"}
            </button>
          </div>
        </div>

        <div className="bn-side right" aria-hidden="true"><i /></div>
      </div>
    </div>
  );
}
