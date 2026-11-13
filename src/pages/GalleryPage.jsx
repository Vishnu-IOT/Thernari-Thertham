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

/* Website inauguration news: big video + text, 2 photos, 2 more videos (hidden).
   Photos: /public/images/festivals/fes1.jpeg, fes2.jpeg
   Videos: /public/images/festivals/fes6.mp4, fes7.mp4, fes8.mp4 */
const LAUNCH_IMAGES = [1, 2].map((n) => `/images/festivals/fes${n}.jpeg`);
const LAUNCH_VIDEOS = [6, 7, 8].map((n) => `/images/festivals/fes${n}.mp4`);

const LAUNCH = {
  ml: {
    kicker: "വാർത്ത",
    title: "ഔദ്യോഗിക വെബ്സൈറ്റ് ഉദ്ഘാടനം",
    videoLabel: "ഉദ്ഘാടന ചടങ്ങിന്റെ വീഡിയോ",
    date: "2026 നവംബർ 10",
    place: "ക്ഷേത്രാങ്കണം, തേനാരി",
    moments: "ചടങ്ങിലെ നിമിഷങ്ങൾ",
    more: "കൂടുതൽ വീഡിയോകൾ",
    alts: ["വെബ്സൈറ്റ് ഉദ്ഘാടന ചടങ്ങ്", "ഉദ്ഘാടന ചടങ്ങിലെ ദൃശ്യം"],
    paras: [
      "തേനാരി ശ്രീരാമ ക്ഷേത്രത്തിന്റെ ഔദ്യോഗിക വെബ്സൈറ്റ് 2026 നവംബർ 10-ന് ക്ഷേത്രാങ്കണത്തിൽ വെച്ച് ക്ഷേത്രം ട്രസ്റ്റി ചെയർമാൻ; ശ്രീ. K.K. നാരായണമൂർത്തി, ട്രസ്റ്റി അംഗം; ശ്രീ. R. നാരായണമൂർത്തി, മേൽശാന്തി; ശ്രീ ഹരികൃഷ്ണൻ, ശ്രീ. ശ്രീരാം എന്നിവർ ചേർന്ന് ഔദ്യോഗികമായി ഉദ്ഘാടനം ചെയ്തു.",
      "വെബ്സൈറ്റ് വികസിപ്പിച്ച സോഫ്റ്റ്‌വെയർ കമ്പനിയായ MPeoples Business Solutions Pvt. Ltd.-ന്റെ പ്രതിനിധികളായ ശ്രീ. അശ്വിൻ, ശ്രീ. ശ്രീജിത്ത്, ശ്രീമതി. നിഷാ എന്നിവർ ചടങ്ങിൽ സന്നിഹിതരായിരുന്നു.",
      "ക്ഷേത്രത്തിന്റെ ചരിത്രവും ആത്മീയ പൈതൃകവും പ്രവർത്തനങ്ങളും ഡിജിറ്റൽ ലോകത്ത് കൂടുതൽ ജനങ്ങളിലേക്ക് എത്തിക്കുന്നതിനുള്ള സുപ്രധാനമായ ഒരു ചുവടുവെപ്പാണിത്.",
    ],
  },
  en: {
    kicker: "News",
    title: "Official Website Inauguration",
    videoLabel: "Inauguration ceremony video",
    date: "10 November 2026",
    place: "Temple Premises, Thenari",
    moments: "Moments from the ceremony",
    more: "More videos",
    alts: ["Website inauguration ceremony", "Inauguration ceremony moment"],
    paras: [
      "The official website of Thenari Sree Rama Temple was formally inaugurated on 10th November 2026 at the temple premises by Trustee Chairman Mr. K. K. Narayanamoorthy, Trustee Member Mr. R. Narayanamoorthy, Melshanthi (Chief Priest) Mr. Harikrishnan, and Mr. Sreeram.",
      "The inauguration ceremony was held in the presence of representatives of MPeoples Business Solutions Pvt. Ltd., the software development company responsible for developing the website, including Mr. Aswin, Mr. Sreejith, and Mrs. Nisha.",
      "This initiative marks a significant step towards bringing the temple's history, spiritual heritage, and activities to a wider audience through the digital platform.",
    ],
  },
  ta: {
    kicker: "செய்தி",
    title: "அதிகாரப்பூர்வ இணையதளத் தொடக்கம்",
    videoLabel: "தொடக்க விழா வீடியோ",
    date: "2026 நவம்பர் 10",
    place: "கோவில் வளாகம், தெனாரி",
    moments: "விழாவின் தருணங்கள்",
    more: "மேலும் வீடியோக்கள்",
    alts: ["இணையதளத் தொடக்க விழா", "தொடக்க விழா காட்சி"],
    paras: [
      "தெனாரி ஸ்ரீ ராமர் கோவிலின் அதிகாரப்பூர்வ இணையதளம் 2026 நவம்பர் 10-ஆம் தேதி கோவில் வளாகத்தில் நடைபெற்ற நிகழ்ச்சியில், கோவில் அறங்காவலர் குழுத் தலைவர் திரு. K.K. நாராயணமூர்த்தி, அறங்காவலர் குழு உறுப்பினர் திரு. R. நாராயணமூர்த்தி, மேல்சாந்தி திரு. ஹரிகிருஷ்ணன் மற்றும் திரு. ஸ்ரீராம் ஆகியோரால் அதிகாரப்பூர்வமாகத் தொடங்கி வைக்கப்பட்டது.",
      "இந்த இணையதளத்தை உருவாக்கிய மென்பொருள் நிறுவனமான MPeoples Business Solutions Pvt. Ltd.-ன் பிரதிநிதிகளான திரு. அஷ்வின், திரு. ஸ்ரீஜித் மற்றும் திருமதி. நிஷா ஆகியோர் இந்நிகழ்ச்சியில் கலந்து கொண்டனர்.",
      "கோவிலின் வரலாறு, ஆன்மீகப் பாரம்பரியம் மற்றும் செயல்பாடுகளை டிஜிட்டல் தளத்தின் மூலம் அதிகமான மக்களிடம் கொண்டு சேர்ப்பதற்கான ஒரு முக்கியமான முன்னெடுப்பாக இது அமைகிறது.",
    ],
  },
};

function WebsiteLaunch() {
  const { lang } = useLang();
  const c = LAUNCH[lang] || LAUNCH.en;
  const [mainVideo, ...moreVideos] = LAUNCH_VIDEOS;
  const [lead, ...others] = c.paras;
  return (
    <section id="website-launch" className="wl-sec">
      <div className="container">
        <Reveal className="wl-head">
          <p className="wl-kicker">{c.kicker}</p>
          <h2>{c.title}</h2>
          <span className="wl-rule" aria-hidden="true" />
        </Reveal>

        {/* Big video on the left, story on the right */}
        <div className="wl-top">
          <Reveal variant="left" className="wl-main">
            <div className="wl-main-frame">
              <video controls playsInline preload="metadata" aria-label={`${c.videoLabel} 1`}>
                <source src={mainVideo} type="video/mp4" />
              </video>
            </div>
          </Reveal>

          <Reveal variant="right" className="wl-story">
            <div className="wl-badges">
              <span className="wl-badge">{c.date}</span>
              <span className="wl-badge wl-badge-soft">{c.place}</span>
            </div>
            <p className="wl-lead">{lead}</p>
            {others.map((para, i) => (
              <p key={i} className={i === 0 ? "wl-quote" : "wl-closing"}>{para}</p>
            ))}
          </Reveal>
        </div>

        {/* Photos: only two, side by side */}
        <p className="wl-sub">{c.moments}</p>
        <div className="wl-mosaic">
          {LAUNCH_IMAGES.map((src, i) => (
            <Reveal key={src} delay={i * 80} className="wl-photo">
              <img src={src} alt={c.alts[i]} loading="lazy" decoding="async" />
            </Reveal>
          ))}
        </div>

        {/* Two more videos */}
        {/* <p className="wl-sub">{c.more}</p>
        <div className="wl-videos">
          {moreVideos.map((src, i) => (
            <Reveal key={src} delay={i * 90} className="wl-video">
              <video controls playsInline preload="metadata" aria-label={`${c.videoLabel} ${i + 2}`}>
                <source src={src} type="video/mp4" />
              </video>
            </Reveal>
          ))}
        </div> */}

      </div>
    </section>
  );
}

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

      {/* Official website inauguration news, just before the notable visits */}
      <WebsiteLaunch />

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