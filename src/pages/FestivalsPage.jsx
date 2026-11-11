import { Link } from "react-router-dom";
import { useData, english } from "../data/useData.js";
import { slug } from "../data/slug.js";
import { useLang } from "../i18n/LanguageContext.jsx";
import { PageHero, Reveal, Section, SectionTitle, usePageMeta } from "../components/ui.jsx";

/* Karkidakam, the Ramayana month: a detailed section of its own */
function KarkidakamDetail() {
  const { karkidakamDetail: k } = useData();
  const { tx } = useLang();
  return (
    <section id="karkidakam" className="kd-sec">
      <div className="container">
        <div className="kd-top">
          <Reveal className="kd-intro">
            <p className="kd-kicker">{tx("kkd.kicker")}</p>
            <h2>{k.title}</h2>
            <span className="kd-rule" aria-hidden="true" />
            <p className="kd-lead">{k.intro}</p>
          </Reveal>
          <Reveal variant="arch" className="kd-photo">
            <img src={k.image} alt={k.title} loading="lazy" decoding="async" />
          </Reveal>
        </div>

        <dl className="kd-stats">
          {k.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} className="kd-stat">
              <dt>{s.value}</dt>
              <dd>{s.label}</dd>
            </Reveal>
          ))}
        </dl>

        <div className="kd-body">
          <div className="kd-blocks">
            {k.blocks.map((b, i) => (
              <Reveal key={b.title} delay={i * 80} className="kd-block">
                <span className="kd-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal variant="right" className="kd-side">
            <img src={k.sideImage} alt="" loading="lazy" decoding="async" />
          </Reveal>
        </div>
        <p className="kd-note">{k.note}</p>
      </div>
    </section>
  );
}

export default function FestivalsPage() {
  const { t, festivals } = useData();
  const { tx } = useLang();
  usePageMeta(tx("festivals.title"), tx("festivals.desc"));
  return (
    <>
      <PageHero kicker={tx("festivals.kicker")} title={tx("festivals.pageTitle")} sub={tx("festivals.sub")} className="hero-festivals" bg="/images/temple/festive.png" />

      <KarkidakamDetail />

      <Section className="fx-sec">
        <SectionTitle kicker={tx("kkd.nextFest")} title={tx("common.festTitle")} sub={tx("common.festSub")} />
        <div className="fx-list">
          {festivals.map((f, i) => (
            <Reveal key={f.name} id={slug(english.festivals[i].name)} variant={i % 2 ? "right" : "left"} className={`fx-row ${i % 2 ? "rev" : ""}`}>
              <div className="fx-img">
                <img src={f.image} alt={f.name} loading="lazy" decoding="async" />
              </div>
              <div className="fx-body">
                <p className="fx-no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</p>
                <p className="fx-date">{f.date}</p>
                <h2>{f.name}</h2>
                {f.text.split(/\n+/).map((para, k) => <p key={k}>{para}</p>)}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="fx-cta">
          <p>{tx("festivals.cta")}</p>
          <div className="btn-row">
            <a className="btn btn-maroon" href={`tel:${t.contact.phone.replace(/\s/g, "")}`}>{tx("festivals.call", { phone: t.contact.phone })}</a>
            <Link className="btn btn-line" to="/visit#contact">{tx("festivals.reach")}</Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
