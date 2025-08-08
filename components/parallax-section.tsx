"use client"

import { useRef, useEffect, type ReactNode } from "react"

interface ParallaxSectionProps {
  children: ReactNode
  bgImage?: string
  speed?: number
  className?: string
}

export function ParallaxSection({ children, bgImage, speed = 0.5, className = "" }: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial positioning of the background
    if (bgRef.current) {
      bgRef.current.style.transform = "translateY(0px)"
    }

    const handleScroll = () => {
      if (!sectionRef.current || !bgRef.current) return

      const rect = sectionRef.current.getBoundingClientRect()
      const scrollPosition = window.scrollY
      const sectionTop = rect.top + scrollPosition
      const viewportHeight = window.innerHeight

      // Check if section is in viewport
      if (rect.top < viewportHeight && rect.bottom > 0) {
        // Calculate parallax offset
        const offset = (scrollPosition - sectionTop) * speed
        bgRef.current.style.transform = `translateY(${offset}px)`
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial position

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [speed])

  return (
    <div
      ref={sectionRef}
      className={`parallax-container ${className}`}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {bgImage && (
        <div
          ref={bgRef}
          className="parallax-bg"
          style={{
            backgroundImage: `url(${bgImage})`,
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "120%",
            top: "-10%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
