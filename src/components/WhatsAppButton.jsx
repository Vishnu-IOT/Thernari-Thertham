import { useData } from "../data/useData.js";
import { useLang } from "../i18n/LanguageContext.jsx";

export default function WhatsAppButton() {
  const { t } = useData();
  const { tx } = useLang();

  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/${t.contact.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={tx("floating.whatsapp")}
      title={tx("floating.whatsapp")}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.5 11.8a8.6 8.6 0 0 1-12.7 7.5L3 20.5l1.3-4.6a8.6 8.6 0 1 1 16.2-4.1Z" />
        <path d="M8.2 7.8c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.8 1.9c.1.2.1.4 0 .5l-.6.7c-.2.2-.2.4-.1.6.6 1 1.4 1.8 2.5 2.3.2.1.4.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.3.4.5 0 .3-.2 1.3-.9 1.8-.6.5-1.4.7-2.2.5-.5-.1-1.2-.3-2.1-.7-1.1-.5-2.1-1.3-2.9-2.2-.8-.9-1.3-1.9-1.5-2.5-.3-.8-.1-1.7.3-2.3Z" />
      </svg>
    </a>
  );
}
