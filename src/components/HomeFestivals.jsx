import { Link } from "react-router-dom";
import { useData, english } from "../data/useData.js";
import { useLang } from "../i18n/LanguageContext.jsx";
import { slug } from "../data/slug.js";
import { SectionTitle } from "./ui.jsx";

/* Home page festival rail. Each card shows a short preview (three lines);
   "View more" opens that festival on the Festivals page. */
export default function HomeFestivals() {
  const { festivals } = useData();
  const { tx } = useLang();
  const list = festivals.slice(0, 6);
  return (
    <section className="section occasions">
      <img className="section-rama" src="/images/deity/fill.png" alt="" aria-hidden="true" />
      <div className="container">
        <SectionTitle
          light
          kicker={tx("home.festKicker")}
          title={tx("common.festTitle")}
          sub={tx("common.festSub")}
        />
      </div>
      <div className="rail-wrap">
        <div className="rail" tabIndex={0} aria-label={tx("home.railAria")}>
          {list.map((f, i) => (
            <article className="fest" key={f.name}>
              <p className="fest-date">{f.date}</p>
              <h3>{f.name}</h3>
              <p className="fest-text">{f.text.replace(/\s*\n\s*/g, " ")}</p>
              <Link
                className="fest-view"
                to={`/festivals#${slug(english.festivals[i].name)}`}
                aria-label={tx("home.festViewAria", { name: f.name })}
              >
                {tx("home.festView")} <i aria-hidden="true">→</i>
              </Link>
            </article>
          ))}
        </div>
        <Link to="/festivals" className="fest-more">
          <span>{tx("home.festMore")}</span>
        </Link>
      </div>
    </section>
  );
}
