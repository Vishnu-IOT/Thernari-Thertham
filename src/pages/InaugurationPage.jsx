import { Link } from "react-router-dom";
import { useData } from "../data/useData.js";
import { useLang } from "../i18n/LanguageContext.jsx";
import { PageHero, Reveal, Section, SectionTitle, usePageMeta } from "../components/ui.jsx";

/* Inauguration 2024: the opening of the new Mandapam */
export default function InaugurationPage() {
  const { inauguration: ig } = useData();
  const { tx } = useLang();
  usePageMeta(tx("inaug.title"), tx("inaug.desc"));

  return (
    <>
      <PageHero
        kicker={tx("inaug.kicker")}
        title={tx("inaug.pageTitle")}
        sub={tx("inaug.sub")}
        className="hero-festivals"
        bg={ig.image}
      />

      <Section className="ig-sec">
        <div className="ig-top">
          <Reveal variant="left" className="ig-photo">
            <img src={ig.image} alt={ig.imageAlt} width="1280" height="853" decoding="async" />
          </Reveal>
          <div className="ig-copy">
            <Reveal>
              <p className="kicker">{tx("inaug.dayKicker")}</p>
            </Reveal>
            <Reveal delay={80}>
              <h2>{ig.title}</h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="lead">{ig.lead}</p>
            </Reveal>
            {ig.story.map((p, i) => (
              <Reveal key={i} delay={200 + i * 60}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal as="dl" className="ig-facts" aria-label={tx("inaug.factsTitle")}>
          {ig.facts.map((f) => (
            <div key={f.label} className="ig-fact">
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section className="ig-moments-sec">
        <SectionTitle kicker={tx("inaug.momentsKicker")} title={tx("inaug.momentsTitle")} />
        <ol className="ig-moments">
          {ig.moments.map((m, i) => (
            <Reveal as="li" key={m.title} delay={i * 110} className="ig-moment">
              <span className="ig-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section className="ig-guest-sec">
        <div className="ig-guest">
          <Reveal variant="right" className="ig-guest-photo">
            <img src={ig.guest.image} alt={ig.guest.imageAlt} width="960" height="1280" loading="lazy" decoding="async" />
            <figcaption>{ig.guest.caption}</figcaption>
          </Reveal>
          <div className="ig-guest-copy">
            <Reveal>
              <p className="kicker">{tx("inaug.guestKicker")}</p>
            </Reveal>
            <Reveal delay={80}>
              <h2>{ig.guest.title}</h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="lead">{tx("inaug.guestText")}</p>
            </Reveal>
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
    </>
  );
}
