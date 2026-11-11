import { useData } from "../data/useData.js";
import { useLang } from "../i18n/LanguageContext.jsx";

export default function CallButton() {
  const { t } = useData();
  const { tx } = useLang();

  return (
    <a
      className="call-float"
      href={`tel:${t.contact.phone.replace(/\s/g, "")}`}
      aria-label={tx("floating.call")}
      title={tx("floating.call")}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.6 3.8 9 3.2l2 4.7-1.8 1.5a15 15 0 0 0 5.4 5.4l1.5-1.8 4.7 2-.6 2.4a2.5 2.5 0 0 1-2.8 1.9C10.7 18.4 5.6 13.3 4.7 6.6a2.5 2.5 0 0 1 1.9-2.8Z" />
      </svg>
    </a>
  );
}
