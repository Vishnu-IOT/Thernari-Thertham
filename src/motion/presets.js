/* Shared motion presets so every animation on the site feels like one family. */
export const EASE = [0.22, 1, 0.36, 1] // soft "expo out", same feel as the CSS --ease
export const SPRING = { type: 'spring', stiffness: 380, damping: 30 }
export const SPRING_SOFT = { type: 'spring', stiffness: 220, damping: 26 }

/* Used by Reveal(): where each variant starts from. */
export const REVEAL_FROM = {
  up: { y: 30 },
  left: { x: -40 },
  right: { x: 40 },
  zoom: { scale: 0.92 },
  arch: { y: 46, scale: 0.95 },
  fade: {},
}

/* Lets the browser's own CSS transform (hover lifts etc.) work again once an
   element has finished animating: framer-motion otherwise leaves an inline
   "transform: none" behind which beats any stylesheet rule. */
export const releaseTransform = (_values, generated) => generated

/* Parent / child pair for staggered groups. */
export const stagger = (gap = 0.07, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})
export const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}
