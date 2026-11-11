import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal, Section, SectionHeading } from './Common.jsx'
import { templeData as t, about, donation } from '../data/templeData.js'

export function Invocation() {
  return (
    <div id="invocation" className="invocation" aria-hidden="true">
      <span>॥ श्री राम ॥</span><i /><span>ശ്രീ രാമ</span><i /><span>॥ श्री राम ॥</span>
    </div>
  )
}

export function Glance() {
  const items = [
    { h: 'Darshan', p: `${t.timings.morning} · ${t.timings.evening}`, to: '/about#worship', cta: 'Daily worship' },
    { h: 'Sacred water', p: t.theertham.quote, to: '/about#theertham', cta: 'About the theertham' },
    { h: 'Visit', p: t.contact.address, to: '/contact#reach', cta: 'How to reach' },
    { h: 'Offerings', p: 'Ways to contribute to the temple.', to: '/donation', cta: 'Make an offering' },
  ]
  return (
    <section className="glance" aria-label="Temple at a glance">
      <div className="container glance-row">
        {items.map((i) => (
          <Reveal key={i.h} className="glance-item">
            <h3>{i.h}</h3><p>{i.p}</p><Link className="text-link" to={i.to}>{i.cta} →</Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function DonateBand() {
  return (
    <section className="donate-band" aria-labelledby="donate-title">
      <div className="container donate-inner">
        <div className="lamp-big" aria-hidden="true"><i className="lamp-s" /></div>
        <div>
          <p className="label">Seva and offerings</p>
          <h2 id="donate-title">Support the temple</h2>
          <p>Contributions from devotees are accepted. The ways to give are set out on the donation page.</p>
        </div>
        <Link className="btn btn-maroon" to="/donation">Make an offering</Link>
      </div>
    </section>
  )
}

export function AboutNav() {
  const links = [['heritage', 'Heritage'], ['story', 'Timeline'], ['deities', 'Deities'], ['theertham', 'Theertham'], ['worship', 'Worship'], ['festivals', 'Festivals'], ['architecture', 'Architecture']]
  return (
    <nav className="subnav" aria-label="On this page">
      <div className="container">{links.map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}</div>
    </nav>
  )
}

export function AboutStory() {
  return (
    <Section id="story" className="tint">
      <SectionHeading label="Through the years" title="The temple's story" sub="A record of the temple's milestones, to be completed with verified information." />
      <ol className="timeline">
        {about.timeline.map((e, i) => (
          <Reveal key={i}><li><span className="when">{e.when}</span><h3>{e.title}</h3><p>{e.text}</p></li></Reveal>
        ))}
      </ol>
      <h3 className="sub-title">Traditions and customs</h3>
      <dl className="customs">
        {about.customs.map((c, i) => <div key={i}><dt>{c.title}</dt><dd>{c.text}</dd></div>)}
      </dl>
    </Section>
  )
}

export function EnquiryForm() {
  const [v, setV] = useState({ name: '', phone: '', message: '' })
  const [err, setErr] = useState({})
  const email = t.contact.email
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const n = {}
    if (!v.name.trim()) n.name = 'Please enter your name.'
    if (v.message.trim().length < 10) n.message = 'Please write at least a short message (10 characters).'
    if (v.phone && !/^[+\d][\d\s-]{6,}$/.test(v.phone.trim())) n.phone = 'Enter a valid phone number, or leave it blank.'
    setErr(n)
    if (Object.keys(n).length || !email) return
    const body = `${v.message}\n\n${v.name}${v.phone ? `\nPhone: ${v.phone}` : ''}`
    window.location.href = `mailto:${email}?subject=${encodeURIComponent('Enquiry from the temple website')}&body=${encodeURIComponent(body)}`
  }
  const field = (k, label, props = {}) => (
    <div className="field">
      <label htmlFor={`f-${k}`}>{label}</label>
      {props.area ? <textarea id={`f-${k}`} rows="5" value={v[k]} onChange={set(k)} aria-invalid={!!err[k]} /> : <input id={`f-${k}`} value={v[k]} onChange={set(k)} aria-invalid={!!err[k]} {...props} />}
      {err[k] && <p className="error" role="alert">{err[k]}</p>}
    </div>
  )
  return (
    <Section id="enquiry">
      <SectionHeading label="Write to us" title="Send an enquiry" sub="Your message opens in your email app, addressed to the temple." />
      <form className="enquiry" onSubmit={submit} noValidate>
        {field('name', 'Your name', { autoComplete: 'name' })}
        {field('phone', 'Phone (optional)', { type: 'tel', autoComplete: 'tel' })}
        {field('message', 'Message', { area: true })}
        {!email && <p className="note">{t.contact.phone ? <>Online enquiries are not yet available. Please call <a className="text-link" href={`tel:${t.contact.phone.replace(/\s/g, '')}`}>{t.contact.phone}</a>.</> : <>The enquiry form will work once the temple email is added in <code>src/data/templeData.js</code>.</>}</p>}
        <button className="btn btn-maroon" type="submit" disabled={!email}>Send enquiry</button>
      </form>
    </Section>
  )
}

function Copy({ value }) {
  const [done, setDone] = useState(false)
  const go = async () => { try { await navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1600) } catch { /* clipboard unavailable */ } }
  return <button type="button" className="link-btn" onClick={go} aria-label={`Copy ${value}`}>{done ? 'Copied' : 'Copy'}</button>
}

export function DonationWays() {
  const d = donation
  return (
    <>
      <Section id="give">
        <div className="give-intro">
          <p className="label">Offerings</p>
          <h2>Giving to the temple</h2>
          <div className="divider" aria-hidden="true"><span /></div>
          <p className="lead">{d.intro}</p>
          <p className="note">{d.note}{t.contact.phone && <> To confirm details, call <a className="text-link" href={`tel:${t.contact.phone.replace(/\s/g, '')}`}>{t.contact.phone}</a>.</>}</p>
        </div>
        <div className="give-layout">
          <div className="ways">
            {d.ways.map((w) => (
              <Reveal key={w.title} className="way">
                <h3>{w.title}</h3>
                <dl>
                  {w.fields.map(([k, val]) => (
                    <div key={k}><dt>{k}</dt><dd>{val ? <>{val} <Copy value={val} /></> : <span className="tbd">[To be added]</span>}</dd></div>
                  ))}
                </dl>
              </Reveal>
            ))}
          </div>
          <Reveal className="qr-frame">
            {d.qr ? <img src={d.qr} alt="UPI QR code for donations to the temple" width="320" height="320" /> : <div className="qr-ph"><span>QR code to be added</span></div>}
            <p>Scan to give by UPI</p>
          </Reveal>
        </div>
      </Section>
      <Section id="offerings" className="tint">
        <SectionHeading label="Seva" title="Offerings and amounts" sub="Specific offerings and their amounts will be listed here once verified by the temple." />
        <ul className="ledger">
          {d.offerings.map((o, i) => <li key={i}><span>{o.name}</span><i /><span>{o.amount}</span></li>)}
        </ul>
        <p className="note">{d.receipts}</p>
        <p><Link className="btn btn-outline" to="/contact">Ask the temple a question</Link></p>
      </Section>
    </>
  )
}
