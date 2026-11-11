import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { templeData as base } from "../data/templeData.js";
import { useData } from "../data/useData.js";
import { useLang } from "../i18n/LanguageContext.jsx";
import {
  IconChat,
  IconClock,
  IconMail,
  IconPhone,
  IconPin,
  PageHero,
  Reveal,
  Section,
  SectionTitle,
  usePageMeta,
} from "../components/ui.jsx";

import bellAnimation from "../assets/Lottie/Bell.json";
import { Lottie, LottieSubscription } from "lottie-react";

const tel = `tel:${base.contact.phone.replace(/\s/g, "")}`;

function Bell() {
  return (
    <svg className="hero-bell" viewBox="0 0 120 170" aria-hidden="true">
      <defs>
        <linearGradient id="vcBell" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a8741c" />
          <stop offset="0.45" stopColor="#f1d489" />
          <stop offset="1" stopColor="#a8741c" />
        </linearGradient>
      </defs>
      <line x1="60" y1="0" x2="60" y2="34" stroke="#d4a23a" strokeWidth="3" />
      <circle cx="60" cy="38" r="7" fill="url(#vcBell)" />
      <path
        d="M28 118 C28 76 40 46 60 44 C80 46 92 76 92 118 L104 130 L16 130 Z"
        fill="url(#vcBell)"
      />
      <circle cx="60" cy="140" r="9" fill="url(#vcBell)" />
    </svg>
  );
}

/* Bell rings in (frames 0-240), then keeps ringing (150-240) instead of
   playing the exit scale-out at the end of the file, which made it vanish. */
function TempleBellAnimation() {
  const ref = useRef(null);
  return (
    <div className="hero-bell">
      <Lottie
        src={bellAnimation}
        lottieRef={ref}
        autoplay
        loop
        className="hero-bell-lottie"
        subscriptions={{
          [LottieSubscription.ready]: () =>
            ref.current?.playSegments([[0, 240], [150, 240]]),
        }}
      />
    </div>
  );
}

function InfoCards() {
  const { t } = useData();
  const { tx } = useLang();
  const cards = [
    {
      icon: <IconPhone />,
      title: tx("visit.call"),
      body: <a href={tel}>{t.contact.phone}</a>,
    },
    {
      icon: <IconPin />,
      title: tx("visit.address"),
      body: <span>{t.contact.address}</span>,
    },
    {
      icon: <IconClock />,
      title: tx("visit.hours"),
      body: <span>{t.contact.hours}</span>,
    },
  ];
  if (t.contact.email)
    cards.push({
      icon: <IconMail />,
      title: tx("visit.email"),
      body: <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a>,
    });
  return (
    <div className="vc-cards">
      {cards.map((c, i) => (
        <Reveal key={c.title} delay={i * 100} className="vc-card">
          <span className="vc-ic">{c.icon}</span>
          <h3>{c.title}</h3>
          <p>{c.body}</p>
        </Reveal>
      ))}
    </div>
  );
}

function WeekTable() {
  const { t, weeklyTimings } = useData();
  const { tx } = useLang();
  return (
    <Reveal className="vc-week">
      <h3>{tx("visit.week")}</h3>
      <table>
        <thead>
          <tr>
            <th scope="col">{tx("visit.day")}</th>
            <th scope="col">{tx("common.morning")}</th>
            <th scope="col">{tx("common.evening")}</th>
          </tr>
        </thead>
        <tbody>
          {weeklyTimings.map((d) => (
            <tr key={d.day}>
              <th scope="row">{d.dayLabel}</th>
              <td>{d.morning}</td>
              <td>{d.evening}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="note">{t.timings.note}</p>
    </Reveal>
  );
}

function MapAndRoutes() {
  const { t } = useData();
  const { tx } = useLang();
  const [i, setI] = useState(0);
  return (
    <div className="vc-routes">
      <Reveal variant="left" className="vc-map">
        <iframe
          title={tx("visit.mapTitle")}
          src={t.location.embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <a
          className="btn btn-gold vc-map-btn"
          href={t.location.mapUrl}
          target="_blank"
          rel="noreferrer"
        >
          {tx("visit.openMap")}
        </a>
      </Reveal>
      <Reveal variant="right" className="vc-panel">
        <div className="vc-tabs" role="tablist" aria-label={tx("visit.ways")}>
          {t.reach.map((r, k) => (
            <button
              key={r.mode}
              role="tab"
              id={`vc-tab-${k}`}
              aria-selected={i === k}
              aria-controls="vc-body"
              className={i === k ? "on" : ""}
              onClick={() => setI(k)}
            >
              {r.mode}
            </button>
          ))}
        </div>
        <div
          id="vc-body"
          role="tabpanel"
          aria-labelledby={`vc-tab-${i}`}
          key={i}
          className="vc-body"
        >
          <h3>{t.reach[i].mode}</h3>
          <p>{t.reach[i].text}</p>
        </div>
      </Reveal>
    </div>
  );
}

function MessageForm() {
  const { t } = useData();
  const { tx } = useLang();
  const [f, setF] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.name.trim() && f.message.trim();

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    const text = `${tx("visit.greeting")} ${f.message.trim()}\n\n${f.name.trim()}${f.phone.trim() ? `\n${tx("visit.phoneLabel")} ${f.phone.trim()}` : ""}`;
    window.open(
      `https://wa.me/${t.contact.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener",
    );
    setSent(true);
  };

  return (
    <div className="vc-message">
      <Reveal className="vc-copy">
        <p className="kicker">{tx("visit.writeKicker")}</p>
        <h2>{tx("visit.writeTitle")}</h2>
        <p>{tx("visit.writeText")}</p>
        <p className="icon-line">
          <IconChat />{" "}
          <span>{tx("visit.talk", { phone: <a href={tel}>{t.contact.phone}</a> })}</span>
        </p>
        <p className="note">
          {tx("visit.notSure", {
            fest: <Link to="/festivals">{tx("visit.festList")}</Link>,
            offer: <Link to="/donation">{tx("visit.makeOffer")}</Link>,
          })}
        </p>
      </Reveal>

      <Reveal
        delay={120}
        as="form"
        className="vc-form"
        onSubmit={submit}
        noValidate
      >
        <label>
          <span>{tx("visit.yourName")}</span>
          <input
            value={f.name}
            onChange={set("name")}
            autoComplete="name"
            required
          />
        </label>
        <label>
          <span>
            {tx("visit.phone")} <em>{tx("visit.optional")}</em>
          </span>
          <input
            value={f.phone}
            onChange={set("phone")}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
          />
        </label>
        <label>
          <span>{tx("visit.message")}</span>
          <textarea
            rows="5"
            value={f.message}
            onChange={set("message")}
            required
          />
        </label>
        <button className="btn btn-maroon" type="submit" disabled={!valid}>
          {tx("visit.send")}
        </button>
        <p className="vc-ok" role="status">
          {sent ? tx("visit.sent") : ""}
        </p>
      </Reveal>
    </div>
  );
}

export default function VisitContactPage() {
  const { t } = useData();
  const { tx } = useLang();
  usePageMeta(tx("visit.title"), tx("visit.desc"));
  return (
    <>
      <PageHero
        kicker={tx("visit.kicker")}
        title={tx("visit.pageTitle")}
        sub={tx("visit.sub")}
        className="hero-visit"
      >
        {/* <Bell /> */}
        <TempleBellAnimation />
      </PageHero>

      <Section id="visit" className="vc-sec">
        <SectionTitle
          kicker={tx("visit.secKicker")}
          title={tx("visit.secTitle")}
          sub={t.contact.address}
        />
        <InfoCards />
        <WeekTable />
        <MapAndRoutes />
      </Section>

      <Section id="contact" className="vc-sec vc-contact">
        <MessageForm />
      </Section>
    </>
  );
}
