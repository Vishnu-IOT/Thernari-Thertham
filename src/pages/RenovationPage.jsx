import { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../data/useData.js";
import { reelItems, instagramId, titleOf } from "../data/templeData.js";
import ReelCard from "../components/ReelCard.jsx";
import { useLang } from "../i18n/LanguageContext.jsx";
import { PageHero, Reveal, Section, SectionTitle, usePageMeta } from "../components/ui.jsx";

/* A portrait that quietly disappears if its file has not been added yet,
   so the page never shows a broken-image icon. */
function Portrait({ src, alt, className = "", children }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <figure className={className}>
      <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setOk(false)} />
      {children}
    </figure>
  );
}

/* Renovation: the renovated Mandapam (opened 2024) and notable visits */
export default function RenovationPage() {
  const { inauguration: ig } = useData();
  const { tx, lang } = useLang();
  usePageMeta(tx("inaug.title"), tx("inaug.desc"));
  const v = ig.visitor;
  // The reel of the visit: use the one already listed with its title and cover
  const code = instagramId(v.reel);
  const listed = reelItems.find((r) => r.id === code);
  const reel = listed || (code ? { url: v.reel, id: code } : null);
  const reelLabel = (listed && titleOf(listed.title, lang)) || v.title;

  return (
    <div className="reno-page">
      <PageHero
        kicker={tx("inaug.kicker")}
        title={tx("inaug.pageTitle")}
        sub={tx("inaug.sub")}
        className="hero-festivals"
        bg={ig.image}
      />

      {/* The opening */}
      <Section className="rn-open">
        <div className="rn-open-grid">
          <Reveal variant="left" className="rn-photo">
            <img src={ig.image} alt={ig.imageAlt} width="1280" height="853" decoding="async" />
            <span className="rn-year" aria-hidden="true">{ig.year}</span>
          </Reveal>
          <div className="rn-copy">
            <Reveal><p className="kicker">{tx("inaug.dayKicker")}</p></Reveal>
            <Reveal delay={80}><h2>{ig.title}</h2></Reveal>
            <Reveal delay={140}><p className="lead">{ig.lead}</p></Reveal>
            {ig.story.map((p, i) => (
              <Reveal key={i} delay={200 + i * 60}><p>{p}</p></Reveal>
            ))}
          </div>
        </div>

        <Reveal as="dl" className="rn-facts" aria-label={tx("inaug.factsTitle")}>
          {ig.facts.map((f) => (
            <div key={f.label} className="rn-fact">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </Reveal>
      </Section>

      {/* Moments */}
      <Section className="rn-moments-sec">
        <SectionTitle kicker={tx("inaug.momentsKicker")} title={tx("inaug.momentsTitle")} />
        <ol className="rn-moments">
          {ig.moments.map((m, i) => (
            <Reveal as="li" key={m.title} delay={i * 110} className="rn-moment">
              <span className="rn-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Notable visit: Jayam Ravi */}
      <section className="rn-visit" aria-labelledby="rn-visit-h">
        <div className="container">
          <div className={`rn-visit-grid ${reel ? "" : "no-photo"}`}>
            {reel && (
              <Reveal variant="left" className="rn-visit-reel">
                <ReelCard
                  reel={reel}
                  label={reelLabel}
                  fallback={ig.image}
                  badge={tx("history.tabReels")}
                />
              </Reveal>
            )}
            <div className="rn-visit-copy">
              <Reveal><p className="kicker">{tx("inaug.visitKicker")}</p></Reveal>
              <Reveal delay={80}><h2 id="rn-visit-h">{v.title}</h2></Reveal>
              <Reveal delay={120}>
                <p className="rn-visitor">
                  <b>{v.name}</b>
                  <span>{v.role}</span>
                </p>
              </Reveal>
              <Reveal delay={160}><p className="lead">{v.text}</p></Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* A welcome: MLA */}
      <Section className="rn-guest-sec">
        <div className="rn-guest">
          <Portrait src={ig.guest.image} alt={ig.guest.imageAlt} className="rn-guest-photo">
            <figcaption>{ig.guest.caption}</figcaption>
          </Portrait>
          <div className="rn-guest-copy">
            <Reveal><p className="kicker">{tx("inaug.guestKicker")}</p></Reveal>
            <Reveal delay={80}><h2>{ig.guest.title}</h2></Reveal>
            <Reveal delay={140}><p className="lead">{tx("inaug.guestText")}</p></Reveal>
          </div>
        </div>

        <Reveal className="fx-cta">
          <p>{tx("inaug.cta")}</p>
          <div className="btn-row">
            <Link className="btn btn-maroon" to="/donation">{tx("inaug.support")}</Link>
            <Link className="btn btn-line" to="/history">{tx("inaug.back")}</Link>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}
