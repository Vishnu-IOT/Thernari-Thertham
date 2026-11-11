import { useState } from "react";
import { useLang } from "../i18n/LanguageContext.jsx";

export default function ReelPlayer({ reel, title }) {
  const { tx } = useLang();
  if (reel.file) {
    return (
      <video
        className="rl-video"
        src={reel.file}
        poster={reel.cover || undefined}
        controls
        autoPlay
        playsInline
        preload="metadata"
        aria-label={title}
      />
    );
  }

  const rawUrl = reel.url || reel.permalink || reel.id;

  const shortcode = String(rawUrl || "").match(
    /instagram\.com\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)|^([A-Za-z0-9_-]+)$/,
  );

  const id = shortcode?.[1] || shortcode?.[2];

  if (!id) {
    return <p>{tx("history.reelError")}</p>;
  }

  return (
    <div className="rl-embed">
      <iframe
        src={`https://www.instagram.com/reel/${id}/embed/`}
        title={title || "Instagram Reel"}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export function CoverImg({ src, fallback, ...rest }) {
  const [cur, setCur] = useState(src || fallback);

  return (
    <img
      {...rest}
      src={cur}
      onError={() => {
        if (cur !== fallback) setCur(fallback);
      }}
    />
  );
}
