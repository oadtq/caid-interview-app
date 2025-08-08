"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

interface ContrastStatCardProps {
  icon: React.ReactNode
  value: string
  label: string
}

export function ContrastStatCard({ icon, value, label }: ContrastStatCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="stat-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex items-center gap-5">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          {icon}
        </div>
        <div>
          <div className="text-3xl font-light text-white">{value}</div>
          <p className="text-gray-400 text-sm">{label}</p>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-primary"
        initial={{ width: "30%" }}
        animate={{ width: isHovered ? "100%" : "30%" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
