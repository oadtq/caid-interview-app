"use client"

import type React from "react"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

interface TechFeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick?: () => void
}

export function TechFeatureCard({ icon, title, description, onClick }: TechFeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="tech-card h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: isHovered ? "0 10px 25px -5px rgba(0, 0, 0, 0.1)" : "",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <div
            className="h-16 w-16 rounded-full gradient-bg flex items-center justify-center mb-4 shadow-lg"
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.3s ease",
            }}
          >
            {icon}
          </div>
          <h3 className="text-2xl font-light mb-2">{title}</h3>
          <div className="w-12 h-1 bg-primary/20 rounded-full mb-3" />
        </div>
        <p className="text-gray-700 flex-grow font-light">{description}</p>

        <div
          className="mt-4 flex items-center text-primary font-medium text-sm"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateX(0)" : "translateX(-10px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          Learn more <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </div>
  )
}
