import { useData } from "../data/useData.js";
import { useLang } from "../i18n/LanguageContext.jsx";

export default function LocationButton() {
  const { t } = useData();
  const { tx } = useLang();

  return (
    <a
      className="location-float"
      href={t.location.mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={tx("home.directions")}
      title={tx("home.directions")}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    </a>
  );
}
