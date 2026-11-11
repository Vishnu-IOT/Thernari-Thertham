import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Slogan from "./Slogan.jsx";
import { EASE, REVEAL_FROM, releaseTransform } from "../motion/presets.js";

/* ---------- Scroll reveal (framer-motion) ----------
   Same API as before (as / variant / delay in ms / className). The old
   "reveal rv-* in" class names are kept so existing CSS selectors still match. */
const motionTags = new Map()
const motionFor = (Tag) => {
  if (typeof Tag === "string") return motion[Tag] || motion.div;
  if (!motionTags.has(Tag)) motionTags.set(Tag, motion.create(Tag));
  return motionTags.get(Tag);
};

export function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  className = "",
  children,
  ...rest
}) {
  const [seen, setSeen] = useState(false);
  const M = motionFor(Tag);
  const from = REVEAL_FROM[variant] || REVEAL_FROM.up;
  return (
    <M
      className={`reveal rv-${variant} rv-m ${seen ? "in" : ""} ${className}`}
      style={{ "--d": `${delay}ms` }}
      initial={{ opacity: 0, ...from }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.85, ease: EASE, delay: delay / 1000 }}
      transformTemplate={releaseTransform}
      onViewportEnter={() => setSeen(true)}
      {...rest}
    >
      {children}
    </M>
  );
}

/* Today's weekday in India, e.g. "Tuesday" (used to highlight today's timings) */
export const istWeekday = () =>
  new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", weekday: "long" }).format(new Date());

/* ---------- Section wrapper ---------- */
export function Section({ id, className = "", children }) {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="container">{children}</div>
    </section>
  );
}

/* ---------- Floating embers (hero atmosphere) ---------- */
export function Embers({ count = 26 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        dur: 9 + Math.random() * 10,
        delay: -Math.random() * 18,
        drift: (Math.random() - 0.5) * 90,
      })),
    [count],
  );
  return (
    <div className="embers" aria-hidden="true">
      {items.map((e, i) => (
        <i
          key={i}
          style={{
            left: `${e.left}%`,
            "--s": `${e.size}px`,
            "--t": `${e.dur}s`,
            "--dl": `${e.delay}s`,
            "--x": `${e.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Decorative bits ---------- */
export function Ornament({ className = "" }) {
  return (
    <div className={`ornament ${className}`} aria-hidden="true">
      <span />
      <svg viewBox="0 0 48 20" width="48" height="20">
        <path d="M24 2 L30 10 L24 18 L18 10 Z" fill="currentColor" />
        <circle cx="8" cy="10" r="2.2" fill="currentColor" />
        <circle cx="40" cy="10" r="2.2" fill="currentColor" />
      </svg>
      <span />
    </div>
  );
}

export function Diya({ className = "" }) {
  const uid = useId().replace(/:/g, "");
  const dg = `dg${uid}`;
  const db = `db${uid}`;
  return (
    <svg
      className={`diya ${className}`}
      viewBox="0 0 120 120"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={dg} cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e8892a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={db} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1d489" />
          <stop offset="1" stopColor="#a8741c" />
        </linearGradient>
      </defs>
      <circle className="diya-glow" cx="60" cy="48" r="46" fill={`url(#${dg})`} />
      <g className="flame">
        <path
          d="M60 18 C70 34 76 42 76 54 C76 64 69 70 60 70 C51 70 44 64 44 54 C44 42 52 34 60 18 Z"
          fill="#ffb347"
        />
        <path
          d="M60 36 C66 46 68 50 68 57 C68 63 64 66 60 66 C56 66 52 63 52 57 C52 50 55 46 60 36 Z"
          fill="#fff3c4"
        />
      </g>
      <path
        d="M18 70 C22 96 44 106 60 106 C76 106 98 96 102 70 C88 78 72 80 60 80 C48 80 32 78 18 70 Z"
        fill={`url(#${db})`}
      />
      <path
        d="M18 70 C32 78 48 80 60 80 C72 80 88 78 102 70"
        stroke="#6e1423"
        strokeOpacity=".35"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

export function SectionTitle({
  kicker,
  title,
  sub,
  align = "center",
  light = false,
}) {
  return (
    <Reveal className={`sec-title ${align} ${light ? "light" : ""}`}>
      {kicker && <p className="kicker">{kicker}</p>}
      <h2>{title}</h2>
      {sub && <p className="sub">{sub}</p>}
      <Ornament />
    </Reveal>
  );
}

/* ---------- Compact page banner used by the inner pages ---------- */
export function PageHero({ title, sub, kicker, children, className = "", bg, slogan = true }) {
  /* the banner text drifts up and softly fades as the page is scrolled */
  const sec = useRef(null);
  const { scrollYProgress } = useScroll({ target: sec, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);
  return (
    <>
      <section className={`page-hero ${bg ? "has-bg" : ""} ${className}`} ref={sec}>
        {bg && (
          <>
            <img className="page-hero-bg" src={bg} alt="" aria-hidden="true" fetchpriority="high" decoding="async" />
            <span className="page-hero-veil" aria-hidden="true" />
          </>
        )}
        <Embers count={14} />
        <div className="container page-hero-inner">
          <motion.div className="page-hero-copy" style={{ y: copyY, opacity: copyOpacity }}>
            {kicker && (
              <p className="mantra rise" style={{ "--d": ".05s" }}>
                {kicker}
              </p>
            )}
            <h1 className="rise" style={{ "--d": ".15s" }}>
              {title}
            </h1>
            {sub && (
              <p className="page-hero-sub rise" style={{ "--d": ".3s" }}>
                {sub}
              </p>
            )}
          </motion.div>
          {!bg && (
            <div className="page-hero-art rise" style={{ "--d": ".2s" }} aria-hidden="true">
              {children}
            </div>
          )}
        </div>
      </section>
      {/* {slogan && <Slogan />} */}
      {slogan && <Slogan key={typeof window !== "undefined" ? window.location.pathname : "s"} />}
    </>
  );
}

/* ---------- Icons ---------- */
const I = ({ children }) => (
  <svg
    className="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);
export const IconPhone = () => (
  <I>
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </I>
);
export const IconPin = () => (
  <I>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </I>
);
export const IconClock = () => (
  <I>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </I>
);
export const IconMail = () => (
  <I>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </I>
);
export const IconChat = () => (
  <I>
    <path d="M21 12a8 8 0 0 1-11.7 7L4 20l1.2-4.6A8 8 0 1 1 21 12z" />
  </I>
);
export const IconCopy = () => (
  <I>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </I>
);
export const IconCheck = () => (
  <I>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </I>
);

/* ---------- Helpers ---------- */
export function usePageMeta(title, desc) {
  useEffect(() => {
    document.title = title;
    const m = document.querySelector('meta[name="description"]');
    if (m && desc) m.setAttribute("content", desc);
  }, [title, desc]);
}
