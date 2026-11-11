import { Link } from "react-router-dom";
import { useData } from "../data/useData.js";
import { useLang } from "../i18n/LanguageContext.jsx";
import { Ornament, istWeekday } from "./ui.jsx";

export default function Footer() {
  const { t, navLinks, weeklyTimings } = useData();
  const { tx, lang } = useLang();
  const now = istWeekday();
  return (
    <footer className="site-footer">
      <div className="ft-watermark" aria-hidden="true">
        <img src="/images/temple/chakra.webp" alt="" />
        <span>{tx("common.ram")}</span>
      </div>

      {/* Temple name + daily timings, centred at the top of the footer */}
      <div className="container ft-top">
        <img src="/images/temple/chakra.webp" alt="" width="64" height="64" loading="lazy" />
        <h2>{t.name}</h2>
        <p className="ft-sub">{t.subtitle}</p>
        <p className="mantra">{tx("common.ayodhyaMantra")}</p>
        {/* <ul className="ft-hours" aria-label={tx("footer.timings")}>
          <li>
            {lang === "en" && <span>{tx("common.morning")}</span>}
            <b>{t.timings.morning.label}</b>
          </li>
          <li>
            {lang === "en" && <span>{tx("common.evening")}</span>}
            <b>{t.timings.evening.label}</b>
          </li>
        </ul> */}
      </div>

      <div className="container footer-grid">
        <nav aria-label={tx("footer.nav")}>
          <h3>{tx("footer.pages")}</h3>
          <ul>{navLinks.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}</ul>
        </nav>

        <div className="ft-timings">
          <h3>{tx("footer.timings")}</h3>
          <ul>
            {weeklyTimings.map((d) => (
              <li key={d.day} className={d.day === now ? "today" : ""}>
                <span className="ft-day">{d.dayLabel}</span>
                <span className="ft-time">{d.morning}<br />{d.evening}</span>
              </li>
            ))}
          </ul>
          <p className="ft-note">{tx("footer.timingsNote")}</p>
        </div>

        <div>
          <h3>{tx("footer.visit")}</h3>
          <p>{t.contact.address}</p>
          <p><a href={`tel:${t.contact.phone.replace(/\s/g, "")}`}>{t.contact.phone}</a></p>
          <p><a href={t.location.mapUrl} target="_blank" rel="noreferrer">{tx("footer.directions")}</a></p>
          {t.social.length > 0 && (
            <ul className="footer-social">{t.social.map((s) => <li key={s.label}><a href={s.url} target="_blank" rel="noreferrer">{s.label}</a></li>)}</ul>
          )}
        </div>
      </div>

      <Ornament className="footer-orn" />
      <div className="container footer-legal">
        <p className="copyright">© {new Date().getFullYear()} {t.name}, {t.subtitle}</p>
        <p className="footer-credit">
          Designed and developed by{" "}
          <a href="https://mpeoples.in" target="_blank" rel="noopener noreferrer">
            MPeoples Business Solutions
          </a>
        </p>
      </div>
    </footer>
  );
}
