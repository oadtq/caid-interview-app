"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useScroll, useTransform } from "framer-motion"

export function AnimatedLogo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const { scrollY } = useScroll()

  // Transform the logo position based on scroll
  const logoX = useTransform(scrollY, [0, 300], [0, 100])

  useEffect(() => {
    // Initial animation
    controls.start({
      opacity: 1,
      x: 0,
      transition: { duration: 1, ease: "easeOut" },
    })

    // Pulse animation that repeats
    const pulseAnimation = async () => {
      while (true) {
        await controls.start({
          scale: 1.05,
          filter: "brightness(1.2)",
          transition: { duration: 1.5, ease: "easeInOut" },
        })
        await controls.start({
          scale: 1,
          filter: "brightness(1)",
          transition: { duration: 1.5, ease: "easeInOut" },
        })
      }
    }

    pulseAnimation()
  }, [controls])

  return (
    <div ref={containerRef} className="relative">
      <motion.div
        className="flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={controls}
        style={{ x: logoX }}
      >
        <div className="font-bold text-xl relative">
          <span className="gradient-text">EveryMatch</span>
          <motion.span
            className="text-primary absolute -top-1 -right-3"
            animate={{
              opacity: [0, 1, 0],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          >
            ●
          </motion.span>
          <span className="text-white">.ai</span>
        </div>
      </motion.div>
    </div>
  )
}
