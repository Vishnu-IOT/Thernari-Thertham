import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "../motion/presets.js";
import { useLang } from "../i18n/LanguageContext.jsx";

/* Each option is written in its own language. */
const OPTIONS = [
  { code: "ml", short: "ML", label: "മലയാളം" },
  { code: "en", short: "EN", label: "English" },
  { code: "ta", short: "TA", label: "தமிழ்" },
];

/* Language dropdown (Malayalam / English / Tamil) */
export default function LangSwitch() {
  const { lang, setLang, tx } = useLang();
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const current = OPTIONS.find((o) => o.code === lang) || OPTIONS[0];

  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => { if (!box.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        box.current?.querySelector(".lng-btn")?.focus();
      }
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const choose = (code) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div className={`lng-dd ${open ? "open" : ""}`} ref={box}>
      <button
        type="button"
        className="lng-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${tx("lang.label")}: ${current.label}`}
        onClick={() => setOpen((o) => !o)}
      >
        <svg className="lng-globe" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z" />
        </svg>
        <span className="lng-cur">{current.short}</span>
        <svg className="lng-caret" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" /></svg>
      </button>

      <AnimatePresence>
      {open && (
        <motion.ul
          className="lng-menu lm-m"
          role="listbox"
          aria-label={tx("lang.label")}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.18, ease: EASE }}
          style={{ transformOrigin: "top right" }}
        >
          {OPTIONS.map((o) => (
            <li key={o.code} role="presentation">
              <button
                type="button"
                role="option"
                lang={o.code}
                aria-selected={o.code === lang}
                className={o.code === lang ? "on" : ""}
                onClick={() => choose(o.code)}
              >
                <span>{o.label}</span>
                {o.code === lang && (
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.8" /></svg>
                )}
              </button>
            </li>
          ))}
        </motion.ul>
      )}
      </AnimatePresence>
    </div>
  );
}
