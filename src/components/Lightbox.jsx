import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { EASE, SPRING_SOFT } from "../motion/presets.js";
import { useLang } from "../i18n/LanguageContext.jsx";
import ReelPlayer from "./ReelPlayer.jsx";

export default function Lightbox({ items, index, onClose, onChange }) {
  const { tx } = useLang();
  const item = items[index];
  const touch = useRef(null);
  const move = useCallback((d) => onChange((index + d + items.length) % items.length), [index, items.length, onChange]);

  useEffect(() => {
    const k = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", k);
    document.documentElement.classList.add("locked");
    return () => {
      window.removeEventListener("keydown", k);
      document.documentElement.classList.remove("locked");
    };
  }, [move, onClose]);

  const onTouchStart = (e) => { touch.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1);
    touch.current = null;
  };

  return (
    <motion.div
      className="gl-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={tx("lightbox.dialog")}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <button className="gl-lb-btn gl-lb-close" onClick={onClose} aria-label={tx("lightbox.close")}>×</button>
      <button className="gl-lb-btn gl-lb-prev" onClick={(e) => { e.stopPropagation(); move(-1); }} aria-label={tx("lightbox.prev")}>‹</button>
      <motion.figure
        key={item.id}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={SPRING_SOFT}
      >
        {item.type === "video" ? (
          <div className="gl-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${item.videoId}?autoplay=1&rel=0`}
              title={item.caption}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : item.type === "reel" ? (
          <div className="gl-reel">
            <ReelPlayer reel={item.reel} title={item.caption} />
          </div>
        ) : (
          <img src={item.src} alt={item.alt} />
        )}
        <figcaption>
          <b>{item.caption}</b>
          <small>{tx("lightbox.count", { category: tx(`cat.${item.category}`), n: index + 1, total: items.length })}</small>
        </figcaption>
      </motion.figure>
      <button className="gl-lb-btn gl-lb-next" onClick={(e) => { e.stopPropagation(); move(1); }} aria-label={tx("lightbox.next")}>›</button>
    </motion.div>
  );
}
