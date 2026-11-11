import { useEffect, useState } from "react";
import { useData } from "../data/useData.js";
import { useLang } from "../i18n/LanguageContext.jsx";
import { Diya } from "./ui.jsx";
import { prefersCalm } from "../motion/config.js";

/* Splash screen: a pair of carved temple doors that fill the WHOLE screen and
   swing INWARD (away from the visitor, into the screen) to reveal the site.
   Images:  /images/temple/door-left.webp, door-right.webp  (the two leaves)
            /images/temple/door-knocker.webp                 (elephant pull handle) */
function Leaf({ side }) {
  return (
    <div className={`door ${side}`} aria-hidden="true">
      <img
        className="door-art"
        src={`/images/temple/door-${side === "l" ? "left" : "right"}.webp`}
        alt=""
        width="760"
        height="1477"
        decoding="async"
        fetchpriority="high"
      />
      <img className="door-knob" src="/images/temple/door-knocker.webp" alt="" width="617" height="720" decoding="async" />
      <span className="door-shade" />
    </div>
  );
}

export default function Preloader() {
  const { t } = useData();
  const { tx } = useLang();
  const [phase, setPhase] = useState("show"); // show -> open -> gone
  useEffect(() => {
    const root = document.documentElement;
    const fast = prefersCalm();
    root.classList.add("locked");
    const open = setTimeout(() => {
      setPhase("open");
      root.classList.remove("locked");
      root.classList.add("ready"); // starts the hero text animation
    }, fast ? 300 : 1900);
    const gone = setTimeout(() => setPhase("gone"), fast ? 700 : 5000);
    return () => {
      clearTimeout(open);
      clearTimeout(gone);
      root.classList.remove("locked");
      root.classList.add("ready");
    };
  }, []);
  if (phase === "gone") return null;
  return (
    <div className={`preloader ${phase === "open" ? "open" : ""}`} role="status" aria-label={tx("loading")}>
      <div className="pre-wall" aria-hidden="true" />
      <div className="pre-core">
        <Diya className="pre-diya" />
        <p className="pre-name">{t.name}</p>
        <p className="pre-sub">{t.subtitle}</p>
      </div>
      <div className="door-set">
        <span className="pre-light" aria-hidden="true" />
        <Leaf side="l" />
        <Leaf side="r" />
      </div>
    </div>
  );
}
