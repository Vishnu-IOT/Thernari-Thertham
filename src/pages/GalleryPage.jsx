import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { videoItems, reelItems, titleOf } from "../data/templeData.js";
import { useData } from "../data/useData.js";
import { useLang } from "../i18n/LanguageContext.jsx";
import { PageHero, Reveal, SectionTitle, usePageMeta } from "../components/ui.jsx";
import Lightbox from "../components/Lightbox.jsx";
import { JayamRaviVisit, MlaVisit } from "../components/VisitSections.jsx";
import { CoverImg } from "../components/ReelPlayer.jsx";

/* One single gallery section: photos, videos and Instagram reels live in the
   same grid. The pills above it filter the grid (All / Temple / Deity / ...). */
const ORDER = ["Temple", "Deity", "Video", "Reel"];

function Tile({ g, index, onOpen, fallback }) {
  const { tx } = useLang();
  const isVideo = g.type === "video";
  const isReel = g.type === "reel";
  return (
    <button
      type="button"
      className="gl-tile"
      onClick={() => onOpen(index)}
      aria-label={tx(isReel ? "gallery.playReel" : isVideo ? "gallery.playVideo" : "gallery.openPhoto", { caption: g.caption })}
    >
      <span className="gl-media">
        <CoverImg
          src={g.src}
          fallback={fallback}
          alt={g.alt}
          width={isReel ? 360 : isVideo ? 480 : g.w}
          height={isReel ? 640 : isVideo ? 300 : g.h}
          loading="lazy"
          decoding="async"
        />
        {(isVideo || isReel) && (
          <span className="gl-play" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </span>
        )}
        {isReel && (
          <span className="gx-ig" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
            </svg>
            {tx("cat.Reel")}
          </span>
        )}
      </span>
      {/* <span className="gl-cap">
        <b>{g.caption}</b>
        <small>{tx(`cat.${g.category}`)}</small>
      </span> */}
    </button>
  );
}

export default function GalleryPage() {
  const { gallery: photos } = useData();
  const { tx, lang } = useLang();
  usePageMeta(tx("gallery.title"), tx("gallery.desc"));
  const [cat, setCat] = useState("All");
  const [active, setActive] = useState(null);

  const all = useMemo(() => {
    const fallbackVideo = tx("gallery.videoFallback");
    const fallbackReel = tx("gallery.reelFallback");
    const videos = videoItems.map((v) => ({
      id: `video-${v.id}`,
      type: "video",
      videoId: v.id,
      src: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
      category: "Video",
      caption: titleOf(v.title, lang) || fallbackVideo,
      alt: titleOf(v.title, lang) || fallbackVideo,
    }));
    const reels = reelItems.map((r, i) => ({
      id: `reel-${r.id}`,
      type: "reel",
      reel: r,
      src: r.cover || photos[i % photos.length]?.src,
      category: "Reel",
      caption: titleOf(r.title, lang) || fallbackReel,
      alt: titleOf(r.title, lang) || fallbackReel,
    }));
    // mix the videos and reels in between the photos so the grid has rhythm
    const extras = [...videos, ...reels];
    const every = Math.max(3, Math.floor(photos.length / (extras.length + 1)));
    const mixed = [];
    photos.forEach((p, i) => {
      mixed.push(p);
      if ((i + 1) % every === 0 && extras.length) mixed.push(extras.shift());
    });
    return [...mixed, ...extras];
  }, [photos, tx, lang]);

  const cats = ORDER.filter((c) => all.some((g) => g.category === c));
  const items = cat === "All" ? all : all.filter((g) => g.category === cat);
  const fallback = photos[0]?.src;
  const videoCount = all.filter((g) => g.type === "video").length;
  const reelCount = all.filter((g) => g.type === "reel").length;

  return (
    <>
      <PageHero
        kicker={tx("gallery.kicker")}
        title={tx("gallery.pageTitle")}
        sub={
          reelCount
            ? tx("gallery.subReels")
            : videoCount
              ? tx("gallery.subVideos", { photos: photos.length, videos: videoCount })
              : tx("gallery.sub", { photos: photos.length })
        }
        className="hero-gallery"
      >
        <div className="hero-collage">
          {[photos[2], photos[1], photos[0]].filter(Boolean).map((g, i) => (
            <img key={g.id} src={g.src} alt="" style={{ "--i": i }} />
          ))}
        </div>
      </PageHero>

      <section id="gallery" className="section gl-block gl-all" aria-label={tx("gallery.pageTitle")}>
        <div className="container">
          <SectionTitle kicker={tx("gallery.kicker")} title={tx("gallery.secTitle")} sub={tx("gallery.secSub")} />

          {cats.length > 1 && (
            <div className="rl-tabs gx-filter" role="group" aria-label={tx("gallery.filter")}>
              {["All", ...cats].map((c) => (
                <button
                  key={c}
                  type="button"
                  className={cat === c ? "on" : ""}
                  aria-pressed={cat === c}
                  onClick={() => setCat(c)}
                >
                  {tx(`cat.${c}`)}
                  <small>{c === "All" ? all.length : all.filter((g) => g.category === c).length}</small>
                </button>
              ))}
            </div>
          )}

          <ul className="gl-set masonry gx-grid" key={cat}>
            {items.map((g, i) => (
              <Reveal as="li" key={g.id} variant="zoom" delay={(i % 4) * 70} className={`gx-item gx-${g.type || "photo"}`}>
                <Tile g={g} index={i} onOpen={setActive} fallback={fallback} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <JayamRaviVisit />
      <MlaVisit />

      <AnimatePresence>
        {active !== null && (
          <Lightbox key="lightbox" items={items} index={active} onClose={() => setActive(null)} onChange={setActive} />
        )}
      </AnimatePresence>
    </>
  );
}
