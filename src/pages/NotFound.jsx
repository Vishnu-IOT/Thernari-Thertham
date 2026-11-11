import { Link } from "react-router-dom";
import { PageHero, Section, usePageMeta } from "../components/ui.jsx";
import { useLang } from "../i18n/LanguageContext.jsx";

export default function NotFound() {
  const { tx } = useLang();
  usePageMeta(tx("notFound.title"));
  return (
    <>
      <PageHero title={tx("notFound.pageTitle")} sub={tx("notFound.sub")} />
      <Section>
        <p className="btn-row center" style={{ justifyContent: "center" }}>
          <Link className="btn btn-maroon" to="/">{tx("notFound.home")}</Link>
          <Link className="btn btn-line" to="/visit">{tx("common.planVisit")}</Link>
        </p>
      </Section>
    </>
  );
}
