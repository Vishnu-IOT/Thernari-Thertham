import { useEffect, useRef, useState } from "react";
import { prefersCalm } from "../motion/config.js";
import { Link } from "react-router-dom";
import { useData } from "../data/useData.js";
import {
  homeVideo,
  videoItems,
  titleOf,
  youtubeId,
} from "../data/templeData.js";
import { useLang } from "../i18n/LanguageContext.jsx";
import {
  Diya,
  IconPhone,
  IconPin,
  Reveal,
  Section,
  SectionTitle,
} from "./ui.jsx";

export function HeritageIntro() {
  const { t } = useData();
  const { tx } = useLang();
  return (
    <Section id="heritage" className="heritage">
      <div className="split">
        <Reveal className="frames heritage-visual">
          <img
            className="rotating-chakra"
            src="/images/temple/chakra.webp"
            alt=""
            aria-hidden="true"
          />
          <img
            className="rama-image"
            src="/images/temple/heritage.webp"
            alt={tx("home.ramaAlt")}
            loading="lazy"
            width="1254"
            height="1254"
          />
        </Reveal>
        <Reveal>
          <p className="label">{tx("common.heritageKicker")}</p>
          <h2>{tx("home.heritageH2")}</h2>
          <div className="divider left" aria-hidden="true">
            <span />
          </div>
          {t.heritage.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <Link className="btn btn-maroon" to="/history">
            {tx("home.heritageBtn")}
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}

export function TheerthamSection() {
  const { t } = useData();
  const { tx, lang } = useLang();
  const sloganVerse = t.theertham.slogan.verses.find(
    (verse) => verse.lang === lang,
  );
  return (
    <section className="theertham" aria-labelledby="th-title">
      <div className="ripples" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="container split">
        <Reveal className="th-images">
          {/* <img
            className="big"
            src="/images/temple/boat-god.jpeg"
            alt={tx("home.boatAlt")}
            loading="lazy"
          /> */}
          <div className="th-frame">
            <video
            src="/images/temple/nandi1.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={t.name}
              />
          </div>
          <img
            className="small"
            src={t.images.theertham2}
            alt={tx("home.boatAlt2")}
            loading="lazy"
          />
        </Reveal>
        <Reveal>
          <p className="label light">{tx("common.waters")}</p>
          <h2 id="th-title">{t.name}</h2>
          <p className="quote">{t.theertham.quote}</p>
          <p>{t.theertham.text}</p>
          <figure className="theertham-slogan">
            <figcaption className="theertham-slogan-title">
              {t.theertham.slogan.title}
            </figcaption>
            {sloganVerse && (
              <p className="theertham-slogan-line" key={sloganVerse.lang}>
                <span lang={sloganVerse.lang}>{sloganVerse.text}</span>
              </p>
            )}
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/* Home: three equal, aligned sanctum cards (photo on top, text below) */
export function DeitySection() {
  const { homeDeities } = useData();
  const { tx } = useLang();
  return (
    <Section id="deities">
      <SectionTitle
        kicker={tx("home.deityKicker")}
        title={tx("home.deityTitle")}
        sub={tx("home.deitySub")}
      />
      <div className="sc-grid">
        {homeDeities.map((d, i) => (
          <Reveal key={d.id} delay={i * 120} as="article" className="sc-card">
            <div className="sc-photo">
              <img
                src={d.image}
                alt={d.name}
                loading="lazy"
                decoding="async"
                width="640"
                height="800"
              />
            </div>
            <div className="sc-body">
              <span className="sc-tag">
                {d.id === "rama"
                  ? tx("common.principal")
                  : tx("common.sanctumDeity")}
              </span>
              <h3>{d.name}</h3>
              <p>{d.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* Pooja Offering: tinted offering cards. "Offer" opens the donation form with
   that offering already chosen. (Pooja & Seva stays on the History page.) */
const PER_SLIDE = 6; // offerings on each slide
const MAX_OFFERINGS = 24; // 4 slides

function OfferCard({ pooja, index }) {
  const { tx } = useLang();
  return (
    <article className="po-card">
      <div className="po-top">
        <span className="po-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c1.6 2.2 2.4 3.8 2.4 5.2a2.4 2.4 0 0 1-4.8 0C9.6 6.8 10.4 5.2 12 3Z" />
            <path d="M4 13h16c0 3.9-3.6 7-8 7s-8-3.1-8-7Z" />
          </svg>
        </span>
        <h3>{pooja.name}</h3>
        {pooja.tag && <span className="po-tag">{pooja.tag}</span>}
      </div>
      <p className="po-text">{pooja.text}</p>
      <div className="po-foot">
        <span className="po-rate">
          {pooja.amount ? (
            <>
              <small>{tx("home.rate")}</small>
              <b>₹{Number(pooja.amount).toLocaleString("en-IN")}</b>
            </>
          ) : (
            <b className="po-word">{tx("home.poojaKicker")}</b>
          )}
        </span>
        <Link
          className="po-btn"
          to={`/donation?offering=pooja-${index}`}
          aria-label={tx("home.offerAria", { name: pooja.name })}
        >
          {tx("home.offerBtn")} <i aria-hidden="true">→</i>
        </Link>
      </div>
    </article>
  );
}

/* Offerings in slides of six. Native scroll-snap: swipe on a phone, arrows
   and dots everywhere. */
function PoojaCarousel({ items }) {
  const { tx } = useLang();
  const track = useRef(null);
  const [page, setPage] = useState(0);
  const slides = [];
  for (let i = 0; i < items.length; i += PER_SLIDE) slides.push(items.slice(i, i + PER_SLIDE));
  const last = slides.length - 1;

  const goTo = (n) => {
    const el = track.current;
    if (!el) return;
    const i = Math.min(Math.max(n, 0), last);
    const calm = prefersCalm();
    el.scrollTo({ left: i * el.clientWidth, behavior: calm ? "auto" : "smooth" });
  };
  const onScroll = () => {
    const el = track.current;
    if (el) setPage(Math.round(el.scrollLeft / el.clientWidth));
  };
  const onKey = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(page + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(page - 1); }
  };

  return (
    <div className="po-car" role="group" aria-roledescription="carousel" aria-label={tx("home.poojaTitle")}>
      <button type="button" className="po-arrow po-prev" onClick={() => goTo(page - 1)} disabled={page <= 0} aria-label={tx("home.poojaPrev")}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
      </button>

      <div className="po-track" ref={track} onScroll={onScroll} onKeyDown={onKey} tabIndex={0}>
        {slides.map((slide, s) => (
          <div
            className="po-slide"
            key={s}
            role="group"
            aria-roledescription="slide"
            aria-label={tx("home.poojaPage", { n: s + 1, total: slides.length })}
          >
            <div className="po-grid">
              {slide.map((p, i) => (
                <OfferCard key={p.name} pooja={p} index={s * PER_SLIDE + i} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="po-arrow po-next" onClick={() => goTo(page + 1)} disabled={page >= last} aria-label={tx("home.poojaNext")}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
      </button>

      <div className="po-dots" aria-live="polite">
        {slides.map((_, i) => (
          <button
            type="button"
            key={i}
            className={i === page ? "on" : ""}
            onClick={() => goTo(i)}
            aria-label={tx("home.poojaPage", { n: i + 1, total: slides.length })}
            aria-current={i === page ? "true" : undefined}
          />
        ))}
        <span className="po-count">{page + 1} / {slides.length}</span>
      </div>
    </div>
  );
}

export function PoojaSection() {
  const { poojaRates } = useData();
  const { tx } = useLang();
  return (
    <Section id="pooja" className="tint po-sec">
      <SectionTitle
        kicker={tx("home.poojaKicker")}
        title={tx("home.poojaTitle")}
        sub={tx("home.poojaSub")}
      />
      <Reveal>
        <PoojaCarousel items={poojaRates.slice(0, MAX_OFFERINGS)} />
      </Reveal>
      {/* <p className="ps-all">
        <Link className="btn btn-line" to="/history#seva">
          {tx("home.poojaAll")}
        </Link>
      </p> */}
      {/* <p className="ps-note">
        {tx("home.poojaNote", {
          link: <Link to="/visit#contact">{tx("home.poojaNoteLink")}</Link>,
        })}
      </p> */}
    </Section>
  );
}

/* ---------- Video: the frame grows from small to full width as it scrolls into view ---------- */
export function HomeVideo() {
  const { lang, tx } = useLang();
  const stage = useRef(null);
  const [play, setPlay] = useState(false);
  const [thumbOk, setThumbOk] = useState(true);

  const first = videoItems[0];
  const ytId = homeVideo.url ? youtubeId(homeVideo.url) : first?.id;
  const file = homeVideo.file;
  const title =
    titleOf(homeVideo.title, lang) ||
    (!homeVideo.url && first ? titleOf(first.title, lang) : "") ||
    tx("home.videoFallback");
  const poster =
    homeVideo.poster ||
    (ytId && thumbOk
      ? `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`
      : "/images/gallery/16.jpg");

  /* scroll-linked zoom: 0 = just entering, 1 = fully grown */
  useEffect(() => {
    const el = stage.current;
    if (!el) return undefined;
    const calm = prefersCalm();
    if (calm) {
      el.style.setProperty("--z", 1);
      return undefined;
    }
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // 0 when the top edge is at the bottom of the screen, 1 when it is ~30% down the screen
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.7)));
      el.style.setProperty("--z", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (!file && !ytId) return null;

  return (
    <section id="video" className="section home-video">
      <div className="container">
        <SectionTitle
          light
          kicker={tx("home.videoKicker")}
          title={tx("home.videoTitle")}
          sub={tx("home.videoSub")}
        />
      </div>
      <div className="hv-stage" ref={stage}>
        <div className={`hv-frame ${play ? "playing" : ""}`}>
          {play ? (
            file ? (
              <video
                src={file}
                poster={homeVideo.poster || undefined}
                controls
                autoPlay
                playsInline
                aria-label={title}
              />
            ) : (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            )
          ) : (
            <button
              type="button"
              className="hv-poster"
              onClick={() => setPlay(true)}
              aria-label={tx("home.videoPlay", { title })}
            >
              <img
                src={poster}
                alt=""
                loading="lazy"
                decoding="async"
                onLoad={(e) => {
                  /* YouTube serves a tiny grey image when maxres is missing */
                  if (e.currentTarget.naturalWidth <= 200) setThumbOk(false);
                }}
                onError={() => setThumbOk(false)}
              />
              <span className="hv-play" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="hv-cap">{title}</span>
            </button>
          )}
        </div>
      </div>
      {/* <div className="container hv-more">
        <Link className="btn btn-ghost" to="/history#video">
          {tx("home.videoMore")}
        </Link>
      </div> */}
    </section>
  );
}

export function Give() {
  const { tx } = useLang();
  return (
    <section className="give">
      <div className="container give-inner">
        <Reveal variant="zoom" className="give-lamp">
          <Diya />
        </Reveal>
        <div className="give-copy">
          <Reveal>
            <h2>{tx("home.giveTitle")}</h2>
          </Reveal>
          <Reveal delay={100}>
            <p>{tx("home.giveText")}</p>
          </Reveal>
          <Reveal delay={200}>
            <Link className="btn btn-maroon" to="/donation">
              {tx("home.giveBtn")}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Visit() {
  const { t } = useData();
  const { tx } = useLang();
  return (
    <section className="section visit">
      <div className="container visit-grid is-solo">
        <Reveal delay={150} className="visit-where">
          <p className="kicker">{tx("home.findUs")}</p>
          <h2>{tx("home.place")}</h2>
          <p className="icon-line">
            <IconPin /> <span>{t.contact.address}</span>
          </p>
          <p className="icon-line">
            <IconPhone />{" "}
            <a href={`tel:${t.contact.phone.replace(/\s/g, "")}`}>
              {t.contact.phone}
            </a>
          </p>
          <div className="btn-row">
            <a
              className="btn btn-gold"
              href={t.location.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              {tx("home.directions")}
            </a>
            <Link className="btn btn-ghost" to="/visit#contact">
              {tx("home.contactBtn")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
