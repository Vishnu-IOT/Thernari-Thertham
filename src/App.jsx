import { useEffect, useRef } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Preloader from "./components/Preloader.jsx";
import { ScrollProgress, BackToTop } from "./components/ScrollUI.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import FestivalsPage from "./pages/FestivalsPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import VisitContactPage from "./pages/VisitContactPage.jsx";
import Donation from "./pages/Donation.jsx";
import NotFound from "./pages/NotFound.jsx";
import { useLang } from "./i18n/LanguageContext.jsx";
import LocationButton from "./components/LocationButton.jsx";
import YouTubeButton from "./components/YouTubeButton.jsx";
import WhatsAppButton from "./components/WhatsAppButton.jsx";
import CallButton from "./components/CallButton.jsx";
import SmoothScroll from "./motion/SmoothScroll.jsx";
import { scrollToEl, scrollToTop } from "./motion/smoothScroll.js";
import { EASE, releaseTransform } from "./motion/presets.js";
import { RESPECT_REDUCED_MOTION } from "./motion/config.js";

/* Scrolling to a #anchor after a page change. The page fades out first, so the
   new page is not on screen yet; keep looking for the element until it is.
   (Going back to the top of a new page happens when the old page has left.) */
const EXIT_MS = 380;
function ScrollToAnchor() {
  const { pathname, hash } = useLocation();
  const prev = useRef(pathname);
  useEffect(() => {
    const changed = prev.current !== pathname;
    prev.current = pathname;
    if (!hash) return undefined;
    let tries = 0;
    let id;
    const seek = () => {
      const el = document.getElementById(hash.slice(1));
      if (el) scrollToEl(el, { immediate: true });
      else if (++tries < 25) id = setTimeout(seek, 80);
    };
    id = setTimeout(seek, changed ? EXIT_MS : 60);
    return () => clearTimeout(id);
  }, [pathname, hash]);
  return null;
}

/* Page enter / leave (framer-motion) */
const pageMotion = {
  enter: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  leave: { opacity: 0, y: -10, transition: { duration: 0.22, ease: "easeIn" } },
};

export default function App() {
  const location = useLocation();
  const { pathname } = location;
  const { tx } = useLang();
  return (
    <MotionConfig reducedMotion={RESPECT_REDUCED_MOTION ? "user" : "never"}>
      <SmoothScroll />
      <Preloader />
      <ScrollProgress />
      <a className="skip-link" href="#main">{tx("skip")}</a>
      <Header />
      <ScrollToAnchor />
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => scrollToTop({ immediate: true })}>
        <motion.main
          id="main"
          className="page pg-m"
          key={pathname}
          variants={pageMotion}
          initial="enter"
          animate="show"
          exit="leave"
          transformTemplate={releaseTransform}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/festivals" element={<FestivalsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/visit" element={<VisitContactPage />} />
            <Route path="/contact" element={<Navigate to="/visit#contact" replace />} />
            <Route path="/renovation" element={<Navigate to="/history#mandapam" replace />} />
            <Route path="/inauguration-2024" element={<Navigate to="/history#mandapam" replace />} />
            <Route path="/donation" element={<Donation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <BackToTop />
      <LocationButton />
      <YouTubeButton />
      <WhatsAppButton />
      <CallButton />
    </MotionConfig>
  );
}
