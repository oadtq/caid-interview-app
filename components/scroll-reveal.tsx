"use client"

import { useRef, useEffect, type ReactNode, useState } from "react"

type RevealDirection = "up" | "down" | "left" | "right" | "none"

interface ScrollRevealProps {
  children: ReactNode
  direction?: RevealDirection
  delay?: number
  threshold?: number
  className?: string
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  threshold = 0.1,
  className = "",
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Force visibility after a timeout as a fallback
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
          clearTimeout(timer)
        }
      },
      {
        threshold,
        rootMargin: "0px",
      },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
      clearTimeout(timer)
    }
  }, [threshold])

  const getRevealClass = () => {
    switch (direction) {
      case "up":
        return "reveal-up"
      case "down":
        return "reveal-down"
      case "left":
        return "reveal-left"
      case "right":
        return "reveal-right"
      default:
        return ""
    }
  }

  return (
    <div
      ref={ref}
      className={`${className} ${getRevealClass()} ${isVisible ? "reveal-visible" : ""}`}
      style={{
        transitionDelay: `${delay}s`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : getInitialTransform(direction),
        visibility: isVisible ? "visible" : "hidden",
        transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  )
}

// Helper function to get initial transform based on direction
function getInitialTransform(direction: RevealDirection): string {
  switch (direction) {
    case "up":
      return "translateY(30px)" // Reduced distance for subtlety
    case "down":
      return "translateY(-30px)"
    case "left":
      return "translateX(-30px)"
    case "right":
      return "translateX(30px)"
    default:
      return "none"
  }
}
