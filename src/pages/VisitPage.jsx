import { usePageMeta, Reveal } from "../components/Common.jsx";
import { PageHero, CarvedFrame } from "../components/Ornaments.jsx";
import { templeData as t } from "../data/templeData.js";

export default function VisitPage() {
  usePageMeta("Visit Us | Thenari Theertham", "How to reach Thenari Sree Rama Temple, Elappully, Palakkad.");
  const { mapUrl, embedUrl } = t.location;
  return (
    <div className="page-visit">
      <PageHero theme="theme-green" mal="തീർത്ഥയാത്ര" title="Visit Us" sub={t.contact.address} />
      <section className="yatra-sec">
        <div className="container yatra-grid">
          <ol className="yatra-path">
            {t.reach.map((r) => (
              <Reveal key={r.mode} className="yatra-stop"><span className="stop-lamp" aria-hidden="true">🪔</span><h2>{r.mode}</h2><p>{r.text}</p></Reveal>
            ))}
          </ol>
          <div className="yatra-map">
            <CarvedFrame>
              {embedUrl ? <iframe title="Temple location map" src={embedUrl} loading="lazy" />
                : <div className="map-ph">Map placeholder — add embedUrl in src/data/templeData.js</div>}
            </CarvedFrame>
            {mapUrl && <p className="center"><a className="btn btn-maroon" href={mapUrl} target="_blank" rel="noreferrer">Open in Google Maps</a></p>}
          </div>
        </div>
      </section>
    </div>
  );
}
