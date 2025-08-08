"use client"

import { useEffect, useState } from "react"

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(scrollPercent)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial position

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return <div className="scroll-progress" style={{ width: `${progress}%` }} />
}
