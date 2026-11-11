import { useState } from 'react'
import { Link } from 'react-router-dom'
import { templeData as t } from '../data/templeData.js'
import { Reveal, PageHero, SectionTitle, usePageMeta, IconPhone, IconPin, IconClock, IconMail, IconChat } from '../components/ui.jsx'

const tel = `tel:${t.contact.phone.replace(/\s/g, '')}`

function InfoCards() {
  const cards = [
    { icon: <IconPhone />, title: 'Call the temple', body: <a href={tel}>{t.contact.phone}</a> },
    { icon: <IconPin />, title: 'Visit', body: <span>{t.contact.address}</span> },
    { icon: <IconClock />, title: 'Darshan hours', body: <span>{t.contact.hours}</span> },
  ]
  if (t.contact.email) cards.push({ icon: <IconMail />, title: 'Email', body: <a href={`mailto:${t.contact.email}`}>{t.contact.email}</a> })
  return (
    <div className="info-cards">
      {cards.map((c, i) => (
        <Reveal key={c.title} delay={i * 100} className="info-card">
          <span className="info-ic">{c.icon}</span>
          <h3>{c.title}</h3>
          <p>{c.body}</p>
        </Reveal>
      ))}
    </div>
  )
}

function MapAndRoutes() {
  const [i, setI] = useState(0)
  return (
    <section className="section routes">
      <div className="container">
        <SectionTitle kicker="Finding the temple" title="How to reach Thenari" />
        <div className="routes-grid">
          <Reveal variant="left" className="map-frame">
            <iframe title="Map showing Thenari Theertham Sree Rama Temple" src={t.location.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <a className="btn btn-gold map-btn" href={t.location.mapUrl} target="_blank" rel="noreferrer">Open in Google Maps</a>
          </Reveal>
          <Reveal variant="right" className="route-panel">
            <div className="tabs" role="tablist" aria-label="Ways to reach">
              {t.reach.map((r, k) => (
                <button key={r.mode} role="tab" id={`tab-${k}`} aria-selected={i === k} aria-controls="route-body" className={i === k ? 'on' : ''} onClick={() => setI(k)}>{r.mode}</button>
              ))}
            </div>
            <div id="route-body" role="tabpanel" aria-labelledby={`tab-${i}`} key={i} className="route-body">
              <h3>{t.reach[i].mode}</h3>
              <p>{t.reach[i].text}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function MessageForm() {
  const [f, setF] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const valid = f.name.trim() && f.message.trim()

  const submit = (e) => {
    e.preventDefault()
    if (!valid) return
    const text = `Namaskaram. ${f.message.trim()}\n\n${f.name.trim()}${f.phone.trim() ? `\nPhone: ${f.phone.trim()}` : ''}`
    window.open(`https://wa.me/${t.contact.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    setSent(true)
  }

  return (
    <section className="section message">
      <div className="container message-grid">
        <Reveal className="message-copy">
          <p className="kicker">Write to us</p>
          <h2>Questions about a pooja, a visit or an offering?</h2>
          <p>Send a note and the temple will reply. Your message opens in WhatsApp, ready to send, so you can read it once more before it goes.</p>
          <p className="icon-line"><IconChat /> <span>Prefer to talk? Call <a href={tel}>{t.contact.phone}</a> during darshan hours.</span></p>
          <p className="note">Not sure about dates? See the <Link to="/about#festivals">festival list</Link> or the <Link to="/about#seva">offerings</Link>.</p>
        </Reveal>

        <Reveal delay={120} as="form" className="form" onSubmit={submit} noValidate>
          <label>
            <span>Your name</span>
            <input value={f.name} onChange={set('name')} autoComplete="name" required />
          </label>
          <label>
            <span>Phone number <em>(optional)</em></span>
            <input value={f.phone} onChange={set('phone')} type="tel" autoComplete="tel" inputMode="tel" />
          </label>
          <label>
            <span>Your message</span>
            <textarea rows="5" value={f.message} onChange={set('message')} required />
          </label>
          <button className="btn btn-maroon" type="submit" disabled={!valid}>Send on WhatsApp</button>
          <p className={`form-ok ${sent ? 'on' : ''}`} role="status">{sent ? 'WhatsApp should now be open with your message. Please press send there.' : ''}</p>
        </Reveal>
      </div>
    </section>
  )
}

export default function Contact() {
  usePageMeta('Contact | Thenari Theertham', 'Phone, address, map, directions and a message form for Thenari Sree Rama Temple, Elappully, Palakkad.')
  return (
    <>
      <PageHero kicker="Namaskaram" title="Contact" sub="We are glad to hear from you." className="hero-contact">
        <svg className="hero-bell" viewBox="0 0 120 170" aria-hidden="true">
          <defs>
            <linearGradient id="bellg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#a8741c" />
              <stop offset="0.45" stopColor="#f1d489" />
              <stop offset="1" stopColor="#a8741c" />
            </linearGradient>
          </defs>
          <g className="bell-swing">
            <line x1="60" y1="0" x2="60" y2="34" stroke="#d4a23a" strokeWidth="3" />
            <circle cx="60" cy="38" r="7" fill="url(#bellg)" />
            <path d="M28 118 C28 76 40 46 60 44 C80 46 92 76 92 118 L104 130 L16 130 Z" fill="url(#bellg)" />
            <path d="M16 130 L104 130" stroke="#6e1423" strokeOpacity=".4" strokeWidth="2" />
            <circle className="clapper" cx="60" cy="140" r="9" fill="url(#bellg)" />
          </g>
        </svg>
      </PageHero>
      <section className="section info"><div className="container"><InfoCards /></div></section>
      <MapAndRoutes />
      <MessageForm />
    </>
  )
}
