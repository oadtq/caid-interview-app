"use client"

import type React from "react"

import { useState, useRef, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  intensity?: number
  onClick?: () => void
}

export function MagneticButton({
  children,
  className = "",
  variant = "default",
  size = "default",
  intensity = 0.3,
  onClick,
}: MagneticButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX
    const mouseY = e.clientY

    // Calculate distance from center
    const distanceX = mouseX - centerX
    const distanceY = mouseY - centerY

    // Apply magnetic effect
    setPosition({
      x: distanceX * intensity,
      y: distanceY * intensity,
    })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <Button
      ref={buttonRef}
      className={`transition-transform ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      variant={variant}
      size={size}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
