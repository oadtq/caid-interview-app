"use client"

import type React from "react"

import { useState } from "react"

interface TechStatCardProps {
  icon: React.ReactNode
  value: string
  label: string
}

export function TechStatCard({ icon, value, label }: TechStatCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="flex items-center gap-5 p-5 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl relative overflow-hidden border border-primary/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? "scale(1.03)" : "scale(1)",
        transition: "transform 0.3s ease",
      }}
    >
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-8 h-8 bg-primary/10 transform rotate-45 translate-x-4 -translate-y-4" />
      </div>

      <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-sm relative border border-gray-100">
        {icon}
      </div>
      <div>
        <div className="text-3xl font-light gradient-text">{value}</div>
        <p className="text-gray-600 text-sm">{label}</p>
      </div>

      <div className="absolute bottom-0 left-0 w-16 h-16 overflow-hidden">
        <div className="absolute bottom-0 left-0 w-8 h-8 bg-primary/5 transform rotate-45 -translate-x-4 translate-y-4" />
      </div>
    </div>
  )
}
