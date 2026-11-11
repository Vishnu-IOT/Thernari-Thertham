import { useEffect, useRef, useState } from "react";
import { getLenis } from "../motion/smoothScroll.js";
import TimingsCard from "../components/TimingsCard.jsx";
import { MandapamSection } from "../components/VisitSections.jsx";
import { Link } from "react-router-dom";
import ReelPlayer, { CoverImg } from "../components/ReelPlayer.jsx";
import {
  titleOf,
  templeCommittee,
  videoItems as videos,
  reelItems as reels,
  gallery as photos,
  instagramProfile,
} from "../data/templeData.js";
import { useData } from "../data/useData.js";
import { useLang } from "../i18n/LanguageContext.jsx";
import {
  Reveal,
  PageHero,
  SectionTitle,
  usePageMeta,
} from "../components/ui.jsx";

const sectionIds = [
  "heritage",
  "family",
  "legend",
  ...(videos.length || reels.length ? ["video"] : []),
  "deities",
  "theertham",
  "mandapam",
  "seva",
  "timings",
];

/* Sticky in-page navigation. It sits directly under the site header, and every
   section starts below it: the bar's height is published as --jump-h and the
   sections use it as their scroll margin (see temple-people.css). */
function JumpNav() {
  const { tx } = useLang();
  const sections = sectionIds.map((id) => ({
    id,
    label: tx(`history.s.${id}`),
  }));
  const [active, setActive] = useState("heritage");
  const bar = useRef(null);

  useEffect(() => {
    const publish = () =>
      document.documentElement.style.setProperty(
        "--jump-h",
        `${bar.current?.offsetHeight || 52}px`,
      );
    const updateActive = () => {
      const headerHeight =
        document.querySelector(".site-header")?.getBoundingClientRect()
          .height || 0;
      const sectionBoundary =
        headerHeight + (bar.current?.offsetHeight || 52) + 8;
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= sectionBoundary) {
          current = id;
        } else {
          break;
        }
      }

      setActive(current);
    };
    publish();
    updateActive();

    const onResize = () => {
      publish();
      updateActive();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", updateActive);
      document.documentElement.style.removeProperty("--jump-h");
    };
  }, []);

  /* keep the active tab visible inside the horizontally scrolling bar */
  useEffect(() => {
    const strip = bar.current?.querySelector(".jump-inner");
    const activeTab = strip?.querySelector("a.on");
    if (!strip || !activeTab) return;

    const stripRect = strip.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    strip.scrollTo({
      left:
        strip.scrollLeft +
        tabRect.left -
        stripRect.left -
        (strip.clientWidth - activeTab.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [active]);

  return (
    <nav className="jump" ref={bar} aria-label={tx("history.jump")}>
      <div className="container jump-inner">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? "on" : ""}
            aria-current={active === s.id ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              const target = document.getElementById(s.id);
              if (!target) return;

              const headerHeight =
                document.querySelector(".site-header")?.getBoundingClientRect()
                  .height || 0;
              const sectionBoundary =
                headerHeight + (bar.current?.offsetHeight || 52) + 8;
              const top =
                window.scrollY +
                target.getBoundingClientRect().top -
                sectionBoundary;
              const lenis = getLenis();

              if (lenis) {
                lenis.scrollTo(top, { duration: 1.2 });
              } else {
                window.scrollTo({ top, behavior: "smooth" });
              }
            }}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function Heritage() {
  const { t } = useData();
  const { tx } = useLang();
  const chapters = t.heritage.map((text, i) => ({
    title: tx(`history.ch.${i}`),
    text,
  }));
  return (
    <section id="heritage" className="section heritage">
      <div className="container heritage-grid">
        <div className="mandala">
          <figure className="mandala-sticky">
            <img
              className="heritage-photo"
              src="/images/deity/1.jpg"
              alt={tx("history.photoAlt")}
              width="387"
              height="516"
              loading="lazy"
            />
            <figcaption>{tx("history.photoCap")}</figcaption>
          </figure>
        </div>
        <div className="chapters">
          <Reveal>
            <p className="kicker">{tx("common.heritageKicker")}</p>
          </Reveal>
          <Reveal delay={80}>
            <h2>{tx("history.heritageH2")}</h2>
          </Reveal>
          {chapters.map((c, i) => (
            <Reveal key={c.title} delay={60} className="chapter">
              <h3>{c.title}</h3>
              <p className={i === 0 ? "dropcap" : ""}>{c.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* The temple family: Tantri and priests, then the trustee board, renovation
   committee and office bearers as one joined band, with vice presidents and
   joint secretaries underneath. Names live in templeData.js (templeCommittee).
   Entries marked draft show only in `npm run dev`. */
const showEntry = (e) => !e.draft || import.meta.env.DEV;

const IconFleur = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3c-2 2.4-2 5 0 7 2-2 2-4.6 0-7Z" />
    <path d="M12 10v10M8.5 20h7" />
    <path d="M12 12c-1.2-2.4-4.4-3-6-1.4-1.4 1.4-.8 4 1.6 4.4 1.8.3 3.2-.6 4.4-3Z" />
    <path d="M12 12c1.2-2.4 4.4-3 6-1.4 1.4 1.4.8 4-1.6 4.4-1.8.3-3.2-.6-4.4-3Z" />
  </svg>
);
const IconTrident = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 21V8M7 4v5a5 5 0 0 0 10 0V4M12 3v5" />
    <path d="M5.5 5.5 7 4l1.5 1.5M15.5 5.5 17 4l1.5 1.5M10.5 4.5 12 3l1.5 1.5" />
    <path d="M9.5 21h5" />
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2c.6 4.6 2.4 8.4 7 10-4.6 1.6-6.4 5.4-7 10-.6-4.6-2.4-8.4-7-10 4.6-1.6 6.4-5.4 7-10Z" />
  </svg>
);

function TempleFamily() {
  const { templePeople } = useData();
  const { tx } = useLang();
  const c = templeCommittee;
  const priests = (
    templePeople.find((g) => g.id === "priests")?.entries || []
  ).filter(showEntry);
  const trustees = c.trustees.filter((m) => m.name);
  const patrons = c.patrons.filter(Boolean);
  const officeBearers = c.officeBearers.filter((o) => o.name);
  const vicePresidents = c.vicePresidents.filter(Boolean);
  const jtSecretaries = c.jtSecretaries.filter(Boolean);
  const boardSections =
    Number(trustees.length > 0) +
    Number(patrons.length > 0) +
    Number(officeBearers.length > 0);

  return (
    <section id="family" className="section fm-sec">
      <div className="container">
        <div className="fm-head">
          <Reveal>
            <p className="kicker">{tx("people.kicker")}</p>
          </Reveal>
          <Reveal delay={80}>
            <h2>{tx("people.title")}</h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="fm-sub">{tx("people.sub")}</p>
          </Reveal>
        </div>

        {priests.length > 0 && (
          <Reveal className="fm-priests">
            <span className="fm-priests-label">{tx("people.tantri")}</span>
            <ul>
              {priests.map((p) => (
                <li key={p.id} className={p.draft ? "is-draft" : ""}>
                  <b>{p.name}</b>
                  <small>{p.role}</small>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {boardSections > 0 && (
          <Reveal className={`fm-board fm-board-${boardSections}`}>
            {trustees.length > 0 && (
              <section
                className="fm-col fm-trustees"
                aria-labelledby="fm-h-trustees"
              >
                <header className="fm-col-head">
                  <span className="fm-ico">
                    <IconFleur />
                  </span>
                  <h3 id="fm-h-trustees">{tx("people.trustees")}</h3>
                </header>
                <ul className="fm-names">
                  {trustees.map((m) => (
                    <li key={m.name}>
                      <span>{m.name}</span>
                      {(m.chair || m.role === "member") && (
                        <em className="fm-tag">
                          {tx(m.chair ? "people.chairman" : "people.member")}
                        </em>
                      )}
                      {m.phone && (
                        <a className="fm-phone" href={`tel:${m.phone}`}>
                          {m.phone}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
                {c.manager && (
                  <p className="fm-manager">
                    {tx("people.manager", { name: c.manager })}
                  </p>
                )}
              </section>
            )}

            {patrons.length > 0 && (
              <section className="fm-col fm-reno" aria-labelledby="fm-h-reno">
                <header className="fm-col-head">
                  <span className="fm-ico">
                    <IconTrident />
                  </span>
                  <h3 id="fm-h-reno">{tx("people.renovation")}</h3>
                </header>
                <p className="fm-reno-label">{tx("people.patrons")}</p>
                <ul className="fm-plaques">
                  {patrons.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </section>
            )}

            {officeBearers.length > 0 && (
              <section
                className="fm-col fm-office"
                aria-labelledby="fm-h-office"
              >
                <header className="fm-col-head">
                  <span className="fm-ico">
                    <IconStar />
                  </span>
                  <h3 id="fm-h-office">{tx("people.officeBearers")}</h3>
                </header>
                <dl className="fm-ledger">
                  {officeBearers.map((o) => (
                    <div key={o.role}>
                      <dt>{tx(`people.role.${o.role}`)}</dt>
                      <dd>{o.name}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </Reveal>
        )}

        {(vicePresidents.length > 0 || jtSecretaries.length > 0) && (
          <Reveal className="fm-band" delay={80}>
            {vicePresidents.length > 0 && (
              <div className="fm-group">
                <h3>{tx("people.vicePresidents")}</h3>
                <ul className="fm-chips">
                  {vicePresidents.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
            {vicePresidents.length > 0 && jtSecretaries.length > 0 && (
              <span className="fm-gem" aria-hidden="true" />
            )}
            {jtSecretaries.length > 0 && (
              <div className="fm-group">
                <h3>{tx("people.jtSecretaries")}</h3>
                <ul className="fm-chips">
                  {jtSecretaries.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* The legend of Sree Rama Theertham: a real sequence, so the steps are numbered */
function Legend() {
  const { legendChapters } = useData();
  const { tx } = useLang();
  return (
    <section id="legend" className="section legend-sec">
      <div className="container">
        <div className="lg-top">
          <div>
            <Reveal>
              <p className="kicker">{tx("history.legendKicker")}</p>
            </Reveal>
            <Reveal delay={80}>
              <h2>{tx("history.legendTitle")}</h2>
            </Reveal>
            <Reveal delay={160}>
              <blockquote className="pull">
                {tx("history.legendQuote")}
              </blockquote>
            </Reveal>
            <Reveal delay={220}>
              <p className="lead">{tx("history.legendIntro")}</p>
            </Reveal>
          </div>
          <Reveal variant="arch" className="lg-photo">
            <img
              src="/images/gallery/27.webp"
              alt={tx("history.legendAlt")}
              width="765"
              height="1020"
              loading="lazy"
              decoding="async"
            />
          </Reveal>
        </div>

        <ol className="lg-steps">
          {legendChapters.map((c, i) => (
            <Reveal as="li" key={c.title} variant={i % 2 ? "right" : "left"} delay={60} className={`lg-step ${i % 2 ? "is-right" : "is-left"}`}>
              <span className="lg-num" aria-hidden="true">
                {i + 1}
              </span>
              <div className="lg-body">
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <p className="lg-note">{tx("history.legendNote")}</p>
      </div>
    </section>
  );
}

/* YouTube loads only after a tap, so the page stays fast on mobile data */
function VideoCard({ id, title }) {
  const { tx } = useLang();
  const [play, setPlay] = useState(false);
  const [thumbOk, setThumbOk] = useState(true);
  return (
    <figure className="video-card">
      <div className="video-frame">
        {play ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title || tx("history.videoFallback")}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            className="video-poster"
            onClick={() => setPlay(true)}
            aria-label={tx("history.playVideo", {
              title: title || tx("history.videoFallback"),
            })}
          >
            {thumbOk && (
              <img
                src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                onError={() => setThumbOk(false)}
              />
            )}
            <span className="video-play" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {title && <figcaption>{title}</figcaption>}
    </figure>
  );
}

/* Instagram reel: portrait phone-style card. It plays right here on the site
   (see ReelPlayer): nothing on the card takes the visitor to Instagram. */
function ReelCard({ reel, index }) {
  const { tx, lang } = useLang();
  const [play, setPlay] = useState(false);
  const label = titleOf(reel.title, lang) || tx("history.reelFallback");
  const fallback = photos[index % photos.length]?.src;
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
            <CoverImg
              src={reel.cover}
              fallback={fallback}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="rl-badge" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
              </svg>
              {tx("history.tabReels")}
            </span>
            <span className="rl-play" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
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

/* Horizontal scroller with arrow buttons (swipe works on touch).
   YouTube videos and Instagram reels sit on two tabs; with only one kind
   of media the tabs disappear. */
function VideoSection() {
  const { tx, lang } = useLang();
  const track = useRef(null);
  const hasVideos = videos.length > 0;
  const hasReels = reels.length > 0;
  const [tab, setTab] = useState(hasVideos ? "videos" : "reels");
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = () => {
    const el = track.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  };
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [tab]);

  if (!hasVideos && !hasReels) return null;
  const isReels = tab === "reels";
  const go = (dir) => {
    const el = track.current;
    const card = el.querySelector(".video-slide");
    const step = card
      ? card.getBoundingClientRect().width + 16
      : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="video" className="section video-sec">
      <div className="container">
        <SectionTitle
          kicker={tx("history.videoKicker")}
          title={isReels ? tx("history.reelTitle") : tx("history.videoTitle")}
          sub={isReels ? tx("history.reelSub") : tx("history.videoSub")}
        />

        {hasVideos && hasReels && (
          <div
            className="rl-tabs"
            role="tablist"
            aria-label={tx("history.tabs")}
          >
            <button
              type="button"
              role="tab"
              aria-selected={!isReels}
              className={!isReels ? "on" : ""}
              onClick={() => setTab("videos")}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              {tx("history.tabVideos")} <small>{videos.length}</small>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isReels}
              className={isReels ? "on" : ""}
              onClick={() => setTab("reels")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
              </svg>
              {tx("history.tabReels")} <small>{reels.length}</small>
            </button>
          </div>
        )}

        <div className="video-scroller" key={tab}>
          <button
            type="button"
            className="video-arrow prev"
            onClick={() => go(-1)}
            disabled={edge.start}
            aria-label={
              isReels ? tx("history.reelPrev") : tx("history.videoPrev")
            }
          >
            ‹
          </button>
          <div
            className={`video-track ${isReels ? "rl-track" : ""}`}
            ref={track}
            onScroll={update}
            tabIndex={0}
            aria-label={
              isReels ? tx("history.reelTrack") : tx("history.videoTrack")
            }
          >
            {isReels
              ? reels.map((r, i) => (
                  <div className="video-slide rl-slide" key={r.id}>
                    <ReelCard reel={r} index={i} />
                  </div>
                ))
              : videos.map((v) => (
                  <div className="video-slide" key={v.id}>
                    <VideoCard id={v.id} title={titleOf(v.title, lang)} />
                  </div>
                ))}
          </div>
          <button
            type="button"
            className="video-arrow next"
            onClick={() => go(1)}
            disabled={edge.end}
            aria-label={
              isReels ? tx("history.reelNext") : tx("history.videoNext")
            }
          >
            ›
          </button>
        </div>

        {isReels && instagramProfile && (
          <p className="rl-follow">
            <a
              className="btn btn-gold"
              href={instagramProfile}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tx("history.followIG")}
            </a>
          </p>
        )}
      </div>
    </section>
  );
}

/* History: alternating photo / text rows, each deity on its own line */
function Deities() {
  const { deities } = useData();
  const { tx } = useLang();
  return (
    <section id="deities" className="section deities-sec">
      <div className="container">
        <SectionTitle
          kicker={tx("history.deityKicker")}
          title={tx("history.deityTitle")}
        />
        <div className="dz-list">
          {deities.map((d, i) => (
            <Reveal
              key={d.id}
              as="article"
              className={`dz-row ${i % 2 ? "flip" : ""}`}
            >
              <figure className="dz-photo">
                <img
                  src={d.image}
                  alt={d.name}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="dz-text">
                <p className="dz-kicker">
                  {d.id === "rama"
                    ? tx("common.principal")
                    : tx("common.sanctumDeity")}
                </p>
                <h3>{d.name}</h3>
                <span className="dz-rule" aria-hidden="true" />
                <p className="dz-desc">{d.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Theertham() {
  const { t, waters, surroundings } = useData();
  const { tx } = useLang();
  return (
    <section id="theertham" className="section waters about-waters">
      <div className="ripples" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="container">
        <div className="about-waters-top">
          <div>
            <Reveal>
              <p className="kicker">{tx("common.waters")}</p>
            </Reveal>
            <Reveal delay={80}>
              <h2>{t.name}</h2>
            </Reveal>
            <Reveal delay={160}>
              <blockquote className="pull light">
                {t.theertham.quote}
              </blockquote>
            </Reveal>
            <Reveal delay={220}>
              <p className="lead">{t.theertham.text}</p>
            </Reveal>
          </div>
          <Reveal variant="arch" className="waters-photo">
            <img
              src="/images/temple/boat-god.jpeg"
              alt={tx("history.boatAlt")}
              loading="lazy"
            />
            {/* <video
              src="/images/temple/nandi.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={tx("history.boatAlt")}
            /> */}
          </Reveal>
        </div>
        <div className="water-cards">
          {waters.map((w, i) => (
            <Reveal key={w.title} delay={i * 120} className="water-card">
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </Reveal>
          ))}
        </div>
        <div className="around">
          {surroundings.map((s, i) => (
            <Reveal key={s.title} delay={i * 100} className="around-item">
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* History: dark two-column layout, intro panel + a ledger of offerings */
function Seva() {
  const { poojas } = useData();
  const { tx } = useLang();
  const [open, setOpen] = useState(null);
  return (
    <section id="seva" className="section seva-dark">
      <div className="container sd-wrap">
        <Reveal className="sd-intro">
          <p className="sd-kicker">{tx("history.sevaKicker")}</p>
          <h2>{tx("history.sevaTitle")}</h2>
          <span className="sd-rule" aria-hidden="true" />
          <p>{tx("history.sevaText")}</p>
          <Link className="btn btn-gold" to="/visit#contact">
            {tx("history.ask")}
          </Link>
        </Reveal>

        <ul className="sd-list">
          {poojas.map((p, i) => {
            const on = open === i;
            return (
              <Reveal
                as="li"
                key={p.name}
                delay={i * 60}
                className={`sd-item ${on ? "on" : ""}`}
              >
                <button
                  type="button"
                  className="sd-head"
                  onClick={() => setOpen(on ? null : i)}
                  aria-expanded={on}
                  aria-controls={`sd-${i}`}
                >
                  <span className="sd-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3c1.6 2.2 2.4 3.8 2.4 5.2a2.4 2.4 0 0 1-4.8 0C9.6 6.8 10.4 5.2 12 3Z" />
                      <path d="M4 13h16c0 3.9-3.6 7-8 7s-8-3.1-8-7Z" />
                    </svg>
                  </span>
                  <span className="sd-main">
                    <b>{p.name}</b>
                    <small>{p.time}</small>
                  </span>
                  <span className="sd-toggle" aria-hidden="true" />
                </button>
                <div className="sd-panel" id={`sd-${i}`} role="region">
                  <div>
                    <p>{p.text}</p>
                    <p className="sd-note">{p.details}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Timings() {
  return <TimingsCard id="timings" />;
}

export default function HistoryPage() {
  const { t } = useData();
  const { tx } = useLang();
  usePageMeta(tx("history.title"), tx("history.desc"));
  return (
    <div className="history-page">
      <PageHero
        kicker={tx("common.ayodhyaMantra")}
        title={tx("history.pageTitle")}
        sub={t.subtitle}
        className="hero-about"
        bg="/images/temple/history.png"
      />
      <JumpNav />
      <Heritage />
      <TempleFamily />
      <Legend />
      <VideoSection />
      <Deities />
      <Theertham />
      <MandapamSection />
      <Seva />
      <Timings />
    </div>
  );
}
