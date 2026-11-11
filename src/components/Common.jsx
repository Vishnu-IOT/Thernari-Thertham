import { useEffect, useRef, useState } from 'react'
export function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return setSeen(true)
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${seen ? 'in' : ''} ${className}`}>{children}</div>
}
export function SectionHeading({ label, title, sub }) {
  return (
    <div className="section-heading">
      {label && <p className="label">{label}</p>}
      <h2>{title}</h2>
      {sub && <p className="sub">{sub}</p>}
      <div className="divider" aria-hidden="true"><span /></div>
    </div>
 )
}
export function Section({ id, className = '', children }) {
  return <section id={id} className={`section ${className}`}><div className="container">{children}</div></section>
}
export function usePageMeta(title, desc) {
  useEffect(() => {
    document.title = title
    const m = document.querySelector('meta[name="description"]')
    if (m && desc) m.setAttribute('content', desc)
  }, [title, desc])
}
