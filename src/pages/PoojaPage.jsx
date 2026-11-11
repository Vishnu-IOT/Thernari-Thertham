import { useState } from "react";
import { Link } from "react-router-dom";
import { usePageMeta } from "../components/Common.jsx";
import { PageHero, TempleTitle } from "../components/Ornaments.jsx";
import { templeData as t, poojas } from "../data/templeData.js";

export default function PoojaPage() {
  usePageMeta("Pooja & Seva | Thenari Theertham", "Vazhipadu and offerings at Sree Madhyaranya Sree Rama Temple Thenari.");
  const [open, setOpen] = useState(null);
  return (
    <div className="page-pooja">
      <PageHero theme="theme-board" mal="വഴിപാടുകൾ" title="Pooja & Seva" sub="Vazhipadu offered by devotees" />
      <section className="vazhipadu-sec">
        <div className="container">
          <div className="board">
            <h2>Vazhipadu</h2>
            <ul>
              {poojas.map((p, i) => (
                <li key={p.name} className={open === i ? "open" : ""}>
                  <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                    <span className="v-name">{p.name}</span>
                    <span className="v-dots" aria-hidden="true" />
                    <span className="v-time">{p.time}</span>
                  </button>
                  <div className="v-more"><p>{p.text}</p><p className="v-note">{p.details}</p></div>
                </li>
              ))}
            </ul>
            <p className="board-foot">Offerings and rates are confirmed at the temple office.</p>
          </div>
          <aside className="darshan-note">
            <TempleTitle small="Darshan" title="Temple Timings" />
            <p><strong>Morning</strong> {t.timings.morning}</p>
            <p><strong>Evening</strong> {t.timings.evening}</p>
            <p className="plaque-note">{t.timings.note}</p>
            <Link className="btn btn-maroon" to="/contact">Contact the Temple</Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
