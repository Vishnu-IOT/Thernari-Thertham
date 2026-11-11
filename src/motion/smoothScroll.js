/* One place that knows how to scroll. When the Lenis smooth-scroll engine is
   running it is used; otherwise the browser's own scrolling is. */
let lenis = null
export const setLenis = (l) => { lenis = l }
export const getLenis = () => lenis

/* the space the sticky header takes: html scroll-padding + the element's scroll-margin */
function topGap(el) {
  const num = (v) => parseFloat(v) || 0
  return num(getComputedStyle(document.documentElement).scrollPaddingTop) + num(getComputedStyle(el).scrollMarginTop)
}

export function scrollToEl(el, { immediate = false, block = 'start' } = {}) {
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { offset: -topGap(el), immediate, duration: 1.2 })
    return
  }
  el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block })
}

export function scrollToTop({ immediate = false } = {}) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true, duration: 1.2 })
  else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
}
