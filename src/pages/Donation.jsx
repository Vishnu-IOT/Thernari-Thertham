import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useData, english } from '../data/useData.js'
import { useLang } from '../i18n/LanguageContext.jsx'
import { Reveal, PageHero, Diya, usePageMeta, IconCopy, IconCheck, IconChat, IconPhone } from '../components/ui.jsx'
import { scrollToTop } from '../motion/smoothScroll.js'
import { EASE, SPRING, releaseTransform, rise, stagger } from '../motion/presets.js'

const inr = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

/* form <-> thank-you screen */
const swap = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
}

/* an error line that slides open instead of popping in */
function Err({ id, children }) {
  return (
    <motion.p
      id={id}
      className="err"
      role="alert"
      initial={{ opacity: 0, height: 0, y: -4 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {children}
    </motion.p>
  )
}

/* The amount counts up or down to the new figure. */
function Money({ value }) {
  const mv = useMotionValue(value)
  const text = useTransform(mv, (v) => inr(Math.round(v)))
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, ease: EASE })
    return () => c.stop()
  }, [mv, value])
  return <motion.span>{text}</motion.span>
}

function useCopy(value) {
  const [ok, setOk] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setOk(true); setTimeout(() => setOk(false), 1800) } catch { /* clipboard unavailable */ }
  }
  return [ok, copy]
}

/* copy icon that turns into a tick */
function CopyIcon({ ok }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={ok ? 'ok' : 'copy'}
        className="dn-ico"
        initial={{ scale: 0.4, opacity: 0, rotate: -40 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={{ duration: 0.16 }}
      >
        {ok ? <IconCheck /> : <IconCopy />}
      </motion.span>
    </AnimatePresence>
  )
}

function CopyRow({ label, value }) {
  const { tx } = useLang()
  const [ok, copy] = useCopy(value)
  return (
    <div className="copy-row">
      <span>{label}</span>
      <b>{value}</b>
      <motion.button type="button" whileTap={{ scale: 0.88 }} onClick={copy} aria-label={tx('donation.copy', { label })}><CopyIcon ok={ok} /></motion.button>
    </div>
  )
}

function CopyBtn({ label, value }) {
  const { tx } = useLang()
  const [ok, copy] = useCopy(value)
  return (
    <motion.button type="button" className="copy-btn" whileTap={{ scale: 0.88 }} onClick={copy} aria-label={tx('donation.copy', { label })}><CopyIcon ok={ok} /></motion.button>
  )
}

/* Every choice in the dropdown: the general needs, then the pooja offerings.
   The English twin is used for the UPI note, which stays in English. */
function buildOptions(src, tx) {
  const needs = src.donation.purposes.map((p) => ({ ...p, group: tx('donation.offeringGroupNeeds') }))
  const poojas = src.poojaRates.map((p, i) => ({ id: `pooja-${i}`, name: p.name, text: p.text, amount: p.amount, group: tx('donation.offeringGroupPooja') }))
  return [...needs, ...poojas]
}
const enLookup = (id) => buildOptions(english, (k) => k).find((o) => o.id === id)

/* UPI QR: your own picture if present, else drawn from the UPI id, else a neutral frame. */
/* Show bank transfer details only when the temple has provided them. */
function PayPanel() {
  const { donation: d } = useData()
  const { tx } = useLang()
  const rows = [
    ['accountName', d.bank.accountName],
    ['accountNumber', d.bank.accountNumber],
    ['bankName', d.bank.bankName],
    ['ifsc', d.bank.ifsc],
    ['branch', d.bank.branch],
  ].filter(([, value]) => value)
  if (!rows.length) return null

  return (
    <Reveal as="section" variant="up" delay={120} className="pay-panel dn-pay" aria-labelledby="pay-h">
      <div className="pay-head">
        <h2 id="pay-h">{tx('donation.payTitle')}</h2>
        <p>{tx('donation.paySub')}</p>
      </div>
      <div className="pay-bank">
        <h3>{tx('donation.bankTitle')}</h3>
        <dl>
          {rows.map(([k, v]) => (
            <div key={k} className="bank-row">
              <dt>{tx(`donation.bankRows.${k}`)}</dt>
              <dd><b>{v}</b><CopyBtn label={tx(`donation.bankRows.${k}`)} value={v} /></dd>
            </div>
          ))}
        </dl>
        <p className="note">{tx('donation.payCheck')}</p>
      </div>
    </Reveal>
  )
}

function Thanks({ offer, onBack }) {
  const { t, donation: d } = useData()
  const { tx } = useLang()
  const bankRows = [
    ['accountName', d.bank.accountName],
    ['accountNumber', d.bank.accountNumber],
    ['bankName', d.bank.bankName],
    ['ifsc', d.bank.ifsc],
    ['branch', d.bank.branch],
  ].filter(([, v]) => v)
  // The UPI note stays in English: some UPI apps reject non-Latin text.
  const enPurpose = enLookup(offer.purpose.id) || offer.purpose
  const note = `Offering to ${english.t.name} - ${enPurpose.name}`
  const upi = d.upiId
    ? `upi://pay?pa=${encodeURIComponent(d.upiId)}&pn=${encodeURIComponent(d.payeeName)}&am=${offer.amount}&cu=INR&tn=${encodeURIComponent(note)}`
    : ''
  const lines = [
    tx('donation.wa.intro'),
    tx('donation.wa.purpose', { v: offer.purpose.name }),
    tx('donation.wa.amount', { v: inr(offer.amount) }),
    tx('donation.wa.name', { v: offer.name }),
    offer.star ? tx('donation.wa.star', { v: offer.star }) : '',
    offer.phone ? tx('donation.wa.phone', { v: offer.phone }) : '',
  ].filter(Boolean).join('\n')
  const wa = `https://wa.me/${t.contact.whatsapp}?text=${encodeURIComponent(lines)}`

  /* a small shower of gold petals when the offering is ready */
  useEffect(() => {
    let off = false
    import('canvas-confetti').then(({ default: confetti }) => {
      if (off) return
      const colors = ['#d4a23a', '#f1d489', '#e8892a', '#6e1423', '#fff3c4']
      const base = { colors, disableForReducedMotion: true, ticks: 220, gravity: 0.9 }
      confetti({ ...base, particleCount: 80, spread: 80, startVelocity: 36, origin: { x: 0.5, y: 0.32 } })
      setTimeout(() => {
        if (off) return
        confetti({ ...base, particleCount: 36, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } })
        confetti({ ...base, particleCount: 36, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } })
      }, 260)
    }).catch(() => {})
    return () => { off = true }
  }, [])

  return (
    <motion.div className="thanks" role="status" variants={stagger(0.09, 0.05)} initial="hidden" animate="show">
      <motion.div className="thanks-lamp" variants={{ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 160, damping: 14 } } }}>
        <Diya />
      </motion.div>
      <motion.h2 variants={rise}>{tx('donation.thanks', { name: offer.name.split(' ')[0] })}</motion.h2>
      <motion.p className="lead" variants={rise}>{tx('donation.lead', { amount: <b>{inr(offer.amount)}</b>, purpose: <b>{offer.purpose.name}</b> })}</motion.p>

      <motion.div className="pay-options" variants={stagger(0.1)}>
        {upi && (
          <motion.div className="pay-card" variants={rise}>
            <h3>{tx('donation.upiTitle')}</h3>
            <p>{tx('donation.upiText')}</p>
            <a className="btn btn-gold" href={upi}>{tx('donation.pay', { amount: inr(offer.amount) })}</a>
            <CopyRow label={tx('donation.upiId')} value={d.upiId} />
          </motion.div>
        )}
        {bankRows.length > 0 && (
          <motion.div className="pay-card" variants={rise}>
            <h3>{tx('donation.bank')}</h3>
            {bankRows.map(([k, v]) => <CopyRow key={k} label={tx(`donation.bankRows.${k}`)} value={v} />)}
          </motion.div>
        )}
        <motion.div className="pay-card" variants={rise}>
          <h3>{upi || bankRows.length ? tx('donation.tell') : tx('donation.confirm')}</h3>
          <p>{upi || bankRows.length ? tx('donation.tellText') : tx('donation.confirmText')}</p>
          <a className="btn btn-maroon" href={wa} target="_blank" rel="noreferrer"><IconChat /> {tx('donation.whatsapp')}</a>
          <a className="btn btn-line" href={`tel:${t.contact.phone.replace(/\s/g, '')}`}><IconPhone /> {tx('donation.call', { phone: t.contact.phone })}</a>
        </motion.div>
      </motion.div>

      <motion.p className="note center" variants={rise}>{tx('donation.noMoney')}</motion.p>
      <motion.button className="btn btn-ghost-dark" variants={rise} whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={onBack}>{tx('donation.change')}</motion.button>
    </motion.div>
  )
}

export default function Donation() {
  const data = useData()
  const { donation: d } = data
  const { tx } = useLang()
  usePageMeta(tx('donation.title'), tx('donation.desc'))
  const options = useMemo(() => buildOptions(data, tx), [data, tx])
  const [params] = useSearchParams()
  const wanted = params.get('offering')
  const [purposeId, setPurposeId] = useState(options.some((o) => o.id === wanted) ? wanted : d.purposes[0].id)
  const [amount, setAmount] = useState(d.amounts[1])
  const [custom, setCustom] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', star: '' })
  const [done, setDone] = useState(false)
  const [tried, setTried] = useState(false)

  const purpose = options.find((p) => p.id === purposeId) || options[0]
  // An offering with a fixed rate fills in its amount
  useEffect(() => { if (purpose.amount) setCustom(String(purpose.amount)) }, [purpose.id, purpose.amount])
  const value = custom !== '' ? Number(custom) : amount
  const amountOk = Number.isFinite(value) && value >= 1
  const nameOk = form.name.trim().length > 1
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const offer = useMemo(() => ({ purpose, amount: value, ...form, name: form.name.trim() }), [purpose, value, form])

  const submit = (e) => {
    e.preventDefault()
    setTried(true)
    if (!amountOk || !nameOk) return
    setDone(true)
    scrollToTop()
  }

  return (
    <>
      <PageHero kicker={tx('donation.kicker')} title={tx('donation.pageTitle')} sub={tx('donation.sub')} className="hero-donation">
        <Diya className="hero-diya" />
      </PageHero>

      <section className="section give-sec dn-sec">
        <div className="container">
          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <motion.div key="thanks" variants={swap} initial="initial" animate="animate" exit="exit">
                <Thanks offer={offer} onBack={() => setDone(false)} />
              </motion.div>
            ) : (
              <motion.div key="form" variants={swap} initial="initial" animate="animate" exit="exit">
                <div className="give-grid dn-grid">
                  <form id="dn-form" className="give-form dn-form dn-card" onSubmit={submit} noValidate>
                    <Reveal as="fieldset" className="step dn-step">
                      <legend><span className="dn-num" aria-hidden="true">1</span><span>{tx('donation.where')}</span></legend>
                      <label className="field select-field">
                        <span className="sr-only">{tx('donation.where')}</span>
                        <select value={purposeId} onChange={(e) => setPurposeId(e.target.value)}>
                          {[tx('donation.offeringGroupNeeds'), tx('donation.offeringGroupPooja')].map((g) => (
                            <optgroup key={g} label={g}>
                              {options.filter((o) => o.group === g).map((o) => <option key={o.id} value={o.id}>{o.amount ? `${o.name} — ₹${Number(o.amount).toLocaleString('en-IN')}` : o.name}</option>)}
                            </optgroup>
                          ))}
                        </select>
                      </label>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.p
                          key={purpose.id}
                          className="select-hint"
                          aria-live="polite"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          {purpose.text}
                        </motion.p>
                      </AnimatePresence>
                    </Reveal>

                    <Reveal as="fieldset" className="step dn-step" delay={80}>
                      <legend><span className="dn-num" aria-hidden="true">2</span><span>{tx('donation.chooseAmount')}</span></legend>
                      <div className="amounts dn-amounts">
                        {d.amounts.map((a) => {
                          const on = custom === '' && amount === a
                          return (
                            <motion.button
                              type="button"
                              key={a}
                              className={on ? 'on' : ''}
                              aria-pressed={on}
                              onClick={() => { setAmount(a); setCustom('') }}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              transformTemplate={releaseTransform}
                            >
                              {on && <motion.span layoutId="dn-chip" className="dn-chip-bg" transition={SPRING} />}
                              <span className="dn-chip-text">{inr(a)}</span>
                            </motion.button>
                          )
                        })}
                      </div>
                      <label className="field dn-other">
                        <span>{tx('donation.other')}</span>
                        <div className="dn-rupee">
                          <input inputMode="numeric" pattern="[0-9]*" value={custom} onChange={(e) => setCustom(e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder={tx('donation.otherPh')} aria-invalid={tried && !amountOk} aria-describedby={tried && !amountOk ? 'dn-err-amount' : undefined} />
                        </div>
                      </label>
                      <AnimatePresence>{tried && !amountOk && <Err id="dn-err-amount">{tx('donation.errAmount')}</Err>}</AnimatePresence>
                    </Reveal>

                    <Reveal as="fieldset" className="step dn-step" delay={160}>
                      <legend><span className="dn-num" aria-hidden="true">3</span><span>{tx('donation.details')}</span></legend>
                      <div className="dn-fields">
                        <label className="field">
                          <span>{tx('donation.yourName')}</span>
                          <input value={form.name} onChange={set('name')} autoComplete="name" aria-invalid={tried && !nameOk} aria-describedby={tried && !nameOk ? 'dn-err-name' : undefined} />
                        </label>
                        <label className="field">
                          <span>{tx('donation.phone')} <em>{tx('donation.optional')}</em></span>
                          <input value={form.phone} onChange={set('phone')} type="tel" inputMode="tel" autoComplete="tel" />
                        </label>
                        <label className="field dn-span">
                          <span>{tx('donation.star')} <em>{tx('donation.optional')}</em></span>
                          <input value={form.star} onChange={set('star')} placeholder={tx('donation.starPh')} />
                        </label>
                      </div>
                      <AnimatePresence>{tried && !nameOk && <Err id="dn-err-name">{tx('donation.errName')}</Err>}</AnimatePresence>
                    </Reveal>
                  </form>

                  <PayPanel />

                  <motion.aside
                    className="summary dn-summary"
                    aria-live="polite"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                    transformTemplate={releaseTransform}
                  >
                    <div className="summary-card">
                      <Diya className="summary-diya" />
                      <p className="summary-label">{tx('donation.summary')}</p>
                      <p className={`summary-amount ${amountOk ? '' : 'dim'}`}>{amountOk ? <Money value={value} /> : tx('donation.chooseAmount')}</p>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.p
                          key={purpose.id}
                          className="summary-purpose"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.18 }}
                        >
                          {purpose.name}
                        </motion.p>
                      </AnimatePresence>
                      <motion.button className="btn btn-gold" type="submit" form="dn-form" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>{tx('donation.next')}</motion.button>
                      <p className="summary-note">{tx('donation.noCharge')}</p>
                    </div>
                  </motion.aside>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}
