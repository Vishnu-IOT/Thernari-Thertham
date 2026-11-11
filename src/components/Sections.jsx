import { Link } from "react-router-dom";
import { Reveal, Section, SectionHeading } from "./Common.jsx";
import { PoojaCard, FestivalCard } from "./Cards.jsx";
import {
  templeData as t,
  deities,
  poojas,
  festivals,
  highlights,
} from "../data/templeData.js";
import rama from "../../public/images/temple/heritage.png";
import { RotatingChakra } from "./RotatingChakra.jsx";
import { useRef } from "react";
import { Diya, IconPhone, IconPin, SectionTitle } from "./ui.jsx";

const PH = (v) => v || "[Not yet provided]";

export function HeritageIntro() {
  return (
    <Section id="heritage" className="heritage">
      <div className="split">
        <Reveal className="frames heritage-visual">
          <RotatingChakra />
          <img
            src={rama}
            alt="Golden sculpture of Sree Rama holding a bow, with a figure standing beside him"
            loading="lazy"
            width="1254"
            height="1254"
            className="rama-image"
          />
        </Reveal>
        <Reveal>
          <p className="label">Our heritage</p>
          <h2>A Sacred Place of Faith and Tradition</h2>
          <div className="divider left" aria-hidden="true">
            <span />
          </div>
          {t.heritage.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <Link className="btn btn-maroon" to="/history">
            Discover Our History →
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}

export function TheerthamSection() {
  return (
    <section className="theertham" aria-labelledby="th-title">
      <div className="ripples" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="container split">
        <Reveal className="th-images">
          <img
            className="big"
            src="/images/temple/boat-god.jpeg"
            alt="Sacred water of Thenari Theertham (placeholder photograph)"
            loading="lazy"
          />
          <img
            className="small"
            src={t.images.theertham2}
            alt="Greenery around the theertham (placeholder photograph)"
            loading="lazy"
          />
        </Reveal>
        <Reveal>
          <p className="label light">The sacred waters</p>
          <h2 id="th-title">{t.name}</h2>
          <p className="quote">{t.theertham.quote}</p>
          <p>{t.theertham.text}</p>
        </Reveal>
      </div>
    </section>
  );
}

export function DeitySection() {
  return (
    <Section id="deities">
      <SectionHeading
        label="Sanctum"
        title="Temple deities"
        sub="Sree Rama, the principal deity of the temple."
      />
      <div className="deity-list">
        {deities.map((d) => (
          <Reveal key={d.name} className="card deity-card">
            <div className="img-wrap arch">
              <img
                src={d.image}
                alt={`${d.name} (placeholder image)`}
                loading="lazy"
                width="700"
                height="900"
              />
            </div>
            <h3>{d.name}</h3>
            <p>{d.text}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function PoojaSection({ showLink = true }) {
  return (
    <Section id="pooja" className="tint">
      <SectionHeading label="Daily worship" title="Pooja & Seva" />
      <div className="pooja-list">
        {poojas.map((p) => (
          <PoojaCard key={p.name} pooja={p} />
        ))}
      </div>
      {showLink && (
        <p className="center">
          <Link className="btn btn-maroon" to="/pooja-seva">
            All Pooja & Seva →
          </Link>
        </p>
      )}
    </Section>
  );
}

export function TempleTimings() {
  return (
    <Section id="timings">
      <SectionHeading label="Darshan" title="Temple timings" />
      <Reveal className="timings">
        <div>
          <h3>Morning</h3>
          <p>{t.timings.morning}</p>
        </div>
        <div className="sep" aria-hidden="true">
          🪔
        </div>
        <div>
          <h3>Evening</h3>
          <p>{t.timings.evening}</p>
        </div>
      </Reveal>
      <p className="center note">{t.timings.note}</p>
    </Section>
  );
}

export function FestivalSection({ all = false }) {
  // const list = all ? festivals : festivals.slice(0, 3);
  // return (
  // <Section id="festivals" className="tint">
  //   <SectionHeading label="Celebrations" title="Festivals & events" />
  //   <div className="fest-grid">
  //     {list.map((f) => (
  //       <Reveal key={f.name}>
  //         <FestivalCard festival={f} />
  //       </Reveal>
  //     ))}
  //   </div>
  //   {!all && (
  //     <p className="center">
  //       <Link className="btn btn-maroon" to="/festivals">
  //         All Festivals →
  //       </Link>
  //     </p>
  //   )}
  // </Section>
  const rail = useRef(null);
  const go = (dir) =>
    rail.current?.scrollBy({
      left: dir * Math.min(360, rail.current.clientWidth * 0.8),
      behavior: "smooth",
    });
  const list = festivals.slice(0, 6);
  return (
    <section className="section occasions">
      <img className="section-rama" src='/images/deity/fill.png' alt="Festivals" />
      <div className="container">
        <SectionTitle
          light
          kicker="Through the year"
          title="Festivals and observances"
          sub="Dates change every year, so please confirm with the temple before you plan a visit."
        />
      </div>
      <div className="rail-wrap">
        <div
          className="rail"
          ref={rail}
          tabIndex={0}
          aria-label="Festivals, scroll sideways"
        >
          {list.map((f) => (
            <article className="fest" key={f.name}>
              <p className="fest-date">{f.date}</p>
              <h3>{f.name}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
        <Link to="/about#festivals" className="fest-more">
          <span>Explore Festivals →</span>
        </Link>
        {/* <div className="rail-btns container">
          <button onClick={() => go(-1)} aria-label="Previous">
            ‹
          </button>
          <button onClick={() => go(1)} aria-label="Next">
            ›
          </button>
        </div> */}
      </div>
    </section>
  );
}

export function ArchitectureSection() {
  return (
    <Section id="architecture" className="arch-sec">
      <SectionHeading
        label="Craft"
        title="Architecture & heritage"
        sub="Scroll sideways to walk through the temple."
      />
      <div
        className="h-scroll"
        tabIndex={0}
        aria-label="Architecture highlights"
      >
        {highlights.map((h) => (
          <figure key={h.title}>
            <div className="img-wrap">
              <img
                src={h.image}
                alt={`${h.title} (placeholder image)`}
                loading="lazy"
                width="700"
                height="900"
              />
            </div>
            <figcaption>
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

export function VisitSection({ full = false }) {
  const { mapUrl, embedUrl } = t.location;
  return (
    <Section id="visit" className="tint">
      <SectionHeading
        label="Pilgrimage"
        title="Visit the temple"
        sub={`${t.name}, ${t.subtitle}`}
      />
      <p className="center">{PH(t.contact.address)}</p>
      {full && (
        <div className="grid four reach">
          {t.reach.map((r) => (
            <div className="card" key={r.mode}>
              <h3>{r.mode}</h3>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      )}
      {full && embedUrl && (
        <iframe
          className="map"
          title="Temple location map"
          src={embedUrl}
          loading="lazy"
        />
      )}
      {full && !embedUrl && (
        <div className="map placeholder">
          Map placeholder — add embedUrl in src/data/templeData.js
        </div>
      )}
      <p className="center">
        {mapUrl ? (
          <a
            className="btn btn-maroon"
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open in Google Maps
          </a>
        ) : (
          <span className="btn btn-maroon disabled" aria-disabled="true">
            Open in Google Maps
          </span>
        )}
        {!full && (
          <Link className="btn btn-outline" to="/visit">
            How to Reach
          </Link>
        )}
      </p>
    </Section>
  );
}

export function ContactSection() {
  const c = t.contact;
  const rows = [
    ["Temple Address", c.address],
    ["Phone", c.phone],
    ["Email", c.email],
    ["Opening Hours", c.hours || `${t.timings.morning} / ${t.timings.evening}`],
  ];
  return (
    <Section id="contact">
      <SectionHeading label="Reach us" title="Contact" />
      <dl className="contact-list">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{PH(v)}</dd>
          </div>
        ))}
      </dl>
      <p className="center">
        {t.location.mapUrl ? (
          <a
            className="btn btn-maroon"
            href={t.location.mapUrl}
            target="_blank"
            rel="noreferrer"
          >
            Get Directions
          </a>
        ) : (
          <Link className="btn btn-maroon" to="/visit">
            Get Directions
          </Link>
        )}
        {c.email ? (
          <a className="btn btn-outline" href={`mailto:${c.email}`}>
            Contact Temple
          </a>
        ) : (
          <span className="btn btn-outline disabled" aria-disabled="true">
            Contact Temple
          </span>
        )}
      </p>
    </Section>
  );
}

/* ============ Donation invitation ============ */
export function Give() {
  return (
    <section className="give">
      <div className="container give-inner">
        <Reveal variant="zoom" className="give-lamp"><Diya /></Reveal>
        <div className="give-copy">
          <Reveal><h2>Offer a lamp, a meal, a prayer</h2></Reveal>
          <Reveal delay={100}><p>Every offering helps the daily worship, the care of the theertham and the festivals that bring the community together.</p></Reveal>
          <Reveal delay={200}><Link className="btn btn-maroon" to="/donation">Give to the temple</Link></Reveal>
        </div>
      </div>
    </section>
  )
}

/* ============ Visit ============ */
export function Visit() {
  return (
    <section className="section visit">
      <div className="container visit-grid">
        <Reveal className="visit-times">
          <p className="kicker">Darshan</p>
          <div className="time-block"><span>Morning</span><strong>{t.timings.morning.label}</strong></div>
          <div className="time-block"><span>Evening</span><strong>{t.timings.evening.label}</strong></div>
          <p className="note">{t.timings.note}</p>
        </Reveal>
        <Reveal delay={150} className="visit-where">
          <p className="kicker">Find us</p>
          <h2>Elappully, Palakkad</h2>
          <p className="icon-line"><IconPin /> <span>{t.contact.address}</span></p>
          <p className="icon-line"><IconPhone /> <a href={`tel:${t.contact.phone.replace(/\s/g, '')}`}>{t.contact.phone}</a></p>
          <div className="btn-row">
            <a className="btn btn-gold" href={t.location.mapUrl} target="_blank" rel="noreferrer">Get directions</a>
            <Link className="btn btn-ghost" to="/contact">Contact the temple</Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
