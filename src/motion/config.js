/* One switch for the whole site's motion.
   false  -> every animation always plays (what the temple wants for its visitors)
   true   -> visitors whose phone / computer says "reduce motion" get no
             smooth scrolling, no parallax and only quick fades. */
export const RESPECT_REDUCED_MOTION = false

export const prefersCalm = () =>
  RESPECT_REDUCED_MOTION && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
