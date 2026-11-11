import { Link } from "react-router-dom";
import Gallery from "../components/Gallery.jsx";
import { Section, usePageMeta } from "../components/Common.jsx";
import {
  HeritageIntro,
  TheerthamSection,
  DeitySection,
  PoojaSection,
  TempleTimings,
  FestivalSection,
  ArchitectureSection,
  VisitSection,
  ContactSection,
} from "../components/Sections.jsx";

function PageBanner({ title, sub }) {
  usePageMeta(
    `${title} | Thenari Theertham`,
    `${title} — Thenari Theertham, Sree Madhyaranya Sree Rama Temple Thenari.`,
  );
  return (
    <div className="page-banner">
      <h1>{title}</h1>
      {sub && <p>{sub}</p>}
    </div>
  );
}
export const TemplePage = () => (
  <>
    <PageBanner title="The Temple" sub="Sree Madhyaranya Sree Rama Temple Thenari" />
    <DeitySection />
    <ArchitectureSection />
    <TempleTimings />
  </>
);
// export const HistoryPage = () => (
//   <>
//     <PageBanner title="History" sub="Sree Madhyaranya Sree Rama Temple Thenari" />
//     <HeritageIntro />
//   </>
// );
export const TheerthamPage = () => (
  <>
    <PageBanner title="Thenari Theertham" />
    <TheerthamSection />
  </>
);
export const PoojaSeva = () => (
  <>
    <PageBanner title="Pooja & Seva" />
    <PoojaSection showLink={false} />
    <TempleTimings />
  </>
);
export const FestivalsPage = () => (
  <>
    <PageBanner title="Festivals & events" />
    <FestivalSection all />
  </>
);
export const GalleryPage = () => (
  <>
    <PageBanner title="Gallery" />
    <Section>
      <Gallery />
    </Section>
  </>
);
export const VisitPage = () => (
  <>
    <PageBanner title="Visit Us" />
    <VisitSection full />
  </>
);
export const ContactPage = () => (
  <>
    <PageBanner title="Contact" />
    <ContactSection />
  </>
);
export const PrivacyPage = () => (
  <>
    <PageBanner title="Privacy" />
    <Section>
      <p>[Add the temple's privacy statement here.]</p>
    </Section>
  </>
);
export const NotFoundPage = () => (
  <>
    <PageBanner
      title="Page not found"
      sub="This page does not exist or has moved."
    />
    <Section>
      <p className="center">
        <Link className="btn btn-maroon" to="/">
          Return home
        </Link>
        <Link className="btn btn-outline" to="/visit">
          Plan your visit
        </Link>
      </p>
    </Section>
  </>
);
