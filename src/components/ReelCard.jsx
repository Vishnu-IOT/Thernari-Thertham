import { useState } from "react";
import { useLang } from "../i18n/LanguageContext.jsx";
import ReelPlayer, { CoverImg } from "./ReelPlayer.jsx";

/* A portrait, phone-style Instagram reel. It plays right on the site when
   tapped; nothing on the card takes the visitor to Instagram. */
export default function ReelCard({ reel, label, fallback, badge }) {
  const { tx } = useLang();
  const [play, setPlay] = useState(false);
  return (
    <figure className="rl-card">
      <div className={`rl-frame ${play ? "playing" : ""}`}>
        {play ? (
          <ReelPlayer reel={reel} title={label} />
        ) : (
          <button
            type="button"
            className="rl-poster"
            onClick={() => setPlay(true)}
            aria-label={tx("history.playReel", { title: label })}
          >
            <CoverImg src={reel.cover} fallback={fallback} alt="" loading="lazy" decoding="async" />
            <span className="rl-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
              </svg>
              {badge}
            </span>
            <span className="rl-play" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </span>
            <span className="rl-cap">
              <b>{label}</b>
              <small>{tx("history.reelTap")}</small>
            </span>
          </button>
        )}
      </div>
    </figure>
  );
}
