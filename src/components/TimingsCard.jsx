import { Link } from "react-router-dom";
import { Reveal } from "./ui.jsx";
import { useData } from "../data/useData.js";
import { useLang } from "../i18n/LanguageContext.jsx";

/* Splits a label such as "5:30 AM – 10:30 AM" (or the Malayalam / Tamil
   version) into its two clock times and their AM / PM words. Works in every
   language because it only looks at the digits and the word after them.
   If a label ever has a different shape, it is shown as plain text. */
const RANGE =
  /^\s*(?:([^\d\s][^\d]*?)\s+)?(\d{1,2}[:.]\d{2})\s*([^\s\d–—-]*)\s*[–—-]\s*(\d{1,2}[:.]\d{2})\s*([^\s\d–—-]*)\s*$/;
const parseRange = (label = "") => {
  const m = RANGE.exec(label);
  return m ? { pre: m[1], from: m[2], fromU: m[3], to: m[4], toU: m[5] } : null;
};

function Times({ label }) {
  const r = parseRange(label);
  if (!r) return <p className="tc-times tc-times-plain">{label}</p>;
  return (
    <p className="tc-times" aria-label={label}>
      {/* Malayalam / Tamil labels start with a word such as "രാവിലെ" instead of AM / PM */}
      {r.pre && (
        <small className="tc-pre" aria-hidden="true">
          {r.pre}
        </small>
      )}
      <span className="tc-t" aria-hidden="true">
        <b>{r.from}</b>
        {r.fromU && <small>{r.fromU}</small>}
      </span>
      <span className="tc-dash" aria-hidden="true" />
      <span className="tc-t" aria-hidden="true">
        <b>{r.to}</b>
        {r.toU && <small>{r.toU}</small>}
      </span>
    </p>
  );
}

const Diamond = () => (
  <svg className="tc-dia" viewBox="0 0 10 10" aria-hidden="true">
    <path d="M5 0.6 9.4 5 5 9.4 0.6 5Z" fill="currentColor" />
  </svg>
);

/* tiny flame-and-stem mark that sits either side of the kicker */
const Sprig = () => (
  <svg className="tc-sprig" viewBox="0 0 12 14" aria-hidden="true">
    <path
      d="M6 1c1.6 1.7 2 3 2 4.1A2 2 0 0 1 4 5.1C4 4 4.4 2.7 6 1Z M6 8v5 M2.6 8.6c1.4.1 2.6.9 3.4 2 .8-1.1 2-1.9 3.4-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function Lamp({ label }) {
  return (
    <svg className="tc-lamp" viewBox="0 0 64 132" role="img" aria-label={label}>
      <defs>
        <radialGradient id="tcGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#f6b04a" stopOpacity=".55" />
          <stop offset="1" stopColor="#f6b04a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tcBrass" x1="0" x2="1">
          <stop offset="0" stopColor="#6d4a24" />
          <stop offset=".45" stopColor="#c9a05c" />
          <stop offset="1" stopColor="#6d4a24" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="17" r="17" fill="url(#tcGlow)" />
      <g className="tc-flame">
        <path d="M32 3c4 4.6 5.4 8.2 5.4 11.2a5.4 5.4 0 0 1-10.8 0C26.6 11.2 28 7.6 32 3Z" fill="#f0a23a" />
        <path d="M32 9c2 2.4 2.8 4.4 2.8 6a2.8 2.8 0 0 1-5.6 0c0-1.6.8-3.6 2.8-6Z" fill="#fff0c2" />
      </g>
      {/* cup and top tier */}
      <path d="M22 22h20l-3 7H25Z" fill="url(#tcBrass)" />
      <rect x="29.5" y="29" width="5" height="22" fill="url(#tcBrass)" />
      {/* tiers */}
      <path d="M17 44h30l-3 6H20Z" fill="url(#tcBrass)" />
      <rect x="29.5" y="50" width="5" height="12" fill="url(#tcBrass)" />
      <path d="M13 62h38l-4 7H17Z" fill="url(#tcBrass)" />
      <rect x="29.5" y="69" width="5" height="18" fill="url(#tcBrass)" />
      <path d="M9 87h46l-5 8H14Z" fill="url(#tcBrass)" />
      {/* stem and base */}
      <path d="M27 95h10l3 15H24Z" fill="url(#tcBrass)" />
      <path d="M14 110h36l6 12H8Z" fill="url(#tcBrass)" />
      <rect x="8" y="122" width="48" height="3" rx="1" fill="#6d4a24" />
    </svg>
  );
}

const Brackets = () => <span className="tc-br" aria-hidden="true" />;

/* The "Temple Timings" card used on the Home page and the History page.
   Everything readable comes from the language files, the times from
   templeData (so editing the times there updates both pages). */
export default function TimingsCard({ id, as: Tag = "section", headingId = "tc-heading" }) {
  const { t } = useData();
  const { tx } = useLang();
  return (
    <Tag id={id} className="tc-sec" aria-labelledby={headingId}>
      <div className="container">
        <Reveal className="tc-card">
          <span className="tc-roof" aria-hidden="true">
            <svg viewBox="0 0 220 46" preserveAspectRatio="xMidYMax meet">
              <path d="M2 44H218" />
              <path d="M30 44 110 12 190 44" />
              <path d="M52 44 110 22 168 44" opacity=".5" />
              <path d="M110 12V4" />
              <circle cx="110" cy="3" r="2" className="fill" />
              <circle cx="2" cy="44" r="2.4" className="fill" />
              <circle cx="218" cy="44" r="2.4" className="fill" />
            </svg>
          </span>
          <i className="tc-corner tl" aria-hidden="true" />
          <i className="tc-corner tr" aria-hidden="true" />
          <i className="tc-corner bl" aria-hidden="true" />
          <i className="tc-corner br" aria-hidden="true" />

          <header className="tc-head">
            <p className="tc-kicker">
              <Sprig />
              <span className="tc-bars" aria-hidden="true" />
              <span>{tx("timeCard.kicker")}</span>
              <span className="tc-bars" aria-hidden="true" />
              <Sprig />
            </p>
            <h2 id={headingId}>{tx("timeCard.title")}</h2>
            <p className="tc-sub">{tx("timeCard.sub")}</p>
          </header>

          <div className="tc-body">
            <div className="tc-col tc-morning">
              <p className="tc-label">
                <span>{tx("timeCard.morningLabel")}</span>
                <Diamond />
              </p>
              <h3>{tx("timeCard.morningTitle")}</h3>
              <Times label={t.timings.morning.label} />
            </div>

            <div className="tc-mid">
              <span className="tc-line" aria-hidden="true" />
              <Lamp label={tx("timeCard.lampAria")} />
              <span className="tc-lamp-name">{tx("timeCard.lamp")}</span>
              <span className="tc-line" aria-hidden="true" />
            </div>

            <div className="tc-col tc-evening">
              <p className="tc-label">
                <Diamond />
                <span>{tx("timeCard.eveningLabel")}</span>
              </p>
              <h3>{tx("timeCard.eveningTitle")}</h3>
              <Times label={t.timings.evening.label} />
            </div>
          </div>

          <div className="tc-foot">
            <div className="tc-actions">
              <Link className="tc-btn tc-btn-solid" to="/visit#contact">
                <Brackets />
                <span>{tx("common.planVisit")}</span>
                <svg viewBox="0 0 16 10" aria-hidden="true">
                  <path d="M1 5h13M10 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link className="tc-btn tc-btn-line" to="/donation">
                <Brackets />
                <span>{tx("history.support")}</span>
              </Link>
            </div>
            <p className="tc-note">{t.timings.note}</p>
          </div>
        </Reveal>
      </div>
    </Tag>
  );
}
