import { useState } from 'react'
export function PoojaCard({ pooja }) {
  const [open, setOpen] = useState(false)
  return (
    <article className="card pooja-card">
      <h3>{pooja.name}</h3>
      <p className="time">{pooja.time}</p>
      <p>{pooja.text}</p>
      <div className={`more ${open ? 'open' : ''}`}><p>{pooja.details}</p></div>
      <button className="link-btn" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Hide Details' : 'View Details'}</button>
    </article>
  )
}
export function FestivalCard({ festival }) {
  const [open, setOpen] = useState(false)
  return (
    <article className="card festival-card">
      <div className="img-wrap"><img src={festival.image} alt={`${festival.name} (placeholder image)`} loading="lazy" width="800" height="600" /></div>
      <div className="card-body">
        <h3>{festival.name}</h3>
        <p className="time">{festival.date}</p>
        <p>{festival.text}</p>
        <div className={`more ${open ? 'open' : ''}`}><p>[Add full festival details here]</p></div>
        <button className="link-btn" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Hide Details' : 'View Details'}</button>
      </div>
    </article>
  )
}
