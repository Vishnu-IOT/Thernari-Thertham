// Traditional Kerala ornaments drawn as inline SVG so they scale and recolor with CSS.

/** Nilavilakku — the traditional standing brass lamp */
export function Nilavilakku({ className = "", lit = true }) {
  return (
    <svg
      className={`nilavilakku ${className}`}
      viewBox="0 0 80 200"
      role="presentation"
      aria-hidden="true"
    >
      {lit && (
        <path
          className="flame"
          d="M40 4c6 9 9 15 0 24-9-9-6-15 0-24z"
          fill="#f6c453"
        />
      )}
      <ellipse cx="40" cy="38" rx="22" ry="7" fill="#b08d3c" />
      <path d="M18 38c0 10 8 16 22 16s22-6 22-16z" fill="#8f6f26" />
      <path d="M36 54h8l-2 40h-4z" fill="#b08d3c" />
      <ellipse cx="40" cy="98" rx="14" ry="5" fill="#c9a24d" />
      <path d="M33 103h14l4 46H29z" fill="#a37f2e" />
      <ellipse cx="40" cy="152" rx="26" ry="8" fill="#c9a24d" />
      <path d="M14 152c0 14 12 22 26 22s26-8 26-22z" fill="#8f6f26" />
      <rect x="22" y="176" width="36" height="8" rx="3" fill="#b08d3c" />
      <rect x="16" y="184" width="48" height="8" rx="3" fill="#8f6f26" />
    </svg>
  );
}

/** Kasavu border strip — cream and gold band of Kerala's traditional cloth */
export function Kasavu({ thick = false }) {
  return <div className={`kasavu ${thick ? "thick" : ""}`} aria-hidden="true" />;
}

/** Wooden carved frame with gold corner brackets */
export function CarvedFrame({ children, className = "" }) {
  return (
    <div className={`carved-frame ${className}`}>
      <i className="c tl" aria-hidden="true" />
      <i className="c tr" aria-hidden="true" />
      <i className="c bl" aria-hidden="true" />
      <i className="c br" aria-hidden="true" />
      {children}
    </div>
  );
}

/** Lotus-petal mandala drawn behind headings */
export function Mandala({ className = "" }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg className={`mandala ${className}`} viewBox="-100 -100 200 200" aria-hidden="true">
      {petals.map((a) => (
        <path
          key={a}
          transform={`rotate(${a})`}
          d="M0 -18C10 -42 10 -70 0 -92C-10 -70 -10 -42 0 -18Z"
        />
      ))}
      <circle r="14" />
      <circle r="98" fill="none" strokeDasharray="2 6" />
    </svg>
  );
}

/** Section title in the temple-inscription style, with lamps either side */
export function TempleTitle({ small, title, sub, tone = "dark", as: Tag = "h2" }) {
  return (
    <header className={`temple-title ${tone}`}>
      {small && <p className="tt-small">{small}</p>}
      <div className="tt-row">
        <span className="tt-lotus" aria-hidden="true">❁</span>
        <Tag>{title}</Tag>
        <span className="tt-lotus" aria-hidden="true">❁</span>
      </div>
      <Kasavu />
      {sub && <p className="tt-sub">{sub}</p>}
    </header>
  );
}

/** Full-width page banner, each page passes its own theme class */
export function PageHero({ theme, mal, title, sub, children }) {
  return (
    <section className={`page-hero ${theme}`}>
      <Mandala className="ph-mandala" />
      <div className="container ph-inner">
        {mal && <p className="ph-mal" lang="ml">{mal}</p>}
        <h1>{title}</h1>
        {sub && <p className="ph-sub">{sub}</p>}
        {children}
      </div>
      <Kasavu thick />
    </section>
  );
}
