import { useEffect, useState } from "react";
import { scrollToEl } from "../motion/smoothScroll.js";
import { Link } from "react-router-dom";
import {
  templeData as t,
  deities,
  waters,
  surroundings,
  poojas,
  festivals,
} from "../data/templeData.js";
import {
  Reveal,
  PageHero,
  SectionTitle,
  Ornament,
  usePageMeta,
} from "../components/ui.jsx";

const sections = [
  { id: "heritage", label: "Heritage" },
  { id: "deities", label: "Deities" },
  { id: "theertham", label: "Theertham" },
  { id: "seva", label: "Pooja and Seva" },
  { id: "festivals", label: "Festivals" },
  { id: "timings", label: "Timings" },
];

/* Sticky in-page navigation that follows the reader */
function JumpNav() {
  const [active, setActive] = useState("heritage");
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const top = () => {
      if (window.scrollY < 200) setActive("heritage");
    };
    window.addEventListener("scroll", top, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", top);
    };
  }, []);
  return (
    <nav className="jump" aria-label="On this page">
      <div className="container jump-inner">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? "on" : ""}
            onClick={(e) => {
              e.preventDefault();
              scrollToEl(document.getElementById(s.id));
            }}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

const chapters = [
  { title: "The place", text: t.heritage[0] },
  { title: "The tradition", text: t.heritage[1] },
  { title: "Worship today", text: t.heritage[2] },
];

function Heritage() {
  return (
    <section id="heritage" className="section heritage">
      <div className="container heritage-grid">
        <div className="mandala" aria-hidden="true">
          <div className="mandala-sticky">
            <img
              className="mandala-chakra"
              src="/images/temple/chakra.webp"
              alt=""
              loading="lazy"
            />
            <img
              className="mandala-deity"
              src="/images/temple/heritage.webp"
              alt=""
              loading="lazy"
            />
          </div>
        </div>
        <div className="chapters">
          <Reveal>
            <p className="kicker">Our heritage</p>
          </Reveal>
          <Reveal delay={80}>
            <h2>Where the Ramayana meets the village of Thenari</h2>
          </Reveal>
          {chapters.map((c, i) => (
            <Reveal key={c.title} delay={60} className="chapter">
              <h3>{c.title}</h3>
              <p className={i === 0 ? "dropcap" : ""}>{c.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Deities() {
  return (
    <section id="deities" className="section deities-sec">
      <div className="container">
        <SectionTitle kicker="The sanctum" title="Deities of the temple" />
        <div className="deity-rows">
          {deities.map((d, i) => (
            <Reveal
              key={d.name}
              variant={i % 2 ? "right" : "left"}
              className="deity-row"
            >
              <div className="deity-arch small">
                <span className="script" lang="ml">
                  {d.script}
                </span>
              </div>
              <div>
                <h3>{d.name}</h3>
                <p>{d.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Theertham() {
  return (
    <section id="theertham" className="section waters about-waters">
      <div className="ripples" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="container">
        <div className="about-waters-top">
          <div>
            <Reveal>
              <p className="kicker">The sacred waters</p>
            </Reveal>
            <Reveal delay={80}>
              <h2>{t.name}</h2>
            </Reveal>
            <Reveal delay={160}>
              <blockquote className="pull light">
                {t.theertham.quote}
              </blockquote>
            </Reveal>
            <Reveal delay={220}>
              <p className="lead">{t.theertham.text}</p>
            </Reveal>
          </div>
          <Reveal variant="arch" className="waters-photo">
            <img
              src="/images/temple/boat-god.jpeg"
              alt="A golden boat adorned with flower garlands on the water"
              loading="lazy"
            />
          </Reveal>
        </div>
        <div className="water-cards">
          {waters.map((w, i) => (
            <Reveal key={w.title} delay={i * 120} className="water-card">
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </Reveal>
          ))}
        </div>
        <div className="around">
          {surroundings.map((s, i) => (
            <Reveal key={s.title} delay={i * 100} className="around-item">
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Seva() {
  const [open, setOpen] = useState(null);
  return (
    <section id="seva" className="section seva">
      <div className="container seva-wrap">
        <SectionTitle
          kicker="Offerings for devotees"
          title="Pooja and Seva"
          sub="Tap an offering to see how to arrange it."
        />
        <ul className="acc">
          {poojas.map((p, i) => {
            const on = open === i;
            return (
              <Reveal
                as="li"
                key={p.name}
                delay={i * 50}
                className={`acc-item ${on ? "on" : ""}`}
              >
                <button
                  onClick={() => setOpen(on ? null : i)}
                  aria-expanded={on}
                  aria-controls={`acc-${i}`}
                >
                  <span className="acc-name">{p.name}</span>
                  <span className="acc-time">{p.time}</span>
                  <span className="acc-plus" aria-hidden="true" />
                </button>
                <div className="acc-panel" id={`acc-${i}`} role="region">
                  <div>
                    <p>{p.text}</p>
                    <p className="acc-note">{p.details}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Festivals() {
  return (
    <section id="festivals" className="section occasions about-fest">
      <div className="container">
        <SectionTitle
          light
          kicker="Through the year"
          title="Festivals and observances"
          sub="Dates change every year, so please confirm with the temple before you plan a visit."
        />
        <div className="fest-grid">
          {festivals.map((f, i) => (
            <Reveal
              as="article"
              key={f.name}
              delay={(i % 3) * 100}
              className="fest"
            >
              <p className="fest-date">{f.date}</p>
              <h3>{f.name}</h3>
              <p>{f.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Timings() {
  return (
    <section id="timings" className="section timings">
      <div className="container">
        <SectionTitle kicker="Darshan" title="Temple timings" />
        <Reveal className="timing-board">
          <div>
            <span>Morning</span>
            <strong>{t.timings.morning.label}</strong>
          </div>
          <Ornament className="vertical" />
          <div>
            <span>Evening</span>
            <strong>{t.timings.evening.label}</strong>
          </div>
        </Reveal>
        <p className="center note">{t.timings.note}</p>
        <Reveal className="about-cta">
          <Link className="btn btn-maroon" to="/contact">
            Plan your visit
          </Link>
          <Link className="btn btn-line" to="/donation">
            Support the temple
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export default function About() {
  usePageMeta(
    "About | Thenari Theertham",
    "The heritage, deities, sacred theertham, offerings and festivals of Thenari Sree Rama Temple, Elappully, Palakkad.",
  );
  return (
    <>
      <PageHero
        kicker="॥ ശ്രീ രാമ ॥"
        title="About the temple"
        sub={t.subtitle}
        className="hero-about"
      >
        <img className="spin-slow" src="/images/temple/chakra.webp" alt="" />
      </PageHero>
      <JumpNav />
      <Heritage />
      <Deities />
      <Theertham />
      <Seva />
      <Festivals />
      <Timings />
    </>
  );
}
