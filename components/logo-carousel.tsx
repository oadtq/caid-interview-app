"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"

interface Logo {
  src: string
  alt: string
  width: number
  height: number
  sizePriority?: boolean
}

interface LogoCarouselProps {
  logos: Logo[]
  speed?: number
  className?: string
  pauseOnHover?: boolean
}

export function LogoCarousel({ logos, speed = 5, className = "", pauseOnHover = false }: LogoCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!carouselRef.current || !innerRef.current) return

    // Clone the logos to create a seamless loop
    const cloneLogos = () => {
      const inner = innerRef.current
      if (!inner) return

      const clone = inner.cloneNode(true) as HTMLDivElement
      clone.setAttribute("aria-hidden", "true")
      carouselRef.current?.appendChild(clone)
    }

    cloneLogos()

    // Update animation duration based on the number of logos and speed
    const updateAnimation = () => {
      const carouselItems = carouselRef.current?.querySelectorAll(".logo-carousel-inner") || []
      carouselItems.forEach((item: Element) => {
        const htmlItem = item as HTMLElement
        htmlItem.style.animationDuration = `${logos.length * speed}s`
      })
    }

    updateAnimation()

    // Only add pause on hover if the prop is true
    if (pauseOnHover) {
      // Pause animation on hover
      const handleMouseEnter = () => {
        const carouselItems = carouselRef.current?.querySelectorAll(".logo-carousel-inner") || []
        carouselItems.forEach((item: Element) => {
          const htmlItem = item as HTMLElement
          htmlItem.style.animationPlayState = "paused"
        })
      }

      const handleMouseLeave = () => {
        const carouselItems = carouselRef.current?.querySelectorAll(".logo-carousel-inner") || []
        carouselItems.forEach((item: Element) => {
          const htmlItem = item as HTMLElement
          htmlItem.style.animationPlayState = "running"
        })
      }

      carouselRef.current.addEventListener("mouseenter", handleMouseEnter)
      carouselRef.current.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        if (carouselRef.current) {
          carouselRef.current.removeEventListener("mouseenter", handleMouseEnter)
          carouselRef.current.removeEventListener("mouseleave", handleMouseLeave)
        }
      }
    }
  }, [logos.length, speed, pauseOnHover])

  return (
    <div ref={carouselRef} className={`logo-carousel ${className}`} aria-label="Partner logos">
      <div ref={innerRef} className="logo-carousel-inner">
        {logos.map((logo, index) => (
          <div key={index} className="logo-carousel-item">
            <div className="p-4 mx-2 bg-white rounded-xl shadow-sm border border-gray-100 w-[180px] h-[80px] flex items-center justify-center">
              <Image
                src={logo.src || "/placeholder.svg"}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className={`object-contain w-auto ${logo.sizePriority ? "max-h-16" : "max-h-12"} max-w-[150px]`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
