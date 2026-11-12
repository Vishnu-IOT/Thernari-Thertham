import { Link } from "react-router-dom";
import { useData, english } from "../data/useData.js";
import { slug } from "../data/slug.js";
import { useLang } from "../i18n/LanguageContext.jsx";
import { PageHero, Reveal, Section, SectionTitle, usePageMeta } from "../components/ui.jsx";

/* Karkidakam, the Ramayana month: a detailed section of its own */
function KarkidakamDetail() {
  const { karkidakamDetail: k } = useData();
  const { tx } = useLang();
  return (
    <section id="karkidakam" className="kd-sec">
      <div className="container">
        <div className="kd-top">
          <Reveal className="kd-intro">
            <p className="kd-kicker">{tx("kkd.kicker")}</p>
            <h2>{k.title}</h2>
            <span className="kd-rule" aria-hidden="true" />
            <p className="kd-lead">{k.intro}</p>
          </Reveal>
          <Reveal variant="arch" className="kd-photo">
            <img src={k.image} alt={k.title} loading="lazy" decoding="async" />
          </Reveal>
        </div>

        <dl className="kd-stats">
          {k.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} className="kd-stat">
              <dt>{s.value}</dt>
              <dd>{s.label}</dd>
            </Reveal>
          ))}
        </dl>

        <div className="kd-body">
          <div className="kd-blocks">
            {k.blocks.map((b, i) => (
              <Reveal key={b.title} delay={i * 80} className="kd-block">
                <span className="kd-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal variant="right" className="kd-side">
            <img src={k.sideImage} alt="" loading="lazy" decoding="async" />
          </Reveal>
        </div>
        <p className="kd-note">{k.note}</p>
      </div>
    </section>
  );
}

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

export default function FestivalsPage() {
  const { t, festivals } = useData();
  const { tx } = useLang();
  usePageMeta(tx("festivals.title"), tx("festivals.desc"));
  return (
    <>
      <PageHero kicker={tx("festivals.kicker")} title={tx("festivals.pageTitle")} sub={tx("festivals.sub")} className="hero-festivals" bg="/images/temple/festive.png" />

      <KarkidakamDetail />

      <WebsiteLaunch />

      <Section className="fx-sec">
        <SectionTitle kicker={tx("kkd.nextFest")} title={tx("common.festTitle")} sub={tx("common.festSub")} />
        <div className="fx-list">
          {festivals.map((f, i) => (
            <Reveal key={f.name} id={slug(english.festivals[i].name)} variant={i % 2 ? "right" : "left"} className={`fx-row ${i % 2 ? "rev" : ""}`}>
              <div className="fx-img">
                <img src={f.image} alt={f.name} loading="lazy" decoding="async" />
              </div>
              <div className="fx-body">
                <p className="fx-no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</p>
                <p className="fx-date">{f.date}</p>
                <h2>{f.name}</h2>
                {f.text.split(/\n+/).map((para, k) => <p key={k}>{para}</p>)}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="fx-cta">
          <p>{tx("festivals.cta")}</p>
          <div className="btn-row">
            <a className="btn btn-maroon" href={`tel:${t.contact.phone.replace(/\s/g, "")}`}>{tx("festivals.call", { phone: t.contact.phone })}</a>
            <Link className="btn btn-line" to="/visit#contact">{tx("festivals.reach")}</Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}