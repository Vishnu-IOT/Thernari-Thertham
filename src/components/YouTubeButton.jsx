import { useLang } from "../i18n/LanguageContext.jsx";

/* ▶ PASTE YOUR YOUTUBE LINK HERE (video, playlist or channel) */
const YOUTUBE_URL = "https://youtu.be/n00fE4av47E?si=B6JVIGevtEwUCToQ";

export default function YouTubeButton() {
  const { tx } = useLang();
  return (
    <a
      className="yt-float"
      href={YOUTUBE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={tx("watchYoutube")}
      title={tx("watchYoutube")}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.3 5 12 5 12 5s-6.3 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.74 2 12 2 12s0 3.26.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.7 19 12 19 12 19s6.3 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.26 22 12 22 12s0-3.26-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
      </svg>
    </a>
  );
}
