import { Link } from "react-router-dom";
import { usePageMeta } from "../components/Common.jsx";
import { PageHero, Nilavilakku } from "../components/Ornaments.jsx";

export function PrivacyPage() {
  usePageMeta("Privacy | Thenari Theertham", "Privacy statement.");
  return (
    <div className="page-plain">
      <PageHero theme="theme-ola" title="Privacy" />
      <section className="section"><div className="container"><p>[Add the temple's privacy statement here.]</p></div></section>
    </div>
  );
}

export function NotFoundPage() {
  usePageMeta("Page not found | Thenari Theertham", "This page does not exist.");
  return (
    <div className="page-plain">
      <PageHero theme="theme-maroon" title="Page not found" sub="This page does not exist or has moved." />
      <section className="section">
        <div className="container center">
          <Nilavilakku className="nf-lamp" lit={false} />
          <p className="btn-row"><Link className="btn btn-maroon" to="/">Return home</Link><Link className="btn btn-outline" to="/visit">Plan your visit</Link></p>
        </div>
      </section>
    </div>
  );
}
