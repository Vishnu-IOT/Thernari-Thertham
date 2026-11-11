import { useCallback, useEffect, useRef, useState } from 'react'
import { gallery, galleryCategories } from '../data/templeData.js'
import { PageHero, usePageMeta } from '../components/ui.jsx'

function Lightbox({ items, index, onClose, onChange }) {
  const item = items[index]
  const touch = useRef(null)
  const move = useCallback((d) => onChange((index + d + items.length) % items.length), [index, items.length, onChange])

  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') move(1)
      if (e.key === 'ArrowLeft') move(-1)
    }
    window.addEventListener('keydown', k)
    document.documentElement.classList.add('locked')
    return () => { window.removeEventListener('keydown', k); document.documentElement.classList.remove('locked') }
  }, [move, onClose])

  const onTouchStart = (e) => { touch.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touch.current == null) return
    const dx = e.changedTouches[0].clientX - touch.current
    if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1)
    touch.current = null
  }

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={onClose} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <button className="lb-btn lb-close" onClick={onClose} aria-label="Close">×</button>
      <button className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); move(-1) }} aria-label="Previous image">‹</button>
      <figure key={item.id} onClick={(e) => e.stopPropagation()}>
        <img src={item.src} alt={item.alt} />
        <figcaption>{item.caption}<small>{index + 1} of {items.length}</small></figcaption>
      </figure>
      <button className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); move(1) }} aria-label="Next image">›</button>
    </div>
  )
}

export default function Gallery() {
  usePageMeta('Gallery | Thenari Theertham', 'Photographs of the deities, sacred theertham and craftsmanship of Thenari Sree Rama Temple.')
  const [cat, setCat] = useState('All')
  const [active, setActive] = useState(null)
  const items = cat === 'All' ? gallery : gallery.filter((g) => g.category === cat)

  return (
    <>
      <PageHero kicker="Darshan in pictures" title="Gallery" sub={`${gallery.length} photographs of the deities, the theertham and the golden craftsmanship of the temple.`} className="hero-gallery">
        <div className="hero-collage">
          {gallery.slice(0, 3).map((g, i) => <img key={g.id} src={g.src} alt="" style={{ '--i': i }} />)}
        </div>
      </PageHero>

      <section className="section gallery-sec">
        <div className="container">
          <div className="filters" role="group" aria-label="Filter gallery">
            {galleryCategories.map((c) => (
              <button key={c} className={c === cat ? 'active' : ''} aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>

          <ul className="masonry" key={cat}>
            {items.map((g, i) => (
              <li key={g.id} className={`tile ${g.shape}`} style={{ '--i': i }}>
                <button onClick={() => setActive(i)} aria-label={`Open photo: ${g.caption}`}>
                  <img src={g.src} alt={g.alt} loading="lazy" />
                  <span className="tile-cap"><b>{g.caption}</b><small>{g.category}</small></span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {active !== null && <Lightbox items={items} index={active} onClose={() => setActive(null)} onChange={setActive} />}
    </>
  )
}
