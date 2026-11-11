import { Link } from "react-router-dom";
import { usePageMeta, Reveal } from "../components/Common.jsx";
import { PageHero, TempleTitle, CarvedFrame, Kasavu } from "../components/Ornaments.jsx";
import { templeData as t, deities, highlights } from "../data/templeData.js";

export default function TemplePage() {
  usePageMeta("The Temple | Thenari Theertham", "The deities, architecture and surroundings of Sree Madhyaranya Sree Rama Temple Thenari.");
  return (
    <div className="page-temple">
      <PageHero theme="theme-maroon" mal="ശ്രീകോവിൽ" title="The Temple" sub={t.subtitle} />

      {/* Sreekovil: each deity is a lamp-lit niche on dark wood */}
      <section className="sreekovil">
        <div className="container">
          <TempleTitle small="Sreekovil" title="The Sacred Sanctum" tone="light"
            sub="Sree Rama, the principal deity of the temple, with the deities who share the sanctum precinct." />
          <div className="shrine-list">
            {deities.map((d, i) => (
              <Reveal key={d.name} className={`shrine ${i === 0 ? "principal" : ""}`}>
                <CarvedFrame className="shrine-frame">
                  <div className="shrine-arch"><img src={d.image} alt={d.name} loading="lazy" /></div>
                </CarvedFrame>
                <div className="shrine-text">
                  <h3>{d.name}</h3>
                  <Kasavu />
                  <p>{d.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture: temple-wall mural panels */}
      <section className="section mural-wall">
        <div className="container">
          <TempleTitle small="Craft" title="Architecture & Sacred Spaces" />
          <div className="mural-grid">
            {highlights.map((h, i) => (
              <Reveal key={h.title} className={`mural m${i % 3}`}>
                <div className="mural-img"><img src={h.image} alt={h.title} loading="lazy" /></div>
                <div className="mural-cap"><h3>{h.title}</h3><p>{h.text}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="timing-plaque-sec">
        <div className="container">
          <div className="plaque">
            <h2>Darshan Timings</h2>
            <div className="plaque-row">
              <div><h3>Morning</h3><p>{t.timings.morning}</p></div>
              <span aria-hidden="true">🪔</span>
              <div><h3>Evening</h3><p>{t.timings.evening}</p></div>
            </div>
            <p className="plaque-note">{t.timings.note}</p>
          </div>
          <p className="center"><Link className="btn btn-gold" to="/visit">Plan Your Visit</Link></p>
        </div>
      </section>
    </div>
  );
}
