import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useData } from "../data/useData.js";
import { useLang } from "../i18n/LanguageContext.jsx";
import LangSwitch from "./LangSwitch.jsx";
import { istWeekday } from "./ui.jsx";
import { EASE, SPRING, releaseTransform } from "../motion/presets.js";

const MotionNavLink = motion.create(NavLink);
const drawerItem = {
  closed: { opacity: 0, x: 26 },
  open: (i) => ({ opacity: 1, x: 0, transition: { delay: 0.12 + i * 0.06, duration: 0.45, ease: EASE } }),
};

function BaliTharpanamMarquee({ darshanTrackRef }) {
  const { t } = useData();
  const [copies, setCopies] = useState(1);
  const windowRef = useRef(null);
  const itemRef = useRef(null);
  const baliTrackRef = useRef(null);
  const runRef = useRef(null);
  useEffect(() => {
    const updateMarquee = () => {
      const messageWidth = itemRef.current?.getBoundingClientRect().width;
      const availableWidth = windowRef.current?.clientWidth;
      const baliWidth = baliTrackRef.current?.getBoundingClientRect().width;
      const darshanWidth = darshanTrackRef.current?.getBoundingClientRect().width;
      if (messageWidth && availableWidth) {
        setCopies((count) => {
          const next = Math.ceil(availableWidth / messageWidth) + 1;
          return count === next ? count : next;
        });
      }
      if (!baliWidth || !darshanWidth || !runRef.current) return;
      runRef.current.style.setProperty(
        "--tm-duration",
        `${48 * (baliWidth / darshanWidth)}s`,
      );
    };
    updateMarquee();
    const observer = "ResizeObserver" in window ? new ResizeObserver(updateMarquee) : null;
    if (windowRef.current) observer?.observe(windowRef.current);
    if (itemRef.current) observer?.observe(itemRef.current);
    if (baliTrackRef.current) observer?.observe(baliTrackRef.current);
    if (darshanTrackRef.current) observer?.observe(darshanTrackRef.current);
    window.addEventListener("resize", updateMarquee);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateMarquee);
    };
  }, [darshanTrackRef, t.baliTharpanamTicker]);
  const message = (index, ref) => (
    <span className="tm-item" key={index} ref={ref}>
      <b>{t.baliTharpanamTicker}</b>
      <em aria-hidden="true">◆</em>
    </span>
  );
  return (
    <div className="timing-marquee bali-marquee" role="group" aria-label={t.baliTharpanamTicker}>
      <span className="tm-label">{t.baliTharpanamTickerLabel}</span>
      <div className="tm-window" ref={windowRef}>
        <div className="tm-run" ref={runRef}>
          <div className="tm-track" ref={baliTrackRef}>
            {Array.from({ length: copies }, (_, index) =>
              message(index, index === 0 ? itemRef : undefined),
            )}
          </div>
          <div className="tm-track" aria-hidden="true">
            {Array.from({ length: copies }, (_, index) => message(index, undefined))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ open, onClose }) {
  const { navLinks } = useData();
  const { tx } = useLang();
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.documentElement.classList.toggle("menu-open", open);
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
      document.documentElement.classList.remove("menu-open");
    };
  }, [open, onClose]);
  return (
    <>
      <div
        className={`drawer-backdrop ${open ? "on" : ""}`}
        onClick={onClose}
      />
      <motion.nav
        className={`drawer ${open ? "on" : ""}`}
        aria-label={tx("header.mobile")}
        aria-hidden={!open}
        initial={false}
        animate={open ? "open" : "closed"}
        variants={{ open: {}, closed: {} }}
      >
        {navLinks.map((l, i) => (
          <MotionNavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            tabIndex={open ? 0 : -1}
            custom={i}
            variants={drawerItem}
            transformTemplate={releaseTransform}
          >
            {l.label}
          </MotionNavLink>
        ))}
      </motion.nav>
    </>
  );
}

/* Scrolling Sunday-Saturday darshan timings above the navbar */
function TimingMarquee({ trackRef }) {
  const { weeklyTimings } = useData();
  const { tx } = useLang();
  const now = istWeekday();
  const items = weeklyTimings.map((d) => (
    <span className={`tm-item ${d.day === now ? "today" : ""}`} key={d.day}>
      <b>{d.dayLabel}</b> {d.morning} <i aria-hidden="true">·</i> {d.evening}
      <em aria-hidden="true">◆</em>
    </span>
  ));
  return (
    <div
      className="timing-marquee"
      role="group"
      aria-label={tx("header.marqueeAria")}
    >
      <span className="tm-label">{tx("header.darshan")}</span>
      <div className="tm-window">
        <div className="tm-run">
          <div className="tm-track" ref={trackRef}>{items}</div>
          <div className="tm-track" aria-hidden="true">
            {items}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const { t, navLinks } = useData();
  const { tx } = useLang();
  const [open, setOpen] = useState(false);
  const darshanTrackRef = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  /* the glass of the header becomes a little more solid as the page scrolls */
  const { scrollY } = useScroll();
  const glass = useTransform(scrollY, [0, 140], [0, 1]);
  /* Publish the real header height so sticky tabs and anchor jumps sit right under it */
  useEffect(() => {
    const el = document.querySelector(".site-header");
    if (!el) return undefined;
    const set = () => document.documentElement.style.setProperty("--hh-live", `${el.offsetHeight}px`);
    set();
    const ro = "ResizeObserver" in window ? new ResizeObserver(set) : null;
    ro?.observe(el);
    window.addEventListener("resize", set);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", set);
    };
  }, []);
  return (
    <motion.header
      className="site-header"
      style={{ "--hglass": glass }}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      transformTemplate={releaseTransform}
    >
      <TimingMarquee trackRef={darshanTrackRef} />
      <div className="header-main">
        <Link
          to="/"
          className="brand"
          aria-label={tx("header.home", { name: t.name })}
        >
          <span className="emblem" aria-hidden="true">
            <img src="/images/temple/logo.png" alt="Rama"/>
          </span>
          {/* 🪔 */}
          <span className="brand-text">
            <strong>{t.name}</strong>
            <span>{t.subtitle}</span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label={tx("header.main")}>
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={l.to === "/donation" ? "nav-donate" : undefined}
            >
              {({ isActive }) => (
                <>
                  <span>{l.label}</span>
                  {isActive && l.to !== "/donation" && (
                    <motion.i className="nav-ink" layoutId="nav-ink" transition={SPRING} aria-hidden="true" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="lng-tools">
          <LangSwitch />
          <button
            className={`burger ${open ? "x" : ""}`}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={tx("header.menu")}
          >
            <i />
            <i />
            <i />
          </button>
        </div>
      </div>
      <BaliTharpanamMarquee darshanTrackRef={darshanTrackRef} />
      <div className="header-border" aria-hidden="true" />
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </motion.header>
  );
}
