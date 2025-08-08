"use client"

import { useRef, useEffect, type ReactNode, useState, Children, cloneElement, isValidElement } from "react"

interface StaggerListProps {
  children: ReactNode
  threshold?: number
  className?: string
}

export function StaggerList({ children, threshold = 0.1, className = "" }: StaggerListProps) {
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

  // Add stagger-item class to each child
  const staggeredChildren = Children.map(children, (child, index) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        className: `stagger-item ${child.props.className || ""}`,
        style: {
          ...child.props.style,
          transitionDelay: `${0.1 * (index + 1)}s`,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "none" : "translateY(20px)",
          visibility: isVisible ? "visible" : "hidden",
        },
      })
    }
    return child
  })

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? "stagger-visible" : ""}`}
      style={{
        opacity: 1,
        visibility: "visible",
      }}
    >
      {staggeredChildren}
    </div>
  )
}
