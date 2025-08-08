"use client"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface Card3DProps {
  children: ReactNode
  className?: string
}

export function Card3D({ children, className }: Card3DProps) {
  return (
    <div className={cn("relative transition-shadow duration-300 hover:shadow-lg", className)}>
      <div className="w-full h-full">{children}</div>
    </div>
  )
}
