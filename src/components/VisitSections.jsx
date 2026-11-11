import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useData } from "../data/useData.js";
import { useLang } from "../i18n/LanguageContext.jsx";
import VisitStage from "./VisitStage.jsx";
import { Reveal, SectionTitle } from "./ui.jsx";
import { SPRING_SOFT, releaseTransform } from "../motion/presets.js";

/* The Mandapam (About page) and the two notable visits (Gallery page).
   The Mandapam uses vs- classes (frosted glass over soft colour); the two
   visits are full-screen photo stages: see VisitStage.jsx and visit-stage.css. */

/* A photo that drifts slightly inside its frame as the page scrolls.
   If the file has not been added yet the frame quietly disappears. */
function ParallaxPhoto({ src, alt, className = "", children, ratio }) {
  const ref = useRef(null);
  const [ok, setOk] = useState(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  if (!ok) return null;
  return (
    <Reveal variant="zoom" className={`vs-photo-wrap ${className}`}>
      <div className="vs-photo" ref={ref} style={ratio ? { aspectRatio: ratio } : undefined}>
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{ y, scale: 1.18 }}
          onError={() => setOk(false)}
        />
        <span className="vs-photo-shine" aria-hidden="true" />
        {children}
      </div>
    </Reveal>
  );
}

function SupportRow() {
  const { tx } = useLang();
  return (
    <Reveal className="vs-cta vs-glass">
      <p>{tx("inaug.cta")}</p>
      <div className="btn-row">
        <Link className="btn btn-maroon" to="/donation">{tx("inaug.support")}</Link>
      </div>
    </Reveal>
  );
}

/* ---------------------------------------------------------------- About page */
export function MandapamSection() {
  const { inauguration: ig } = useData();
  const { tx } = useLang();
  return (
    <section id="mandapam" className="section vs-sec vs-mandapam" aria-label={ig.title}>
      <div className="container">
        <SectionTitle kicker={tx("vs.mandapamKicker")} title={ig.title} sub={ig.lead} />

        <div className="vs-split">
          <ParallaxPhoto src={ig.image} alt={ig.imageAlt} className="vs-split-photo" ratio="4 / 3">
            <span className="vs-year vs-glass" aria-hidden="true">{ig.year}</span>
          </ParallaxPhoto>

          <div className="vs-copy vs-glass">
            <Reveal><p className="kicker">{tx("inaug.dayKicker")}</p></Reveal>
            {ig.story.map((p, i) => (
              <Reveal key={i} delay={100 + i * 70}><p>{p}</p></Reveal>
            ))}
          </div>
        </div>

        <Reveal as="dl" className="vs-facts" aria-label={tx("inaug.factsTitle")}>
          {ig.facts.map((f) => (
            <motion.div
              key={f.label}
              className="vs-fact vs-glass"
              whileHover={{ y: -5 }}
              transition={SPRING_SOFT}
              transformTemplate={releaseTransform}
            >
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </motion.div>
          ))}
        </Reveal>

        <div className="vs-moments-head">
          <Reveal><p className="kicker">{tx("inaug.momentsKicker")}</p></Reveal>
          <Reveal delay={70}><h3>{tx("inaug.momentsTitle")}</h3></Reveal>
        </div>
        <ol className="vs-moments">
          {ig.moments.map((m, i) => (
            <Reveal as="li" key={m.title} delay={i * 110} className="vs-moment vs-glass">
              <span className="vs-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h4>{m.title}</h4>
              <p>{m.text}</p>
            </Reveal>
          ))}
        </ol>

        <SupportRow />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Gallery page */
/* Both visits are shown from photos already in the gallery, each with its own
   description (see `slides` in src/data/templeData.js and the ml / ta files). */
export function JayamRaviVisit() {
  const { inauguration: ig } = useData();
  const { tx } = useLang();
  const v = ig.visitor;
  return (
    <VisitStage
      id="jayam-ravi"
      tone="night"
      flip
      label={v.title}
      kicker={tx("inaug.visitKicker")}
      title={v.title}
      person={v.name}
      role={v.role}
      slides={v.slides}
    />
  );
}

/* One portrait photo, so this section is a calm light "feature" layout
   (a framed portrait beside the words) and not a slideshow. */
export function MlaVisit() {
  const { inauguration: ig } = useData();
  const { tx } = useLang();
  const g = ig.guest;
  const s = g.slides?.[0] || {};
  return (
    <section id="mla-visit" className="mlx" aria-label={g.title}>
      <span className="mlx-orb a" aria-hidden="true" />
      <span className="mlx-orb b" aria-hidden="true" />
      <div className="container mlx-grid">
        <Reveal variant="right" className="mlx-photo-wrap">
          <figure className={`mlx-photo${g.video ? " mlx-video-photo" : ""}`}>
            <div className="mlx-mat">
              {g.video ? (
                <video
                  src={g.video}
                  controls
                  playsInline
                  preload="metadata"
                  poster={s.src || g.image}
                  aria-label={g.title}
                />
              ) : (
                <img src={s.src || g.image} alt={s.alt || g.imageAlt} loading="lazy" decoding="async" />
              )}
              <span className="mlx-shine" aria-hidden="true" />
            </div>
            <figcaption className="mlx-cap">{g.caption}</figcaption>
          </figure>
        </Reveal>

        <div className="mlx-copy">
          <Reveal><p className="mlx-kicker">{tx("inaug.guestKicker")}</p></Reveal>
          <Reveal delay={80}><h2 className="mlx-title">{g.title}</h2></Reveal>
          <Reveal delay={140}><span className="mlx-rule" aria-hidden="true" /></Reveal>
          {s.title && <Reveal delay={190}><h3 className="mlx-sub">{s.title}</h3></Reveal>}
          <Reveal delay={240}><p className="mlx-text">{s.text || tx("inaug.guestText")}</p></Reveal>
          <Reveal delay={300}>
            <div className="btn-row mlx-cta">
              <Link className="btn btn-maroon" to="/donation">{tx("inaug.support")}</Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
