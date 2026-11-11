import { useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "../i18n/LanguageContext.jsx";
import { useLocation } from "react-router-dom";
import { pageSlogans } from "../data/pageSlogans.js";

/* Splits a line into words so each one can rise in on its own */
function Words({ text, from = 0 }) {
  return text.split(" ").map((w, i, all) => (
    <span key={`${w}-${i}`}>
      <span className="sg-w" aria-hidden="true" style={{ "--i": from + i }}>
        <i>{w}</i>
      </span>
      {i < all.length - 1 ? " " : null}
    </span>
  ));
}

/* Slogan: a full-screen band shown under the hero on every page.
   Animations start when it scrolls into view and replay on re-entry. */
export default function Slogan() {
  const { tx, lang } = useLang();
  const { pathname } = useLocation();

  // this page's slogan, falling back to the default one from strings.js
  const page = pageSlogans[pathname.replace(/\/$/, "") || "/"];
  const text = page?.[lang]; // en | ml | ta
  const s = {
    ramaMl: page?.ramaMl ?? tx("slogan.ramaMl"),
    ramaEn: page?.ramaEn ?? tx("slogan.ramaEn"),
    meaning: text?.meaning ?? tx("slogan.ramaMeaning"),
    line1: text?.line1 ?? tx("slogan.line1"),
    line2: text?.line2 ?? tx("slogan.line2"),
    quote: text?.quote ?? tx("slogan.quote"),
  };
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!("IntersectionObserver" in window)) {
      setOn(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const sparks = useMemo(
    () =>
      Array.from({ length: 22 }, () => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        dur: 8 + Math.random() * 9,
        delay: -Math.random() * 14,
        drift: (Math.random() - 0.5) * 80,
      })),
    [],
  );

  const ml = tx("slogan.ramaMl");
  const en = tx("slogan.ramaEn");
  const tickerMl = tx("slogan.ticker");
  const tickerEn = tx("slogan.tickerEn");

  const row = (text, k) =>
    Array.from({ length: 6 }, (_, i) => (
      <span key={`${k}${i}`}>
        {text}
        <em aria-hidden="true">✦</em>
      </span>
    ));

  return (
    <section
      id="slogan"
      ref={ref}
      className={`slogan sg ${on ? "sg-on" : ""}`}
      aria-label={tx("slogan.chip")}
    >
      {/* Two endless chant lines, running in opposite directions */}
      <div className="sg-ticker" aria-hidden="true">
        <div className="sg-run sg-run-a">
          <div className="sg-track" lang={lang === "ta" ? "ta" : "ml"}>
            {row(tickerMl, "a")}
          </div>
          <div className="sg-track">{row(tickerMl, "b")}</div>
        </div>
        {/* <div className="sg-run sg-run-b">
          <div className="sg-track" lang="en">
            {row(tickerEn, "c")}
          </div>
          <div className="sg-track">{row(tickerEn, "d")}</div>
        </div> */}
      </div>
      <span className="slogan-dust" aria-hidden="true" />
      <span className="sg-rays" aria-hidden="true" />
      <span className="sg-halo" aria-hidden="true" />
      <div className="sg-sparks" aria-hidden="true">
        {sparks.map((s, i) => (
          <i
            key={i}
            style={{
              left: `${s.left}%`,
              "--s": `${s.size}px`,
              "--t": `${s.dur}s`,
              "--dl": `${s.delay}s`,
              "--x": `${s.drift}px`,
            }}
          />
        ))}
      </div>

      <div className="container slogan-inner">
        {/* <p className="slogan-chip sg-in" style={{ "--d": ".05s" }}>
          <i aria-hidden="true">✦</i>
          {tx("slogan.chip")}
          <i aria-hidden="true">✦</i>
        </p> */}
        {/* <p className="slogan-place sg-in" style={{ "--d": ".15s" }}>
          {tx("slogan.place")}
        </p> */}

        {/* Sree Rama mantra: Malayalam + English, word by word */}
        {/* <h2 className="sg-rama" aria-label={`${ml}. ${en}`}>
          <span className="sg-rama-ml" lang="ml">
            <Words text={ml} from={1} />
          </span>
          <span className="sg-rama-en" lang="en">
            <Words text={en} from={7} />
          </span>
        </h2> */}
        {/* <p className="sg-meaning sg-in" style={{ "--d": "1.9s" }}>
          {tx("slogan.ramaMeaning")}
        </p> */}

        <div className="slogan-divider sg-divider" aria-hidden="true">
          <span />
          <svg viewBox="0 0 40 20" width="40" height="20">
            <path d="M20 3 L24 10 L20 17 L16 10 Z" fill="currentColor" />
            <circle cx="7" cy="10" r="1.8" fill="currentColor" />
            <circle cx="33" cy="10" r="1.8" fill="currentColor" />
          </svg>
          <span />
        </div>

        <blockquote className="slogan-quote sg-in" style={{ "--d": "1s" }}>
          <span className="slogan-mark open" aria-hidden="true">
            “
          </span>
          <p className="slogan-ml" lang={lang}>
            {/* <span>{tx("slogan.line1")}</span>
            <span>{tx("slogan.line2")}</span> */}

            <span>{s.line1}</span>
            <span>{s.line2}</span>
          </p>
          <span className="slogan-mark close" aria-hidden="true">
            ”
          </span>
        </blockquote>

        <div className="slogan-divider sg-divider" aria-hidden="true">
          <span />
          <svg viewBox="0 0 40 20" width="40" height="20">
            <path d="M20 3 L24 10 L20 17 L16 10 Z" fill="currentColor" />
            <circle cx="7" cy="10" r="1.8" fill="currentColor" />
            <circle cx="33" cy="10" r="1.8" fill="currentColor" />
          </svg>
          <span />
        </div>

        {/* <p className="slogan-en sg-in" style={{ "--d": "2.3s" }}>“{tx("slogan.quote")}”</p> */}

        {/* <ul className="slogan-tags sg-in" style={{ "--d": "2.5s" }}>
          <li>{tx("slogan.tag1")}</li>
          <li>{tx("slogan.tag2")}</li>
          <li>{tx("slogan.tag3")}</li>
        </ul> */}
      </div>
    </section>
  );
}
