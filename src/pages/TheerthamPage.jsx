import { Link } from "react-router-dom";
import { usePageMeta, Reveal } from "../components/Common.jsx";
import { PageHero, TempleTitle } from "../components/Ornaments.jsx";
import { templeData as t, festivals, highlights } from "../data/templeData.js";

export default function TheerthamPage() {
  usePageMeta("Thenari Theertham | The Sacred Water", "The sacred water source in front of Thenari Sree Rama Temple.");
  const rites = festivals.filter((f) => ["Karkidaka Vavu", "Thulavavu Tharpanam", "Ramayana Parayanam"].includes(f.name));
  const waters = highlights.filter((h) => /Theertham/.test(h.title));
  return (
    <div className="page-theertham">
      <PageHero theme="theme-water" mal="തേനാരി തീർത്ഥം" title={t.name} sub={t.theertham.quote}>
        <div className="ripples" aria-hidden="true"><i /><i /><i /></div>
      </PageHero>

      <section className="water-intro">
        <div className="container ghat-grid">
          <Reveal className="ghat-photo"><img src="/images/temple/boat-god.jpeg" alt="Sacred water of Thenari Theertham" /></Reveal>
          <Reveal className="ghat-text">
            <p className="water-small">The sacred waters</p>
            <p className="water-lead">{t.theertham.text}</p>
          </Reveal>
        </div>
      </section>

      <section className="water-steps">
        <div className="container">
          <TempleTitle small="Rites at the water" title="Observances at the Theertham" tone="light" />
          <ol className="steps-list">
            {rites.map((r) => (
              <Reveal key={r.name} className="step">
                <h3>{r.name}</h3><p className="step-when">{r.date}</p><p>{r.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="water-places">
        <div className="container">
          <TempleTitle small="Sacred landscape" title="Theerthams of Thenari" />
          <div className="places-row">
            {waters.map((w) => (
              <Reveal key={w.title} className="place-card">
                <img src={w.image} alt={w.title} loading="lazy" />
                <h3>{w.title}</h3><p>{w.text}</p>
              </Reveal>
            ))}
          </div>
          <p className="center"><Link className="btn btn-maroon" to="/festivals">Festival Calendar</Link></p>
        </div>
      </section>
    </div>
  );
}
