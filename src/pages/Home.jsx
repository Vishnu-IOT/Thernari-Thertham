import Hero from "../components/Hero.jsx";
import HomeFestivals from "../components/HomeFestivals.jsx";
import { HeritageIntro, TheerthamSection, DeitySection, PoojaSection, HomeVideo, Give, Visit } from "../components/HomeSections.jsx";
import TimingsCard from "../components/TimingsCard.jsx";
import { usePageMeta } from "../components/ui.jsx";
import { useLang } from "../i18n/LanguageContext.jsx";

export default function Home() {
  const { tx } = useLang();
  usePageMeta(tx("home.title"), tx("home.desc"));
  return (
    <>
      <Hero />
      <HeritageIntro />
      <TheerthamSection />
      <DeitySection />
      <PoojaSection />
      <HomeVideo />
      <HomeFestivals />
      <Give />
      <TimingsCard id="timings" />
      {/* <Visit /> */}
    </>
  );
}
