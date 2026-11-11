import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "../i18n/LanguageContext.jsx";
import { EASE } from "../motion/presets.js";

/* A full-screen, immersive photo stage used by the MLA visit and the
   Jayam Ravi visit on the Gallery page (class names start with vst-).

   - fills the space under the navbar, so the whole section fits the screen
   - the photo being shown is also blurred behind everything as the backdrop
   - each photo has its own title and description, in the chosen language
   - swipe (phones), arrow buttons, arrow keys, thumbnails and a slow autoplay
     that pauses on hover/focus and never runs for visitors who reduce motion */

const AUTO_MS = 7000;
const SWIPE_PX = 56;

const prefersReduced = () =>
  typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const Chevron = ({ flip }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
    <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function VisitStage({
  id,
  tone = "night",
  flip = false,
  label,
  kicker,
  title,
  person,
  role,
  slides,
  children,
}) {
  const { tx } = useLang();
  const root = useRef(null);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(() => !prefersReduced());
  const [hold, setHold] = useState(false);
  const [inView, setInView] = useState(false);
  const n = slides.length;

  const go = useCallback((d) => setI((c) => (c + d + n) % n), [n]);

  /* only autoplay while the section is actually on screen */
  useEffect(() => {
    const el = root.current;
    if (!el || !("IntersectionObserver" in window)) return setInView(true);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting && e.intersectionRatio > 0.35), {
      threshold: [0, 0.35, 0.6],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = playing && !hold && inView && n > 1;
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => go(1), AUTO_MS);
    return () => clearTimeout(t);
  }, [i, running, go]);

  const onKey = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };
  const onDragEnd = (_e, info) => {
    if (info.offset.x < -SWIPE_PX) go(1);
    else if (info.offset.x > SWIPE_PX) go(-1);
  };
  const mouseOnly = (v) => (e) => { if (e.pointerType === "mouse") setHold(v); };

  return (
    <section
      id={id}
      ref={root}
      className={`vst vst-${tone}${flip ? " is-flip" : ""}`}
      aria-label={label}
      aria-roledescription="carousel"
      onKeyDown={onKey}
      onPointerEnter={mouseOnly(true)}
      onPointerLeave={mouseOnly(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      {/* the current photo, blurred, fills the whole section */}
      <div className="vst-bgs" aria-hidden="true">
        {slides.map((s, k) => (
          <div key={s.src} className={`vst-bg${k === i ? " on" : ""}`} style={{ backgroundImage: `url(${s.src})` }} />
        ))}
      </div>
      <div className="vst-veil" aria-hidden="true" />

      <motion.div
        className="container vst-inner"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {/* ---------- the photo ---------- */}
        <div className="vst-media">
          <motion.div
            className="vst-frame"
            drag={n > 1 ? "x" : false}
            dragSnapToOrigin
            dragElastic={0.16}
            dragMomentum={false}
            onDragEnd={onDragEnd}
          >
            {slides.map((s, k) => (
              <figure
                key={s.src}
                className={`vst-slide${k === i ? " on" : ""}`}
                aria-hidden={k === i ? undefined : "true"}
                aria-roledescription="slide"
                aria-label={tx("vs.count", { n: k + 1, total: n })}
              >
                <img className="vst-fill" src={s.src} alt="" aria-hidden="true" loading="lazy" decoding="async" draggable="false" />
                <img className="vst-img" src={s.src} alt={s.alt || s.title} loading="lazy" decoding="async" draggable="false" />
              </figure>
            ))}
            <span className="vst-shine" aria-hidden="true" />
            <span className="vst-count" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}<i> / {String(n).padStart(2, "0")}</i>
            </span>
            {n > 1 && (
              <>
                <button type="button" className="vst-nav prev" onClick={() => go(-1)} aria-label={tx("vs.prev")}><Chevron flip /></button>
                <button type="button" className="vst-nav next" onClick={() => go(1)} aria-label={tx("vs.next")}><Chevron /></button>
              </>
            )}
          </motion.div>
        </div>

        {/* ---------- the words ---------- */}
        <div className="vst-panel">
          <p className="vst-kicker">{kicker}</p>
          <h2 className="vst-title">{title}</h2>
          {person && (
            <p className="vst-person">
              <b>{person}</b>
              {role && <span>{role}</span>}
            </p>
          )}

          {/* every caption sits in the same grid cell, so the panel keeps the
              height of the longest one and nothing jumps when the photo changes */}
          <div className="vst-caps" tabIndex={0} aria-live={running ? "off" : "polite"} onKeyDown={onKey}>
            {slides.map((s, k) => (
              <div key={s.src} className={`vst-cap${k === i ? " on" : ""}`} aria-hidden={k === i ? undefined : "true"}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>

          {n > 1 && (
            <div className="vst-controls">
              <div className="vst-thumbs">
                {slides.map((s, k) => (
                  <button
                    key={s.src}
                    type="button"
                    className={`vst-thumb${k === i ? " on" : ""}`}
                    onClick={() => setI(k)}
                    aria-label={tx("vs.goto", { n: k + 1 })}
                    aria-current={k === i ? "true" : undefined}
                  >
                    <img src={s.src} alt="" loading="lazy" decoding="async" draggable="false" />
                    {k === i && running && <i className="vst-prog" key={`${i}-${running}`} style={{ animationDuration: `${AUTO_MS}ms` }} />}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="vst-play"
                onClick={() => setPlaying((p) => !p)}
                aria-label={tx(playing ? "vs.pause" : "vs.play")}
                aria-pressed={!playing}
              >
                {playing ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.4v14H7zM13.6 5H17v14h-3.4z" fill="currentColor" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
                )}
              </button>
            </div>
          )}

          {children}
        </div>
      </motion.div>
    </section>
  );
}
