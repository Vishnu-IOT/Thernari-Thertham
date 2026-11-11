import { Link } from "react-router-dom";
import { usePageMeta } from "../components/Common.jsx";
import { PageHero, Kasavu } from "../components/Ornaments.jsx";
import { templeData as t } from "../data/templeData.js";

const PH = (v) => v || "[Not yet provided]";

export default function ContactPage() {
  usePageMeta("Contact | Thenari Theertham", "Contact Thenari Sree Rama Temple, Elappully, Palakkad.");
  const c = t.contact;
  const rows = [["Temple Address", c.address], ["Phone", c.phone], ["Email", c.email], ["Opening Hours", c.hours]];
  return (
    <div className="page-contact">
      <PageHero theme="theme-maroon" mal="ബന്ധപ്പെടുക" title="Contact" sub="Reach the temple office" />
      <section className="invitation-sec">
        <div className="container">
          <div className="invitation">
            <p className="inv-mantra" lang="sa">॥ श्री राम ॥</p>
            <h2>{t.name}</h2><Kasavu />
            <dl>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{PH(v)}</dd></div>)}</dl>
            <p className="btn-row">
              {t.location.mapUrl
                ? <a className="btn btn-maroon" href={t.location.mapUrl} target="_blank" rel="noreferrer">Get Directions</a>
                : <Link className="btn btn-maroon" to="/visit">Get Directions</Link>}
              {c.phone && <a className="btn btn-outline" href={`tel:${c.phone.replace(/\s/g, "")}`}>Call the Temple</a>}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
