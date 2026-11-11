import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { setLenis } from './smoothScroll.js'
import { prefersCalm } from './config.js'

/* Buttery wheel / trackpad scrolling (Lenis). Touch screens keep their native
   momentum scrolling, and visitors who prefer reduced motion get none of it. */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersCalm()) return undefined
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 })
    setLenis(lenis)

    let raf = 0
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)

    /* Pause while the preloader, the mobile menu or the lightbox lock the page. */
    const sync = () => {
      const locked = document.documentElement.classList.contains('locked') || document.body.style.overflow === 'hidden'
      if (locked) lenis.stop(); else lenis.start()
    }
    const mo = new MutationObserver(sync)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    mo.observe(document.body, { attributes: true, attributeFilter: ['style'] })
    sync()

    return () => {
      mo.disconnect()
      cancelAnimationFrame(raf)
      setLenis(null)
      lenis.destroy()
    }
  }, [])
  return null
}
