import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useData } from "../data/useData.js";
import { useLang } from "../i18n/LanguageContext.jsx";
import { Embers, Ornament } from "./ui.jsx";
import { scrollToEl } from "../motion/smoothScroll.js";

/* Framed card: tag chip, photo with caption overlay, progress bars + arrows */
function DeitySlides() {
  const { heroSlides: slides } = useData();
  const { tx } = useLang();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (d) => setI((n) => (n + d + slides.length) % slides.length);
  useEffect(() => {
    const calm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (paused || calm) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [paused, i]);
  const cur = slides[i];

  return (
    <div
      className="hero-card"
      role="group"
      aria-roledescription="carousel"
      aria-label={tx("hero.aria")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="hc-chip">
        <i aria-hidden="true" />
        {tx("hero.chip")}
      </span>

      <div className="hc-photo">
        {slides.map((s, n) => (
          <img
            key={s.src}
            className={n === i ? "on" : ""}
            src={s.src}
            alt={n === i ? s.alt : ""}
            aria-hidden={n !== i}
            width="700"
            height="930"
            loading={n === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
        {/* <div className="hc-info" key={i} aria-live="polite">
          <p className="hc-kicker">{cur.kicker}</p>
          <h3>{cur.name}</h3>
          <p className="hc-text">{cur.text}</p>
          <Link className="hc-link" to="/history#deities">
            View the deities <span aria-hidden="true">→</span>
          </Link>
        </div> */}
      </div>

      <div className="hc-foot">
        <div className="hc-bars">
          {slides.map((s, n) => (
            <button key={s.src} className={n === i ? "on" : ""} onClick={() => setI(n)} aria-label={tx("hero.show", { name: s.name })} aria-current={n === i} />
          ))}
        </div>
        <div className="hc-arrows">
          <button type="button" onClick={() => go(-1)} aria-label={tx("hero.prev")}>‹</button>
          <button type="button" onClick={() => go(1)} aria-label={tx("hero.next")}>›</button>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useData();
  const { tx } = useLang();
  const words = t.name.split(" ");
  /* the hero copy drifts up and fades as the visitor scrolls past */
  const sec = useRef(null);
  const { scrollYProgress } = useScroll({ target: sec, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const scrollNext = (e) => {
    e.preventDefault();
    scrollToEl(document.getElementById("heritage"));
  };
  return (
    <section className="hero" aria-labelledby="hero-title" ref={sec}>
      <img className="hero-bg" src="/images/temple/hero-bg.jpg" alt="" aria-hidden="true" fetchpriority="high" decoding="async" />
      <span className="hero-veil" aria-hidden="true" />
      <Embers />
      <div className="container hero-inner">
        <motion.div className="hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
          <p className="mantra rise" style={{ "--d": ".1s" }}>
            {tx("common.ayodhyaMantra")}
          </p>
          <h1 id="hero-title" className="hero-title">
            {words.map((w, n) => (
              <span className="w" key={w}>
                <i style={{ "--d": `${0.2 + n * 0.15}s` }}>{w}</i>
              </span>
            ))}
          </h1>
          <p className="hero-sub rise" style={{ "--d": ".6s" }}>
            {t.subtitle}
          </p>
          <Ornament className="hero-ornament rise" />
          <p className="hero-tag rise" style={{ "--d": ".75s" }}>
            {t.tagline}
          </p>
          <div className="btn-row rise" style={{ "--d": ".9s" }}>
            <Link className="btn btn-gold" to="/history">
              {tx("hero.discover")}
            </Link>
            <Link className="btn btn-ghost" to="/donation">
              {tx("hero.offer")}
            </Link>
          </div>
        </motion.div>

        {/* <div className="hero-stage">
          <span className="hero-halo" aria-hidden="true" />
          <DeitySlides />
        </div> */}
      </div>
      <a className="scroll-cue" href="#heritage" onClick={scrollNext} aria-label={tx("hero.scroll")}>
        <span />
      </a>
    </section>
  );
}
