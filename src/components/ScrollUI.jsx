import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext.jsx'
import { scrollToTop } from '../motion/smoothScroll.js'
import { SPRING, releaseTransform } from '../motion/presets.js'

/* Thin saffron bar at the top: grows with the page scroll, with a little spring. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
}

export function BackToTop() {
  const { tx } = useLang()
  const { scrollY } = useScroll()
  const [show, setShow] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setShow(y > 600))
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="back-top"
          className="back-top on bt-m"
          onClick={() => scrollToTop()}
          aria-label={tx('backTop')}
          initial={{ opacity: 0, y: 18, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.7 }}
          whileHover={{ y: -4, scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          transition={SPRING}
          transformTemplate={releaseTransform}
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  )
}
